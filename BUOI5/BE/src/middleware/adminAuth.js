const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware: Chỉ cho phép user đã đăng nhập
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Vui lòng đăng nhập' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Người dùng không tồn tại' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token không hợp lệ' 
        });
    }
};

// Middleware: Chỉ cho phép admin
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Vui lòng đăng nhập' 
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Người dùng không tồn tại' 
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Bạn không có quyền truy cập trang này' 
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token không hợp lệ' 
        });
    }
};

module.exports = { isAuthenticated, isAdmin };
