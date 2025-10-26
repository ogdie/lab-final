import express from "express";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";

const router = express.Router();

// Send connection request
router.post('/:id/request', async (req, res) => {
  try {
    const { from } = req.body;
    const { id: to } = req.params;
    
    // Check if request already exists
    const existing = await ConnectionRequest.findOne({ from, to });
    if (existing) {
      return res.status(400).json({ error: 'Solicitação já enviada' });
    }
    
    const request = await ConnectionRequest.create({ from, to });
    
    // Create notification
    await Notification.create({
      user: to,
      from,
      type: 'connection_request'
    });
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept connection
router.put('/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const request = await ConnectionRequest.findById(id);
    
    if (!request) return res.status(404).json({ error: 'Solicitação não encontrada' });
    
    request.status = 'accepted';
    await request.save();
    
    // Add to connections for both users
    await User.findByIdAndUpdate(request.from, { $addToSet: { connections: request.to } });
    await User.findByIdAndUpdate(request.to, { $addToSet: { connections: request.from } });
    
    // Notify requester
    await Notification.create({
      user: request.from,
      from: request.to,
      type: 'connection_accepted'
    });
    
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Decline connection
router.put('/:id/decline', async (req, res) => {
  try {
    const request = await ConnectionRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'declined' },
      { new: true }
    );
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get received requests
router.get('/requests', async (req, res) => {
  try {
    const { userId } = req.query;
    const requests = await ConnectionRequest.find({ to: userId, status: 'pending' })
      .populate('from', 'name email profilePicture xp')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sent requests
router.get('/sent', async (req, res) => {
  try {
    const { userId } = req.query;
    const requests = await ConnectionRequest.find({ from: userId, status: 'pending' })
      .populate('to', 'name email profilePicture xp')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove connection
router.delete('/:id', async (req, res) => {
  try {
    const { currentUserId } = req.query;
    const connection = await ConnectionRequest.findById(req.params.id);
    
    if (!connection) return res.status(404).json({ error: 'Conexão não encontrada' });
    
    // Remove from both users' connections
    await User.findByIdAndUpdate(connection.from, { $pull: { connections: connection.to } });
    await User.findByIdAndUpdate(connection.to, { $pull: { connections: connection.from } });
    
    await ConnectionRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Conexão removida' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

