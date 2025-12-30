const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

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

const resetAdminPassword = async () => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const result = await User.updateOne(
      { email: 'admin@admin.com' },
      { $set: { password: hashedPassword, status: 'active' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Admin password reset successfully!');
    } else {
      console.log('✅ Admin account ready!');
    }
    
    console.log('=============================');
    console.log('Email:    admin@admin.com');
    console.log('Password: Admin@123');
    console.log('=============================');
    console.log('Login at: http://localhost:5174/login');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();
