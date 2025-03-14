from django.urls import path
#from pages import views
from . import views

urlpatterns = [
	
    path('api/fleet/', views.fleet_list, name='fleet-list'),
    path('api/fleet/add/', views.add_fleet, name='add-fleet'),
    path('api/fleet/delete/<int:fleet_id>/', views.delete_fleet, name='delete-fleet'),
    
    path('', views.index, name='index'),
    path("home/", views.home, name='home'),
    path("details/", views.project_index, name="project_index"),
    path('new/', views.newProject, name='NewGroup'),
    path('EditItem/<int:product_id>/', views.newProject, name='NewGroup'),
    path('EditFleet/<int:fleet_id>/', views.add_fleet, name='NewGroup'),	
    path("list/", views.project_list, name="project_list"),
    path('Game/', views.handle_game_details_request, name='Game'),
    path('newStudent/', views.CUStudent, name='NewStudent'),
    path('DeleteItem/<int:product_id>/', views.handle_delete_item_request, name='Delete Item'),
    path('DeleteFleet/<int:fleet_id>/', views.handle_delete_fleet_request, name='Delete Item'),	
	path('addFleet/', views.add_fleet, name='add_fleet'),
    path('fleetList/', views.fleet_list, name='fleet_list'),
	path('carModel/', views.add_car_model, name='add_car_model'),
	path('brand/', views.add_brand, name='add_brand'),
	
    #path('EditItem/<int:product_id>/', views.handle_edit_item_request, name='Edit Item')
]
