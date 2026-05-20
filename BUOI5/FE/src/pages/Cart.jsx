import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';
import { Trash2, AlertTriangle, Check, Minus, Plus } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const { cart, loading, updateCartItem, removeFromCart, clearCart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [stockWarningItem, setStockWarningItem] = useState(null);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  useEffect(() => {
    if (cart.items.length > 0) {
      const initialSelected = {};
      cart.items.forEach(item => {
        initialSelected[item.productId] = false;
      });
      setSelectedItems(initialSelected);
    }
  }, [cart.items]);

  const handleSelectAll = (checked) => {
    const newSelected = {};
    cart.items.forEach(item => {
      newSelected[item.productId] = checked;
    });
    setSelectedItems(newSelected);
  };

  const handleSelectItem = (productId, checked) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: checked
    }));
  };

  const handleQuantityChange = async (productId, newQuantity, item) => {
    if (newQuantity === 0) {
      setItemToDelete(item);
      setShowDeletePopup(true);
      return;
    }

    if (newQuantity > item.stock) {
      setStockWarningItem(item);
      setShowStockWarning(true);
      return;
    }

    await updateCartItem(productId, newQuantity);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeFromCart(itemToDelete.productId);
    }
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setItemToDelete(null);
  };

  const handleCloseStockWarning = () => {
    setShowStockWarning(false);
    setStockWarningItem(null);
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = cart.items.filter(item => selectedItems[item.productId]);
    if (selectedCartItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    navigate('/checkout', { state: { selectedItems: selectedCartItems } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const getSelectedTotal = () => {
    return cart.items
      .filter(item => selectedItems[item.productId])
      .reduce((sum, item) => sum + item.subtotal, 0);
  };

  const getSelectedCount = () => {
    return cart.items.filter(item => selectedItems[item.productId]).length;
  };

  const isAllSelected = cart.items.length > 0 && cart.items.every(item => selectedItems[item.productId]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
          <Link to="/login" className="btn-primary inline-block">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (loading && cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Đang tải giỏ hàng...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-6">Không có sản phẩm nào trong giỏ hàng</p>
          <Link to="/products" className="btn-primary inline-block">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with Select All */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-sm font-medium text-gray-600">
              <div className="col-span-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer"
                />
                <span>Chọn tất cả ({cart.items.length} sản phẩm)</span>
              </div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>

            {cart.items.map((item) => (
              <div 
                key={item._id} 
                className={`p-4 md:p-6 border-b last:border-b-0 transition-colors ${
                  selectedItems[item.productId] ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Checkbox and Product Info */}
                  <div className="col-span-1 md:col-span-6 flex gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems[item.productId] || false}
                      onChange={(e) => handleSelectItem(item.productId, e.target.checked)}
                      className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer mt-8"
                    />
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Còn lại: {item.stock} sản phẩm
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-red-500 text-sm mt-2 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-1 md:col-span-2 text-center">
                    <p className="font-medium text-gray-900">{formatPrice(item.price)}</p>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-1 md:col-span-2 flex justify-center">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1, item)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 0}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          handleQuantityChange(item.productId, val, item);
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val < 1) handleQuantityChange(item.productId, 1, item);
                          if (val > item.stock) handleQuantityChange(item.productId, item.stock, item);
                        }}
                        className="w-12 text-center border-x border-gray-300 py-1 focus:outline-none"
                        min="0"
                        max={item.stock}
                      />
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1, item)}
                        className="px-3 py-1 hover:bg-gray-100 transition-colors disabled:opacity-50"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-1 md:col-span-2 text-right">
                    <p className={`font-bold ${selectedItems[item.productId] ? 'text-primary-600' : 'text-gray-400'}`}>
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="px-6 py-4 bg-gray-50">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Xóa tất cả sản phẩm
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng quan đơn hàng</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sản phẩm đã chọn</span>
                <span>{getSelectedCount()} / {cart.items.length}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(getSelectedTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-primary-600">{formatPrice(getSelectedTotal())}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Tiến hành thanh toán ({getSelectedCount()})
            </button>

            <Link
              to="/products"
              className="block text-center mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Xóa sản phẩm</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc muốn xóa <span className="font-medium">{itemToDelete?.name}</span> khỏi giỏ hàng?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stock Warning Popup */}
      {showStockWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cảnh báo</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Sản phẩm <span className="font-medium">{stockWarningItem?.name}</span> chỉ còn lại <span className="font-bold text-red-600">{stockWarningItem?.stock}</span> sản phẩm trong kho.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Vui lòng chọn số lượng không vượt quá số lượng tồn kho.
            </p>
            <button
              onClick={handleCloseStockWarning}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
