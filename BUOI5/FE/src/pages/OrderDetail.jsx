import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Đơn hàng mới', icon: '📦' },
  { key: 'confirmed', label: 'Đã xác nhận', icon: '✅' },
  { key: 'preparing', label: 'Shop chuẩn bị hàng', icon: '📋' },
  { key: 'delivering', label: 'Đang giao hàng', icon: '🚚' },
  { key: 'delivered', label: 'Đã giao thành công', icon: '🎉' }
];

const ORDER_STATUS_CONFIG = {
  pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Đơn hàng mới', icon: '📦' },
  confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Đã xác nhận', icon: '✅' },
  preparing: { color: 'bg-orange-100 text-orange-800', label: 'Shop chuẩn bị hàng', icon: '📋' },
  delivering: { color: 'bg-purple-100 text-purple-800', label: 'Đang giao hàng', icon: '🚚' },
  delivered: { color: 'bg-green-100 text-green-800', label: 'Đã giao thành công', icon: '🎉' },
  cancelled: { color: 'bg-red-100 text-red-800', label: 'Đã hủy', icon: '❌' },
  cancel_request: { color: 'bg-gray-100 text-gray-800', label: 'Yêu cầu hủy đơn', icon: '⏳' }
};

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrderDetail();
  }, [user, orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await orderAPI.getById(orderId);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        alert('Không tìm thấy đơn hàng');
        navigate('/my-orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancel = () => {
    if (!order) return false;
    if (order.status === 'cancelled' || order.status === 'delivered' || order.status === 'delivering') {
      return false;
    }
    if (order.status === 'preparing') {
      return 'request'; // Can request cancel
    }
    // Check if within 30 minutes
    const createdAt = new Date(order.createdAt);
    const now = new Date();
    const minutesSinceCreation = (now - createdAt) / (1000 * 60);
    return minutesSinceCreation <= 30;
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn');
      return;
    }

    setCancelling(true);
    try {
      const response = await orderAPI.cancel(orderId, cancelReason);
      if (response.data.success) {
        alert(response.data.message);
        setShowCancelModal(false);
        fetchOrderDetail();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Đã xảy ra lỗi');
    } finally {
      setCancelling(false);
    }
  };

  const getCurrentStep = () => {
    if (!order) return 0;
    const statusIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
    return statusIndex >= 0 ? statusIndex : 0;
  };

  const getStatusProgress = () => {
    if (!order) return 0;
    const stepIndex = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
    if (stepIndex === -1) {
      if (order.status === 'cancelled' || order.status === 'cancel_request') return 0;
      return 100;
    }
    return (stepIndex / (ORDER_STATUS_STEPS.length - 1)) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải chi tiết đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy đơn hàng</h2>
        <Link to="/my-orders" className="btn-primary inline-block mt-4">
          Quay lại đơn hàng
        </Link>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.pending;
  const cancelStatus = canCancel();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/my-orders" className="text-primary-600 hover:text-primary-700 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Đơn hàng #{order.orderNumber}
                </h1>
                <p className="text-gray-500">Đặt lúc: {formatDate(order.createdAt)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.icon} {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Order Status Timeline */}
          {order.status !== 'cancelled' && order.status !== 'cancel_request' && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Trạng thái đơn hàng</h2>
              
              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded">
                  <div 
                    className="h-full bg-primary-600 rounded transition-all duration-500"
                    style={{ width: `${getStatusProgress()}%` }}
                  ></div>
                </div>

                {/* Status Steps */}
                <div className="relative flex justify-between">
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= getCurrentStep();
                    const isCurrent = index === getCurrentStep();
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 transition-all ${
                          isCompleted 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}>
                          {step.icon}
                        </div>
                        <p className={`mt-2 text-xs font-medium text-center max-w-[80px] ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.estimatedDelivery && order.status !== 'delivered' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800">
                    <strong>Dự kiến giao hàng:</strong> {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cancel Request Status */}
          {order.status === 'cancel_request' && (
            <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⏳</span>
                Yêu cầu hủy đơn đang chờ xử lý
              </h2>
              <p className="text-gray-600">
                Shop đang xem xét yêu cầu hủy đơn của bạn. Vui lòng chờ phản hồi.
              </p>
              {order.cancelReason && (
                <p className="mt-2 text-gray-500">
                  <strong>Lý do hủy:</strong> {order.cancelReason}
                </p>
              )}
            </div>
          )}

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm đã đặt</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item._id} className="flex gap-4 py-4 border-b last:border-b-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>Giá: {formatPrice(item.price)}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancel Button */}
          {cancelStatus && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {cancelStatus === 'request' ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Shop đang chuẩn bị hàng. Bạn có thể gửi yêu cầu hủy đơn cho Shop.
                  </p>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Gửi yêu cầu hủy đơn
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Bạn có thể hủy đơn hàng này trong vòng 30 phút kể từ khi đặt hàng.
                  </p>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-80">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tổng cộng</h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Địa chỉ giao hàng</h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">{order.shippingAddress.fullName}</p>
              <p className="mt-1">{order.shippingAddress.phone}</p>
              <p className="mt-1">
                {[order.shippingAddress.address, order.shippingAddress.ward, order.shippingAddress.district, order.shippingAddress.city]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>
            <p className="text-gray-600">
              {order.paymentMethod === 'COD' ? '💵 Thanh toán khi nhận hàng (COD)' : order.paymentMethod}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Trạng thái: <span className="font-medium capitalize">{order.paymentStatus}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {cancelStatus === 'request' ? 'Gửi yêu cầu hủy đơn' : 'Hủy đơn hàng'}
            </h3>
            <p className="text-gray-600 mb-4">
              {cancelStatus === 'request' 
                ? 'Vui lòng nhập lý do bạn muốn hủy đơn hàng này.'
                : 'Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.'}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn (bắt buộc)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none mb-4"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Đang xử lý...' : 'Xác nhận hủy'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
