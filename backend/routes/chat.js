const express = require("express");
const auth = require("../middleware/auth.js");
const {
  getChatHistory,
  sendMessage,
  deleteChat,
  clearHistory,
} = require("../controllers/chatController.js");

const router = express.Router();

// Get chat history
router.get("/history", auth, getChatHistory);

// Send message and get AI response
router.post("/message", auth, sendMessage);

// Delete specific chat
router.delete("/chat/:chatId", auth, deleteChat);

// Clear all chat history
router.delete("/history", auth, clearHistory);

module.exports = router;
