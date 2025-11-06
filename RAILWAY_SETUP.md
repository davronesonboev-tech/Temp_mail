# 🚂 Railway Setup - Пошаговая Инструкция

Подробная инструкция по деплою TempMail на Railway с нуля до работающего сервиса.

## 📋 Что понадобится

- ✅ Аккаунт на [GitHub](https://github.com)
- ✅ Аккаунт на [Railway](https://railway.app)
- ✅ Аккаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (бесплатно)
- ✅ Домен (опционально, можно использовать Railway домен)

## 🎯 Шаг 1: Подготовка репозитория

### 1.1 Создайте репозиторий на GitHub

1. Перейдите на [GitHub](https://github.com/new)
2. Название: `temp-mail-service`
3. Выберите Public или Private
4. Не добавляйте README (у нас уже есть)
5. Нажмите Create repository

### 1.2 Загрузите код

```bash
# Инициализируйте git (если еще не сделали)
git init

# Добавьте remote
git remote add origin https://github.com/ВАШ_USERNAME/temp-mail-service.git

# Добавьте файлы
git add .

# Коммит
git commit -m "Initial commit: TempMail service"

# Пуш
git branch -M main
git push -u origin main
```

## 🗄️ Шаг 2: Настройка MongoDB Atlas

### 2.1 Создание аккаунта

1. Перейдите на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Нажмите "Try Free"
3. Зарегистрируйтесь через Google или email

### 2.2 Создание кластера

1. Выберите план **M0 (Free)**
2. Провайдер: **AWS** или **Google Cloud**
3. Region: Выберите ближайший к вам (например, Frankfurt для Европы)
4. Cluster Name: `tempmail-cluster`
5. Нажмите **Create**
6. Ждите 3-5 минут создания кластера

### 2.3 Настройка доступа

**Database Access (Пользователь):**

1. Security → Database Access → Add New Database User
2. Authentication Method: **Password**
3. Username: `tempmail`
4. Password: Сгенерируйте сложный (нажмите Autogenerate)
5. **ВАЖНО:** Сохраните пароль!
6. Database User Privileges: **Read and write to any database**
7. Add User

**Network Access (Белый список IP):**

1. Security → Network Access → Add IP Address
2. Выберите **Allow Access from Anywhere** (0.0.0.0/0)
3. Confirm

⚠️ Для production лучше ограничить доступ к конкретным IP Railway.

### 2.4 Получение Connection String

1. Нажмите **Connect** на вашем кластере
2. Выберите **Connect your application**
3. Driver: **Node.js**
4. Version: **4.1 or later**
5. Скопируйте Connection String:
   ```
   mongodb+srv://tempmail:<password>@tempmail-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Замените `<password>` на ваш реальный пароль
7. Добавьте имя базы данных в конце:
   ```
   mongodb+srv://tempmail:ВАШ_ПАРОЛЬ@tempmail-cluster.xxxxx.mongodb.net/tempmail?retryWrites=true&w=majority
   ```

## 🚂 Шаг 3: Деплой на Railway

### 3.1 Создание проекта

1. Перейдите на [Railway.app](https://railway.app)
2. Войдите через GitHub
3. Нажмите **New Project**
4. Выберите **Deploy from GitHub repo**
5. Если это первый раз, разрешите Railway доступ к GitHub
6. Выберите репозиторий `temp-mail-service`
7. Нажмите **Deploy Now**

Railway автоматически:
- Обнаружит Node.js проект
- Установит зависимости
- Запустит сервер

### 3.2 Настройка переменных окружения

1. Откройте ваш проект в Railway
2. Перейдите в **Variables**
3. Добавьте переменные по одной:

**Обязательные переменные:**

```env
NODE_ENV=production
```

```env
MONGODB_URI=mongodb+srv://tempmail:ВАШ_ПАРОЛЬ@tempmail-cluster.xxxxx.mongodb.net/tempmail?retryWrites=true&w=majority
```

```env
ALLOWED_DOMAINS=yourapp.up.railway.app
```

```env
EMAIL_RETENTION_HOURS=24
```

```env
MAX_EMAILS_PER_ADDRESS=50
```

```env
ALLOWED_ORIGINS=*
```

**Опциональные (Railway автоматически создаст PORT):**

```env
PORT=3000
```

4. После добавления переменных Railway автоматически передеплоит

### 3.3 Получение домена

1. В Railway проекте откройте **Settings**
2. Найдите раздел **Domains**
3. Нажмите **Generate Domain**
4. Получите домен вида: `yourapp.up.railway.app`
5. **ВАЖНО:** Обновите переменную `ALLOWED_DOMAINS`:
   ```
   ALLOWED_DOMAINS=yourapp.up.railway.app,temp.yourapp.up.railway.app
   ```

### 3.4 Проверка деплоя

1. Перейдите на **Deployments**
2. Дождитесь статуса **SUCCESS** ✅
3. Нажмите **View Logs** для просмотра логов
4. Должны увидеть:
   ```
   ✅ MongoDB подключен
   🚀 HTTP сервер запущен на порту 3000
   ```
5. Откройте ваш домен в браузере

## 🌐 Шаг 4: Настройка своего домена (Опционально)

### 4.1 Если у вас есть домен

**На стороне Railway:**

1. Settings → Domains → Add Custom Domain
2. Введите ваш домен: `mail.yourdomain.com`
3. Railway покажет CNAME запись

**На стороне вашего DNS провайдера (Cloudflare, Namecheap, etc):**

1. Добавьте CNAME запись:
   ```
   Type: CNAME
   Name: mail
   Target: yourapp.up.railway.app
   TTL: Auto
   ```

2. Для получения email, добавьте MX запись (после настройки email провайдера):
   ```
   Type: MX
   Name: @
   Priority: 10
   Target: inbound.sendgrid.net (пример для SendGrid)
   ```

### 4.2 Обновите ALLOWED_DOMAINS

В Railway Variables:
```env
ALLOWED_DOMAINS=mail.yourdomain.com,temp.yourdomain.com
```

## 📧 Шаг 5: Настройка получения email

Railway не поддерживает SMTP порт 25. Используйте один из вариантов:

### Вариант A: SendGrid (Рекомендуется)

#### 5.1 Регистрация

1. Перейдите на [SendGrid](https://signup.sendgrid.com)
2. Создайте бесплатный аккаунт
3. Подтвердите email

#### 5.2 Настройка домена

1. Settings → Sender Authentication
2. Authenticate Your Domain
3. Выберите DNS хост (например, Cloudflare)
4. Введите ваш домен
5. Добавьте DNS записи, которые покажет SendGrid (CNAME, MX)

#### 5.3 Inbound Parse

1. Settings → Inbound Parse
2. Add Host & URL
3. Hostname: `mail.yourdomain.com`
4. Destination URL: `https://yourapp.up.railway.app/api/webhook/sendgrid`
5. Check: "POST the raw, full MIME message"
6. Save

#### 5.4 Добавьте webhook в код

Создайте файл `routes/webhooks.js`:

```javascript
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { simpleParser } = require('mailparser');
const { saveEmail } = require('../utils/emailHandler');

const upload = multer();

router.post('/sendgrid', upload.single('email'), async (req, res) => {
    try {
        const parsed = await simpleParser(req.file.buffer);
        
        await saveEmail({
            to: parsed.to.text,
            from: parsed.from.text,
            subject: parsed.subject,
            text: parsed.text,
            html: parsed.html,
            headers: parsed.headers,
            attachments: parsed.attachments || []
        });
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Error');
    }
});

module.exports = router;
```

В `server.js` добавьте:

```javascript
const webhookRoutes = require('./routes/webhooks');
app.use('/api/webhook', webhookRoutes);
```

В `package.json` добавьте:

```json
"dependencies": {
    "multer": "^1.4.5-lts.1"
}
```

Коммит и пуш изменений!

### Вариант B: Mailgun

1. Зарегистрируйтесь на [Mailgun](https://www.mailgun.com)
2. Добавьте домен
3. Настройте Routes для форварда на webhook
4. Добавьте DNS записи

### Вариант C: CloudMailin

1. [CloudMailin](https://www.cloudmailin.com)
2. Создайте address
3. Webhook URL: `https://yourapp.up.railway.app/api/webhook/cloudmailin`
4. Обновите DNS

## ✅ Шаг 6: Тестирование

### 6.1 Проверка сервиса

1. Откройте `https://yourapp.up.railway.app`
2. Нажмите "Сгенерировать адрес"
3. Скопируйте email адрес

### 6.2 Отправка тестового письма

Используйте любой email клиент или:

```bash
# Через Gmail, Yahoo, etc
# Или через командную строку:

curl -X POST https://api.mailgun.net/v3/YOUR_DOMAIN/messages \
  -u "api:YOUR_API_KEY" \
  -F from="Test <test@yourdomain.com>" \
  -F to="generated@mail.yourdomain.com" \
  -F subject="Test Email" \
  -F text="Testing TempMail service"
```

### 6.3 Проверка получения

1. На странице TempMail обновите письма
2. Должно появиться тестовое письмо
3. Кликните для просмотра

## 📊 Шаг 7: Мониторинг

### 7.1 Railway Dashboard

- **Deployments**: История деплоев
- **Metrics**: CPU, RAM, Network
- **Logs**: Просмотр в реальном времени

### 7.2 MongoDB Atlas

- **Metrics**: Database операции
- **Performance Advisor**: Рекомендации
- **Alerts**: Настройка уведомлений

### 7.3 Health Check

```bash
curl https://yourapp.up.railway.app/health

# Ответ:
{"status":"ok","timestamp":"2024-01-01T12:00:00.000Z"}
```

## 🔧 Решение проблем

### Ошибка: "Application failed to respond"

```bash
# Проверьте логи
railway logs

# Проверьте переменные
railway variables

# Перезапустите
railway restart
```

### Ошибка: "Cannot connect to MongoDB"

1. Проверьте connection string
2. Проверьте пароль (нет спецсимволов без кодирования)
3. Проверьте Network Access в Atlas (0.0.0.0/0)
4. Проверьте Database User в Atlas

### Письма не приходят

1. Проверьте MX записи:
   ```bash
   nslookup -type=MX mail.yourdomain.com
   ```

2. Проверьте webhook URL доступен:
   ```bash
   curl https://yourapp.up.railway.app/api/webhook/sendgrid
   ```

3. Проверьте логи SendGrid

4. Проверьте `ALLOWED_DOMAINS` содержит правильный домен

## 🎉 Готово!

Ваш TempMail сервис работает на Railway! 🚀

### Следующие шаги:

- ✅ Добавьте rate limiting
- ✅ Настройте мониторинг
- ✅ Добавьте analytics
- ✅ Кастомизируйте дизайн
- ✅ Поделитесь с друзьями!

## 📞 Поддержка

- Railway Docs: https://docs.railway.app
- MongoDB Docs: https://docs.mongodb.com
- SendGrid Docs: https://docs.sendgrid.com

---

**Успешного деплоя! 🚀**

