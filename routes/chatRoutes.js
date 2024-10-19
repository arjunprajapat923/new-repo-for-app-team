const express = require('express');
const { matchUsers, getChatHistory } = require('../controllers/chatController');

const router = express.Router();

// Define the route for user matching
router.post('/match', matchUsers);

// Define the route to get chat history
router.get('/history/:roomId', getChatHistory);

module.exports = router;
