const mongoose = require('mongoose');

const tempAddressSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  emailCount: {
    type: Number,
    default: 0
  }
});

// TTL индекс ОТКЛЮЧЕН - адреса не удаляются автоматически
// tempAddressSchema.index(
//   { lastAccessedAt: 1 }, 
//   { expireAfterSeconds: 48 * 3600 }
// );

module.exports = mongoose.model('TempAddress', tempAddressSchema);

