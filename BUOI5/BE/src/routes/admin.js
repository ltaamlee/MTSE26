const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/adminAuth');
const adminProductController = require('../controllers/adminProductController');
const adminCategoryController = require('../controllers/adminCategoryController');

// ========== ADMIN PRODUCTS ==========

// GET /api/admin/products - Lấy danh sách sản phẩm
router.get('/products', isAdmin, adminProductController.getAllProducts);

// GET /api/admin/products/stats - Thống kê sản phẩm
router.get('/products/stats', isAdmin, adminProductController.getProductStats);

// POST /api/admin/products - Tạo sản phẩm mới
router.post('/products', isAdmin, adminProductController.createProduct);

// PUT /api/admin/products/:id - Cập nhật sản phẩm
router.put('/products/:id', isAdmin, adminProductController.updateProduct);

// DELETE /api/admin/products/:id - Xóa sản phẩm
router.delete('/products/:id', isAdmin, adminProductController.deleteProduct);

// PATCH /api/admin/products/:id/toggle - Toggle trạng thái
router.patch('/products/:id/toggle', isAdmin, adminProductController.toggleProductStatus);

// ========== ADMIN CATEGORIES ==========

// GET /api/admin/categories - Lấy danh sách danh mục
router.get('/categories', isAdmin, adminCategoryController.getAllCategories);

// GET /api/admin/categories/stats - Thống kê danh mục
router.get('/categories/stats', isAdmin, adminCategoryController.getCategoryStats);

// POST /api/admin/categories - Tạo danh mục mới
router.post('/categories', isAdmin, adminCategoryController.createCategory);

// PUT /api/admin/categories/:id - Cập nhật danh mục
router.put('/categories/:id', isAdmin, adminCategoryController.updateCategory);

// DELETE /api/admin/categories/:id - Xóa danh mục
router.delete('/categories/:id', isAdmin, adminCategoryController.deleteCategory);

// PATCH /api/admin/categories/:id/toggle - Toggle trạng thái
router.patch('/categories/:id/toggle', isAdmin, adminCategoryController.toggleCategoryStatus);

module.exports = router;
