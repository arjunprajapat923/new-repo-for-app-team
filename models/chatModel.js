const mongoose = require('mongoose');

// Chat schema
const chatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    encrypted: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
});

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
