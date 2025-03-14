from django.db import models


# Create your models here.
class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    technology = models.CharField(max_length=20)


class Student(models.Model):
    name = models.CharField(max_length=30)
    age = models.IntegerField()
    major = models.CharField(max_length=10)
    graduated = models.BooleanField()


class gameStints(models.Model):
    gameID = models.CharField(max_length=10)
    stintStart = models.CharField(max_length=10)
    stintEnd = models.CharField(max_length=10)
    awayPos = models.IntegerField()
    homePos = models.IntegerField()
    awayScore = models.IntegerField()
    homeScore = models.IntegerField()

    def __str__(self):
        return f"{self.gameID} - {self.awayScore}- {self.homeScore}- {self.awayPos}- {self.homePos}"


class Brand(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class CarModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="models")
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.brand.name} {self.name}"


class Fleet(models.Model):
    fleet_id = models.CharField(max_length=10, unique=True)
    fleet_number = models.CharField(max_length=10)
    gps_tracker_id = models.CharField(max_length=10)
    state_number = models.CharField(max_length=10)
    manufacture_date = models.DateField()

    # Link to Brand and CarModel
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="fleets")
    car_model = models.ForeignKey(
        CarModel, on_delete=models.CASCADE, related_name="fleets"
    )

    def __str__(self):
        return f"Fleet {self.fleet_number}: {self.brand.name} {self.car_model.name}"
