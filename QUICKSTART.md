# ⚡ Quick Start Guide

Запусти свой TempMail за 10 минут! 🚀

## 🎯 Локальный запуск (2 минуты)

```bash
# 1. Установи зависимости
npm install

# 2. Запусти MongoDB через Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. Создай .env файл
cp .env.example .env

# 4. Запусти сервер
npm start

# 5. Открой браузер
# http://localhost:3000
```

Готово! 🎉

---

## ☁️ Деплой на Railway (10 минут)

### Шаг 1: MongoDB Atlas (3 мин)

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Try Free
2. Создай **M0 (Free)** кластер
3. Database Access → Add User → Сохрани пароль
4. Network Access → Allow 0.0.0.0/0
5. Connect → Connection String → Скопируй

```
mongodb+srv://user:password@cluster.mongodb.net/tempmail
```

### Шаг 2: Railway (2 мин)

1. [railway.app](https://railway.app) → Войди через GitHub
2. New Project → Deploy from GitHub
3. Выбери репозиторий
4. Deploy!

### Шаг 3: Переменные (3 мин)

Variables → Добавь:

```env
NODE_ENV=production
MONGODB_URI=твой_connection_string_из_шага_1
ALLOWED_DOMAINS=твой-домен.up.railway.app
EMAIL_RETENTION_HOURS=24
MAX_EMAILS_PER_ADDRESS=50
```

### Шаг 4: Домен (1 мин)

Settings → Domains → Generate Domain

Скопируй домен и обнови `ALLOWED_DOMAINS`

### Шаг 5: Тест (1 мин)

1. Открой свой домен
2. Нажми "Сгенерировать адрес"
3. Работает! 🎉

---

## 📧 Настройка получения email

### SendGrid (Рекомендуется, 5 минут)

1. [sendgrid.com](https://sendgrid.com) → Sign Up (бесплатно)
2. Settings → Inbound Parse
3. Add Host & URL:
   - Hostname: `mail.твойдомен.com`
   - URL: `https://твой-домен.railway.app/api/webhook/sendgrid`
4. Добавь MX записи в DNS
5. Готово!

**Отправь тест:**
```bash
# Через любой email клиент отправь письмо на:
test@mail.твойдомен.com
```

---

## 🧪 Быстрый тест API

```bash
# Генерация email
curl -X POST https://твой-домен.railway.app/api/generate

# Получение писем
curl https://твой-домен.railway.app/api/emails/test@domain.com

# Health check
curl https://твой-домен.railway.app/health
```

---

## 🎨 Кастомизация за 1 минуту

### Изменить цвета

`public/styles.css`:
```css
:root {
    --primary: #667eea;  /* ← Твой цвет */
    --secondary: #764ba2; /* ← Твой цвет */
}
```

### Изменить название

`public/index.html`:
```html
<title>Твой TempMail</title>
<h1>Твой TempMail</h1>
```

---

## 🚨 Проблемы?

### MongoDB не подключается
```bash
# Проверь connection string
railway logs | grep MongoDB
```

### Письма не приходят
```bash
# Проверь домены
railway variables | grep ALLOWED_DOMAINS
```

### Ошибка при деплое
```bash
# Смотри логи
railway logs --tail 100
```

---

## 📚 Полная документация

- **README.md** - Полное описание проекта
- **RAILWAY_SETUP.md** - Детальная инструкция по деплою
- **EXAMPLES.md** - Примеры использования API

---

## 🎓 Что дальше?

✅ Добавь rate limiting
✅ Настрой мониторинг  
✅ Кастомизируй UI
✅ Добавь аналитику
✅ Поделись с друзьями!

---

**Поздравляю! Твой TempMail работает! 🚀**

Need help? Check [Railway Docs](https://docs.railway.app) или создай issue.

