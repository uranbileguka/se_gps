from django.shortcuts import render
# views.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from navixy.models import GpsZoneReportLine, GpsZone, GpsFuelReportLine, GpsMotohourReportLine, TrackPoint  
from pages.models import Fleet
from django.db.models import Count, Sum, Q
from datetime import datetime, time

from .serializers import (
	FleetSerializer,
	GpsTrackerSerializer,
	GpsZoneSerializer,
	GpsReportSerializer,
	GpsTripReportLineSerializer,
	GpsZoneReportLineSerializer,
	GpsStopReportLineSerializer,
	GpsFuelReportLineSerializer,
	GpsFuelFillReportSerializer,
)
import logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def location_count_by_technic(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	location = request.data.get('location')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if location:
		filters['location_id'] = location

	raw_data = (
		GpsZoneReportLine.objects
		.filter(**filters)
		.values('technic_id', 'technic__fleet_number')  # Include fleet number
		.annotate(count=Count('id'))
		.order_by('-count')
	)

	data = [
		{
			'fleet_number': item['technic__fleet_number'],
			'count': item['count']
		}
		for item in raw_data
	]

	return Response(data)

@api_view(['POST'])
def location_count_by_date(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	location = request.data.get('location')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if location:
		filters['location_id'] = location

	raw_data = (
		GpsZoneReportLine.objects
		.filter(**filters)
		.values('line_date')
		.annotate(count=Count('id'))
		.order_by('line_date')
	)

	data = [
		{
			'line_date': item['line_date'],
			'count': item['count']
		}
		for item in raw_data
	]

	return Response(data)



@api_view(['GET'])
def zone_report_list(request):
	report = GpsZoneReportLine.objects.all()
	serializer = GpsZoneReportLineSerializer(report, many=True)
	return Response(serializer.data)

@api_view(['GET'])
def list_locations(request):
	locations = GpsZone.objects.values('id', 'english_name').order_by('english_name')
	return Response(list(locations))	

# Utilization report
@api_view(['GET'])
def list_technics(request):
	fleets = Fleet.objects.values('id', 'fleet_number').order_by('fleet_number')
	return Response(list(fleets))		

@api_view(['POST'])
def motohour_count_by_technic(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	technic = request.data.get('technic')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if technic:
		filters['technic_id'] = technic

	raw_data = (
		GpsMotohourReportLine.objects
		.filter(**filters)
		.values('technic_id', 'technic__fleet_number')  # Include fleet number
		.annotate(total_duration=Sum('duration_hour'))
		.order_by('-total_duration')
	)
	start_datetime = datetime.combine(start, time.min)
	end_datetime = datetime.combine(end, time.max)
	date_diff_hours = ((end_datetime - start_datetime).total_seconds()) /3600.0
	logger.info(f"Start: {start_datetime}, End: {end_datetime}, diff: {date_diff_hours}")

	data = [
		{
			'fleet_number': item['technic__fleet_number'],
			'total_worked_hour': round(float(item['total_duration']) if item['total_duration'] else 0.0,1),
			'date_range_hours': round(date_diff_hours, 2),
	   		'total_stop_hour': round(date_diff_hours - float(item['total_duration']) if item['total_duration'] else date_diff_hours, 2),
			'worked_percent': f"{round((float(item['total_duration']) / (date_diff_hours)) * 100) if item['total_duration'] else 0}",
		
		}
		for item in raw_data
	]

	return Response(data)

@api_view(['POST'])
def motohour_count_by_date(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	technic = request.data.get('technic')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if technic:
		filters['technic_id'] = technic

	raw_data = (
		GpsMotohourReportLine.objects
		.filter(**filters)
		.values('line_date')
		.annotate(
			total_duration=Sum('duration_hour'),
			technic_count=Count('technic_id', distinct=True)
		)    	
		.order_by('line_date')
	)
	start_datetime = datetime.combine(start, time.min)
	end_datetime = datetime.combine(end, time.max)
	date_diff_hours = ((end_datetime - start_datetime).total_seconds()) /3600.0
	logger.info(f"Start: {start_datetime}, End: {end_datetime}, diff: {date_diff_hours}")

	data = [
		{
			'technic_count': item['technic_count'],
			'line_date': item['line_date'],
			'total_worked_hour': float(item['total_duration']) if item['total_duration'] else 0.0,
			'date_range_hours': round(date_diff_hours, 2),
	   		'total_stop_hour': round(date_diff_hours - float(item['total_duration']) if item['total_duration'] else date_diff_hours, 2),
			'worked_percent': f"{round((float(item['total_duration']) / (24*item['technic_count'])) * 100) if item['total_duration'] else 0}"
		}
		for item in raw_data
	]

	return Response(data)

# fuel
@api_view(['POST'])
def fuel_count_by_technic(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	technic = request.data.get('technic')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if technic:
		filters['technic_id'] = technic

	raw_data = (
		GpsFuelReportLine.objects
		.filter(**filters)
		.values('technic_id', 'technic__fleet_number')  # Include fleet number
		.annotate(
			total_mileage=Sum('mileage'),
			total_consumed=Sum('consumed'),
			total_consumpt_per_dist=Sum('consumpt_per_dist'),
			total_fillings_volume=Sum('fillings_volume'),
	)    	
		.order_by('-total_consumed')
	)


	data = [
		{
			'fleet_number': item['technic__fleet_number'],
			'total_mileage': round(float(item['total_mileage']) if item['total_mileage'] else 0.0,1),
			'total_consumed': round(float(item['total_consumed']) if item['total_consumed'] else 0.0,1),
			'total_fillings_volume': round(float(item['total_fillings_volume']) if item['total_fillings_volume'] else 0.0,1),
			'consumed_per_mile': round(float(item['total_consumed']) / float(item['total_mileage']), 2) if item['total_consumed'] > 0 else 0
		
		}
		for item in raw_data
	]

	return Response(data)

@api_view(['POST'])
def fuel_count_by_date(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	technic = request.data.get('technic')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start = datetime.strptime(start_date, "%Y-%m-%d").date()
		end = datetime.strptime(end_date, "%Y-%m-%d").date()
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	
	filters = {'line_date__range': (start, end)}
	if technic:
		filters['technic_id'] = technic

	raw_data = (
		GpsFuelReportLine.objects
		.filter(**filters)
		.values('line_date')
		.annotate(
			total_mileage=Sum('mileage'),
			total_consumed=Sum('consumed'),
			total_consumpt_per_dist=Sum('consumpt_per_dist'),
			total_fillings_volume=Sum('fillings_volume'),
	)    	
		.order_by('-total_consumed')
	)


	data = [
		{
			'line_date': item['line_date'],
			'total_mileage': round(float(item['total_mileage']) if item['total_mileage'] else 0.0,1),
			'total_consumed': round(float(item['total_consumed']) if item['total_consumed'] else 0.0,1),
			'total_fillings_volume': round(float(item['total_fillings_volume']) if item['total_fillings_volume'] else 0.0,1),
			'consumed_per_mile': round(float(item['total_consumed']) / float(item['total_mileage']), 2) if item['total_consumed'] > 0 else 0
		
		}
		for item in raw_data
	]

	return Response(data)

@api_view(['POST'])
def trackpoint(request):
	start_date = request.data.get('start_date')
	end_date = request.data.get('end_date')
	technic_id = request.data.get('technic_id')

	if not start_date or not end_date:
		return Response({'error': 'start_date and end_date are required'}, status=400)

	try:
		start_datetime = datetime.fromisoformat(start_date)
		end_datetime = datetime.fromisoformat(end_date)

		# start_datetime = datetime.combine(datetime.strptime(start_date, "%Y-%m-%d"), time.min)
		# end_datetime = datetime.combine(datetime.strptime(end_date, "%Y-%m-%d"), time.max)
	except ValueError:
		return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)

	filters = Q(timestamp__range=(start_datetime, end_datetime))
	if technic_id:
		filters &= Q(technic_id=technic_id)

	trackpoints = TrackPoint.objects.filter(filters).values(
		'name', 'latitude', 'longitude', 'timestamp'
	).order_by('timestamp')

	return Response(list(trackpoints))