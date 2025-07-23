const logger = require('../utils/logger'); // ✅ Import the logger
const User = require('../models/User');    // Make sure you have this

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    logger.info(`Login attempt for username: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      logger.warn(`Login failed: User '${username}' not found`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for user '${username}'`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    logger.info(`User '${username}' logged in successfully`);

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
    logger.error(`Login error for user '${req.body.username}': ${error.message}`);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login };
