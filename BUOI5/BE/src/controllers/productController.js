const Product = require('../models/Product');
const Category = require('../models/Category');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        minPrice,
        maxPrice,
        sort = '-createdAt',
        search
      } = req.query;

      const query = { isActive: true };

      if (category) {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (search) {
        query.$text = { $search: search };
      }

      const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id)
        .populate('category', 'name slug description');

      if (!product) {
        return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
      }

      res.json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getFeaturedProducts: async (req, res) => {
    try {
      const products = await Product.find({ isFeatured: true, isActive: true })
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(8);

      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getNewestProducts: async (req, res) => {
    try {
      const products = await Product.find({ isNewProduct: true, isActive: true })
        .populate('category', 'name slug')
        .sort('-createdAt')
        .limit(8);

      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBestSellerProducts: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const products = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .sort('-sold')
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments({ isActive: true });

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // API cho infinite scroll - lazy loading
  getProductsInfinite: async (req, res) => {
    try {
      const { page = 1, limit = 12, category, minPrice, maxPrice, sort = '-createdAt', search } = req.query;

      const query = { isActive: true };

      if (category) {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (search) {
        query.$text = { $search: search };
      }

      const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);
      const currentPage = Number(page);
      const hasMore = currentPage < totalPages;

      res.json({
        success: true,
        data: products,
        pagination: {
          page: currentPage,
          limit: Number(limit),
          total,
          pages: totalPages,
          hasMore,
          hasPrev: currentPage > 1,
          hasNext: hasMore
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // API top 10: bán chạy nhất và xem nhiều nhất
  getTopProducts: async (req, res) => {
    try {
      const { type = 'bestseller', page = 1, limit = 5 } = req.query;
      
      let products;
      let total;
      
      if (type === 'bestseller') {
        // Top 10 sản phẩm bán chạy nhất
        products = await Product.find({ isActive: true })
          .populate('category', 'name slug')
          .sort('-sold')
          .limit(10);
        total = 10;
      } else if (type === 'mostviewed') {
        // Top sản phẩm xem nhiều nhất (cần thêm trường viewCount vào model)
        products = await Product.find({ isActive: true })
          .populate('category', 'name slug')
          .sort('-viewCount')
          .skip((page - 1) * limit)
          .limit(Number(limit));
        total = await Product.countDocuments({ isActive: true });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Type phải là "bestseller" hoặc "mostviewed"' 
        });
      }

      const totalPages = Math.ceil(total / limit);
      const currentPage = Number(page);
      const hasMore = currentPage < totalPages;

      res.json({
        success: true,
        data: products,
        pagination: {
          page: currentPage,
          limit: Number(limit),
          total,
          pages: totalPages,
          hasMore,
          hasPrev: currentPage > 1,
          hasNext: hasMore
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProductsByCategory: async (req, res) => {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
      }

      const products = await Product.find({ category: categoryId, isActive: true })
        .populate('category', 'name slug')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments({ category: categoryId, isActive: true });

      res.json({
        success: true,
        data: products,
        category,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getRelatedProducts: async (req, res) => {
    try {
      const { id, categoryId } = req.params;

      const products = await Product.find({
        category: categoryId,
        _id: { $ne: id },
        isActive: true
      })
        .populate('category', 'name slug')
        .sort('-sold')
        .limit(4);

      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  searchProducts: async (req, res) => {
    try {
      const { q, category, minPrice, maxPrice, sort = '-createdAt' } = req.query;
      const { page = 1, limit = 12 } = req.query;

      const query = { isActive: true };

      if (q) {
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ];
      }

      if (category) {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

      const total = await Product.countDocuments(query);

      res.json({
        success: true,
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = productController;
