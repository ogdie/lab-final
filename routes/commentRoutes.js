import express from "express";
import Comment from "../models/comment.js";

const router = express.Router();

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find().populate('author', 'name profilePicture');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comment by ID
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('author', 'name profilePicture');
    if (!comment) return res.status(404).json({ error: 'Comentário não encontrado' });
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update comment
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

// Delete comment
router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentário deletado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

