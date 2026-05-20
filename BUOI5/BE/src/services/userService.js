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
            return {
                EC: 1,
                EM: "Email already exists"
            };
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        let result = await User.create({
            username: name,
            email: email,
            password: hashedPassword,
            role: 'user'
        });
        return {
            EC: 0,
            EM: "User created successfully",
            user: {
                _id: result._id,
                username: result.username,
                email: result.email
            }
        };
    }
    catch (error) {
        console.log(error);
        return {
            EC: -1,
            EM: "Error creating user"
        };
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
                    userId: user._id,
                    email: user.email,
                    name: user.username,
                    role: user.role
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
                        _id: user._id,
                        email: user.email,
                        name: user.username,
                        role: user.role
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