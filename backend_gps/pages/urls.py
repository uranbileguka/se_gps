from django.urls import path
#from pages import views
from . import views
from .views import RegisterAPIView, LoginAPIView, BrandCreateView, BrandListView, BrandDetailView, CarModelListView, CarModelCreateView, CarModelDetailView
from .views import FleetListView, FleetCreateView, FleetDetailView

urlpatterns = [
	
    path('api/fleet/', views.fleet_list, name='fleet-list'),
    path('api/fleet/add/', views.add_fleet, name='add-fleet'),
    path('api/fleet/delete/<int:fleet_id>/', views.delete_fleet, name='delete-fleet'),
    path('api/brands/', BrandCreateView.as_view(), name='brand-create'),
    path('api/brandList/', BrandListView.as_view(), name='brand-list'),
    path('api/brands/<int:pk>/', BrandDetailView.as_view(), name='brand-detail'),  # Retrieve, Update, Delete
    path("api/carmodels/", CarModelListView.as_view(), name="car-model-list"),
    path("api/carmodels/create/", CarModelCreateView.as_view(), name="car-model-create"),
    path("api/carmodels/<int:pk>/", CarModelDetailView.as_view(), name="car-model-detail"),
    path("api/fleets/", FleetListView.as_view(), name="fleet-list"),
    path("api/fleets/create/", FleetCreateView.as_view(), name="fleet-create"),
    path("api/fleets/<int:pk>/", FleetDetailView.as_view(), name="fleet-detail"),	
	
        # login
    path('api/register/', RegisterAPIView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='login'),

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
