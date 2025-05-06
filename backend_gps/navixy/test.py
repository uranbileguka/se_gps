# %%
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "my_portfolio.settings")  # <-- Change this
django.setup()

from navixy.services import get_config
print(get_config("NAVIXY_URL"))
print(get_config("NAVIXY_LOGIN"))
print(get_config("NAVIXY_PASS"))

# %%
from navixy.services import get_navixy_hash
print(get_navixy_hash())


# %%
from navixy.services import fetch_tracker_list
# print(fetch_tracker_list().json())
data = fetch_tracker_list().json()
first_tracker = data.get("list", [])[0]  # Safely get first tracker
print(first_tracker)


# %%
from navixy.services import pull_tracker_list
from navixy.models import GpsTracker
from navixy.serializers import GpsTrackerSerializer
from navixy.models import GpsTracker
GpsTracker.objects.all().delete()

pull_tracker_list()
trackers = GpsTracker.objects.all()
data = GpsTrackerSerializer(trackers, many=True).data

# print(data[0])  # see the first tracker as JSON
print(data)  # see the first tracker as JSON

# %%
from navixy.services import get_tracker_ids
print(get_tracker_ids())

# %%

from django.conf import settings
print("Using DB:", settings.DATABASES['default']['NAME'])


# %%
from navixy.services import get_tracker_ids

tracker_ids = get_tracker_ids()
print(tracker_ids)





# %%
from navixy.services import pull_track_points_data
pull_track_points_data(45504)

# %%
from navixy.services import check_report_status
from navixy.models import GpsReport
report =  GpsReport.objects.get(nav_report_id=1538720) 
print("Created report:", report.nav_report_id)
check_report_status(report)

# %%
from datetime import datetime
from navixy.models import GpsZoneReportLine
from django.db.models import Count

# Set the date range (same start and end date)
start_date = "2025-05-01"
end_date = "2025-05-01"

# Parse to date objects
start = datetime.strptime(start_date, "%Y-%m-%d").date()
end = datetime.strptime(end_date, "%Y-%m-%d").date()

# Run the query
data = (
    GpsZoneReportLine.objects
    .filter(line_date__range=(start, end))
    .values('technic__fleet_number', 'location__name')
    .annotate(count=Count('id'))
    .order_by('-count')
)

# See results
list(data)


# %% track poiunts  
from navixy.services import pull_track_points_datas
from datetime import datetime, time

start_str = '2025-05-01'
start_date = datetime.strptime(start_str, "%Y-%m-%d").date()

pull_track_points_datas(start_date)

# %%
# report tatah yesterday
from navixy.services import generate_reports
from datetime import datetime, time
start_str = '2025-04-02'
start_date = datetime.strptime(start_str, "%Y-%m-%d").date()

generate_reports(start_date)