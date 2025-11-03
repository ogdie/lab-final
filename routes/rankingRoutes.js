import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find()
      .select('name email profilePicture xp userType')
      .sort({ xp: -1 })
      .limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;