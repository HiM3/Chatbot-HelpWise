import OpenAI from 'openai';
import User from '../models/User.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get chat history
export const getChatHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ message: 'Error fetching chat history' });
  }
};

// Send message and get AI response
export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Update or create chat history
    if (chatId) {
      const chat = user.chatHistory.id(chatId);
      if (chat) {
        chat.messages.push(
          { text: message, from: 'user' },
          { text: aiResponse, from: 'bot' }
        );
      } else {
        return res.status(404).json({ message: 'Chat not found' });
      }
    } else {
      user.chatHistory.push({
        title: message.substring(0, 30) + '...',
        messages: [
          { text: message, from: 'user' },
          { text: aiResponse, from: 'bot' }
        ]
      });
    }

    await user.save();

    res.json({
      reply: aiResponse,
      chatId: chatId || user.chatHistory[user.chatHistory.length - 1]._id
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ message: 'Error processing message' });
  }
};

// Delete specific chat
export const deleteChat = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const chat = user.chatHistory.id(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.remove();
    await user.save();
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
};

// Clear all chat history
export const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.chatHistory = [];
    await user.save();
    res.json({ message: 'Chat history cleared successfully' });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({ message: 'Error clearing chat history' });
  }
};