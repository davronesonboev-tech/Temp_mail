# 🤝 Contributing to TempMail

Спасибо за интерес к улучшению TempMail! Вот как ты можешь помочь.

## 🌟 Как внести вклад

### 1. Форкни репозиторий

```bash
# Форкни через GitHub UI, затем:
git clone https://github.com/твой-username/temp-mail-service.git
cd temp-mail-service
```

### 2. Создай ветку

```bash
git checkout -b feature/amazing-feature
# или
git checkout -b fix/bug-fix
```

### 3. Внеси изменения

```bash
# Твой код здесь
npm run dev  # Тестируй локально
```

### 4. Коммит

```bash
git add .
git commit -m "feat: добавил amazing feature"
```

Используй conventional commits:
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - обслуживание

### 5. Пуш

```bash
git push origin feature/amazing-feature
```

### 6. Pull Request

Создай PR через GitHub с описанием изменений.

## 📋 Что можно улучшить

### 🎨 Frontend
- [ ] Dark/Light theme toggle
- [ ] Поиск по письмам
- [ ] Фильтры писем
- [ ] Pagination
- [ ] Push notifications
- [ ] Локализация (i18n)

### 🔧 Backend
- [ ] Rate limiting
- [ ] Redis кэширование
- [ ] Websocket для real-time обновлений
- [ ] Аналитика и метрики
- [ ] Улучшенная обработка вложений
- [ ] Поддержка нескольких SMTP провайдеров

### 📱 Mobile
- [ ] PWA support
- [ ] Mobile app (React Native)
- [ ] Улучшенная мобильная версия

### 🔒 Безопасность
- [ ] Rate limiting для API
- [ ] CAPTCHA для генерации адресов
- [ ] Защита от спама
- [ ] IP blacklisting

### 📊 Мониторинг
- [ ] Prometheus metrics
- [ ] Grafana dashboards
- [ ] Sentry integration
- [ ] Health checks

### 🧪 Тестирование
- [ ] Unit тесты
- [ ] Integration тесты
- [ ] E2E тесты
- [ ] API тесты

## 💻 Development Setup

```bash
# 1. Установи зависимости
npm install

# 2. MongoDB через Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# 3. Создай .env
cp .env.example .env

# 4. Запусти dev сервер
npm run dev

# 5. Запусти тесты (когда добавишь)
npm test
```

## 🎯 Code Style

- Используй ES6+
- Async/await вместо callbacks
- Meaningful variable names
- Комментарии для сложной логики
- Prettier для форматирования

**Пример хорошего кода:**

```javascript
// ✅ Хорошо
async function getEmailsByAddress(address) {
  try {
    const emails = await Email.find({ to: address })
      .sort({ receivedAt: -1 })
      .lean();
    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

// ❌ Плохо
function getEmails(a) {
  Email.find({ to: a }, (err, e) => {
    if (err) console.log(err);
    return e;
  });
}
```

## 🐛 Bug Reports

Нашел баг? Создай issue с:

1. **Описание**: Что не работает?
2. **Шаги воспроизведения**: Как повторить?
3. **Ожидаемое поведение**: Что должно быть?
4. **Актуальное поведение**: Что происходит?
5. **Environment**: OS, Node version, Browser
6. **Screenshots**: Если возможно

**Пример:**

```markdown
## Bug: Письма не отображаются

**Описание:** После генерации email письма не появляются в списке.

**Шаги:**
1. Открыть сайт
2. Сгенерировать email
3. Отправить письмо на адрес
4. Письмо не появляется

**Ожидается:** Письмо должно появиться в списке.

**Environment:**
- OS: Windows 11
- Browser: Chrome 120
- Node: 18.17.0

**Логи:**
```
Error: Cannot connect to MongoDB
```
```

## 🌟 Feature Requests

Хочешь новую функцию? Создай issue с:

1. **Описание**: Что хочешь добавить?
2. **Use case**: Зачем это нужно?
3. **Альтернативы**: Есть ли другие решения?
4. **Mockups**: Если UI feature

## 📝 Documentation

Документация важна! Помоги улучшить:

- README.md - общее описание
- RAILWAY_SETUP.md - инструкция деплоя
- EXAMPLES.md - примеры API
- Code comments - комментарии в коде

## ✅ Pull Request Checklist

Перед созданием PR убедись:

- [ ] Код работает локально
- [ ] Нет console.log (только если нужен)
- [ ] Обновлена документация (если нужно)
- [ ] Добавлены тесты (если возможно)
- [ ] Commit messages осмысленные
- [ ] Нет конфликтов с main
- [ ] PR описание понятное

## 🚀 Release Process

1. Изменения накапливаются в main
2. При достижении milestone создается release
3. Version bump в package.json
4. CHANGELOG обновляется
5. Git tag создается
6. Railway автодеплой

## 💬 Community

- **Discussions**: Вопросы и идеи
- **Issues**: Баги и feature requests
- **Pull Requests**: Код контрибьюшены

## 📜 License

Внося вклад, ты соглашаешься с MIT License.

## 🙏 Thanks

Спасибо за желание улучшить TempMail! Каждый вклад ценен.

### Contributors

<!-- Здесь будет список контрибьютеров -->

---

**Happy Coding! 🚀**

Вопросы? Создай discussion или пиши в issues.

