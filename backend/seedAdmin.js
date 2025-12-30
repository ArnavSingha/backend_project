const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  status: { type: String, default: 'active' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@admin.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@admin.com');
      console.log('Use your existing password or update it in the database.');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    // Create admin user
    const admin = await User.create({
      fullName: 'Admin User',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('✅ Admin user created successfully!');
    console.log('=============================');
    console.log('Email:    admin@admin.com');
    console.log('Password: Admin@123');
    console.log('=============================');
    console.log('You can now login at http://localhost:5173/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
