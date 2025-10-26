import express from "express";
import Message from "../models/message.js";
import User from "../models/user.js";

const router = express.Router();

// Get conversations for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    // Group conversations
    const conversations = {};
    messages.forEach(msg => {
      const otherId = msg.sender._id.toString() === userId ? msg.receiver._id : msg.sender._id;
      if (!conversations[otherId]) {
        conversations[otherId] = {
          user: msg.sender._id.toString() === userId ? msg.receiver : msg.sender,
          lastMessage: msg,
          unread: 0
        };
      }
      if (!msg.read && msg.receiver._id.toString() === userId) {
        conversations[otherId].unread++;
      }
    });
    
    res.json(Object.values(conversations));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages between two users
router.get('/:userId/messages', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.query;
    
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/:userId/messages', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sender, content } = req.body;
    
    const message = await Message.create({
      sender,
      receiver: userId,
      content
    });
    
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete conversation
router.delete('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.query;
    
    await Message.deleteMany({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    });
    
    res.json({ message: 'Conversa deletada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

