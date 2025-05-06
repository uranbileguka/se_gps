from rest_framework import serializers
from .models import Fleet, Brand, CarModel
from django.contrib.auth.models import User


from rest_framework import serializers
from .models import Fleet, Brand, CarModel

class FleetSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)  # ✅ Get brand name
    car_model_name = serializers.CharField(source="car_model.name", read_only=True)  # ✅ Get car model name

    class Meta:
        model = Fleet
        fields = [
            "id",
            "fleet_id",
            "fleet_number",
            "gps_tracker_id",
            "state_number",
            "manufacture_date",
            "brand",
            "brand_name",  # ✅ Include brand name
            "car_model",
            "car_model_name",  # ✅ Include car model name
        ]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

# it s gonna give car brand too
class CarModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)

    class Meta:
        model = CarModel
        fields = ["id", "name", "brand", "brand_name"]


# user login
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user