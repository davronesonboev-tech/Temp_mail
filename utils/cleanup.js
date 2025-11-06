const Email = require('../models/Email');

async function cleanupOldEmails() {
  try {
    const retentionHours = parseInt(process.env.EMAIL_RETENTION_HOURS) || 24;
    const cutoffDate = new Date(Date.now() - retentionHours * 60 * 60 * 1000);
    
    const result = await Email.deleteMany({
      receivedAt: { $lt: cutoffDate }
    });

    if (result.deletedCount > 0) {
      console.log(`🗑️  Удалено старых писем: ${result.deletedCount}`);
    }
  } catch (error) {
    console.error('Error cleaning up old emails:', error);
  }
}

module.exports = { cleanupOldEmails };

