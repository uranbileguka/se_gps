from django.contrib import admin
from django.urls import path, include
from . import views


	
urlpatterns = [
    path('api/locationcountbytechnic/', views.location_count_by_technic, name='location-count-by-technic'),
    path('api/locationcountbydate/', views.location_count_by_date, name='location_count_by_date'),
    path('api/zoneReport/', views.zone_report_list, name='zone-report'),
    path('api/locations/', views.list_locations, name='list-locations'),
    path('api/technics/', views.list_technics, name='list-technics'),
    path('api/motohourCountByTechnic/', views.motohour_count_by_technic, name='motohour_count_by_technic'),
    path('api/motohourCountByDate/', views.motohour_count_by_date, name='motohour_count_by_date'),
    path('api/fuelCountByTechnic/', views.fuel_count_by_technic, name='fuel_count_by_technic'),
    path('api/fuelCountByDate/', views.fuel_count_by_date, name='fuel_count_by_date'),
]
    #path('EditItem/<int:product_id>/', views.handle_edit_item_request, name='Edit Item')

