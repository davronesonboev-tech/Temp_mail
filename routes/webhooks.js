const express = require('express');
const router = express.Router();
const multer = require('multer');
const { simpleParser } = require('mailparser');
const { saveEmail } = require('../utils/emailHandler');

const upload = multer();

// SendGrid Inbound Parse Webhook
router.post('/sendgrid', upload.single('email'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No email data');
        }

        const parsed = await simpleParser(req.file.buffer);
        
        // SendGrid может отправить несколько получателей
        const recipients = Array.isArray(parsed.to) ? parsed.to : [parsed.to];
        
        for (const recipient of recipients) {
            const toAddress = typeof recipient === 'string' ? recipient : recipient.address;
            
            await saveEmail({
                to: toAddress.toLowerCase(),
                from: parsed.from?.address || parsed.from?.text || 'unknown@sender.com',
                subject: parsed.subject || '(No Subject)',
                text: parsed.text || '',
                html: parsed.html || '',
                headers: parsed.headers,
                attachments: parsed.attachments || []
            });
            
            console.log(`📧 Письмо получено через SendGrid для ${toAddress}`);
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('SendGrid webhook error:', error);
        res.status(500).send('Error processing email');
    }
});

// Mailgun Webhook
router.post('/mailgun', express.urlencoded({ extended: true }), async (req, res) => {
    try {
        const { recipient, sender, subject, 'body-plain': text, 'body-html': html } = req.body;
        
        if (!recipient) {
            return res.status(400).send('No recipient');
        }

        await saveEmail({
            to: recipient.toLowerCase(),
            from: sender || 'unknown@sender.com',
            subject: subject || '(No Subject)',
            text: text || '',
            html: html || '',
            headers: new Map(),
            attachments: []
        });
        
        console.log(`📧 Письмо получено через Mailgun для ${recipient}`);
        res.status(200).send('OK');
    } catch (error) {
        console.error('Mailgun webhook error:', error);
        res.status(500).send('Error processing email');
    }
});

// CloudMailin Webhook
router.post('/cloudmailin', express.json({ limit: '10mb' }), async (req, res) => {
    try {
        const { envelope, headers, plain, html, to } = req.body;
        
        const recipients = Array.isArray(to) ? to : [to];
        
        for (const recipient of recipients) {
            await saveEmail({
                to: recipient.toLowerCase(),
                from: envelope?.from || 'unknown@sender.com',
                subject: headers?.subject || '(No Subject)',
                text: plain || '',
                html: html || '',
                headers: headers ? new Map(Object.entries(headers)) : new Map(),
                attachments: []
            });
            
            console.log(`📧 Письмо получено через CloudMailin для ${recipient}`);
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('CloudMailin webhook error:', error);
        res.status(500).send('Error processing email');
    }
});

// Generic webhook для тестирования
router.post('/test', express.json(), async (req, res) => {
    try {
        const { to, from, subject, text, html } = req.body;
        
        if (!to) {
            return res.status(400).json({ error: 'Missing "to" field' });
        }

        await saveEmail({
            to: to.toLowerCase(),
            from: from || 'test@example.com',
            subject: subject || 'Test Email',
            text: text || 'Test email content',
            html: html || '<p>Test email content</p>',
            headers: new Map(),
            attachments: []
        });
        
        console.log(`📧 Тестовое письмо создано для ${to}`);
        res.json({ success: true, message: 'Test email created' });
    } catch (error) {
        console.error('Test webhook error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;

