require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = (req, res, next) => {
    const white_lists = ['/', '/login', '/register'];
    if (white_lists.find(item => '//v1/api' + item === req.originalUrl)) {
        return next();
    }
    else {
        if (req?.headers?.authorization?.split(' ')[1]) {
            const token = req.headers.authorization.split(' ')[1];
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = {
                    id: decoded.userId,
                    email: decoded.email,
                    name: decoded.name,
                    role: decoded.role,
                    createBy: 'hoituine'
                }
                console.log("Decoded token:", decoded);
                next();
            }
            catch (error) {
                return res.status(401).json({
                    message: "Invalid token"
                });
            }
        }
        else {
            return res.status(401).json({
                message: "No token provided"
            });
        }
    }
}

const isAuthenticated = async (req, res, next) => {
    try {
        const white_lists = ['/login', '/register'];
        if (white_lists.some(item => req.originalUrl.endsWith(item))) {
            return next();
        }

        if (!req?.headers?.authorization?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = {
            id: user._id,
            email: user.email,
            name: user.username,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { authMiddleware, isAuthenticated, isAdmin };