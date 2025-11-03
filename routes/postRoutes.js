import express from "express";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { processMentions } from "../lib/mentionUtils.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ topic: null })
      .populate('author', 'name profilePicture')
      .populate({ 
        path: 'comments', 
        populate: [
          { path: 'author', select: 'name profilePicture' },
          { path: 'parentComment', select: '_id' }
        ]
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { author, content, image, topic, tags } = req.body;
    const post = await Post.create({ author, content, image, topic, tags });
    
    if (content) {
      await processMentions(content, author, post._id, null);
    }
    
    const populatedPost = await Post.findById(post._id)
      .populate('author', 'name profilePicture');
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePicture')
      .populate({ 
        path: 'comments', 
        populate: [
          { path: 'author', select: 'name profilePicture' },
          { path: 'parentComment', select: '_id' }
        ]
      });
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    
    if (post.topic) {
      await User.findByIdAndUpdate(post.author, { $inc: { xp: -15 } });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deletado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
      if (post.author.toString() !== userId) {
        await Notification.create({
          user: post.author,
          from: userId,
          type: 'like',
          relatedPost: post._id,
          relatedTopic: post.topic || null
        });
      }
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

router.post('/:id/comments', async (req, res) => {
  try {
    const { author, content, parentComment } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });
    
    const commentData = { author, content, post: req.params.id };
    if (parentComment) {
      commentData.parentComment = parentComment;
    }
    
    const comment = await Comment.create(commentData);
    post.comments.push(comment._id);
    await post.save();
    
    if (post.topic) {
      await User.findByIdAndUpdate(author, { $inc: { xp: 3 } });
    }
    
    if (content) {
      await processMentions(content, author, post._id, comment._id);
    }
    
    if (parentComment) {
      const parent = await Comment.findById(parentComment);
      if (parent && parent.author.toString() !== author) {
        await Notification.create({
          user: parent.author,
          from: author,
          type: 'comment',
          relatedPost: post._id,
          relatedComment: comment._id,
          relatedTopic: post.topic || null
        });
      }
    } else {
      if (post.author.toString() !== author) {
        await Notification.create({
          user: post.author,
          from: author,
          type: 'comment',
          relatedPost: post._id,
          relatedComment: comment._id,
          relatedTopic: post.topic || null
        });
      }
    }
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name profilePicture')
      .populate('parentComment', '_id');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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