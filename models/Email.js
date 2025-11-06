const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  to: {
    type: String,
    required: true,
    index: true
  },
  from: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    default: '(No Subject)'
  },
  text: {
    type: String,
    default: ''
  },
  html: {
    type: String,
    default: ''
  },
  headers: {
    type: Map,
    of: String
  },
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    content: Buffer
  }],
  receivedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  read: {
    type: Boolean,
    default: false
  }
});

// TTL индекс для автоматического удаления старых писем
emailSchema.index(
  { receivedAt: 1 }, 
  { 
    expireAfterSeconds: (process.env.EMAIL_RETENTION_HOURS || 24) * 3600 
  }
);

module.exports = mongoose.model('Email', emailSchema);

