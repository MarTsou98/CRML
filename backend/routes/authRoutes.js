// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // adjust path if needed
// POST /api/login
router.post('/login', async (req, res) => {
  console.log('Login request received with body:', req.body);

  const { username } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    console.log('Invalid username:', username);
    return res.status(401).json({ error: 'Invalid username' });
  }

  console.log('User found:', user);
  res.json({ message: 'Login successful', user });
});

router.get('/test', (req, res) => {
  console.log('Test route hit!');
  res.json({ message: 'Test route is working' });
});

module.exports = router;