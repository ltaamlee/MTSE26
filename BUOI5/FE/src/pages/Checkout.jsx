import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: ''
  });
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    setShippingAddress(prev => ({
      ...prev,
      fullName: user?.name || ''
    }));
  }, [user, cart.items.length, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!shippingAddress.fullName.trim()) {
      alert('Vui lòng nhập họ và tên');
      return false;
    }
    if (!shippingAddress.phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!shippingAddress.address.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await orderAPI.create({
        shippingAddress,
        paymentMethod: 'COD',
        note
      });

      if (response.data.success) {
        setCreatedOrder(response.data.data);
        setOrderSuccess(true);
        await fetchCart();
      } else {
        alert(response.data.message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.message || 'Đã xảy ra lỗi khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess && createdOrder) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
          <p className="text-gray-600 mb-2">Cảm ơn bạn đã đặt hàng tại Minh Tâm Đường</p>
          <p className="text-lg font-medium text-gray-800 mb-6">
            Mã đơn hàng: <span className="text-primary-600">{createdOrder.orderNumber}</span>
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Thông tin giao hàng:</h3>
            <p className="text-gray-600"><strong>Người nhận:</strong> {createdOrder.shippingAddress.fullName}</p>
            <p className="text-gray-600"><strong>Điện thoại:</strong> {createdOrder.shippingAddress.phone}</p>
            <p className="text-gray-600"><strong>Địa chỉ:</strong> {createdOrder.shippingAddress.address}</p>
            <p className="text-gray-600 mt-4"><strong>Tổng tiền:</strong> <span className="text-primary-600 font-bold">{formatPrice(createdOrder.totalAmount)}</span></p>
            <p className="text-gray-500 text-sm mt-2">Phương thức thanh toán: <span className="font-medium">Thanh toán khi nhận hàng (COD)</span></p>
          </div>

          <p className="text-gray-500 mb-6">
            Bạn sẽ nhận được email xác nhận đơn hàng trong thời gian sớm nhất.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/my-orders" className="btn-primary px-8 py-3">
              Xem đơn hàng
            </Link>
            <Link to="/products" className="btn-secondary px-8 py-3">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Thông tin giao hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Nhập họ và tên người nhận"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Số nhà, tên đường"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                <input
                  type="text"
                  name="ward"
                  value={shippingAddress.ward}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Phường/Xã"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                <input
                  type="text"
                  name="district"
                  value={shippingAddress.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Quận/Huyện"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Tỉnh/Thành phố"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú đơn hàng</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Ghi chú về đơn hàng (tùy chọn)"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Phương thức thanh toán
            </h2>

            <div className="space-y-4">
              <label className="flex items-center p-4 border-2 border-primary-600 rounded-lg bg-primary-50 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={true}
                  readOnly
                  className="w-5 h-5 text-primary-600"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                    <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Khuyến khích</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Bạn sẽ thanh toán khi nhận được hàng. Đây là phương thức an toàn và tiện lợi nhất.
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors opacity-50 pointer-events-none">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="VNPAY"
                  disabled
                  className="w-5 h-5 text-primary-600"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">Thanh toán qua VNPAY</span>
                    <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Sắp ra mắt</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Thanh toán qua ví điện tử VNPAY, thẻ ATM, thẻ tín dụng
                  </p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors opacity-50 pointer-events-none">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="MOMO"
                  disabled
                  className="w-5 h-5 text-primary-600"
                />
                <div className="ml-4">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">Thanh toán qua MoMo</span>
                    <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">Sắp ra mắt</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Thanh toán nhanh chóng qua ví điện tử MoMo
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>

            <div className="max-h-80 overflow-y-auto mb-6">
              {cart.items.map((item) => (
                <div key={item._id} className="flex gap-3 py-3 border-b last:border-b-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</h4>
                    <p className="text-xs text-gray-500">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-primary-600">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(cart.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatPrice(cart.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                'Đặt hàng ngay'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Nhấn "Đặt hàng ngay" đồng nghĩa với việc bạn đồng ý với{' '}
              <a href="#" className="text-primary-600 hover:underline">Điều khoản dịch vụ</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
