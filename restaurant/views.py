from django.shortcuts import render
from .models import *

def index(request):
    dishes = Food.objects.all()
    categories = FoodCategory.objects.all()
    tables = Table.objects.all()
    context = {
        'categories': categories,
        'dishes': dishes,
        'tables': tables,
    }
    return render(request,'restaurant/restaurant.html',context)
