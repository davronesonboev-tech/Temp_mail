# 📧 TempMail - Свой Временный Email Сервис

Полнофункциональный сервис временной почты с красивым интерфейсом, готовый к деплою на Railway! 🚀

## ✨ Особенности

- 🎨 **Современный UI** - Красивый темный интерфейс с градиентами
- ⚡ **Быстрая работа** - Мгновенное получение писем
- 🔒 **Анонимность** - Не требуется регистрация
- 📱 **Адаптивный дизайн** - Работает на всех устройствах
- 🌐 **Свои домены** - Используйте любые домены
- 🗄️ **MongoDB** - Надежное хранение писем
- 🔄 **Автообновление** - Письма обновляются каждые 10 секунд
- 🗑️ **Автоудаление** - Письма удаляются через 24 часа
- 📬 **SMTP сервер** - Встроенный SMTP сервер для получения писем
- 🎯 **API** - RESTful API для интеграций

## 🚀 Быстрый старт

### Локальная установка

1. **Клонируйте репозиторий:**
```bash
git clone <your-repo-url>
cd temp-mail
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**

Создайте файл `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tempmail
SMTP_PORT=25
SMTP_HOST=0.0.0.0
ALLOWED_DOMAINS=tempmail.local,mail.local
EMAIL_RETENTION_HOURS=24
MAX_EMAILS_PER_ADDRESS=50
ALLOWED_ORIGINS=*
```

4. **Запустите MongoDB:**
```bash
# Через Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Или установите локально с mongodb.com
```

5. **Запустите сервер:**
```bash
npm start
# Или для разработки с автоперезагрузкой:
npm run dev
```

6. **Откройте браузер:**
```
http://localhost:3000
```

## 🌐 Деплой на Railway

### Шаг 1: Подготовка

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Установите Railway CLI (опционально):
```bash
npm install -g @railway/cli
```

### Шаг 2: Настройка MongoDB

**Вариант A: Railway MongoDB (Рекомендуется)**

1. В Railway создайте новый проект
2. Добавьте MongoDB сервис:
   - New → Database → Add MongoDB
3. Railway автоматически создаст переменную `MONGO_URL`

**Вариант B: MongoDB Atlas (Бесплатно)**

1. Зайдите на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте бесплатный кластер (M0)
3. Получите connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/tempmail
   ```

### Шаг 3: Деплой на Railway

**Через веб-интерфейс:**

1. Войдите на [Railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Выберите свой репозиторий
5. Railway автоматически определит Node.js проект

**Через CLI:**

```bash
railway login
railway init
railway up
```

### Шаг 4: Настройка переменных окружения

В Railway Dashboard → Variables добавьте:

```env
NODE_ENV=production
MONGODB_URI=${{MONGO_URL}}
ALLOWED_DOMAINS=вашдомен.com,mail.вашдомен.com
EMAIL_RETENTION_HOURS=24
MAX_EMAILS_PER_ADDRESS=50
PORT=3000
```

**⚠️ Важно про SMTP:**
Railway не поддерживает SMTP порт 25 напрямую. Есть варианты:
1. Использовать webhook от email провайдера (рекомендуется)
2. Настроить внешний SMTP relay
3. Использовать SendGrid/Mailgun API

### Шаг 5: Настройка доменов

**В Railway:**

1. Settings → Domains
2. Generate Domain - получите домен вида `yourapp.up.railway.app`
3. Или добавьте свой домен

**Настройка DNS для своих доменов:**

Для доменов в `ALLOWED_DOMAINS` настройте MX записи:

```
Тип: MX
Host: mail.вашдомен.com
Value: yourapp.up.railway.app
Priority: 10
```

Также добавьте A запись:
```
Тип: A
Host: yourapp.up.railway.app
Value: IP адрес Railway (смотрите в dashboard)
```

### Шаг 6: Проверка

После деплоя:

1. Откройте ваш домен Railway
2. Сгенерируйте email адрес
3. Отправьте тестовое письмо
4. Проверьте получение

## 🔧 Альтернативы для получения email

Поскольку Railway не поддерживает SMTP порт 25, вот альтернативные решения:

### Вариант 1: SendGrid Inbound Parse (Рекомендуется)

1. Зарегистрируйтесь на [SendGrid](https://sendgrid.com)
2. Настройте Inbound Parse:
   - Settings → Inbound Parse → Add Host & URL
   - Hostname: mail.вашдомен.com
   - Destination URL: https://вашдомен.railway.app/api/webhook/sendgrid
3. Добавьте MX записи от SendGrid

Код webhook для SendGrid (добавьте в `routes/emailRoutes.js`):

```javascript
router.post('/webhook/sendgrid', async (req, res) => {
    try {
        const { to, from, subject, text, html } = req.body;
        await saveEmail({ to, from, subject, text, html });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### Вариант 2: Mailgun Routes

1. Зарегистрируйтесь на [Mailgun](https://www.mailgun.com)
2. Добавьте домен
3. Настройте Route для форвардинга на ваш webhook
4. Настройте DNS записи

### Вариант 3: CloudMailin

1. Зарегистрируйтесь на [CloudMailin](https://www.cloudmailin.com)
2. Создайте email адрес
3. Укажите webhook URL
4. Настройте DNS

## 📚 API Документация

### Получить доступные домены
```http
GET /api/domains
```

### Сгенерировать случайный email
```http
POST /api/generate
Content-Type: application/json

{
  "custom": "myname" // Опционально
}
```

### Получить письма для адреса
```http
GET /api/emails/:address
```

### Получить письмо по ID
```http
GET /api/email/:emailId
```

### Удалить письмо
```http
DELETE /api/email/:emailId
```

### Удалить все письма адреса
```http
DELETE /api/emails/:address
```

### Статистика
```http
GET /api/stats
```

## ⚙️ Конфигурация

### Переменные окружения

| Переменная | Описание | По умолчанию |
|-----------|----------|--------------|
| `PORT` | HTTP порт | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/tempmail |
| `SMTP_PORT` | SMTP порт | 25 |
| `SMTP_HOST` | SMTP хост | 0.0.0.0 |
| `ALLOWED_DOMAINS` | Разрешенные домены (через запятую) | tempmail.local |
| `EMAIL_RETENTION_HOURS` | Время хранения писем (часы) | 24 |
| `MAX_EMAILS_PER_ADDRESS` | Макс писем на адрес | 50 |
| `ALLOWED_ORIGINS` | CORS origins | * |
| `NODE_ENV` | Окружение (production/development) | development |

## 🎨 Кастомизация

### Изменить цветовую схему

Отредактируйте `public/styles.css`:

```css
:root {
    --primary: #667eea;        /* Основной цвет */
    --primary-dark: #5568d3;
    --secondary: #764ba2;      /* Вторичный цвет */
    --danger: #ef4444;
    --success: #10b981;
}
```

### Изменить логотип

Замените SVG в `public/index.html` в секции `.logo`

### Добавить функции

Все API эндпоинты находятся в `routes/emailRoutes.js`
Backend логика в `utils/emailHandler.js`
Frontend в `public/app.js`

## 🛠️ Технологии

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Email:** smtp-server, mailparser
- **Frontend:** Vanilla JavaScript, CSS3
- **Deployment:** Railway, Docker

## 📝 Структура проекта

```
temp-mail/
├── models/              # MongoDB модели
│   ├── Email.js        # Модель письма
│   └── TempAddress.js  # Модель временного адреса
├── routes/             # API маршруты
│   └── emailRoutes.js  # Email endpoints
├── smtp/               # SMTP сервер
│   └── smtpServer.js   # Обработка входящих писем
├── utils/              # Утилиты
│   ├── cleanup.js      # Очистка старых писем
│   ├── domainGenerator.js  # Генерация адресов
│   └── emailHandler.js # Работа с письмами
├── public/             # Frontend
│   ├── index.html      # HTML
│   ├── styles.css      # Стили
│   └── app.js          # JavaScript
├── server.js           # Главный файл сервера
├── package.json        # Зависимости
├── Dockerfile          # Docker конфигурация
├── railway.json        # Railway конфигурация
└── README.md           # Документация
```

## 🔒 Безопасность

- ✅ Валидация всех входящих данных
- ✅ Защита от XSS атак
- ✅ CORS конфигурация
- ✅ Rate limiting (рекомендуется добавить)
- ✅ Автоматическое удаление старых данных
- ✅ Без хранения чувствительных данных

### Рекомендуется добавить:

```bash
npm install express-rate-limit helmet
```

В `server.js`:
```javascript
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // макс 100 запросов
}));
```

## 🐛 Решение проблем

### MongoDB не подключается
```bash
# Проверьте строку подключения
echo $MONGODB_URI

# Проверьте доступ к MongoDB
mongosh $MONGODB_URI
```

### SMTP не работает на Railway
- Railway блокирует порт 25
- Используйте webhook варианты (SendGrid, Mailgun)
- Или настройте внешний SMTP relay

### Письма не приходят
1. Проверьте MX записи домена: `nslookup -type=MX mail.yourdomain.com`
2. Проверьте настройки в `ALLOWED_DOMAINS`
3. Проверьте логи: `railway logs`

### Ошибки в браузере
- Откройте DevTools (F12)
- Проверьте Console и Network вкладки
- Проверьте CORS настройки

## 📈 Мониторинг

### Railway Dashboard
- Логи: `railway logs`
- Метрики: CPU, RAM, Network
- Deployments история

### Health Check
```bash
curl https://вашдомен.railway.app/health
```

## 🚦 Производительность

### Оптимизация MongoDB

```javascript
// Добавьте индексы (уже включены в модели)
emailSchema.index({ to: 1, receivedAt: -1 });
emailSchema.index({ emailId: 1 });
```

### Кэширование

Для больших нагрузок добавьте Redis:
```bash
npm install redis
```

## 🤝 Вклад

Форкните проект, создавайте ветки, делайте pull requests!

## 📄 Лицензия

MIT License - используйте свободно!

## 🎉 Готово!

Теперь у вас есть свой собственный TempMail сервис! 

**Полезные ссылки:**
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [SendGrid Inbound Parse](https://docs.sendgrid.com/for-developers/parsing-email/setting-up-the-inbound-parse-webhook)
- [Mailgun Routes](https://documentation.mailgun.com/en/latest/user_manual.html#routes)

---

Сделано с ❤️ для приватности и удобства

