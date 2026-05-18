require('dotenv').config();
const jwt = require('jsonwebtoken');

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
                    email: decoded.email,
                    name: decoded.name,
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