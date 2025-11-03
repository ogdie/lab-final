import express from "express";
import Comment from "../models/comment.js";
import Notification from "../models/notification.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('author', 'name profilePicture');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    const { userId } = req.body;
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
    
    const isLiked = comment.likes.includes(userId);
    
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
      if (comment.author.toString() !== userId) {
        const Post = (await import('../models/post.js')).default;
        const post = await Post.findById(comment.post);
        
        await Notification.create({
          user: comment.author,
          from: userId,
          type: 'like',
          relatedPost: comment.post,
          relatedComment: comment._id,
          relatedTopic: post?.topic || null
        });
      }
    }
    
    await comment.save();
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture');
    
    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('author', 'name profilePicture');
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('author', 'name profilePicture');
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentário deletado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;