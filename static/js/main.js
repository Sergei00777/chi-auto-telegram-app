// Основные функции приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    // Загрузка сохраненного города
    loadSavedCity();

    // Инициализация слушателей событий
    initEventListeners();

    // Показ уведомления о загрузке
    showWelcomeMessage();
}

function loadSavedCity() {
    const savedCity = localStorage.getItem('chiauto_selected_city');
    if (savedCity) {
        const cityElement = document.getElementById('currentCity');
        if (cityElement) {
            cityElement.textContent = savedCity;
        }
    }
}

function saveCity(cityName) {
    localStorage.setItem('chiauto_selected_city', cityName);
    const cityElement = document.getElementById('currentCity');
    if (cityElement) {
        cityElement.textContent = cityName;
    }
}

function initEventListeners() {
    // Обработчики для карточек
    const cards = document.querySelectorAll('.car-card, .action-card, .range-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function showWelcomeMessage() {
    // Показываем приветственное сообщение только при первом посещении
    const hasVisited = localStorage.getItem('chiauto_has_visited');
    if (!hasVisited) {
        setTimeout(() => {
            showTelegramAlert('Добро пожаловать в CHI AUTO! 🚗 Выберите автомобиль мечты из нашего каталога.');
            localStorage.setItem('chiauto_has_visited', 'true');
        }, 1000);
    }
}

// Функции для работы с модальными окнами
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Функции для работы с API
async function fetchCars(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/cars/filter?${params}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching cars:', error);
        return {};
    }
}

async function fetchCities() {
    try {
        const response = await fetch('/api/cities');
        return await response.json();
    } catch (error) {
        console.error('Error fetching cities:', error);
        return {};
    }
}

// Утилиты форматирования
function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price);
}

function formatPhone(phone) {
    return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3-$4-$5');
}

// Поиск и фильтрация
function searchCars(query, cars) {
    if (!query) return cars;

    const lowerQuery = query.toLowerCase();
    return Object.fromEntries(
        Object.entries(cars).filter(([id, car]) =>
            car.name.toLowerCase().includes(lowerQuery) ||
            car.description.toLowerCase().includes(lowerQuery) ||
            car.engine.toLowerCase().includes(lowerQuery)
        )
    );
}

// Добавьте эту функцию в main.js
function initNavigation() {
    // Определяем текущую страницу
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        // Удаляем активный класс у всех элементов
        item.classList.remove('active');

        // Проверяем, соответствует ли пункт меню текущей странице
        const pageUrl = item.getAttribute('onclick');
        if (pageUrl && pageUrl.includes(currentPath)) {
            item.classList.add('active');
        }
    });

    // Особый случай для главной страницы
    if (currentPath === '/' || currentPath === '/index') {
        const homeItem = document.querySelector('.nav-item[onclick*="/"]');
        if (homeItem && !homeItem.onclick.includes('/catalog') &&
            !homeItem.onclick.includes('/cities') &&
            !homeItem.onclick.includes('/service') &&
            !homeItem.onclick.includes('/contacts')) {
            homeItem.classList.add('active');
        }
    }
}

// Обновите функцию initApp
function initApp() {
    // Загрузка сохраненного города
    loadSavedCity();

    // Инициализация слушателей событий
    initEventListeners();

    // Инициализация навигации
    initNavigation();

    // Показ уведомления о загрузке
    showWelcomeMessage();
}