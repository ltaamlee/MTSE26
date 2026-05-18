import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductCard from '../components/ProductCard';
import TopProductsSection from '../components/TopProductsSection';
import { productAPI, categoryAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newestProducts, setNewestProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, newestRes, bestSellerRes, categoriesRes] = await Promise.all([
        productAPI.getFeatured(),
        productAPI.getNewest(),
        productAPI.getBestSeller(),
        categoryAPI.getAll()
      ]);

      setFeaturedProducts(featuredRes.data.data || []);
      setNewestProducts(newestRes.data.data || []);
      setBestSellers(bestSellerRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const banners = [
    {
      id: 1,
      title: 'Thư Pháp Văn Phòng Tứ Bảo',
      subtitle: 'Nghệ thuật viết tay - Di sản văn hóa Việt',
      description: 'Khám phá bộ sưu tập bút, mực, giấy và nghiên mực cao cấp cho những ai đam mê thư pháp',
      image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1920',
      bgColor: 'from-primary-800 to-primary-900'
    },
    {
      id: 2,
      title: 'Khuyến Mãi Mùa Hè',
      subtitle: 'Giảm đến 30%',
      description: 'Áp dụng cho tất cả sản phẩm mực thư pháp - Chỉ trong tháng 6',
      image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=1920',
      bgColor: 'from-secondary-700 to-secondary-900'
    },
    {
      id: 3,
      title: 'Bộ Sưu Tập Giấy Truyền Thống',
      subtitle: 'Giấy dó - Giấy Washi',
      description: 'Tuyển chọn những loại giấy tốt nhất cho thư pháp Việt và Nhật',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920',
      bgColor: 'from-gold-600 to-gold-800'
    }
  ];

  const promotions = [
    { icon: '🚚', title: 'Miễn phí vận chuyển', desc: 'Đơn hàng từ 500.000đ' },
    { icon: '✨', title: 'Sản phẩm chính hãng', desc: '100% authentic' },
    { icon: '🔄', title: 'Đổi trả 7 ngày', desc: 'Không phí' },
    { icon: '💬', title: 'Hỗ trợ 24/7', desc: 'Luôn sẵn sàng' }
  ];

  return (
    <div className="min-h-screen">
      {/* Banner Slider */}
      <section className="relative">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="h-125 md:h-150"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <div className={`relative h-full bg-linear-to-r ${banner.bgColor}`}>
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="container mx-auto px-4 h-full flex items-center">
                  <div className="relative z-10 max-w-2xl text-white">
                    <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm mb-4">
                      {banner.subtitle}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {banner.title}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-white/90">
                      {banner.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link to="/products" className="btn-primary">
                        Khám phá ngay
                      </Link>
                      <Link to="/about" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900">
                        Tìm hiểu thêm
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Promotions */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {promotions.map((promo, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-3xl">{promo.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{promo.title}</h3>
                  <p className="text-sm text-gray-500">{promo.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Danh Mục Sản Phẩm</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="group relative aspect-square rounded-2xl overflow-hidden card-hover"
              >
                <img
                  src={category.image || 'https://via.placeholder.com/400x400?text=Category'}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {category.name}
                  </h3>
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    Xem ngay →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Sản Phẩm Nổi Bật
              </h2>
              <p className="text-gray-500 mt-2">Những sản phẩm được yêu thích nhất</p>
            </div>
            <Link to="/products?filter=featured" className="btn-outline hidden md:inline-block">
              Xem tất cả
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/products?filter=featured" className="btn-outline">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section className="py-16 bg-linear-to-r from-primary-700 to-secondary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center text-white relative z-10">
          <span className="inline-block px-6 py-2 bg-white/20 rounded-full text-sm mb-4">
            🎉 Khuyến mãi đặc biệt
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Giảm 20% Cho Đơn Hàng Đầu Tiên
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Sử dụng mã: <span className="font-bold">THUPHAM20</span> khi checkout
          </p>
          <Link to="/products" className="inline-block bg-white text-primary-700 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Mua sắm ngay
          </Link>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Sản Phẩm Mới
              </h2>
              <p className="text-gray-500 mt-2">Cập nhật những sản phẩm mới nhất</p>
            </div>
            <Link to="/products?filter=new" className="btn-outline hidden md:inline-block">
              Xem tất cả
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newestProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link to="/products?filter=new" className="btn-outline">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Top Products Section - Bán chạy & Xem nhiều nhất */}
      <TopProductsSection />

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800"
                alt="Thư pháp truyền thống"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <span className="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Về chúng tôi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Thư Pháp Văn Phòng Tứ Bảo
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Với hơn 10 năm kinh nghiệm trong lĩnh vực cung cấp dụng cụ thư pháp, Tứ Bảo tự hào là địa chỉ tin cậy 
                của những người yêu nghệ thuật viết tay. Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, 
                từ bút, mực, giấy đến nghiên mực - tất cả đều được tuyển chọn kỹ lưỡng.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">10+</div>
                  <div className="text-sm text-gray-500">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">5000+</div>
                  <div className="text-sm text-gray-500">Khách hàng</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">200+</div>
                  <div className="text-sm text-gray-500">Sản phẩm</div>
                </div>
              </div>
              <Link to="/about" className="btn-primary">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-linear-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Đăng ký nhận tin khuyến mãi
          </h2>
          <p className="text-gray-400 mb-8">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt qua email
          </p>
          <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button type="submit" className="btn-primary rounded-full">
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
