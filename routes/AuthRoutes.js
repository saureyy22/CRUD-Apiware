const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const router = express.Router();
const JWT_SECRET = 'your_secret_key'; // Replace with env variable in production

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.userId = user._id; // 🔐 Save session
  res.json({ message: 'Logged in successfully (session)' });
});


module.exports = router;
