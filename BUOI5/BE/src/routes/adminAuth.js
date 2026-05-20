const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

const createAdmin = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản admin thành công',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo tài khoản admin'
    });
  }
};

const seedAdmin = async (req, res) => {
  try {
    const adminEmail = 'admin@minhtamduong.com';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Tài khoản admin đã tồn tại',
        data: {
          email: adminEmail,
          password: 'admin123 (giữ nguyên)'
        }
      });
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

    res.status(201).json({
      success: true,
      message: 'Tạo tài khoản admin mẫu thành công',
      data: {
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Error seeding admin:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi tạo tài khoản admin'
    });
  }
};

router.post('/create-admin', createAdmin);
router.post('/seed-admin', seedAdmin);

module.exports = router;
