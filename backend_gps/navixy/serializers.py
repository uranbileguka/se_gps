from rest_framework import serializers
from .models import (
    GpsTracker, GpsZone, GpsReport, GpsTripReportLine, GpsZoneReportLine,
    GpsStopReportLine, GpsMotohourReportLine, GpsFuelReportLine, GpsFuelFillReport
)
from pages.models import Fleet


class FleetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fleet
        fields = '__all__'


class GpsTrackerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GpsTracker
        fields = ['id', 'name']


class GpsZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = GpsZone
        fields = ['id', 'name', 'english_name', 'navixy_id']


class GpsReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GpsReport
        fields = '__all__'


class GpsTripReportLineSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()
    from_loc = GpsZoneSerializer()
    to_loc = GpsZoneSerializer()

    class Meta:
        model = GpsTripReportLine
        fields = '__all__'


class GpsZoneReportLineSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()
    location = GpsZoneSerializer()
    in_loc = GpsZoneSerializer()
    out_loc = GpsZoneSerializer()

    class Meta:
        model = GpsZoneReportLine
        fields = '__all__'


class GpsStopReportLineSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()
    loc = GpsZoneSerializer()

    class Meta:
        model = GpsStopReportLine
        fields = '__all__'


class GpsMotohourReportLineSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()
    start_loc = GpsZoneSerializer()
    end_loc = GpsZoneSerializer()

    class Meta:
        model = GpsMotohourReportLine
        fields = '__all__'


class GpsFuelReportLineSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()

    class Meta:
        model = GpsFuelReportLine
        fields = '__all__'


class GpsFuelFillReportSerializer(serializers.ModelSerializer):
    report = GpsReportSerializer()
    technic = FleetSerializer()
    location = GpsZoneSerializer()

    class Meta:
        model = GpsFuelFillReport
        fields = '__all__'
