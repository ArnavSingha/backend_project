// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please provide a valid email address';
  return null;
};

// Validate password strength
const validatePassword = (password) => {
  const errors = [];
  if (!password) {
    return ['Password is required'];
  }
  if (password.length < 6) {
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

// Validate full name
const validateFullName = (fullName) => {
  if (!fullName) return 'Full name is required';
  if (fullName.length < 2) return 'Full name must be at least 2 characters';
  if (fullName.length > 100) return 'Full name must be less than 100 characters';
  return null;
};

// Sanitize input - trim whitespace and remove potential XSS
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/<[^>]*>/g, '');
};

// Middleware to sanitize request body
const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

// Validate MongoDB ObjectId
const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Middleware to validate ObjectId param
const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!isValidObjectId(id)) {
      return res.status(400).json({ 
        success: false,
        message: `Invalid ${paramName} format` 
      });
    }
    next();
  };
};

module.exports = {
  validateEmail,
  validatePassword,
  validateFullName,
  sanitizeInput,
  sanitizeBody,
  isValidObjectId,
  validateObjectId,
  emailRegex
};
