import express from "express";
import User from "../models/user.js";
import Post from "../models/post.js";
import Notification from "../models/notification.js";

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.json([]);
    }
    
    const users = await User.find({
      name: { $regex: name, $options: 'i' }
    }).select('-password').limit(10);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update settings
router.put('/:id/settings', async (req, res) => {
  try {
    const { language, theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { language, theme },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit profile
router.put('/:id/edit', async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, bio, profilePicture },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get followers
router.get('/:id/followers', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name email profilePicture xp');
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get following
router.get('/:id/following', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name email profilePicture xp');
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get connections
router.get('/:id/connections', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('connections', 'name email profilePicture xp');
    res.json(user.connections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user posts
router.get('/:id/posts', async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .populate('author', 'name profilePicture')
      .populate('comments')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications
router.get('/:id/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.id })
      .populate('from', 'name profilePicture')
      .populate('relatedPost')
      .populate('relatedComment')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

