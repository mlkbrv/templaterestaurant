# restaurant/urls.py
from django.urls import path
from . import views

app_name = 'restaurant'

urlpatterns = [
    path('', views.index, name='index'),
    path('basket/add/<int:product_id>/<int:table_id>/', views.basket_add, name='basket_add'),
    path('admin-panel/', views.admin_panel, name='admin_panel'),
    path('remove/<int:basket_id>/', views.remove_item, name='remove_item'),
    path('clear-cart/', views.clear_cart, name='clear_cart'),
]
