const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.post('/', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getMyOrders);
router.get('/stats', isAuthenticated, getOrderStats);
router.get('/:orderId', isAuthenticated, getOrderById);
router.post('/:orderId/cancel', isAuthenticated, cancelOrder);

module.exports = router;
