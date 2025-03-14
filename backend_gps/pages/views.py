from django.http import HttpResponse, HttpResponseRedirect, Http404
from .models import *
from .forms import *
import json
from django.shortcuts import render, redirect,  get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.urls import reverse
from datetime import datetime, time

# api
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Fleet, Brand, CarModel, Project
from .serializers import FleetSerializer, BrandSerializer, CarModelSerializer

def index(request):
    return render(request, "pages/stintGraph.html")

def project_list(request):
    project = Project.objects.all()
    return render(request, "pages/project_details.html", {"projects": project})

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, f'Your account has been created. You can log in now!')
            return redirect('login')
    else:
        form = UserRegistrationForm()
    context = {'form': form}
    return render(request, 'pages/register.html', context)

def CUStudent(request, student_id=None):
    studentObj = None
    if request.method == 'POST':
        # request.POST - get all the data save it to the database
        student_form = StudentForm(request.POST)
        if student_form.is_valid():
           ab = student_form.save()
           ab.save()
        #    load particular page   
           return HttpResponseRedirect('/pages/studentlist/')
    else:
        if request.method == 'GET':
            if student_id:
                studentObj = Project.objects.get(pk=student_id)
                #Only Task creater can make task Public or Private
                student_form = StudentForm(instance=studentObj)
            else:
                student_form = StudentForm()

    return render(request, 'pages/NewStudent.html', {'StudentForm_form': student_form,
                                                              'studentObj': studentObj, })


def newProject(request, product_id=None):
    groupObj = None
    if request.method == 'POST':
        group_form = NewProjectForm(request.POST)
        if group_form.is_valid():
           groupF = group_form.save()
           groupF.save()
           return HttpResponseRedirect('/pages/list/')
    else:
        if request.method == 'GET':
            if product_id:
                groupObj = Project.objects.get(pk=product_id)
                #Only Task creater can make task Public or Private
                group_form = NewProjectForm(instance=groupObj)
            else:
                group_form = NewProjectForm()

    return render(request, 'pages/NewProject.html', {'GroupForm_form': group_form,
                                                              'groupobj': groupObj, })

def project_index(request):
    projects = Project.objects.all()
    context = {
        "projects": projects
    }
    return render(request, "pages/project_index.html", context)

def home(request):
    project = Project.objects.all()
    return render(request, "pages/project_details.html", {"projects": project})

def handle_delete_item_request(request, product_id):
    item = Project.objects.get(id=product_id)
    item.delete()
    project = Project.objects.all()
    return render(request, "pages/project_details.html", {"projects": project})

def handle_delete_fleet_request(request, fleet_id):
    item = Fleet.objects.get(id=fleet_id)
    item.delete()
    fleet = Fleet.objects.all()
    return render(request, "pages/fleet_list.html", {"fleet": fleet})

def handle_game_details_request(request, game_id=None):
    game_id = request.GET.get("game_id")
    #print(game_id)
    stats = gameStints.objects.filter(gameID='202306010DEN')
    dataTable = {}
    homeScore = []
    awayScore = []
    homePos = []
    awayPos = []
    stintStart = []
    stintEnd = []
    stints = []

    for row in stats:
        homeScore.append(row.homeScore)
        awayScore.append(row.awayScore)
        homePos.append(row.homePos)
        awayPos.append(row.awayPos)
        stintStart.append(row.stintStart)
        stintEnd.append(row.stintEnd)
        startTime_object = datetime.strptime(row.stintStart, '%H:%M:%S')
        endTime_object = datetime.strptime(row.stintEnd, '%H:%M:%S')#.time()
        diff = startTime_object - endTime_object
        stints.append(diff.total_seconds())
        
    dataTable[0] ={"homeScore": homeScore, "awayScore": awayScore, "homePos": homePos, "awayPos": awayPos, "stintStart":stintStart, "stintEnd":stintEnd, "stints": stints}
    data = json.dumps(dataTable)   
    mimetype = 'application/json'
    return HttpResponse(data, mimetype)



# # Fleet Form View
# def add_fleet(request, fleet_id=None):
#     fleetObj = None
#     if request.method == 'POST':
#         fleet_form = FleetForm(request.POST)
#         if fleet_form.is_valid():
#             fleetF = fleet_form.save()
#             fleetF.save()
#             return HttpResponseRedirect('/pages/addFleet/')  # Redirect to fleet list page
#     else:
#         if request.method == 'GET':
#             if fleet_id:
#                 fleetObj = Fleet.objects.get(pk=fleet_id)
#                 fleet_form = FleetForm(instance=fleetObj)
#             else:
#                 fleet_form = FleetForm()

#     return render(request, 'pages/fleet_form.html', {'form': fleet_form})

# # Fleet Form View
def add_brand(request, brand_id=None):
    brandObj = None
    if request.method == 'POST':
        brand_form = BrandForm(request.POST)
        if brand_form.is_valid():
            BrandF = brand_form.save()
            BrandF.save()
            return redirect('add_brand')  # Redirect to Brand list page
    else:
        if request.method == 'GET':
            if brand_id:
                brandObj = Brand.objects.get(pk=brand_id)
                brand_form = BrandForm(instance=brandObj)
            else:
                brand_form = BrandForm()

    return render(request, 'pages/brandForm.html', {'form': brand_form})


# # Fleet Form View
def add_car_model(request, carModel_id=None):
    carModelObj = None
    if request.method == 'POST':
        carModel_form = CarModelForm(request.POST)
        if carModel_form.is_valid():
            carModelF = carModel_form.save()
            carModelF.save()
            return redirect('add_car_model')  # Redirect to Brand list page
    else:
        if request.method == 'GET':
            if carModel_id:
                carModelObj = CarModel.objects.get(pk=carModel_id)
                carModel_form = CarModelForm(instance=carModelObj)
            else:
                carModel_form = CarModelForm()

    return render(request, 'pages/carModelForm.html', {'form': CarModelForm})

# api
@api_view(['GET'])
def fleet_list(request):
    fleet = Fleet.objects.all()
    serializer = FleetSerializer(fleet, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_fleet(request):
    serializer = FleetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def delete_fleet(request, fleet_id):
    try:
        fleet = Fleet.objects.get(id=fleet_id)
        fleet.delete()
        return Response({"message": "Fleet deleted successfully"}, status=204)
    except Fleet.DoesNotExist:
        return Response({"error": "Fleet not found"}, status=404)