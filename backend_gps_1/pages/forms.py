from django import forms
from django.conf import settings
from django.forms import ModelForm
# import pdb
#from django.utils.translation import ugettext_lazy as _
import logging
from .models import *
from django.contrib.auth.forms import *
from django.contrib.auth.models import User


class NewProjectForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(NewProjectForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Project
        fields = '__all__'

class UserRegistrationForm(UserCreationForm):
    first_name = forms.CharField(max_length=101)
    last_name = forms.CharField(max_length=101)
    email = forms.EmailField()
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

class StudentForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(StudentForm, self).__init__(*args, **kwargs)
    class Meta:
        model = Student
        fields = '__all__'


class FleetForm(forms.ModelForm):
    manufacture_date = forms.DateField(
        widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}),
        required=True
    )

    class Meta:
        model = Fleet
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(FleetForm, self).__init__(*args, **kwargs)
        # Optionally add Bootstrap classes to all fields
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'



class BrandForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(BrandForm, self).__init__(*args, **kwargs)
    class Meta:
        model = Brand
        fields = '__all__'


class CarModelForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super(CarModelForm, self).__init__(*args, **kwargs)
    class Meta:
        model = CarModel
        fields = '__all__'
