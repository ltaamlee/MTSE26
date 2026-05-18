const Category = require('../models/Category');
const Product = require('../models/Product');

const adminCategoryController = {
    // Lấy tất cả danh mục (bao gồm cả inactive)
    getAllCategories: async (req, res) => {
        try {
            const { page = 1, limit = 10, search, isActive } = req.query;
            
            const query = {};
            
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }
            
            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            const categories = await Category.find(query)
                .sort('order')
                .skip((page - 1) * limit)
                .limit(Number(limit));

            const total = await Category.countDocuments(query);

            res.json({
                success: true,
                data: categories,
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

    // Tạo danh mục mới
    createCategory: async (req, res) => {
        try {
            const { name, slug, description, image, parent, order, isActive } = req.body;

            // Kiểm tra slug đã tồn tại chưa
            const existingCategory = await Category.findOne({ slug });
            if (existingCategory) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Slug đã tồn tại' 
                });
            }

            // Kiểm tra parent category có tồn tại không
            if (parent) {
                const parentExists = await Category.findById(parent);
                if (!parentExists) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Danh mục cha không tồn tại' 
                    });
                }
            }

            const category = new Category({
                name,
                slug,
                description,
                image,
                parent,
                order: order || 0,
                isActive: isActive !== false
            });

            await category.save();

            res.status(201).json({
                success: true,
                message: 'Tạo danh mục thành công',
                data: category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Cập nhật danh mục
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Nếu cập nhật slug, kiểm tra trùng lặp
            if (updateData.slug) {
                const existing = await Category.findOne({ 
                    slug: updateData.slug, 
                    _id: { $ne: id } 
                });
                if (existing) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Slug đã tồn tại' 
                    });
                }
            }

            // Kiểm tra circular reference nếu cập nhật parent
            if (updateData.parent) {
                if (updateData.parent === id) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Danh mục không thể là cha của chính nó' 
                    });
                }
                
                const parentExists = await Category.findById(updateData.parent);
                if (!parentExists) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Danh mục cha không tồn tại' 
                    });
                }
            }

            const category = await Category.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Danh mục không tồn tại' 
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật danh mục thành công',
                data: category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Xóa danh mục
    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Kiểm tra có sản phẩm nào thuộc danh mục này không
            const productCount = await Product.countDocuments({ category: id });
            if (productCount > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Không thể xóa danh mục. Có ${productCount} sản phẩm đang thuộc danh mục này.` 
                });
            }

            // Kiểm tra có danh mục con không
            const childCount = await Category.countDocuments({ parent: id });
            if (childCount > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Không thể xóa danh mục. Có ${childCount} danh mục con đang thuộc danh mục này.` 
                });
            }

            const category = await Category.findByIdAndDelete(id);

            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Danh mục không tồn tại' 
                });
            }

            res.json({
                success: true,
                message: 'Xóa danh mục thành công'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Toggle trạng thái active
    toggleCategoryStatus: async (req, res) => {
        try {
            const { id } = req.params;
            
            const category = await Category.findById(id);

            if (!category) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Danh mục không tồn tại' 
                });
            }

            category.isActive = !category.isActive;
            await category.save();

            res.json({
                success: true,
                message: `Danh mục đã ${category.isActive ? 'được kích hoạt' : 'bị vô hiệu hóa'}`,
                data: category
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Thống kê danh mục
    getCategoryStats: async (req, res) => {
        try {
            const totalCategories = await Category.countDocuments();
            const activeCategories = await Category.countDocuments({ isActive: true });
            const inactiveCategories = await Category.countDocuments({ isActive: false });

            // Đếm sản phẩm theo danh mục
            const categoryProductCounts = await Category.aggregate([
                {
                    $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'category',
                        as: 'products'
                    }
                },
                {
                    $project: {
                        name: 1,
                        productCount: { $size: '$products' }
                    }
                },
                { $sort: { productCount: -1 } }
            ]);

            res.json({
                success: true,
                data: {
                    total: totalCategories,
                    active: activeCategories,
                    inactive: inactiveCategories,
                    byCategory: categoryProductCounts
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = adminCategoryController;
