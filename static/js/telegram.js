// Инициализация Telegram Web App
function initTelegramApp() {
    if (typeof Telegram === 'undefined') {
        console.log('Telegram Web App not available');
        return;
    }

    const tg = window.Telegram.WebApp;

    // Расширяем на весь экран
    tg.expand();

    // Включаем подтверждение закрытия
    tg.enableClosingConfirmation();

    // Устанавливаем цвета
    tg.setHeaderColor('#1e3a8a');
    tg.setBackgroundColor('#0a1128');

    // Показываем основную кнопку
    tg.MainButton.setText('📞 Связаться с нами');
    tg.MainButton.setParams({
        color: '#3b82f6'
    });
    tg.MainButton.show();

    // Обработчик клика по основной кнопке
    tg.MainButton.onClick(function() {
        tg.openTelegramLink('https://t.me/chiauto_contact_bot');
    });

    // Инициализация завершена
    tg.ready();

    console.log('Telegram Web App initialized successfully');

    return tg;
}

// Функция для отправки данных в Telegram
function sendDataToTelegram(data) {
    if (typeof Telegram !== 'undefined') {
        const tg = window.Telegram.WebApp;
        tg.sendData(JSON.stringify(data));
    }
}

// Функция для открытия ссылки в Telegram
function openTelegramLink(url) {
    if (typeof Telegram !== 'undefined') {
        const tg = window.Telegram.WebApp;
        tg.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
}

// Функция для показа уведомления
function showTelegramAlert(message) {
    if (typeof Telegram !== 'undefined') {
        const tg = window.Telegram.WebApp;
        tg.showPopup({
            title: 'CHI AUTO',
            message: message,
            buttons: [{ type: 'ok' }]
        });
    } else {
        alert(message);
    }
}