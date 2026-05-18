import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight, Flame, Eye, Loader2 } from 'lucide-react';

const TopProductsSection = () => {
  const [activeTab, setActiveTab] = useState('bestseller');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const scrollRef = useRef(null);

  const PRODUCTS_PER_PAGE = 5;

  useEffect(() => {
    fetchTopProducts();
  }, [activeTab]);

  useEffect(() => {
    if (products.length > 0) {
      setTotalPages(Math.ceil(products.length / PRODUCTS_PER_PAGE));
    }
  }, [products]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      const res = await productAPI.getTop({ type: activeTab, limit: 10 });
      setProducts(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching top products:', error);
      // Fallback mock data
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 260 * PRODUCTS_PER_PAGE; // card width + gap
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const goToPage = (page) => {
    if (scrollRef.current) {
      const scrollAmount = 260 * PRODUCTS_PER_PAGE * (page - 1);
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
    setCurrentPage(page);
  };

  const currentProducts = products.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-primary-600 uppercase tracking-wider">
              Sản phẩm nổi bật
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {activeTab === 'bestseller' ? 'Bán Chạy Nhất' : 'Xem Nhiều Nhất'}
            </h2>
            <p className="text-gray-500 mt-2">
              Khám phá những sản phẩm được yêu thích nhất
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-6 md:mt-0">
            <button
              onClick={() => setActiveTab('bestseller')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'bestseller'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Flame className="w-4 h-4" />
              Bán chạy
            </button>
            <button
              onClick={() => setActiveTab('mostviewed')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                activeTab === 'mostviewed'
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              Xem nhiều
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-container pb-4 px-2"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {/* CSS Hide scrollbar */}
            <style>{`
              .scroll-container::-webkit-scrollbar {
                display: none;
              }
              .scroll-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {loading ? (
              // Loading Skeleton
              [...Array(PRODUCTS_PER_PAGE)].map((_, i) => (
                <div
                  key={i}
                  className="w-[240px] shrink-0 bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              // Empty State
              <div className="w-full py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Chưa có sản phẩm nào</p>
              </div>
            ) : (
              // Products
              products.map((product, index) => (
                <div
                  key={product._id || product.id}
                  className="w-[240px] shrink-0 scroll-snap-item"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="relative">
                    {/* Rank Badge */}
                    <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-amber-600 text-white' :
                      'bg-white text-gray-700'
                    }`}>
                      {index + 1}
                    </div>
                    <ProductCard product={product} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Page Indicators */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentPage === i + 1
                    ? 'bg-primary-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Trang ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to={`/products?sort=${activeTab === 'bestseller' ? '-sold' : '-viewCount'}`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem tất cả sản phẩm
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopProductsSection;
