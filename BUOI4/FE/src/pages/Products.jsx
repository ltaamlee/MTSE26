import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1
  });

  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    filter: searchParams.get('filter') || ''
  });

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data || []);
    } catch (error) {
      loadMockCategories();
    }
  };

  const loadMockCategories = () => {
    setCategories([
      { _id: '1', name: 'Bút Thư Pháp', slug: 'but-thu-phap' },
      { _id: '2', name: 'Mực Thư Pháp', slug: 'muc-thu-phap' },
      { _id: '3', name: 'Giấy Thư Pháp', slug: 'giay-thu-phap' },
      { _id: '4', name: 'Nghiên Mực', slug: 'nghien-muc' }
    ]);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        sort: filters.sort
      };

      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await productAPI.getAll(params);
      setProducts(res.data.data || []);
      if (res.data.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.log('Using mock data:', error);
      loadMockProducts();
    } finally {
      setLoading(false);
    }
  };

  const loadMockProducts = () => {
    const mockProducts = [
      {
        _id: '1',
        name: 'Bút Lông Thư Pháp Pentel Brush Pen',
        price: 125000,
        originalPrice: 150000,
        images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400'],
        category: { name: 'Bút Thư Pháp' },
        rating: 4.8,
        reviews: 89,
        stock: 150,
        sold: 89,
        isFeatured: true,
        isNew: false,
        isHot: true
      },
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
        isFeatured: true,
        isNew: true,
        isHot: false
      },
      {
        _id: '3',
        name: 'Mực Thư Pháp Màu Tự Nhiên 12 Màu',
        price: 280000,
        originalPrice: null,
        images: ['https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=400'],
        category: { name: 'Mực Thư Pháp' },
        rating: 4.9,
        reviews: 120,
        stock: 200,
        sold: 120,
        isFeatured: true,
        isNew: false,
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
        isFeatured: false,
        isNew: true,
        isHot: false
      },
      {
        _id: '5',
        name: 'Giấy Dó Truyền Thống Việt Nam',
        price: 95000,
        originalPrice: null,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
        category: { name: 'Giấy Thư Pháp' },
        rating: 4.8,
        reviews: 180,
        stock: 300,
        sold: 180,
        isFeatured: true,
        isNew: false,
        isHot: true
      },
      {
        _id: '6',
        name: 'Giấy Thư Pháp Nhật Bản Washi Tape',
        price: 165000,
        originalPrice: 200000,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
        category: { name: 'Giấy Thư Pháp' },
        rating: 4.9,
        reviews: 95,
        stock: 180,
        sold: 95,
        isFeatured: false,
        isNew: true,
        isHot: false
      },
      {
        _id: '7',
        name: 'Nghiên Mực Đồng Truyền Thống',
        price: 450000,
        originalPrice: null,
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400'],
        category: { name: 'Nghiên Mực' },
        rating: 4.7,
        reviews: 28,
        stock: 50,
        sold: 28,
        isFeatured: true,
        isNew: false,
        isHot: true
      },
      {
        _id: '8',
        name: 'Nghiên Mực Sứ Mini',
        price: 120000,
        originalPrice: 150000,
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400'],
        category: { name: 'Nghiên Mực' },
        rating: 4.5,
        reviews: 42,
        stock: 85,
        sold: 42,
        isFeatured: false,
        isNew: true,
        isHot: false
      },
      {
        _id: '9',
        name: 'Bút Pilot Parallel 2.4mm',
        price: 380000,
        originalPrice: 450000,
        images: ['https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400'],
        category: { name: 'Bút Thư Pháp' },
        rating: 4.8,
        reviews: 38,
        stock: 60,
        sold: 38,
        isFeatured: true,
        isNew: false,
        isHot: true
      },
      {
        _id: '10',
        name: 'Mực Thư Pháp Dr. Ph. Martin',
        price: 320000,
        originalPrice: null,
        images: ['https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=400'],
        category: { name: 'Mực Thư Pháp' },
        rating: 4.9,
        reviews: 35,
        stock: 70,
        sold: 35,
        isFeatured: false,
        isNew: true,
        isHot: false
      },
      {
        _id: '11',
        name: 'Giấy Giác Khoan Trắng Đục',
        price: 220000,
        originalPrice: 280000,
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'],
        category: { name: 'Giấy Thư Pháp' },
        rating: 4.6,
        reviews: 68,
        stock: 120,
        sold: 68,
        isFeatured: false,
        isNew: false,
        isHot: true
      },
      {
        _id: '12',
        name: 'Bộ Nghiên Mực Đồng Cao Cấp 4 Món',
        price: 890000,
        originalPrice: 1100000,
        images: ['https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400'],
        category: { name: 'Nghiên Mực' },
        rating: 4.9,
        reviews: 15,
        stock: 25,
        sold: 15,
        isFeatured: true,
        isNew: false,
        isHot: false
      }
    ];

    let filtered = [...mockProducts];

    if (filters.filter === 'featured') {
      filtered = filtered.filter(p => p.isFeatured);
    } else if (filters.filter === 'new') {
      filtered = filtered.filter(p => p.isNew);
    } else if (filters.filter === 'bestseller') {
      filtered = filtered.sort((a, b) => b.sold - a.sold);
    }

    if (filters.category) {
      filtered = filtered.filter(p => 
        p.category.name.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    setProducts(filtered);
    setPagination({ page: 1, limit: 12, total: filtered.length, pages: 1 });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams();
    if (newFilters.search) params.set('q', newFilters.search);
    if (newFilters.category) params.set('category', newFilters.category);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice);
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice);
    if (newFilters.sort) params.set('sort', newFilters.sort);
    if (newFilters.filter) params.set('filter', newFilters.filter);
    
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
      filter: ''
    });
    setSearchParams({});
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Mới nhất' },
    { value: 'createdAt', label: 'Cũ nhất' },
    { value: '-sold', label: 'Bán chạy nhất' },
    { value: '-price', label: 'Giá: Cao → Thấp' },
    { value: 'price', label: 'Giá: Thấp → Cao' },
    { value: '-rating', label: 'Đánh giá cao' }
  ];

  const priceRanges = [
    { min: '', max: '', label: 'Tất cả' },
    { min: '', max: '100000', label: 'Dưới 100.000đ' },
    { min: '100000', max: '200000', label: '100.000đ - 200.000đ' },
    { min: '200000', max: '300000', label: '200.000đ - 300.000đ' },
    { min: '300000', max: '500000', label: '300.000đ - 500.000đ' },
    { min: '500000', max: '', label: 'Trên 500.000đ' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-linear-to-r from-primary-700 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Sản Phẩm
          </h1>
          <p className="text-white/80">
            Khám phá bộ sưu tập dụng cụ thư pháp cao cấp
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Bộ lọc
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Xóa tất cả
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Danh mục</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === ''}
                      onChange={() => handleFilterChange('category', '')}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-600">Tất cả</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat._id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.name}
                        onChange={() => handleFilterChange('category', cat.name)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Khoảng giá</h4>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                        onChange={() => {
                          handleFilterChange('minPrice', range.min);
                          handleFilterChange('maxPrice', range.max);
                        }}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-gray-600">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Custom Price */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Giá tùy chỉnh</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Đến"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Lọc nhanh</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleFilterChange('filter', 'featured')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.filter === 'featured'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Nổi bật
                  </button>
                  <button
                    onClick={() => handleFilterChange('filter', 'new')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.filter === 'new'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Mới nhất
                  </button>
                  <button
                    onClick={() => handleFilterChange('filter', 'bestseller')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.filter === 'bestseller'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    Bán chạy
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort & Results */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">{pagination.total}</span> sản phẩm
                </p>
                <div className="flex items-center gap-4">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="hidden md:flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.filter) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                  {filters.search && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      Tìm: {filters.search}
                      <button onClick={() => handleFilterChange('search', '')} className="hover:text-primary-900">×</button>
                    </span>
                  )}
                  {filters.category && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {filters.category}
                      <button onClick={() => handleFilterChange('category', '')} className="hover:text-primary-900">×</button>
                    </span>
                  )}
                  {filters.minPrice && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      Từ: {parseInt(filters.minPrice).toLocaleString()}đ
                      <button onClick={() => handleFilterChange('minPrice', '')} className="hover:text-primary-900">×</button>
                    </span>
                  )}
                  {filters.maxPrice && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      Đến: {parseInt(filters.maxPrice).toLocaleString()}đ
                      <button onClick={() => handleFilterChange('maxPrice', '')} className="hover:text-primary-900">×</button>
                    </span>
                  )}
                  {filters.filter === 'featured' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                      Nổi bật
                      <button onClick={() => handleFilterChange('filter', '')} className="hover:text-secondary-900">×</button>
                    </span>
                  )}
                  {filters.filter === 'new' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Mới nhất
                      <button onClick={() => handleFilterChange('filter', '')} className="hover:text-green-900">×</button>
                    </span>
                  )}
                  {filters.filter === 'bestseller' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      Bán chạy
                      <button onClick={() => handleFilterChange('filter', '')} className="hover:text-orange-900">×</button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                      {[...Array(pagination.pages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', (i + 1).toString());
                            setSearchParams(params);
                          }}
                          className={`w-10 h-10 rounded-lg font-medium ${
                            pagination.page === i + 1
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-gray-600 hover:bg-gray-100'
                          } transition-colors`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button onClick={clearFilters} className="btn-primary">
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
