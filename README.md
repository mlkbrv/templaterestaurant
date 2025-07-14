# Template Restaurant

Это учебный проект на Django для демонстрации онлайн-меню ресторана.

## Возможности
- Просмотр меню с категориями и блюдами
- Выбор столика
- (В разработке) Корзина заказов
- Админ-панель для управления меню

## Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone <repo-url>
   cd templaterestaurant
   ```
2. Установите зависимости (рекомендуется использовать виртуальное окружение):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install django
   ```
3. Примените миграции:
   ```bash
   python manage.py migrate
   ```
4. (Опционально) Загрузите фикстуры:
   ```bash
   python manage.py loaddata fixtures/all.json
   ```
5. Запустите сервер:
   ```bash
   python manage.py runserver
   ```
6. Откройте в браузере: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Структура проекта
- `restaurant/` — основное Django-приложение
- `media/` — изображения блюд
- `fixtures/` — пример данных для загрузки

## Требования
- Python 3.8+
- Django 3.x или 4.x

## Лицензия
MIT (или укажите свою) 