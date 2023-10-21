const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    headers: Object,
    body: {
        object: String,
        entry: [
            {
                id: String,
                changes: [
                    {
                        value: {
                            messaging_product: String,
                            metadata: {
                                display_phone_number: String,
                                phone_number_id: String,
                            },
                        },
                        field: String,
                    },
                ],
            },
        ],
    },
});

const MessageModel = mongoose.model('messages', messageSchema);

module.exports = MessageModel;
