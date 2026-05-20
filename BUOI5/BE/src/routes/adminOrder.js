const express = require('express');
const {
  getAllOrders,
  getOrderById,
  updateStatus,
  getOrderStats
} = require('../controllers/adminOrderController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', isAuthenticated, isAdmin, getAllOrders);
router.get('/stats', isAuthenticated, isAdmin, getOrderStats);
router.get('/:orderId', isAuthenticated, isAdmin, getOrderById);
router.patch('/:orderId/status', isAuthenticated, isAdmin, updateStatus);

module.exports = router;
