const OpenAI = require("openai");
const User = require("../models/User.js");
const { validationResult } = require('express-validator');

// Initialize OpenAI with error handling
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (error) {
  console.error("Failed to initialize OpenAI:", error);
  process.exit(1); // Exit if OpenAI initialization fails
}

// Constants
const MAX_MESSAGE_LENGTH = 1000;
const MAX_TOKENS = 500;
const TEMPERATURE = 0.7;
const MODEL = "gpt-3.5-turbo";
const MAX_CHAT_HISTORY = 50; // Maximum number of chats per user

// Helper function to validate user
const validateUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

// Helper function to validate message
const validateMessage = (message) => {
  if (!message || typeof message !== 'string') {
    throw new Error("Invalid message format");
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }
  return message.trim();
};

// Helper function to get AI response
const getAIResponse = async (message, context = []) => {
  try {
    const messages = [
      ...context,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    // Handle specific OpenAI API errors
    if (error.status === 429) {
      if (error.code === 'insufficient_quota') {
        throw new Error("OpenAI API quota exceeded. Please check your billing status or upgrade your plan.");
      } else {
        throw new Error("Too many requests. Please try again in a few moments.");
      }
    } else if (error.status === 401) {
      throw new Error("OpenAI API key is invalid or expired. Please check your API configuration.");
    } else if (error.status === 400) {
      throw new Error("Invalid request to OpenAI API. Please check your message format.");
    } else if (error.status === 503) {
      throw new Error("OpenAI API is currently unavailable. Please try again later.");
    }
    
    throw new Error("Failed to get AI response. Please try again later.");
  }
};

// Get chat history with pagination
exports.getChatHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await validateUser(req.userId);
    
    const totalChats = user.chatHistory.length;
    const chats = user.chatHistory
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(skip, skip + limit);

    res.json({
      chats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalChats / limit),
        totalChats,
        hasMore: skip + limit < totalChats
      }
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message || "Error fetching chat history" });
  }
};

// Send message and get AI response
exports.sendMessage = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message, chatId } = req.body;
    const validatedMessage = validateMessage(message);
    const user = await validateUser(req.userId);

    // Get chat context if chatId exists
    let chatContext = [];
    if (chatId) {
      const chat = user.chatHistory.id(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      // Get last 5 messages for context
      chatContext = chat.messages.slice(-5).map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
    }

    try {
      // Get AI response
      const aiResponse = await getAIResponse(validatedMessage, chatContext);

      // Update or create chat history
      if (chatId) {
        const chat = user.chatHistory.id(chatId);
        chat.messages.push(
          { text: validatedMessage, from: "user", timestamp: new Date() },
          { text: aiResponse, from: "bot", timestamp: new Date() }
        );
        chat.updatedAt = new Date();
      } else {
        // Check if user has reached maximum chat limit
        if (user.chatHistory.length >= MAX_CHAT_HISTORY) {
          // Remove oldest chat
          user.chatHistory.sort((a, b) => a.updatedAt - b.updatedAt);
          user.chatHistory.shift();
        }

        user.chatHistory.push({
          title: validatedMessage.substring(0, 30) + (validatedMessage.length > 30 ? "..." : ""),
          messages: [
            { text: validatedMessage, from: "user", timestamp: new Date() },
            { text: aiResponse, from: "bot", timestamp: new Date() }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      await user.save();

      res.json({
        reply: aiResponse,
        chatId: chatId || user.chatHistory[user.chatHistory.length - 1]._id,
        timestamp: new Date()
      });
    } catch (aiError) {
      // Handle AI-specific errors
      console.error("AI Error:", aiError);
      
      // Still save the user's message
      if (chatId) {
        const chat = user.chatHistory.id(chatId);
        chat.messages.push(
          { text: validatedMessage, from: "user", timestamp: new Date() },
          { text: "Sorry, I'm having trouble connecting to the AI service. Please try again later.", from: "bot", timestamp: new Date() }
        );
        chat.updatedAt = new Date();
      } else {
        user.chatHistory.push({
          title: validatedMessage.substring(0, 30) + (validatedMessage.length > 30 ? "..." : ""),
          messages: [
            { text: validatedMessage, from: "user", timestamp: new Date() },
            { text: "Sorry, I'm having trouble connecting to the AI service. Please try again later.", from: "bot", timestamp: new Date() }
          ],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      await user.save();
      
      res.status(503).json({ 
        message: aiError.message,
        error: "AI_SERVICE_ERROR",
        chatId: chatId || user.chatHistory[user.chatHistory.length - 1]._id
      });
    }
  } catch (error) {
    console.error("Error processing message:", error);
    res.status(error.message === "User not found" ? 404 : 500)
      .json({ 
        message: error.message || "Error processing message",
        error: "PROCESSING_ERROR"
      });
  }
};

// Delete specific chat
exports.deleteChat = async (req, res) => {
  try {
    const user = await validateUser(req.userId);
    const chat = user.chatHistory.id(req.params.chatId);
    
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chat.remove();
    await user.save();
    
    res.json({ 
      message: "Chat deleted successfully",
      deletedChatId: req.params.chatId
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message || "Error deleting chat" });
  }
};

// Clear all chat history
exports.clearHistory = async (req, res) => {
  try {
    const user = await validateUser(req.userId);
    const deletedCount = user.chatHistory.length;
    
    user.chatHistory = [];
    await user.save();
    
    res.json({ 
      message: "Chat history cleared successfully",
      deletedCount
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(error.message === "User not found" ? 404 : 500)
      .json({ message: error.message || "Error clearing chat history" });
  }
};
