import requests
import datetime
# import pytz
import time
import logging
from .models import GpsReport
from pages.models import Fleet
from django.conf import settings
from django.core.cache import cache
from .models import GpsTracker
from navixy.report_processors import (
    process_json_trip,
    process_json_stop,
    process_json_fuel,
    process_json_motohour,
    process_json_zone,
	)

from navixy.models import GpsZone
import re

logger = logging.getLogger(__name__)
HEADERS = {"Accept": "application/json"}
# NAVIXY_TZ = s.timezone("Asia/Ulaanbaatar")
zone_ids = list(
    GpsZone.objects.exclude(navixy_id=None).values_list("navixy_id", flat=True)
)

REPORT_PLUGINS = {
	"trip": {
		"plugin": {
			"hide_empty_tabs": True,
			"plugin_id": 4,
			"show_seconds": False,
			"include_summary_sheet_only": False,
			"split": True,
			"show_idle_duration": True,
			"show_coordinates": False,
			"filter": True,
			"group_by_driver": False,
		},
		"processor": process_json_trip,  # ✅ direct function reference
	},
		"stop": {
		"plugin": {
 				"hide_empty_tabs": True,
                "plugin_id": 6,
                "show_seconds": False,
                "show_coordinates": False,
                "filter": False,
		},
		"processor": process_json_stop,  # ✅ direct function reference
	},
			"fuel": {
		"plugin": {
 				 "show_seconds":False,
            "plugin_id":10,
            "graph_type":"mileage",
            "detailed_by_dates":True,
            "include_summary_sheet_only":False,
            "use_ignition_data_for_consumption":False,
            "include_mileage_plot":False,
            "filter":True,
            "include_speed_plot":False,
            "smoothing":False,
            "surge_filter":True,
            "surge_filter_threshold":0.2,
            "speed_filter":False,
            "speed_filter_threshold":10
		},
		"processor": process_json_fuel,  # ✅ direct function reference
	},
			"motohour": {
		"plugin": {
 				 "hide_empty_tabs":True,
            "plugin_id":7,
            "show_seconds":True,
            "show_detailed":True,
            "include_summary_sheet_only":False,
            "filter":True
		},
		"processor": process_json_motohour,  # ✅ direct function reference
	},
			"zone": {
		"plugin": {
 				 "hide_empty_tabs":True,
            "plugin_id":8,
            "show_seconds":False,
            "show_mileage":False,
            "show_not_visited_zones":False,
            "min_minutes_in_zone":2,
            "hide_charts":True,
            "zone_ids":zone_ids,
			},
		"processor": process_json_zone,  # ✅ direct function reference
		},
	}


def get_config(key):
	return getattr(settings, key, None)


def get_navixy_hash():
	hash_value = cache.get("navixy_hash")
	if hash_value:
		return hash_value

	# If not cached, re-authenticate
	url = get_config("NAVIXY_URL")
	login_data = {
		"login": get_config("NAVIXY_LOGIN"),
		"password": get_config("NAVIXY_PASS"),
	}
	response = requests.post(f"{url}/user/auth", headers=HEADERS, json=login_data)
	data = response.json()

	if not data.get("success"):
		raise Exception("Navixy authentication failed.")

	hash_value = data["hash"]
	cache.set("navixy_hash", hash_value, timeout=3600)  # cache for 1 hour
	return hash_value

# get zone

def pull_zone_data():
	"""Fetch zones from Navixy and update GpsZone table."""
	url = get_config("NAVIXY_URL")
	hash_value = get_navixy_hash()
	req = {'hash': hash_value}

	try:
		r = requests.post(f"{url}/zone/list", headers=HEADERS, json=req)
		r.raise_for_status()
	except requests.RequestException as e:
		raise Exception("Connection error while fetching zones") from e

	for zone in r.json().get('list', []):
		GpsZone.objects.get_or_create(
			navixy_id=zone['id'],
			defaults={'name': zone['label']}
	)




# used??
def parse_zone_text(txt):
	"""Extract zone name from text and ensure it exists in GpsZone."""
	zone_match = re.search(r'\[(.*?)\]', txt)
	if zone_match:
		parsed = zone_match.group(1)
	else:
		parsed = txt.split('-')[-1].strip()

	zone = GpsZone.objects.filter(name__iexact=parsed).first()
	if zone:
		return zone.id
	return GpsZone.objects.create(name=parsed).id

# gps truck list
def fetch_tracker_list():
	"""Fetch tracker list from Navixy using current hash."""
	url = get_config("NAVIXY_URL")
	hash_value = get_navixy_hash()
	response = requests.post(
		f"{url}/tracker/list", headers=HEADERS, json={"hash": hash_value}
	)
	return response


# get gps truck list and put it in  GpsTracker model
def pull_tracker_list():
	"""
	Sync trackers from Navixy to local GpsTracker model.
	Only inserts new trackers, avoids duplicates.
	"""
	response = fetch_tracker_list()
	if response.status_code != 200:
		raise Exception("Connection error with Navixy")

	trackers = response.json().get("list", [])
	for tracker in trackers:
		obj, created = GpsTracker.objects.get_or_create(
			id=tracker["id"], defaults={"name": tracker["label"]}
		)
		print("Created:", created, "->", obj)
	return True


# fleet that is registered will be here
def get_tracker_ids():
	"""
	Get list of tracker IDs that:
	- Are active (not blocked) in Navixy
	- Exist in the local Fleet model (gps_tracker_id)
	"""
	response = fetch_tracker_list()
	data = response.json()

	if not data.get("success"):
		# If session expired, re-authenticate and retry once
		cache.delete("navixy_hash")
		response = fetch_tracker_list()
		data = response.json()
	print(data)
	tracker_ids_navixy = [
		int(rec["id"])
		for rec in data.get("list", [])
		if not rec["source"].get("blocked")
	]

	tracker_ids_fleet = list(Fleet.objects.values_list("gps_tracker_id", flat=True))

	# Return only IDs that exist in both Navixy and local DB
	return list(set(tracker_ids_navixy) & set(tracker_ids_fleet))


def generate_reports(date=None):
	tracker_ids = get_tracker_ids()
	pull_zone_data()
	for report_type, config in REPORT_PLUGINS.items():
		plugin = config["plugin"]
		print("report_type:", report_type, "plugin:", plugin)
		create_report(report_type, tracker_ids, plugin, date, date)


def create_report(report_type, tracker_ids, plugin, date_from=None, date_to=None):
	url = get_config("NAVIXY_URL")
	hash_value = get_navixy_hash()
	print("url:///", url)

	if not date_from or not date_to:
		yesterday = datetime.date.today() - datetime.timedelta(days=1)
		date_from = date_to = yesterday

	payload = {
		"hash": hash_value,
		"trackers": tracker_ids,
		"from": datetime.datetime.combine(date_from, datetime.time.min).strftime(
			"%Y-%m-%d %H:%M:%S"
		),
		"to": datetime.datetime.combine(date_to, datetime.time.max).strftime(
			"%Y-%m-%d %H:%M:%S"
		),
		"time_filter": {
			"from": "00:00:00",
			"to": "23:59:59",
			"weekdays": [1, 2, 3, 4, 5, 6, 7],
		},
		"plugin": plugin,
	}
	print("payload:", payload)

	r = requests.post(f"{url}/report/tracker/generate", headers=HEADERS, json=payload)
	print("status_code:", r.status_code)
	print("status_code:", r.json())

	if r.status_code == 200 and r.json().get("success"):
		GpsReport.objects.filter(date=date_from, report_type=report_type).delete()

		report = GpsReport.objects.create(
			nav_report_id=r.json()["id"],
			date=date_from,
			state="in_process",
			report_type=report_type,
		)
		print("Created report:", report.nav_report_id)
		check_report_status(report)
	else:
		raise Exception(f"Error generating report: {r.text}")


def check_report_status(report: GpsReport):
	url = get_config("NAVIXY_URL")
	hash_value = get_navixy_hash()

	payload = {"hash": hash_value, "report_id": report.nav_report_id}

	while True:
		r = requests.post(f"{url}/report/tracker/status", headers=HEADERS, json=payload)
		print("\\\\ Reading report status...")
		if r.status_code == 200:
			json = r.json()

			if json.get("success") and json.get("percent_ready") == 100:
				print("\\\\ Report is ready. Retrieved successfully.")
				retrieve_report(report)
				break
		else:
			time.sleep(20)
			print("\\\\\reading again")


def retrieve_report(report: GpsReport):
	url = get_config("NAVIXY_URL")
	hash_value = get_navixy_hash()

	payload = {"hash": hash_value, "report_id": report.nav_report_id}

	r = requests.post(f"{url}/report/tracker/retrieve", headers=HEADERS, json=payload)
	print("status_code:", r.status_code)
	if r.status_code == 200:
		config = REPORT_PLUGINS.get(report.report_type)
		processor = config.get("processor") if config else None
		# odoo end process hiiine
		print("config:", config)
		print("success:", processor)

		if processor:
			try:
				processor(report, r.json())  # ✅ Process and insert data
				report.state = "done"
			except Exception as e:
				logger.error(f"❌ Error processing report: {e}")
				report.state = "fail"
				report.server_msg = str(e)
		else:
			logger.warning(
				f"⚠️ No processor defined for report type '{report.report_type}'"
			)
			report.state = "fail"
			report.server_msg = f"No processor for report type: {report.report_type}"
	else:
		report.state = "fail"
		try:
			report.server_msg = (
				r.json().get("status", {}).get("description", "Unknown error")
			)
		except Exception:
			report.server_msg = "Failed to parse error from Navixy"

	report.save()

