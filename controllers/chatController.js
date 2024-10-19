const Chat = require('../models/chatModel');
const { addUserToRoom, getUserRoom } = require('../models/userRoomModel');
const crypto = require('crypto');

// Function to handle user matching
const matchUsers = (req, res) => {
    const { user1, user2 } = req.body;
    const roomId = `room-${user1}-${user2}`;
    addUserToRoom(user1, user2, roomId);

    res.status(200).json({ roomId, message: 'Users matched and room created' });
};

// Encrypt message before saving
const encryptMessage = (message) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Decrypt message before sending
const decryptMessage = (encryptedMessage) => {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// Function to handle user joining a room
const joinRoom = (socket, userId) => {
    const roomId = getUserRoom(userId);
    if (roomId) {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
        socket.emit('message', { sender: 'system', message: 'You have joined the chat.' });
    }
};

// Function to handle sending messages
const sendMessage = async (io, userId, message) => {
    const roomId = getUserRoom(userId);
    if (roomId) {
        const encryptedMessage = encryptMessage(message);
        const newChat = new Chat({ roomId, sender: userId, message: encryptedMessage });
        await newChat.save();

        io.to(roomId).emit('message', {
            sender: userId,
            message: message // Broadcast the original message for the UI
        });

        console.log(`Message from ${userId} to room ${roomId}: ${message}`);
    }
};

// Function to retrieve chat history
const getChatHistory = async (req, res) => {
    const { roomId } = req.params;
    try {
        const chats = await Chat.find({ roomId }).populate('sender', 'username');
        const decryptedChats = chats.map(chat => ({
            ...chat.toObject(),
            message: decryptMessage(chat.message)
        }));
        res.status(200).json(decryptedChats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chat history' });
    }
};

module.exports = {
    matchUsers,
    joinRoom,
    sendMessage,
    getChatHistory,
};
