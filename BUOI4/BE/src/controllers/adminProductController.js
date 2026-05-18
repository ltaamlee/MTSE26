const Product = require('../models/Product');
const Category = require('../models/Category');

const adminProductController = {
    // Lấy tất cả sản phẩm (bao gồm cả inactive)
    getAllProducts: async (req, res) => {
        try {
            const { page = 1, limit = 10, search, category, isActive } = req.query;
            
            const query = {};
            
            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { sku: { $regex: search, $options: 'i' } }
                ];
            }
            
            if (category) {
                query.category = category;
            }
            
            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            const products = await Product.find(query)
                .populate('category', 'name slug')
                .sort('-createdAt')
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

    // Tạo sản phẩm mới
    createProduct: async (req, res) => {
        try {
            const {
                name, slug, sku, description, shortDescription,
                price, originalPrice, images, category, brand,
                stock, isFeatured, isNewProduct, isHot, specifications, tags
            } = req.body;

            // Kiểm tra slug đã tồn tại chưa
            const existingProduct = await Product.findOne({ slug });
            if (existingProduct) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Slug đã tồn tại' 
                });
            }

            // Kiểm tra category có tồn tại không
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Danh mục không tồn tại' 
                });
            }

            const product = new Product({
                name,
                slug,
                sku,
                description,
                shortDescription,
                price,
                originalPrice,
                images,
                category,
                brand,
                stock: stock || 0,
                isFeatured: isFeatured || false,
                isNewProduct: isNewProduct || false,
                isHot: isHot || false,
                specifications,
                tags
            });

            await product.save();
            await product.populate('category', 'name slug');

            res.status(201).json({
                success: true,
                message: 'Tạo sản phẩm thành công',
                data: product
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Cập nhật sản phẩm
    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Nếu cập nhật slug, kiểm tra trùng lặp
            if (updateData.slug) {
                const existing = await Product.findOne({ 
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

            // Nếu cập nhật category, kiểm tra category tồn tại
            if (updateData.category) {
                const categoryExists = await Category.findById(updateData.category);
                if (!categoryExists) {
                    return res.status(400).json({ 
                        success: false, 
                        message: 'Danh mục không tồn tại' 
                    });
                }
            }

            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).populate('category', 'name slug');

            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Sản phẩm không tồn tại' 
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật sản phẩm thành công',
                data: product
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Xóa sản phẩm
    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Sản phẩm không tồn tại' 
                });
            }

            res.json({
                success: true,
                message: 'Xóa sản phẩm thành công'
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Toggle trạng thái active
    toggleProductStatus: async (req, res) => {
        try {
            const { id } = req.params;
            
            const product = await Product.findById(id);

            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Sản phẩm không tồn tại' 
                });
            }

            product.isActive = !product.isActive;
            await product.save();

            res.json({
                success: true,
                message: `Sản phẩm đã ${product.isActive ? 'được kích hoạt' : 'bị vô hiệu hóa'}`,
                data: product
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    // Thống kê sản phẩm
    getProductStats: async (req, res) => {
        try {
            const totalProducts = await Product.countDocuments();
            const activeProducts = await Product.countDocuments({ isActive: true });
            const inactiveProducts = await Product.countDocuments({ isActive: false });
            const outOfStock = await Product.countDocuments({ stock: 0 });
            const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });

            res.json({
                success: true,
                data: {
                    total: totalProducts,
                    active: activeProducts,
                    inactive: inactiveProducts,
                    outOfStock,
                    lowStock
                }
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = adminProductController;
