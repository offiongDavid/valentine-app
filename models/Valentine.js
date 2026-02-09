const mongoose = require('mongoose');

const ValentineSchema = new mongoose.Schema({
  senderName: String,
  receiverName: String,
  uniqueId: String,
  response: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Valentine', ValentineSchema);

