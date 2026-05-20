const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  DELIVERING: 'delivering',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  CANCEL_REQUEST: 'cancel_request'
};

const orderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
}, { _id: true });

const orderStatusHistorySchema = new Schema({
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { _id: false });

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    ward: { type: String, default: '' },
    district: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'VNPAY', 'MOMO', 'WALLET'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },
  statusHistory: [orderStatusHistorySchema],
  note: {
    type: String,
    default: ''
  },
  cancelReason: {
    type: String,
    default: ''
  },
  estimatedDelivery: {
    type: Date,
    default: null
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  confirmedAt: {
    type: Date,
    default: null
  },
  isAutoConfirmed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ confirmedAt: 1, status: 1 });

orderSchema.pre('save', async function() {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: 'Đơn hàng mới được tạo'
    });

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    this.estimatedDelivery = deliveryDate;
  }
});

orderSchema.methods.canCancel = function() {
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  const minutesSinceCreation = (now - createdAt) / (1000 * 60);
  
  return minutesSinceCreation <= 30 && 
         this.status === ORDER_STATUS.PENDING;
};

orderSchema.methods.canRequestCancel = function() {
  return this.status === ORDER_STATUS.PENDING || 
         this.status === ORDER_STATUS.CONFIRMED ||
         this.status === ORDER_STATUS.PREPARING;
};

orderSchema.methods.getStatusText = function() {
  const statusMap = {
    [ORDER_STATUS.PENDING]: 'Đơn hàng mới',
    [ORDER_STATUS.CONFIRMED]: 'Đã xác nhận',
    [ORDER_STATUS.PREPARING]: 'Shop đang chuẩn bị hàng',
    [ORDER_STATUS.DELIVERING]: 'Đang giao hàng',
    [ORDER_STATUS.DELIVERED]: 'Đã giao thành công',
    [ORDER_STATUS.CANCELLED]: 'Đã hủy đơn hàng',
    [ORDER_STATUS.CANCEL_REQUEST]: 'Yêu cầu hủy đơn'
  };
  return statusMap[this.status] || this.status;
};

orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = { Order, ORDER_STATUS };
