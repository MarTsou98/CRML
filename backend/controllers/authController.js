const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Authentication success
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        
salesperson_id: user.salesperson_id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login };
