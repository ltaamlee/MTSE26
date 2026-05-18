import { Link } from 'react-router-dom';

const ProductCard = ({ product, showAddToCart = true }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover group">
      <div className="relative">
        <Link to={`/product/${product._id || product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>
        
        {discount > 0 && (
          <span className="badge-sale">-{discount}%</span>
        )}
        
        {product.isNewProduct && (
          <span className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Mới
          </span>
        )}
        
        {product.isHot && (
          <span className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Hot
          </span>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/product/${product._id || product.id}`}
            className="bg-white text-primary-600 px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary-600 hover:text-white"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{product.category?.name || 'Thư Pháp'}</p>
        
        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < (product.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-500">({product.reviews || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {product.stock > 0 ? `${product.stock} còn` : 'Hết hàng'}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Đã bán: {product.sold || 0}
          </span>
        </div>

        {showAddToCart && (
          <button className="w-full mt-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-2 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
            Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
