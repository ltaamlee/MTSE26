require('dotenv').config();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { name } = require('ejs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        let result = await User.create({
            username: name,
            email: email,
            password: hashedPassword,
            role: 'user'
        });
        return result;
    }
    catch (error) {
        console.log(error);
        return null;
    }}

const loginService = async (email1, password) => { 
    try{
        const user = await User.findOne({email: email1});
        if (user) {
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Wrong password"
                }
            }
            else{
                const payload = {
                    email: user.email,
                    name: user.username,
                }

                const access_token = jwt.sign(
                    payload, 
                    process.env.JWT_SECRET, 
                    {expiresIn: process.env.JWT_EXPIRE});
                
                return {
                    EC: 0,
                    EM: "Login successful",
                    access_token,
                    user: {
                        email: user.email,
                        name: user.username,
                    }
                }
            }
        }
        else{
            return {
                EC: 1,
                EM: "Email/Password is invalid"
            }
        }
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try{
        let result = await User.find({}).select('-password -__v');
        return result;
    }
    catch(error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    createUserService,
    loginService,
    getUserService
}