// createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/feedbackDB')
  .then(()=>console.log('Connected'))
  .catch(err=>console.log(err));

async function create() {
  try {
    const existing = await User.findOne({ email: 'admin@example.com' });
    if (existing) {
      console.log('Admin already exists');
      return process.exit(0);
    }
    const hashed = bcrypt.hashSync('admin123', 10);
    const u = new User({ name: 'Admin', email: 'admin@example.com', password: hashed, role: 'admin' });
    await u.save();
    console.log('✅ Admin created (admin@example.com / admin123)');
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}
create();
