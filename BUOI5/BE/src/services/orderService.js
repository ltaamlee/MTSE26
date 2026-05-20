const { Order, ORDER_STATUS } = require('../models/Order');
const Product = require('../models/Product');

const AUTO_CONFIRM_MINUTES = 30;

const autoConfirmOrders = async () => {
  try {
    const cutoffTime = new Date(Date.now() - AUTO_CONFIRM_MINUTES * 60 * 1000);

    const pendingOrders = await Order.find({
      status: ORDER_STATUS.PENDING,
      createdAt: { $lte: cutoffTime },
      isAutoConfirmed: false
    });

    console.log(`[AutoConfirm] Found ${pendingOrders.length} orders to auto-confirm`);

    for (const order of pendingOrders) {
      order.status = ORDER_STATUS.CONFIRMED;
      order.isAutoConfirmed = true;
      order.confirmedAt = new Date();
      order.statusHistory.push({
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(),
        note: 'Tự động xác nhận sau 30 phút',
        updatedBy: null
      });

      await order.save();

      console.log(`[AutoConfirm] Order ${order.orderNumber} auto-confirmed`);
    }

    return pendingOrders.length;
  } catch (error) {
    console.error('[AutoConfirm] Error:', error);
    return 0;
  }
};

const updateOrderStatus = async (orderId, newStatus, note = '', adminId = null) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const validTransitions = {
      [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.PREPARING]: [ORDER_STATUS.DELIVERING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.DELIVERING]: [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.CANCEL_REQUEST]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
      [ORDER_STATUS.DELIVERED]: [],
      [ORDER_STATUS.CANCELLED]: []
    };

    if (!validTransitions[order.status]?.includes(newStatus)) {
      throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
    }

    order.status = newStatus;
    order.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note,
      updatedBy: adminId
    });

    if (newStatus === ORDER_STATUS.CONFIRMED && !order.confirmedAt) {
      order.confirmedAt = new Date();
    }

    if (newStatus === ORDER_STATUS.DELIVERED) {
      order.deliveredAt = new Date();
    }

    if (newStatus === ORDER_STATUS.CANCELLED) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity }
        });
      }
    }

    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

let autoConfirmInterval = null;

const startAutoConfirmService = () => {
  autoConfirmInterval = setInterval(async () => {
    await autoConfirmOrders();
  }, 60 * 1000);

  console.log('[OrderService] Auto-confirm service started (every 60 seconds)');
};

const stopAutoConfirmService = () => {
  if (autoConfirmInterval) {
    clearInterval(autoConfirmInterval);
    autoConfirmInterval = null;
    console.log('[OrderService] Auto-confirm service stopped');
  }
};

module.exports = {
  autoConfirmOrders,
  updateOrderStatus,
  startAutoConfirmService,
  stopAutoConfirmService
};
