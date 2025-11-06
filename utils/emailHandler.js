const { nanoid } = require('nanoid');
const Email = require('../models/Email');
const TempAddress = require('../models/TempAddress');

async function saveEmail(emailData) {
  try {
    const maxEmails = parseInt(process.env.MAX_EMAILS_PER_ADDRESS) || 50;
    
    // Проверяем количество писем для адреса
    const emailCount = await Email.countDocuments({ to: emailData.to });
    
    // Если превышен лимит, удаляем самое старое письмо
    if (emailCount >= maxEmails) {
      const oldestEmail = await Email.findOne({ to: emailData.to })
        .sort({ receivedAt: 1 })
        .limit(1);
      
      if (oldestEmail) {
        await Email.deleteOne({ _id: oldestEmail._id });
      }
    }

    // Создаем новое письмо
    const email = new Email({
      emailId: nanoid(16),
      to: emailData.to,
      from: emailData.from,
      subject: emailData.subject,
      text: emailData.text,
      html: emailData.html,
      headers: emailData.headers,
      attachments: (emailData.attachments || []).map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
        content: att.content
      }))
    });

    await email.save();

    // Обновляем счетчик в TempAddress
    const [username, domain] = emailData.to.split('@');
    await TempAddress.findOneAndUpdate(
      { address: emailData.to },
      { 
        $inc: { emailCount: 1 },
        $set: { 
          lastAccessedAt: new Date(),
          username,
          domain
        }
      },
      { upsert: true, new: true }
    );

    return email;
  } catch (error) {
    console.error('Error saving email:', error);
    throw error;
  }
}

async function getEmailsByAddress(address) {
  try {
    // Обновляем время последнего доступа
    await TempAddress.findOneAndUpdate(
      { address },
      { $set: { lastAccessedAt: new Date() } },
      { upsert: false }
    );

    const emails = await Email.find({ to: address })
      .sort({ receivedAt: -1 })
      .select('-attachments.content') // Не загружаем содержимое вложений в списке
      .lean();

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

async function getEmailById(emailId) {
  try {
    const email = await Email.findOne({ emailId }).lean();
    
    if (email) {
      // Помечаем как прочитанное
      await Email.updateOne({ emailId }, { $set: { read: true } });
    }

    return email;
  } catch (error) {
    console.error('Error fetching email by ID:', error);
    throw error;
  }
}

async function deleteEmailById(emailId) {
  try {
    const result = await Email.deleteOne({ emailId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
}

async function deleteEmailsByAddress(address) {
  try {
    const result = await Email.deleteMany({ to: address });
    await TempAddress.updateOne(
      { address },
      { $set: { emailCount: 0 } }
    );
    return result.deletedCount;
  } catch (error) {
    console.error('Error deleting emails by address:', error);
    throw error;
  }
}

module.exports = {
  saveEmail,
  getEmailsByAddress,
  getEmailById,
  deleteEmailById,
  deleteEmailsByAddress
};

