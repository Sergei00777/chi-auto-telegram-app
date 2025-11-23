from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)


# Загрузка данных
def load_cities_data():
    with open('static/data/cities.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def load_cars_data():
    with open('static/data/cars.json', 'r', encoding='utf-8') as f:
        return json.load(f)


# Главная страница
@app.route('/')
def index():
    cities = load_cities_data()
    cars = load_cars_data()
    # Берем первые 6 авто для показа на главной
    featured_cars = dict(list(cars.items())[:6])
    return render_template('index.html', cities=cities, featured_cars=featured_cars)


# Каталог автомобилей
@app.route('/catalog')
def catalog():
    cars = load_cars_data()
    return render_template('catalog/catalog.html', cars=cars)


# Фильтр по ценовым диапазонам
@app.route('/catalog/range/<price_range>')
def catalog_range(price_range):
    cars = load_cars_data()
    filtered_cars = {}

    for car_id, car in cars.items():
        if car['price_range'] == price_range:
            filtered_cars[car_id] = car

    return render_template(f'catalog/price_ranges/range_{price_range}.html',
                           cars=filtered_cars, price_range=price_range)


# Детальная страница авто
@app.route('/car/<car_id>')
def car_detail(car_id):
    cars = load_cars_data()
    car = cars.get(car_id)
    if not car:
        return "Автомобиль не найден", 404
    return render_template('catalog/car_detail.html', car=car)


# Список городов
@app.route('/cities')
def cities_list():
    cities = load_cities_data()
    return render_template('cities/cities_list.html', cities=cities)


# Страница города
@app.route('/city/<city_id>')
def city_detail(city_id):
    cities = load_cities_data()
    cars = load_cars_data()
    city = cities.get(city_id)

    if not city:
        return "Город не найден", 404

    # Авто в этом городе
    city_cars = {car_id: car for car_id, car in cars.items()
                 if city_id in car.get('cities', [])}

    return render_template(f'cities/{city_id}.html',
                           city=city, cars=city_cars)


# Сервис
@app.route('/service')
def service_main():
    return render_template('service/service_main.html')


@app.route('/service/booking')
def service_booking():
    return render_template('service/service_booking.html')


@app.route('/service/status')
def service_status():
    return render_template('service/service_status.html')


# Контакты
@app.route('/contacts')
def contacts():
    cities = load_cities_data()
    return render_template('contacts.html', cities=cities)


# О компании
@app.route('/about')
def about():
    return render_template('about.html')


# API endpoints
@app.route('/api/cars')
def api_cars():
    cars = load_cars_data()
    return jsonify(cars)


@app.route('/api/cities')
def api_cities():
    cities = load_cities_data()
    return jsonify(cities)


@app.route('/api/cars/filter')
def api_cars_filter():
    cars = load_cars_data()
    price_range = request.args.get('price_range')
    city = request.args.get('city')

    filtered_cars = {}
    for car_id, car in cars.items():
        if price_range and car.get('price_range') != price_range:
            continue
        if city and city not in car.get('cities', []):
            continue
        filtered_cars[car_id] = car

    return jsonify(filtered_cars)

# Страница Toyota Land Cruiser 200
@app.route('/car/toyota_land_cruiser_200')
def toyota_land_cruiser_200():
    cities = load_cities_data()
    return render_template('catalog/cars/toyota_land_cruiser_200.html', cities=cities)

if __name__ == '__main__':
    # Создаем необходимые директории
    os.makedirs('static/data', exist_ok=True)
    os.makedirs('templates/catalog/price_ranges', exist_ok=True)
    os.makedirs('templates/cities', exist_ok=True)
    os.makedirs('templates/service', exist_ok=True)
    os.makedirs('templates/modals', exist_ok=True)

    app.run(host='0.0.0.0', port=5000, debug=True)