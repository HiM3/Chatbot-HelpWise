import express from 'express';
import auth from '../middleware/auth.js';
import { getChatHistory, sendMessage, deleteChat, clearHistory } from '../controllers/chatController.js';

const router = express.Router();

// Get chat history
router.get('/history', auth, getChatHistory);

// Send message and get AI response
router.post('/message', auth, sendMessage);

// Delete specific chat
router.delete('/chat/:chatId', auth, deleteChat);

// Clear all chat history
router.delete('/history', auth, clearHistory);

export default router;