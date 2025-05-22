// controllers/authController.js
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Auth successful (just by username)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login };
