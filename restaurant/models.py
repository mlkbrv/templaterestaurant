from django.db import models

class Table(models.Model):
    number = models.IntegerField()

    def __str__(self):
        return f'Table - {self.number}'

class FoodCategory(models.Model):
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name

    class Meta:
        verbose_name_plural = "Food Categories"

class Food(models.Model):
    food_name = models.CharField(max_length=100,blank=False, null=False)
    description = models.TextField(blank=True, null=True)
    quantity = models.IntegerField(blank=False, null=False,default=0)
    price = models.FloatField(null=True, blank=True)
    category = models.ForeignKey(FoodCategory, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='images/', blank=True, default='images/default.jpg')
    def __str__(self):
        return self.food_name

class Basket(models.Model):
    table = models.ForeignKey(to=Table, on_delete=models.CASCADE)
    food = models.ForeignKey(to=Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    created_timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Корзина для столика {self.table.number} | Продукт: {self.food.food_name}"

    def sum(self):
        return self.quantity * self.food.price