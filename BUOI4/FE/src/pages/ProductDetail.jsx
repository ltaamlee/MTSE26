import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getById(id);
      setProduct(res.data.data);
      
      if (res.data.data.category) {
        const relatedRes = await productAPI.getRelated(id, res.data.data.category._id);
        setRelatedProducts(relatedRes.data.data);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      loadMockProduct();
    } finally {
      setLoading(false);
    }
  };

  const loadMockProduct = () => {
    const mockProduct = {
      _id: id,
      name: 'Bút Lông Thư Pháp Pentel Brush Pen',
      slug: 'but-long-thu-phap-pentel',
      sku: 'BUT001',
      description: 'Bút lông Pentel Brush Pen là lựa chọn tuyệt vời cho những ai đam mê thư pháp. Với đầu cọ mềm mại, bạn có thể tạo ra những nét vẽ đa dạng từ mảnh đến đậm. Sản phẩm này được ưa chuộng bởi các nghệ nhân thư pháp trên toàn thế giới.\n\n**Đặc điểm nổi bật:**\n- Đầu cọ mềm mại, dễ kiểm soát\n- Mực chảy đều, không tắc đầu\n- Thiết kế ergonomic, dễ cầm\n- Phù hợp cho người mới và chuyên nghiệp\n\n**Hướng dẫn sử dụng:**\n1. Lắc đều bút trước khi sử dụng\n2. Bấm nhẹ đầu cọ để mực chảy ra\n3. Tập vẽ các nét cơ bản trước\n4. Vệ sinh đầu cọ sau khi sử dụng',
      shortDescription: 'Bút lông cao cấp cho thư pháp với đầu cọ mềm mại',
      price: 125000,
      originalPrice: 150000,
      images: [
        'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800',
        'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800',
        'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=800',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
      ],
      category: {
        _id: '507f1f77bcf86cd799439011',
        name: 'Bút Thư Pháp',
        slug: 'but-thu-phap'
      },
      brand: 'Pentel',
      stock: 150,
      sold: 89,
      rating: 4.8,
      numReviews: 89,
      specifications: [
        { name: 'Loại', value: 'Bút lông' },
        { name: 'Màu mực', value: 'Đen' },
        { name: 'Độ dày đầu cọ', value: 'Đa dạng' },
        { name: 'Xuất xứ', value: 'Nhật Bản' }
      ],
      tags: ['but-thu-phap', 'pentel', 'brush-pen']
    };

    const mockRelated = [
      {
        _id: '2',
        name: 'Bộ Bút Thư Pháp Cán Dài Skyvn',
        price: 350000,
        originalPrice: 420000,
        images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400'],
        category: { name: 'Bút Thư Pháp' },
        rating: 4.6,
        reviews: 45,
        stock: 75,
        sold: 45,
        isHot: true
      },
      {
        _id: '3',
        name: 'Bút Pilot Parallel 2.4mm',
        price: 380000,
        originalPrice: 450000,
        images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400'],
        category: { name: 'Bút Thư Pháp' },
        rating: 4.8,
        reviews: 38,
        stock: 60,
        sold: 38,
        isHot: true
      },
      {
        _id: '4',
        name: 'Mực Nho Thư Pháp Premium',
        price: 185000,
        originalPrice: 220000,
        images: ['https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=400'],
        category: { name: 'Mực Thư Pháp' },
        rating: 4.7,
        reviews: 67,
        stock: 95,
        sold: 67,
        isNew: true
      },
      {
        _id: '5',
        name: 'Bộ Bút Thư Pháp Cán Dài Skyvn 5 Món',
        price: 350000,
        originalPrice: 420000,
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400'],
        category: { name: 'Bút Thư Pháp' },
        rating: 4.6,
        reviews: 45,
        stock: 75,
        sold: 45,
        isNew: true
      }
    ];

    setProduct(mockProduct);
    setRelatedProducts(mockRelated);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity((prev) => (prev < product?.stock ? prev + 1 : prev));
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm không tồn tại</h2>
          <Link to="/" className="btn-primary">Quay lại trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link to="/" className="text-gray-500 hover:text-primary-600">Trang chủ</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/products" className="text-gray-500 hover:text-primary-600">Sản phẩm</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to={`/category/${product.category?.slug}`} className="text-gray-500 hover:text-primary-600">
                {product.category?.name}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </nav>

        {/* Product Info */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="relative">
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                  -{discount}%
                </div>
              )}
              
              <Swiper
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
                className="main-swiper rounded-xl overflow-hidden"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="thumb-swiper mt-4"
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <button className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-500 transition-colors">
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-4">
                <Link
                  to={`/category/${product.category?.slug}`}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {product.category?.name}
                </Link>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">{product.rating}/5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.numReviews} đánh giá</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-600">{product.sold} đã bán</span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through ml-3">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {product.stock > 0 ? (
                    <>
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-green-600 font-medium">Còn hàng</span>
                      <span className="text-gray-500">({product.stock} sản phẩm)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-red-600 font-medium">Hết hàng</span>
                    </>
                  )}
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <p className="text-orange-500 text-sm">
                    ⚠️ Chỉ còn {product.stock} sản phẩm! Hãy đặt hàng sớm.
                  </p>
                )}
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Số lượng:</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val > 0 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 text-center font-semibold border-x-2 border-gray-200 py-3 focus:outline-none"
                    />
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-primary-600 transition-colors disabled:opacity-50"
                      disabled={quantity >= product.stock}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm">
                    Tổng: <span className="font-bold text-primary-600">{formatPrice(product.price * quantity)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-linear-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className="flex-1 bg-linear-to-r from-secondary-600 to-secondary-700 text-white py-4 rounded-xl font-semibold hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Mua ngay
                </button>
              </div>

              {/* Product Meta */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-gray-600">SKU: {product.sku}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="text-gray-600">Thương hiệu: {product.brand}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Mô tả sản phẩm
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            {product.description.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 whitespace-pre-line">{paragraph}</p>
            ))}
          </div>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Thông số kỹ thuật</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-500">{spec.name}</span>
                    <span className="text-gray-900 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Sản phẩm tương tự
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
