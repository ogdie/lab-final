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
    const {
      name,
      bio,
      profilePicture,
      institution,
      userType
    } = req.body || {};

    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof bio === 'string') update.bio = bio;
    if (typeof profilePicture === 'string') update.profilePicture = profilePicture;
    if (typeof institution === 'string') update.institution = institution.trim();
    if (typeof userType === 'string') update.userType = userType;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
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
      .populate('relatedPost', '_id topic')
      .populate('relatedComment', '_id')
      .populate('relatedTopic', '_id')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/Unfollow user (toggle)
router.post('/:id/follow', async (req, res) => {
  try {
    const { followerId } = req.body || {};
    const targetUserId = req.params.id;
    if (!followerId || !targetUserId) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    if (followerId === targetUserId) {
      return res.status(400).json({ error: 'Não é possível seguir a si mesmo' });
    }

    const target = await User.findById(targetUserId);
    const follower = await User.findById(followerId);
    if (!target || !follower) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const alreadyFollowing = follower.following.some(id => id.toString() === targetUserId);

    if (alreadyFollowing) {
      await User.findByIdAndUpdate(followerId, { $pull: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $pull: { followers: followerId } });
    } else {
      await User.findByIdAndUpdate(followerId, { $addToSet: { following: targetUserId } });
      await User.findByIdAndUpdate(targetUserId, { $addToSet: { followers: followerId } });
      // Notificação opcional
      await Notification.create({ user: targetUserId, from: followerId, type: 'new_follower' });
    }

    const updatedTarget = await User.findById(targetUserId).select('-password');
    const updatedFollower = await User.findById(followerId).select('-password');
    res.json({ target: updatedTarget, follower: updatedFollower, following: !alreadyFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update achievement - DEVE VIR ANTES da rota POST (rotas mais específicas primeiro)
router.put('/:id/achievements/:achievementId', async (req, res) => {
  try {
    const { title, type, description, date, technologies, image } = req.body;
    
    if (!title || !type || !date) {
      return res.status(400).json({ error: 'Título, tipo e data são obrigatórios' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const achievementIndex = user.achievements.findIndex(
      a => a._id.toString() === req.params.achievementId
    );

    if (achievementIndex === -1) {
      return res.status(404).json({ error: 'Conquista não encontrada' });
    }

    user.achievements[achievementIndex] = {
      ...user.achievements[achievementIndex].toObject(),
      title: title.trim(),
      type,
      description: description || '',
      date: new Date(date),
      technologies: Array.isArray(technologies) ? technologies : (technologies || []),
      image: image || ''
    };

    await user.save();
    const updatedUser = await User.findById(req.params.id).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete achievement - DEVE VIR ANTES da rota POST (rotas mais específicas primeiro)
router.delete('/:id/achievements/:achievementId', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.achievements = user.achievements.filter(
      a => a._id.toString() !== req.params.achievementId
    );

    await user.save();
    const updatedUser = await User.findById(req.params.id).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add achievement to user - Rotas mais genéricas por último
router.post('/:id/achievements', async (req, res) => {
  try {
    const { title, type, description, date, technologies, image } = req.body;
    
    if (!title || !type || !date) {
      return res.status(400).json({ error: 'Título, tipo e data são obrigatórios' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const newAchievement = {
      title: title.trim(),
      type,
      description: description || '',
      date: new Date(date),
      technologies: Array.isArray(technologies) ? technologies : (technologies || []),
      image: image || ''
    };

    // Usa findByIdAndUpdate com $push para evitar validação de campos obrigatórios do schema
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $push: { achievements: newAchievement } },
      { new: true, runValidators: false }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

