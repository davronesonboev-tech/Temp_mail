# 📚 Примеры использования TempMail API

Полное руководство по работе с API TempMail сервиса.

## 🔗 Base URL

```
https://yourapp.up.railway.app/api
```

## 📧 Примеры запросов

### 1. Получить доступные домены

**Запрос:**
```bash
curl https://yourapp.up.railway.app/api/domains
```

**Ответ:**
```json
{
  "success": true,
  "domains": [
    "tempmail.local",
    "mail.local"
  ]
}
```

---

### 2. Сгенерировать случайный email

**Запрос:**
```bash
curl -X POST https://yourapp.up.railway.app/api/generate \
  -H "Content-Type: application/json"
```

**Ответ:**
```json
{
  "success": true,
  "email": "a8x9k2m5n1@tempmail.local"
}
```

---

### 3. Создать кастомный email

**Запрос:**
```bash
curl -X POST https://yourapp.up.railway.app/api/generate \
  -H "Content-Type: application/json" \
  -d '{"custom": "myname"}'
```

**Ответ:**
```json
{
  "success": true,
  "email": "myname@tempmail.local"
}
```

---

### 4. Получить все письма для адреса

**Запрос:**
```bash
curl https://yourapp.up.railway.app/api/emails/a8x9k2m5n1@tempmail.local
```

**Ответ:**
```json
{
  "success": true,
  "count": 2,
  "emails": [
    {
      "emailId": "xY8kL2mN5pQ3rT7v",
      "to": "a8x9k2m5n1@tempmail.local",
      "from": "sender@example.com",
      "subject": "Welcome!",
      "text": "Welcome to our service...",
      "receivedAt": "2024-01-15T12:30:00.000Z",
      "read": false
    },
    {
      "emailId": "aB9cD3eF6gH1iJ4k",
      "to": "a8x9k2m5n1@tempmail.local",
      "from": "news@company.com",
      "subject": "Newsletter",
      "text": "Latest news...",
      "receivedAt": "2024-01-15T11:20:00.000Z",
      "read": true
    }
  ]
}
```

---

### 5. Получить конкретное письмо

**Запрос:**
```bash
curl https://yourapp.up.railway.app/api/email/xY8kL2mN5pQ3rT7v
```

**Ответ:**
```json
{
  "success": true,
  "email": {
    "emailId": "xY8kL2mN5pQ3rT7v",
    "to": "a8x9k2m5n1@tempmail.local",
    "from": "sender@example.com",
    "subject": "Welcome!",
    "text": "Welcome to our service. We're glad to have you here!",
    "html": "<html><body><h1>Welcome!</h1><p>Welcome to our service...</p></body></html>",
    "receivedAt": "2024-01-15T12:30:00.000Z",
    "read": true,
    "attachments": [
      {
        "filename": "document.pdf",
        "contentType": "application/pdf",
        "size": 1024
      }
    ]
  }
}
```

---

### 6. Удалить письмо

**Запрос:**
```bash
curl -X DELETE https://yourapp.up.railway.app/api/email/xY8kL2mN5pQ3rT7v
```

**Ответ:**
```json
{
  "success": true,
  "message": "Email deleted"
}
```

---

### 7. Удалить все письма адреса

**Запрос:**
```bash
curl -X DELETE https://yourapp.up.railway.app/api/emails/a8x9k2m5n1@tempmail.local
```

**Ответ:**
```json
{
  "success": true,
  "message": "Deleted 5 emails",
  "deletedCount": 5
}
```

---

### 8. Получить статистику

**Запрос:**
```bash
curl https://yourapp.up.railway.app/api/stats
```

**Ответ:**
```json
{
  "success": true,
  "stats": {
    "totalEmails": 1523,
    "totalAddresses": 342,
    "unreadEmails": 89,
    "domains": ["tempmail.local", "mail.local"]
  }
}
```

---

### 9. Health Check

**Запрос:**
```bash
curl https://yourapp.up.railway.app/health
```

**Ответ:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T12:30:00.000Z"
}
```

---

## 🎯 Примеры интеграции

### JavaScript (Fetch API)

```javascript
// Генерация email
async function generateEmail() {
  const response = await fetch('https://yourapp.up.railway.app/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await response.json();
  return data.email;
}

// Получение писем
async function getEmails(email) {
  const response = await fetch(`https://yourapp.up.railway.app/api/emails/${encodeURIComponent(email)}`);
  const data = await response.json();
  return data.emails;
}

// Использование
const email = await generateEmail();
console.log('Generated:', email);

const emails = await getEmails(email);
console.log('Emails:', emails);
```

---

### Python (requests)

```python
import requests

BASE_URL = 'https://yourapp.up.railway.app/api'

# Генерация email
def generate_email():
    response = requests.post(f'{BASE_URL}/generate')
    return response.json()['email']

# Получение писем
def get_emails(email):
    response = requests.get(f'{BASE_URL}/emails/{email}')
    return response.json()['emails']

# Использование
email = generate_email()
print(f'Generated: {email}')

emails = get_emails(email)
for msg in emails:
    print(f"From: {msg['from']}")
    print(f"Subject: {msg['subject']}")
    print(f"Text: {msg['text'][:100]}...")
    print('---')
```

---

### Node.js (axios)

```javascript
const axios = require('axios');

const BASE_URL = 'https://yourapp.up.railway.app/api';

// Генерация email
async function generateEmail(custom = null) {
  const response = await axios.post(`${BASE_URL}/generate`, 
    custom ? { custom } : {}
  );
  return response.data.email;
}

// Получение писем
async function getEmails(email) {
  const response = await axios.get(`${BASE_URL}/emails/${encodeURIComponent(email)}`);
  return response.data.emails;
}

// Удаление письма
async function deleteEmail(emailId) {
  const response = await axios.delete(`${BASE_URL}/email/${emailId}`);
  return response.data;
}

// Использование
(async () => {
  const email = await generateEmail('testuser');
  console.log('Generated:', email);
  
  // Ждем письма
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const emails = await getEmails(email);
  console.log(`Received ${emails.length} emails`);
  
  if (emails.length > 0) {
    await deleteEmail(emails[0].emailId);
    console.log('Deleted first email');
  }
})();
```

---

### PHP (cURL)

```php
<?php

$baseUrl = 'https://yourapp.up.railway.app/api';

// Генерация email
function generateEmail($custom = null) {
    global $baseUrl;
    
    $ch = curl_init("$baseUrl/generate");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    if ($custom) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['custom' => $custom]));
    }
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true)['email'];
}

// Получение писем
function getEmails($email) {
    global $baseUrl;
    
    $ch = curl_init("$baseUrl/emails/" . urlencode($email));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true)['emails'];
}

// Использование
$email = generateEmail();
echo "Generated: $email\n";

$emails = getEmails($email);
echo "Total emails: " . count($emails) . "\n";

foreach ($emails as $msg) {
    echo "From: {$msg['from']}\n";
    echo "Subject: {$msg['subject']}\n";
    echo "---\n";
}
?>
```

---

## 🔌 Webhook примеры

### Отправка тестового письма через webhook

```bash
curl -X POST https://yourapp.up.railway.app/api/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@tempmail.local",
    "from": "sender@example.com",
    "subject": "Test Email",
    "text": "This is a test email",
    "html": "<h1>Test Email</h1><p>This is a test email</p>"
  }'
```

---

## 🧪 Автоматизированное тестирование

### Jest/Node.js тест

```javascript
const axios = require('axios');

const BASE_URL = 'https://yourapp.up.railway.app/api';

describe('TempMail API', () => {
  let testEmail;
  
  test('Generate email', async () => {
    const response = await axios.post(`${BASE_URL}/generate`);
    expect(response.data.success).toBe(true);
    expect(response.data.email).toMatch(/@/);
    testEmail = response.data.email;
  });
  
  test('Get emails for address', async () => {
    const response = await axios.get(`${BASE_URL}/emails/${encodeURIComponent(testEmail)}`);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.emails)).toBe(true);
  });
  
  test('Get domains', async () => {
    const response = await axios.get(`${BASE_URL}/domains`);
    expect(response.data.success).toBe(true);
    expect(Array.isArray(response.data.domains)).toBe(true);
  });
});
```

---

## 🔐 Безопасность

### Rate Limiting

Рекомендуется добавить rate limiting на клиенте:

```javascript
class TempMailClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.lastRequest = 0;
    this.minInterval = 1000; // 1 second
  }
  
  async makeRequest(endpoint, options = {}) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequest = Date.now();
    const response = await fetch(`${this.baseUrl}${endpoint}`, options);
    return response.json();
  }
  
  async generateEmail() {
    return this.makeRequest('/generate', { method: 'POST' });
  }
  
  async getEmails(email) {
    return this.makeRequest(`/emails/${encodeURIComponent(email)}`);
  }
}

// Использование
const client = new TempMailClient('https://yourapp.up.railway.app/api');
const { email } = await client.generateEmail();
const { emails } = await client.getEmails(email);
```

---

## 📊 Мониторинг

### Проверка доступности

```bash
#!/bin/bash

URL="https://yourapp.up.railway.app/health"

while true; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)
  
  if [ $STATUS -eq 200 ]; then
    echo "$(date): Service is UP"
  else
    echo "$(date): Service is DOWN (HTTP $STATUS)"
    # Отправить уведомление
  fi
  
  sleep 60
done
```

---

## 💡 Best Practices

1. **Всегда обрабатывайте ошибки:**
```javascript
try {
  const emails = await getEmails(email);
} catch (error) {
  console.error('Failed to fetch emails:', error);
  // Fallback логика
}
```

2. **Используйте polling с умом:**
```javascript
// Плохо: постоянный polling каждую секунду
setInterval(() => getEmails(email), 1000);

// Хорошо: разумный интервал с exponential backoff
let interval = 5000;
const maxInterval = 60000;

async function pollEmails() {
  const emails = await getEmails(email);
  
  if (emails.length > 0) {
    interval = 5000; // Сбросить интервал
  } else {
    interval = Math.min(interval * 1.5, maxInterval);
  }
  
  setTimeout(pollEmails, interval);
}
```

3. **Валидируйте email адреса:**
```javascript
function isValidTempEmail(email, allowedDomains) {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
}
```

---

## 🎓 Дополнительные ресурсы

- [Railway Docs](https://docs.railway.app)
- [MongoDB Docs](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

**Happy Coding! 🚀**

