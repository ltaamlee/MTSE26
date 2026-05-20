const {
    createUserService,
    loginService,
    getUserService
} = require('../services/userService');

const createUser = async (req, res) => {
    const {name, email, password} = req.body;
    const result = await createUserService(name, email, password);
    
    if (result.EC === 1) {
        return res.status(400).json({
            success: false,
            message: result.EM
        });
    }
    
    if (result.EC === -1) {
        return res.status(500).json({
            success: false,
            message: result.EM
        });
    }
    
    return res.status(201).json({
        success: true,
        message: result.EM,
        data: result.user
    });
}

const handleLogin = async (req, res) => {
    const {email, password} = req.body;
    const result = await loginService(email, password);
    
    if (result.EC !== 0) {
        return res.status(401).json({
            success: false,
            message: result.EM
        });
    }
    
    return res.status(200).json({
        success: true,
        message: result.EM,
        token: result.access_token,
        user: result.user
    });
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json({
        success: true,
        data
    });
}

const getAccount = async (req, res) => {
    return res.status(200).json(req.user);
}

module.exports = {
    createUser,
    handleLogin,
    getUser,
    getAccount
}