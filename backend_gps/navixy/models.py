import string
from django.db import models
from pages.models import Fleet

# Create your models here.
class GpsTracker(models.Model):
	id = models.IntegerField(primary_key=True)
	name = models.CharField(max_length=255)

	def __str__(self):
		return self.name

class GpsZone(models.Model):
	name = models.CharField(max_length=255)
	english_name = models.CharField(max_length=255, null=True)
	navixy_id = models.IntegerField(unique=True, null=True, blank=True)

	def __str__(self):
		return self.name
	# when created automatically save as Zone A. Zone B
	def save(self, *args, **kwargs):
		if not self.english_name:
			count = GpsZone.objects.exclude(english_name='').count()
			letter = string.ascii_uppercase[count % 26]  # A to Z cycle
			rounds = count // 26
			if rounds:
				self.english_name = f"Zone {letter}{rounds + 1}"  # Zone A1, B1...
			else:
				self.english_name = f"Zone {letter}"  # Zone A, Zone B...
		super().save(*args, **kwargs)

class GpsReport(models.Model):
   
	nav_report_id = models.IntegerField()
	date = models.DateField()

	REPORT_TYPE_CHOICES = [
		('trip', 'Trip'),
		('stop', 'Stop'),
		('fuel', 'Fuel'),
		('motohour', 'Moto Hour'),
		('zone', 'Zone'),
	]
	report_type = models.CharField(
		max_length=20,
		choices=REPORT_TYPE_CHOICES,
		default='trip'
	)
	state = models.CharField(
		max_length=20,
		choices=[('in_process', 'In process'), ('done', 'Done'), ('fail', 'Fail')]
	)
	server_msg = models.CharField(max_length=255, null=True, blank=True)

	def __str__(self):
		return f"Report {self.report_type} - {self.date}"
	

class GpsTripReportLine(models.Model):
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name='trip_line_ids')
	technic = models.ForeignKey(Fleet, on_delete=models.CASCADE)
	line_date = models.DateField()

	from_loc = models.ForeignKey(GpsZone, related_name='from_lines', on_delete=models.SET_NULL, null=True)
	to_loc = models.ForeignKey(GpsZone, related_name='to_lines', on_delete=models.SET_NULL, null=True)
	from_loc_char = models.CharField(max_length=255, blank=True)
	to_loc_char = models.CharField(max_length=255, blank=True)

	from_time = models.DateTimeField(null=True, blank=True)
	to_time = models.DateTimeField(null=True, blank=True)

	length = models.FloatField()
	time_sec = models.FloatField()
	time_string = models.CharField(max_length=50)
	avg_speed = models.FloatField()
	max_speed = models.FloatField()
	fuel_consumption = models.FloatField()
	idle_sec = models.FloatField()
	idle_string = models.CharField(max_length=50)
	time_hour = models.FloatField()
	idle_hour = models.FloatField()


	def __str__(self):
		return f"Trip line for {self.technic} on {self.line_date}"


class GpsZoneReportLine(models.Model):
	
	line_date = models.DateField()
	roster_date = models.DateField(null=True, blank=True)
	technic = models.ForeignKey(Fleet, on_delete=models.RESTRICT)
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name="zone_lines")

	location = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="zone_location")
	in_loc = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="zone_in_location")
	out_loc = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="zone_out_location")

	in_datetime = models.DateTimeField(null=True, blank=True)
	out_datetime = models.DateTimeField(null=True, blank=True)

	duration_sec = models.FloatField()
	duration_string = models.CharField(max_length=100)
	duration_hour = models.FloatField()		


class GpsStopReportLine(models.Model):
	line_date = models.DateField()
	technic = models.ForeignKey(Fleet, on_delete=models.RESTRICT)
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name="stop_lines")

	loc = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="stop_location")
	loc_char = models.CharField(max_length=255, blank=True)

	from_time = models.DateTimeField(null=True, blank=True)
	to_time = models.DateTimeField(null=True, blank=True)

	idle_sec = models.FloatField()
	idle_hour = models.FloatField()
	idle_string = models.CharField(max_length=100)

	ignition_sec = models.FloatField()
	ignition_string = models.CharField(max_length=100)
	ignition_hour = models.FloatField()	

class GpsMotohourReportLine(models.Model):
	line_date = models.DateField()
	technic = models.ForeignKey(Fleet, on_delete=models.RESTRICT)
	ownership_type = models.CharField(
		max_length=20,
		choices=[
			('own', 'Own'),
			('leasing', 'Leasing'),
			('partner', 'Partner'),
			('rental', 'Rental'),
		],
		null=True,
		blank=True
	)
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name="motohour_lines")

	start_loc = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="start_motohours")
	end_loc = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL, related_name="end_motohours")

	start_time = models.DateTimeField(null=True, blank=True)
	end_time = models.DateTimeField(null=True, blank=True)

	in_movement_sec = models.FloatField()
	in_movement_hour = models.FloatField()
	duration_sec = models.FloatField()
	duration_hour = models.FloatField()

class GpsFuelReportLine(models.Model):
	line_date = models.DateField()
	technic = models.ForeignKey(Fleet, on_delete=models.RESTRICT)
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name="fuel_detailed_lines")

	mileage = models.FloatField()
	start_bal = models.FloatField()
	end_bal = models.FloatField()
	consumed = models.FloatField()
	consumpt_per_dist = models.FloatField()
	fillings_count = models.IntegerField()
	fillings_volume = models.FloatField()
	drains_count = models.IntegerField()
	drains_volume = models.FloatField()	

class GpsFuelFillReport(models.Model):
	line_datetime = models.DateTimeField()
	technic = models.ForeignKey(Fleet, on_delete=models.RESTRICT)
	report = models.ForeignKey(GpsReport, on_delete=models.CASCADE, related_name="fuel_fill_lines")

	volume = models.FloatField()
	start_vol = models.FloatField()
	end_vol = models.FloatField()
	type = models.CharField(max_length=10, choices=[('fill', 'Fill'), ('drain', 'Drain')])
	mileage = models.FloatField()
	location = models.ForeignKey(GpsZone, null=True, on_delete=models.SET_NULL)	