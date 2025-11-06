require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const smtpServer = require('./smtp/smtpServer');
const emailRoutes = require('./routes/emailRoutes');
const webhookRoutes = require('./routes/webhooks');
const { cleanupOldEmails } = require('./utils/cleanup');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || '*'
}));
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tempmail', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB подключен');
  // Запускаем очистку старых писем каждый час
  setInterval(cleanupOldEmails, 60 * 60 * 1000);
  cleanupOldEmails(); // Запускаем сразу при старте
})
.catch(err => {
  console.error('❌ Ошибка подключения к MongoDB:', err);
  process.exit(1);
});

// API Routes
app.use('/api', emailRoutes);
app.use('/api/webhook', webhookRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check для Railway
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Запуск HTTP сервера
app.listen(PORT, () => {
  console.log(`🚀 HTTP сервер запущен на порту ${PORT}`);
  console.log(`📧 Доступные домены: ${process.env.ALLOWED_DOMAINS || 'tempmail.local'}`);
});

// Запуск SMTP сервера
try {
  smtpServer.listen(process.env.SMTP_PORT || 25, process.env.SMTP_HOST || '0.0.0.0', () => {
    console.log(`📬 SMTP сервер запущен на порту ${process.env.SMTP_PORT || 25}`);
  });
} catch (error) {
  console.warn('⚠️  SMTP сервер не запущен:', error.message);
  console.log('💡 На Railway SMTP порт может быть недоступен. Используйте webhook integration или внешний SMTP.');
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM получен, закрываем сервер...');
  smtpServer.close();
  mongoose.connection.close();
  process.exit(0);
});

