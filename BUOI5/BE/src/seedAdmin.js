require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@minhtamduong.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email: admin@minhtamduong.com');
      console.log('Password: admin123');
      await mongoose.disconnect();
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

    const admin = new User({
      username: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin account created successfully!');
    console.log('=================================');
    console.log('Email: admin@minhtamduong.com');
    console.log('Password: admin123');
    console.log('=================================');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
