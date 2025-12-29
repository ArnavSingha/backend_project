const User = require('../models/User');

exports.getUsers = async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  try {
    const count = await User.countDocuments({});
    const users = await User.find({})
      .select('-password')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    // Transform users to include isActive field
    const transformedUsers = users.map(user => ({
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.status === 'active',
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.json({ 
      users: transformedUsers, 
      page, 
      totalPages: Math.ceil(count / pageSize),
      total: count 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.status = req.body.status;
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.fullName,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.status === 'active',
        status: updatedUser.status,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate user
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin status' });
    }

    user.status = 'active';
    await user.save();

    res.json({
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: true,
      status: 'active',
      message: 'User activated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate user
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin status' });
    }

    user.status = 'inactive';
    await user.save();

    res.json({
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: false,
      status: 'inactive',
      message: 'User deactivated successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
