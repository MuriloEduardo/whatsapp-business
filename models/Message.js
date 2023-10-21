const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema();

const MessageModel = mongoose.model('messages', messageSchema);

module.exports = MessageModel;
