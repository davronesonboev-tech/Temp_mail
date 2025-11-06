const express = require('express');
const router = express.Router();
const {
  getEmailsByAddress,
  getEmailById,
  deleteEmailById,
  deleteEmailsByAddress
} = require('../utils/emailHandler');
const {
  getAvailableDomains,
  generateRandomEmail,
  validateEmail,
  generateCustomEmail
} = require('../utils/domainGenerator');
const TempAddress = require('../models/TempAddress');

// Получить доступные домены
router.get('/domains', (req, res) => {
  try {
    const domains = getAvailableDomains();
    res.json({ success: true, domains });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Сгенерировать случайный email адрес
router.post('/generate', async (req, res) => {
  try {
    const { custom } = req.body;
    
    let email;
    if (custom) {
      email = generateCustomEmail(custom);
    } else {
      email = generateRandomEmail();
    }

    // Сохраняем адрес в БД
    const [username, domain] = email.split('@');
    await TempAddress.findOneAndUpdate(
      { address: email },
      { 
        address: email,
        username,
        domain,
        lastAccessedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, email });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить все письма для адреса
router.get('/emails/:address', async (req, res) => {
  try {
    const address = decodeURIComponent(req.params.address).toLowerCase();
    
    if (!validateEmail(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address or domain not allowed' 
      });
    }

    const emails = await getEmailsByAddress(address);
    res.json({ success: true, emails, count: emails.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Получить конкретное письмо по ID
router.get('/email/:emailId', async (req, res) => {
  try {
    const email = await getEmailById(req.params.emailId);
    
    if (!email) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found' 
      });
    }

    res.json({ success: true, email });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удалить письмо по ID
router.delete('/email/:emailId', async (req, res) => {
  try {
    const deleted = await deleteEmailById(req.params.emailId);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false, 
        error: 'Email not found' 
      });
    }

    res.json({ success: true, message: 'Email deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Удалить все письма для адреса
router.delete('/emails/:address', async (req, res) => {
  try {
    const address = decodeURIComponent(req.params.address).toLowerCase();
    
    if (!validateEmail(address)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address or domain not allowed' 
      });
    }

    const deletedCount = await deleteEmailsByAddress(address);
    res.json({ 
      success: true, 
      message: `Deleted ${deletedCount} emails`,
      deletedCount 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Статистика
router.get('/stats', async (req, res) => {
  try {
    const Email = require('../models/Email');
    
    const totalEmails = await Email.countDocuments();
    const totalAddresses = await TempAddress.countDocuments();
    const unreadEmails = await Email.countDocuments({ read: false });

    res.json({
      success: true,
      stats: {
        totalEmails,
        totalAddresses,
        unreadEmails,
        domains: getAvailableDomains()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

