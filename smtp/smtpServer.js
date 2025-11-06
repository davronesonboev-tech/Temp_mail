const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const { saveEmail } = require('../utils/emailHandler');

const smtpServer = new SMTPServer({
  // Аутентификация не требуется
  authOptional: true,
  disabledCommands: ['AUTH'],
  
  // Принимаем все соединения
  onConnect(session, callback) {
    console.log(`📨 Новое SMTP соединение: ${session.remoteAddress}`);
    return callback();
  },

  // Проверяем получателя
  onRcptTo(address, session, callback) {
    const recipient = address.address.toLowerCase();
    const domain = recipient.split('@')[1];
    
    const allowedDomains = (process.env.ALLOWED_DOMAINS || 'tempmail.local')
      .split(',')
      .map(d => d.trim());
    
    if (!allowedDomains.includes(domain)) {
      console.log(`❌ Отклонен получатель: ${recipient} (домен не разрешен)`);
      return callback(new Error(`Domain ${domain} not allowed`));
    }
    
    console.log(`✅ Принят получатель: ${recipient}`);
    return callback();
  },

  // Обрабатываем входящее письмо
  onData(stream, session, callback) {
    let emailData = '';
    
    stream.on('data', (chunk) => {
      emailData += chunk;
    });

    stream.on('end', async () => {
      try {
        // Парсим email
        const parsed = await simpleParser(emailData);
        
        // Сохраняем письмо для каждого получателя
        for (const recipient of session.envelope.rcptTo) {
          await saveEmail({
            to: recipient.address.toLowerCase(),
            from: session.envelope.mailFrom.address,
            subject: parsed.subject || '(No Subject)',
            text: parsed.text || '',
            html: parsed.html || '',
            headers: parsed.headers,
            attachments: parsed.attachments || []
          });
          
          console.log(`💾 Письмо сохранено для ${recipient.address}`);
        }
        
        callback();
      } catch (error) {
        console.error('❌ Ошибка обработки письма:', error);
        callback(error);
      }
    });
  },

  // Обработка ошибок
  onError(error) {
    console.error('❌ SMTP Server Error:', error);
  }
});

module.exports = smtpServer;

