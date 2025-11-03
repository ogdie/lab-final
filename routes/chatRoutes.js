import express from "express";
import Message from "../models/message.js";
import User from "../models/user.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: -1 });
    
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

router.put('/:userId/read', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentUserId } = req.query;

    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({ message: 'Mensagens marcadas como lidas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { currentUserId } = req.query;
    const msg = await Message.findById(messageId);
    if (!msg) return res.status(404).json({ error: 'Mensagem não encontrada' });
    if (msg.sender.toString() !== currentUserId && msg.receiver.toString() !== currentUserId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }
    await Message.findByIdAndDelete(messageId);
    res.json({ message: 'Mensagem deletada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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