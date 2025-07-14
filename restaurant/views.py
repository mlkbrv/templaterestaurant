from django.http import HttpResponseRedirect
from django.shortcuts import render
from .models import *
from django.shortcuts import get_object_or_404, redirect
def index(request):
    categories = FoodCategory.objects.prefetch_related('food_set').all()
    dishes = Food.objects.all()
    tables = Table.objects.all()
    if request.method == 'POST':
        selected_table_id = int(request.POST.get('table_id'))
        request.session['selected_table_id'] = selected_table_id
    else:
        selected_table_id = request.session.get('selected_table_id')
    baskets = Basket.objects.filter(table_id=selected_table_id) if selected_table_id else []
    total_sum = 0
    for basket in baskets:
        total_sum += basket.sum()
    context = {
        'categories': categories,
        'dishes': dishes,
        'tables': tables,
        'baskets': baskets,
        'selected_table_id': selected_table_id,
        'total_sum': total_sum,
    }
    return render(request, 'restaurant/restaurant.html', context)


def basket_add(request,product_id,table_id):
    dish = Food.objects.get(id=product_id)
    table = Table.objects.get(id=table_id)
    baskets = Basket.objects.filter(table=table,food=dish)
    if not baskets.exists():
        Basket.objects.create(table=table,food=dish,quantity=1)
    else:
        basket = baskets.first()
        basket.quantity += 1
        basket.save()
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))

def admin_panel(request):
    tables = Table.objects.all()
    table_orders = []

    for table in tables:
        orders = Basket.objects.filter(table=table)
        if orders.exists():
            table_orders.append({
                'table': table,
                'baskets': orders,
                'total': sum(item.sum() for item in orders)
            })

    context = {
        'table_orders': table_orders
    }
    return render(request, 'restaurant/admin_panel.html', context)

def remove_item(request, basket_id):
    basket = get_object_or_404(Basket, id=basket_id)
    basket.delete()
    return redirect('restaurant:admin_panel')

def clear_cart(request):
    if request.method == 'POST':
        if 'selected_table_id' in request.session:
            del request.session['selected_table_id']
    return redirect('restaurant:index')
