const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ user: userId }).populate('items.product');
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
      await cart.save();
    }

    const validItems = cart.items.filter(item => item.product !== null);
    
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      cart.calculateTotal();
      await cart.save();
    }

    res.json({
      success: true,
      data: {
        items: cart.items.map(item => ({
          _id: item._id,
          productId: item.product?._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          stock: item.product?.stock || 0
        })),
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Sản phẩm chỉ còn ${product.stock} sản phẩm` 
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ 
          success: false, 
          message: `Sản phẩm chỉ còn ${product.stock} sản phẩm` 
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        name: product.name,
        image: product.images?.[0] || ''
      });
    }

    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Thêm vào giỏ hàng thành công',
      data: {
        items: populatedCart.items.map(item => ({
          _id: item._id,
          productId: item.product?._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          stock: item.product?.stock || 0
        })),
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số lượng phải lớn hơn 0' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: `Sản phẩm chỉ còn ${product.stock} sản phẩm` 
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Cập nhật giỏ hàng thành công',
      data: {
        items: populatedCart.items.map(item => ({
          _id: item._id,
          productId: item.product?._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          stock: item.product?.stock || 0
        })),
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Giỏ hàng trống' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không có trong giỏ hàng' });
    }

    cart.items.splice(itemIndex, 1);
    cart.calculateTotal();
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
      data: {
        items: populatedCart.items.map(item => ({
          _id: item._id,
          productId: item.product?._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
          stock: item.product?.stock || 0
        })),
        totalAmount: cart.totalAmount,
        totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.findOneAndDelete({ user: userId });

    const newCart = new Cart({ user: userId, items: [], totalAmount: 0 });
    await newCart.save();

    res.json({
      success: true,
      message: 'Xóa giỏ hàng thành công',
      data: {
        items: [],
        totalAmount: 0,
        totalItems: 0
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
