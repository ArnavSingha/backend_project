const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password strength validation
const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  return errors;
};

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate required fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields: fullName, email, and password' });
  }

  // Email format validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  // Password strength validation
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ message: passwordErrors.join('. ') });
  }

  try {
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.status === 'active',
        createdAt: user.createdAt,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Email format validation
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Update last login timestamp
      user.lastLogin = new Date();
      await user.save();

      res.json({
        _id: user._id,
        name: user.fullName,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.status === 'active',
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current logged in user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.status === 'active',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout - invalidate token (client-side handles token removal)
exports.logout = async (req, res) => {
  // Since JWT is stateless, logout is handled client-side by removing the token
  // This endpoint can be used to perform any server-side cleanup if needed
  res.json({ message: 'Logged out successfully' });
};
