const { Order, ORDER_STATUS } = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod = 'COD', note = '' } = req.body;

    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ thông tin giao hàng' 
      });
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Giỏ hàng trống' });
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({ 
          success: false, 
          message: `Sản phẩm "${item.name}" không còn tồn tại` 
        });
      }
      
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Sản phẩm "${item.name}" chỉ còn ${item.product.stock} sản phẩm` 
        });
      }
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
      image: item.image
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
      note,
      status: ORDER_STATUS.PENDING
    });

    await order.save();

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity, sold: item.quantity }
      });
    }

    await Cart.findOneAndDelete({ user: userId });

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'username email')
      .populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'username email')
      .populate('items.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      statusText: order.getStatusText(),
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      itemCount: order.items.length,
      items: order.items.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      })),
      createdAt: order.createdAt,
      estimatedDelivery: order.estimatedDelivery
    }));

    res.json({
      success: true,
      data: {
        orders: formattedOrders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error getting my orders:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('user', 'username email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    res.json({
      success: true,
      data: {
        _id: order._id,
        orderNumber: order.orderNumber,
        items: order.items.map(item => ({
          _id: item._id,
          product: item.product ? {
            _id: item.product._id,
            name: item.product.name,
            slug: item.product.slug,
            images: item.product.images
          } : { name: item.name },
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        })),
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        status: order.status,
        statusText: order.getStatusText(),
        statusHistory: order.statusHistory,
        note: order.note,
        cancelReason: order.cancelReason,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        confirmedAt: order.confirmedAt,
        deliveredAt: order.deliveredAt,
        estimatedDelivery: order.estimatedDelivery
      }
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { reason = '' } = req.body;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    }

    if (order.status === ORDER_STATUS.DELIVERING || 
        order.status === ORDER_STATUS.DELIVERED ||
        order.status === ORDER_STATUS.CANCELLED) {
      return res.status(400).json({ 
        success: false, 
        message: 'Không thể hủy đơn hàng ở trạng thái này' 
      });
    }

    if (order.status === ORDER_STATUS.PREPARING) {
      order.status = ORDER_STATUS.CANCEL_REQUEST;
      order.cancelReason = reason || 'Yêu cầu hủy đơn từ khách hàng';
      order.statusHistory.push({
        status: ORDER_STATUS.CANCEL_REQUEST,
        timestamp: new Date(),
        note: 'Khách hàng gửi yêu cầu hủy đơn (Shop đang chuẩn bị hàng)',
        updatedBy: userId
      });
      
      await order.save();

      return res.json({
        success: true,
        message: 'Yêu cầu hủy đơn đã được gửi đến Shop',
        data: {
          status: order.status,
          statusText: order.getStatusText()
        }
      });
    }

    if (order.canCancel()) {
      order.status = ORDER_STATUS.CANCELLED;
      order.cancelReason = reason || 'Khách hàng hủy đơn';
      order.statusHistory.push({
        status: ORDER_STATUS.CANCELLED,
        timestamp: new Date(),
        note: 'Khách hàng hủy đơn thành công',
        updatedBy: userId
      });

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity }
        });
      }

      await order.save();

      return res.json({
        success: true,
        message: 'Hủy đơn hàng thành công',
        data: {
          status: order.status,
          statusText: order.getStatusText()
        }
      });
    }

    return res.status(400).json({ 
      success: false, 
      message: 'Đã quá thời hạn hủy đơn (30 phút). Đơn hàng đã được xác nhận.'
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = await Order.countDocuments({ user: userId });
    const totalSpent = await Order.aggregate([
      { 
        $match: { 
          user: userId,
          paymentStatus: 'paid',
          status: { $ne: ORDER_STATUS.CANCELLED }
        } 
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const statusCounts = {};
    stats.forEach(stat => {
      statusCounts[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        totalOrders,
        totalSpent: totalSpent[0]?.total || 0,
        statusCounts
      }
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderStats
};
