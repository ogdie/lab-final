import express from "express";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profilePicture')
      .populate({ path: 'comments', populate: { path: 'author', select: 'name profilePicture' } })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create post
router.post('/', async (req, res) => {
  try {
    const { author, content, image, topic, tags } = req.body;
    const post = await Post.create({ author, content, image, topic, tags });
    
    // Gamificação: não conceder XP para posts do feed.
    // Posts de fórum recebem XP via rotas de fórum.
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name profilePicture');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture')
      .populate({ path: 'comments', populate: { path: 'author', select: 'name profilePicture' } });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('author', 'name profilePicture');
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    
    // Gamificação: somente ajustar XP se for post do fórum
    if (post.topic) {
      // Remover XP relacionado ao post do fórum
      await User.findByIdAndUpdate(post.author, { $inc: { xp: -15 } });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deletado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike post
router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    
    const isLiked = post.likes.includes(userId);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      // Notify author
      if (post.author.toString() !== userId) {
        await Notification.create({
          user: post.author,
          from: userId,
          type: 'like',
          relatedPost: post._id
        });
      }
      // Gamificação: somente curtidas em posts do fórum geram XP
      if (post.topic) {
        await User.findByIdAndUpdate(post.author, { $inc: { xp: 1 } });
      }
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    
    const comment = await Comment.create({ author, content, post: req.params.id });
    post.comments.push(comment._id);
    await post.save();
    
    // Gamificação: somente comentários em posts do fórum geram XP
    if (post.topic) {
      await User.findByIdAndUpdate(author, { $inc: { xp: 3 } });
    }
    
    // Notify post author
    if (post.author.toString() !== author) {
      await Notification.create({
        user: post.author,
        from: author,
        type: 'comment',
        relatedPost: post._id,
        relatedComment: comment._id
      });
    }
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments
router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

