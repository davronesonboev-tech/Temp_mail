const { nanoid, customAlphabet } = require('nanoid');

// Генератор адресов без спецсимволов
const generateUsername = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

function getAvailableDomains() {
  const domains = (process.env.ALLOWED_DOMAINS || 'tempmail.local')
    .split(',')
    .map(d => d.trim());
  return domains;
}

function generateRandomEmail() {
  const domains = getAvailableDomains();
  const username = generateUsername();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}@${domain}`;
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return false;
  }

  const domain = email.split('@')[1];
  const allowedDomains = getAvailableDomains();
  
  return allowedDomains.includes(domain);
}

function generateCustomEmail(username) {
  const domains = getAvailableDomains();
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  // Очищаем username от недопустимых символов
  const cleanUsername = username
    .toLowerCase()
    .replace(/[^a-z0-9._+-]/g, '');
  
  if (cleanUsername.length < 3) {
    throw new Error('Username too short after cleanup');
  }
  
  return `${cleanUsername}@${domain}`;
}

module.exports = {
  getAvailableDomains,
  generateRandomEmail,
  validateEmail,
  generateCustomEmail
};

