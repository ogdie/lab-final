import express from "express";
import Notification from "../models/notification.js";

const router = express.Router();

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { user: userId } : {};
    
    const notifications = await Notification.find(query)
      .populate('user', 'name')
      .populate('from', 'name profilePicture')
      .populate('relatedPost', '_id topic')
      .populate('relatedComment', '_id')
      .populate('relatedTopic', '_id')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
router.delete('/:id', async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notificação deletada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

