from django.contrib import admin
from .models import Food, FoodCategory, Table, Basket

admin.site.register(Food)
admin.site.register(FoodCategory)
admin.site.register(Table)
admin.site.register(Basket)