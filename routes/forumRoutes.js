import express from "express";
import Topic from "../models/topic.js";
import Post from "../models/post.js";
import User from "../models/user.js";

const router = express.Router();

// Get all topics
router.get('/topics', async (req, res) => {
  try {
    const topics = await Topic.find().populate('posts');
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create topic
router.post('/topics', async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const topic = await Topic.create({ name, description, category });
    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get topic by ID
router.get('/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate({
      path: 'posts',
      populate: [
        { path: 'author', select: 'name profilePicture xp' },
        { path: 'comments', populate: { path: 'author', select: 'name profilePicture' } }
      ]
    });
    if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply to topic
router.post('/topics/:id/reply', async (req, res) => {
  try {
    const { author, content } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Tópico não encontrado' });
    
    const post = await Post.create({ author, content, topic: topic._id });
    topic.posts.push(post._id);
    await topic.save();
    
    // Add XP for forum participation
    await User.findByIdAndUpdate(author, { $inc: { xp: 15 } });
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name profilePicture xp');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

