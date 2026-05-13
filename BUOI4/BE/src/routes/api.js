const express = require('express');
const {
    createUser, handleLogin, getUser, getAccount
} = require('../controllers/userController');
const {
    getAllProducts,
    getProductById,
    getFeaturedProducts,
    getNewestProducts,
    getBestSellerProducts,
    getProductsByCategory,
    getRelatedProducts,
    searchProducts
} = require('../controllers/productController');
const {
    getAllCategories,
    getCategoryById,
    getCategoryBySlug
} = require('../controllers/categoryController');
const { seedData } = require('../controllers/seedController');

const auth = require('../middleware/auth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

routerAPI.get('/', (req, res) => {
    res.status(200).json({
        message: "Welcome to Thư Pháp Văn Phòng Tứ Bảo API"
    });
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

routerAPI.get('/products', getAllProducts);
routerAPI.get('/products/featured', getFeaturedProducts);
routerAPI.get('/products/newest', getNewestProducts);
routerAPI.get('/products/best-seller', getBestSellerProducts);
routerAPI.get('/products/search', searchProducts);
routerAPI.get('/products/:id', getProductById);
routerAPI.get('/products/:id/related/:categoryId', getRelatedProducts);
routerAPI.get('/products/category/:categoryId', getProductsByCategory);

routerAPI.get('/categories', getAllCategories);
routerAPI.get('/categories/:id', getCategoryById);
routerAPI.get('/categories/slug/:slug', getCategoryBySlug);

routerAPI.post('/seed', seedData);

module.exports = routerAPI;
