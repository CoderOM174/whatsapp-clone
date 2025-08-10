const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: String,
  message_id: String,
  meta_msg_id: String,
  wa_id: String,
  text: String,
  timestamp: Date,
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  }
}, { collection: 'processed_messages' });

module.exports = mongoose.model('Message', messageSchema);
