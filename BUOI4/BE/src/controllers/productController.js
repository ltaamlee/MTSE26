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
      const products = await Product.find({ isNew: true, isActive: true })
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
      const products = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .sort('-sold')
        .limit(8);

      res.json({ success: true, data: products });
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
