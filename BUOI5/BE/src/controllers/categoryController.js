const Category = require('../models/Category');

const categoryController = {
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true })
        .sort('order');

      res.json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCategoryBySlug: async (req, res) => {
    try {
      const category = await Category.findOne({ slug: req.params.slug, isActive: true });

      if (!category) {
        return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
      }

      res.json({ success: true, data: category });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = categoryController;
