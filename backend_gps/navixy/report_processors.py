# navixy/report_processors.py
from django.utils import timezone

from datetime import datetime, timedelta
from .magic import flatten_trip, flatten_zone_report, flatten_stops, flatten_motohours, flatten_fuel_report
from pages.models import Fleet  # Assuming technic_id comes from Fleet
from navixy.models import GpsTripReportLine, GpsZone, GpsFuelReportLine, GpsZoneReportLine, GpsStopReportLine, GpsMotohourReportLine, GpsFuelReportLine ,GpsFuelFillReport
from django.utils.dateparse import parse_datetime as parse_iso
from django.conf import settings

def process_json_trip(report, res):
	"""
	Process Navixy trip report JSON and populate GpsTripReportLine entries
	"""
	report.trip_line_ids.all().delete()

	token = "striker"  # or use settings/config if dynamic
	trip_list = flatten_trip(res, token)

	for trip in trip_list:
		# Lookup matching fleet (technic_id)
		matching_vehicles = Fleet.objects.filter(gps_tracker_id=str(trip['tracker_id']))

		for vehicle in matching_vehicles:
			from_zone = get_or_create_zone(trip['from'])
			to_zone = get_or_create_zone(trip['to'])

			try:
				# print from_time
				from_time = parse_trip_datetime(trip['date_char'], trip['from'])
				to_time = parse_trip_datetime(trip['date_char'], trip['to'])
				
			except Exception:
				from_time = to_time = None

			GpsTripReportLine.objects.create(
				report=report,
				technic=vehicle,
				line_date=trip['line_date'],
				from_loc_char=trip['from'],
				to_loc_char=trip['to'],
				from_loc=from_zone,
				to_loc=to_zone,
				from_time=from_time,
				to_time=to_time,
				length=trip['length'],
				time_sec=trip['time_sec'],
				time_string=trip['time_string'],
				avg_speed=trip['avg_speed'],
				max_speed=trip['max_speed'],
				idle_sec=trip['idle_sec'],
				idle_string=trip['idle_string'],
				fuel_consumption=trip['fuel_consumption'],
				time_hour=float(trip['time_sec']) / 3600 if trip['time_sec'] else 0,
				idle_hour=float(trip['idle_sec']) / 3600 if trip['idle_sec'] else 0,
			)

def get_or_create_zone(location_text):
	import re
	label = re.search(r'\[(.*?)\]', location_text)
	parsed = label.group(1) if label else location_text.split('-')[-1].strip()
	# print("zone\\: ", parsed)

	zone = GpsZone.objects.filter(name__iexact=parsed).first()
	if zone:
		return zone
	return GpsZone.objects.create(name=parsed)




def parse_trip_datetime(date_str, time_str):
	try:
		time_part = time_str.split(' ')[0] if time_str and ':' in time_str else '00:00'
		print("\\0", time_part)

		combined = f"{date_str} {time_part}"
		dt = datetime.strptime(combined, "%Y-%m-%d %H:%M")
		print("trip_return", dt)

		return timezone.make_aware(dt)
	except Exception as e:
		print(f"❌ Failed to parse datetime: {e}")
		return None

def process_json_stop(report, res):
	"""
	Process Navixy trip report JSON and populate GpsTripReportLine entries
	"""
	print("report_stop")
	report.stop_lines.all().delete()

	token = "striker"  # Or get from settings
	stop_report = flatten_stops(res, token)

	for stop in stop_report:
		vehicles = Fleet.objects.filter(gps_tracker_id=str(stop['tracker_id']))
		line_date = datetime.strptime(stop['date'], "%Y-%m-%d").date()
		zone = get_or_create_zone(stop['location'])

		for vehicle in vehicles:
			print("stop_time", parse_time_safe(stop['date'], stop['start']))
			GpsStopReportLine.objects.create(
				report=report,
				technic=vehicle,
				line_date=line_date,
				loc=zone,
				loc_char=stop['location'],
				from_time=parse_time_safe(stop['date'], stop['start']),
				to_time=parse_time_safe(stop['date'], stop['end']),
				idle_sec=stop['idle_sec'],
				idle_string=stop['idle_string'],
				ignition_sec=stop['ignition_sec'],
				ignition_string=stop['ignition_string'],
				idle_hour=stop['idle_sec'] / 3600 if stop['idle_sec'] else 0,
				ignition_hour=stop['ignition_sec'] / 3600 if stop['ignition_sec'] else 0,
			)

# def get_or_create_zone(name):
#     zone, _ = GpsZone.objects.get_or_create(name=name.strip(), defaults={"navixy_id": None})
#     return zone

def parse_time_safe(date_str, time_str):
    try:
        time_part = time_str.strip().split()[0] if time_str else "00:00"

        # Choose format based on time string length
        if len(time_part) == 5:  # "HH:MM"
            fmt = "%Y-%m-%d %H:%M"
        else:  # assume "HH:MM:SS"
            fmt = "%Y-%m-%d %H:%M:%S"

        combined = f"{date_str} {time_part}"
        dt = datetime.strptime(combined, fmt)
        return timezone.make_aware(dt)
    except Exception as e:
        print(f"❌ parse_time_safe error: {e}")
        return None

def process_json_fuel(report, res):
	"""
	Process Navixy trip report JSON and populate GpsTripReportLine entries
	"""
	print("report_fuel")

	token = "striker"  # or get from config
	fuel_data = flatten_fuel_report(res, token)

	# Clear existing lines
	report.fuel_detailed_lines.all().delete()
	report.fuel_fill_lines.all().delete()

	for row in fuel_data['detailed']:
		vehicles = Fleet.objects.filter(gps_tracker_id=str(row["tracker_id"]))
		for vehicle in vehicles:
			GpsFuelReportLine.objects.create(
				report=report,
				technic=vehicle,
				line_date=datetime.strptime(row["date"], "%Y-%m-%d").date(),
				mileage=row["mileage"],
				start_bal=row["start_bal"],
				end_bal=row["end_bal"],
				consumed=row["consumed"],
				consumpt_per_dist=row["consumpt_per_dist"],
				fillings_count=row["fillings_count"],
				fillings_volume=row["fillings_volume"],
				drains_count=row["drains_count"],
				drains_volume=row["drains_volume"]
			)

	for row in fuel_data['fillups']:
		vehicles = Fleet.objects.filter(gps_tracker_id=str(row["tracker_id"]))
		for vehicle in vehicles:
			zone = get_or_create_zone(row["address"])
			GpsFuelFillReport.objects.create(
				report=report,
				technic=vehicle,
				line_datetime=timezone.make_aware(datetime.strptime(row["datetime"], "%Y-%m-%d %H:%M")),
				mileage=row["mileage"],
				start_vol=row["start_vol"],
				end_vol=row["end_vol"],
				volume=row["volume"],
				location=zone,
				type=row["type"]
			)

# def get_or_create_zone(name):
#     zone, _ = GpsZone.objects.get_or_create(name=name.strip(), defaults={"navixy_id": None})
#     return zone

def process_json_motohour(report, res):
	"""
	Process Navixy trip report JSON and populate GpsTripReportLine entries
	"""
	print("report_motohour")
	report.motohour_lines.all().delete()

	token = "striker"  # Or from settings/config
	motohour_data = flatten_motohours(res, token)

	for item in motohour_data:
		vehicles = Fleet.objects.filter(gps_tracker_id=str(item["tracker_id"]))
		line_date = datetime.strptime(item["date"], "%Y-%m-%d").date()

		start_zone = get_or_create_zone(item["start_loc"])
		end_zone = get_or_create_zone(item["end_loc"])

		for vehicle in vehicles:
			print("motohour_time", parse_time_safe(item["date"], item["start_time"]))

			GpsMotohourReportLine.objects.create(
				report=report,
				technic=vehicle,
				line_date=line_date,
				start_loc=start_zone,
				end_loc=end_zone,
				# printt
				start_time=parse_time_safe(item["date"], item["start_time"]),
				end_time=parse_time_safe(item["date"], item["end_time"]),
				in_movement_sec=item["in_movement"],
				duration_sec=item["duration"],
				in_movement_hour=item["in_movement"] / 3600 if item["in_movement"] else 0,
				duration_hour=item["duration"] / 3600 if item["duration"] else 0,
			)

# def get_or_create_zone(text):
#     zone, _ = GpsZone.objects.get_or_create(name=text.strip(), defaults={"navixy_id": None})
#     return zone


def process_json_zone(report, res):
	"""
	Process Navixy trip report JSON and populate GpsTripReportLine entries
	"""
	print("report_zone")
	report.zone_lines.all().delete()

	token = "striker"  # or get from settings/config
	zone_obj = GpsZone.objects
	stop_list = flatten_zone_report(res, token)

	for stop in stop_list:

		try:
			# print from_time
			from_time = parse_time_safe(stop['date'] ,  stop['in_time'])
			to_time = parse_time_safe(stop['date'] ,  stop['out_time'])
		except Exception:
			from_time = to_time = None
			print("motohour_time",from_time)

		line_date = datetime.strptime(stop['date'], "%Y-%m-%d").date()

		vehicles = Fleet.objects.filter(gps_tracker_id=str(stop['tracker_id']))
		zone_match = zone_obj.filter(navixy_id=stop['location']).first()

		for vehicle in vehicles:
			GpsZoneReportLine.objects.create(
				report=report,
				technic=vehicle,
				line_date=line_date,
				location=zone_match,
				in_datetime=from_time,
				out_datetime=to_time,
				in_loc=get_or_create_zone(stop['in_address']),
				out_loc=get_or_create_zone(stop['out_address']),
				duration_sec=stop['duration_sec'],
				duration_string=stop['duration_string'],
				duration_hour=stop['duration_sec'] / 3600 if stop['duration_sec'] else 0
			)

# def get_or_create_zone(address):
#     zone, _ = GpsZone.objects.get_or_create(name=address.strip(), defaults={"navixy_id": None})
#     return zone	