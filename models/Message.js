const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    object: String,
    entry: [Object],
});

const MessageModel = mongoose.model('messages', messageSchema);

module.exports = MessageModel;
