const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const categories = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Bút Thư Pháp',
    slug: 'but-thu-phap',
    description: 'Các loại bút thư pháp cao cấp cho người yêu nghệ thuật viết tay',
    isActive: true,
    order: 1
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Mực Thư Pháp',
    slug: 'muc-thu-phap',
    description: 'Mực thư pháp với nhiều màu sắc đa dạng',
    isActive: true,
    order: 2
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'Giấy Thư Pháp',
    slug: 'giay-thu-phap',
    description: 'Giấy chuyên dụng cho thư pháp, giấy dó, giấy truyền thống',
    isActive: true,
    order: 3
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: 'Nghiên Mực',
    slug: 'nghien-muc',
    description: 'Nghiên mực cao cấp làm từ muội son và dầu',
    isActive: true,
    order: 4
  }
];

const products = [
  {
    name: 'Bút Lông Thư Pháp Pentel Brush Pen',
    slug: 'but-long-thu-phap-pentel',
    sku: 'BUT001',
    description: 'Bút lông Pentel Brush Pen là lựa chọn tuyệt vời cho những ai đam mê thư pháp. Với đầu cọ mềm mại, bạn có thể tạo ra những nét vẽ đa dạng từ mảnh đến đậm. Sản phẩm này được ưa chuộng bởi các nghệ nhân thư pháp trên toàn thế giới.',
    shortDescription: 'Bút lông cao cấp cho thư pháp',
    price: 125000,
    originalPrice: 150000,
    images: [
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600',
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600'
    ],
    category: '507f1f77bcf86cd799439011',
    brand: 'Pentel',
    stock: 150,
    sold: 89,
    rating: 4.8,
    isFeatured: true,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Loại', value: 'Bút lông' },
      { name: 'Màu mực', value: 'Đen' },
      { name: 'Độ dày đầu cọ', value: 'Đa dạng' }
    ],
    tags: ['but-thu-phap', 'pentel', 'brush-pen']
  },
  {
    name: 'Bộ Bút Thư Pháp Cán Dài Skyvn',
    slug: 'bo-but-thu-phap-can-dai',
    sku: 'BUT002',
    description: 'Bộ bút thư pháp cán dài với thiết kế chuyên nghiệp, phù hợp cho người mới bắt đầu và cả nghệ nhân chuyên nghiệp. Bộ sản phẩm bao gồm nhiều loại đầu bút khác nhau.',
    shortDescription: 'Bộ bút thư pháp cán dài 5 món',
    price: 350000,
    originalPrice: 420000,
    images: [
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600'
    ],
    category: '507f1f77bcf86cd799439011',
    brand: 'Skyvn',
    stock: 75,
    sold: 45,
    rating: 4.6,
    isFeatured: true,
    isNewProduct: true,
    isHot: false,
    specifications: [
      { name: 'Số lượng', value: '5 bút' },
      { name: 'Chất liệu', value: 'Kim loại + Nhựa cao cấp' }
    ],
    tags: ['but-thu-phap', 'bo-but', 'skyvn']
  },
  {
    name: 'Mực Thư Pháp Màu Tự Nhiên 12 Màu',
    slug: 'muc-thu-phap-mau-tu-nhien',
    sku: 'MUC001',
    description: 'Bộ mực thư pháp với 12 màu sắc tự nhiên, được chiết xuất từ nguyên liệu tự nhiên an toàn cho sức khỏe. Mực có độ nhớt phù hợp, dễ tạo nét và bám dính tốt trên nhiều loại giấy.',
    shortDescription: 'Bộ mực 12 màu tự nhiên',
    price: 280000,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600'
    ],
    category: '507f1f77bcf86cd799439012',
    brand: 'NatureInk',
    stock: 200,
    sold: 120,
    rating: 4.9,
    isFeatured: true,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Số lượng', value: '12 chai' },
      { name: 'Dung tích', value: '30ml/chai' },
      { name: 'Xuất xứ', value: 'Việt Nam' }
    ],
    tags: ['muc-thu-phap', 'muc-mau', 'tu-nhien']
  },
  {
    name: 'Mực Nho Thư Pháp Premium - Đen Tuyền',
    slug: 'muc-nho-thu-phap-premium',
    sku: 'MUC002',
    description: 'Mực nho cao cấp cho thư pháp với màu đen tuyền sang trọng. Được làm từ muội son và dầu len tự nhiên, mang lại độ đậm đặc và bóng mượt hoàn hảo.',
    shortDescription: 'Mực nho đen tuyền cao cấp',
    price: 185000,
    originalPrice: 220000,
    images: [
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600'
    ],
    category: '507f1f77bcf86cd799439012',
    brand: 'Premium',
    stock: 95,
    sold: 67,
    rating: 4.7,
    isFeatured: false,
    isNewProduct: true,
    isHot: false,
    specifications: [
      { name: 'Dung tích', value: '45ml' },
      { name: 'Màu sắc', value: 'Đen tuyền' },
      { name: 'Độ bóng', value: 'Cao' }
    ],
    tags: ['muc-thu-phap', 'muc-nho', 'cao-cap']
  },
  {
    name: 'Giấy Dó Truyền Thống Việt Nam',
    slug: 'giay-do-truyen-thong',
    sku: 'GIA001',
    description: 'Giấy dó truyền thống Việt Nam được làm thủ công từ vỏ cây dó, mang đậm nét văn hóa dân tộc. Giấy có bề mặt mịn màng, phù hợp cho thư pháp và tranh thư pháp.',
    shortDescription: 'Giấy dó thủ công 20 tờ',
    price: 95000,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600'
    ],
    category: '507f1f77bcf86cd799439013',
    brand: 'Truyền Thống',
    stock: 300,
    sold: 180,
    rating: 4.8,
    isFeatured: true,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Số lượng', value: '20 tờ' },
      { name: 'Kích thước', value: '40x60cm' },
      { name: 'Chất liệu', value: 'Vỏ cây dó' }
    ],
    tags: ['giay-thu-phap', 'giay-do', 'viet-nam']
  },
  {
    name: 'Giấy Thư Pháp Nhật Bản Washi Tape',
    slug: 'giay-thu-phap-nhat-ban',
    sku: 'GIA002',
    description: 'Giấy Washi tape cao cấp nhập khẩu từ Nhật Bản, với nhiều họa tiết truyền thống tinh xảo. Giấy mỏng nhẹ nhưng bền bỉ, phù hợp cho mọi loại thư pháp.',
    shortDescription: 'Giấy Washi Nhật Bản 30 tờ',
    price: 165000,
    originalPrice: 200000,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
    ],
    category: '507f1f77bcf86cd799439013',
    brand: 'JapanPaper',
    stock: 180,
    sold: 95,
    rating: 4.9,
    isFeatured: false,
    isNewProduct: true,
    isHot: false,
    specifications: [
      { name: 'Số lượng', value: '30 tờ' },
      { name: 'Kích thước', value: 'A4' },
      { name: 'Xuất xứ', value: 'Nhật Bản' }
    ],
    tags: ['giay-thu-phap', 'washi', 'nhat-ban']
  },
  {
    name: 'Nghiên Mực Đồng Truyền Thống',
    slug: 'nghien-muc-dong-truyen-thong',
    sku: 'NGH001',
    description: 'Nghiên mực đồng truyền thống được đúc thủ công, mang đậm nét văn hóa thư pháp cổ điển. Sản phẩm được làm từ hợp kim đồng cao cấp, bền bỉ theo thời gian.',
    shortDescription: 'Nghiên mực đồng truyền thống',
    price: 450000,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600'
    ],
    category: '507f1f77bcf86cd799439014',
    brand: 'Truyền Thống',
    stock: 50,
    sold: 28,
    rating: 4.7,
    isFeatured: true,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Chất liệu', value: 'Đồng hợp kim' },
      { name: 'Kích thước', value: '15x10x3cm' },
      { name: 'Trọng lượng', value: '250g' }
    ],
    tags: ['nghien-muc', 'dong', 'truyen-thong']
  },
  {
    name: 'Nghiên Mực Sứ Trắng Mini',
    slug: 'nghien-muc-suc-mini',
    sku: 'NGH002',
    description: 'Nghiên mực sứ mini xinh xắn, phù hợp cho không gian làm việc nhỏ gọn. Thiết kế tinh tế với men sứ trắng cao cấp, dễ vệ sinh và sử dụng.',
    shortDescription: 'Nghiên mực sứ mini xinh xắn',
    price: 120000,
    originalPrice: 150000,
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600'
    ],
    category: '507f1f77bcf86cd799439014',
    brand: 'CeramicArt',
    stock: 85,
    sold: 42,
    rating: 4.5,
    isFeatured: false,
    isNewProduct: true,
    isHot: false,
    specifications: [
      { name: 'Chất liệu', value: 'Sứ cao cấp' },
      { name: 'Kích thước', value: '8x6x2cm' },
      { name: 'Màu sắc', value: 'Trắng men' }
    ],
    tags: ['nghien-muc', 'suc', 'mini']
  },
  {
    name: 'Bút Thư Pháp Pilot Parallel - 2.4mm',
    slug: 'but-thu-phap-pilot-parallel',
    sku: 'BUT003',
    description: 'Bút Pilot Parallel với đầu song song 2.4mm, cho phép tạo các nét vuông đặc trưng của thư pháp phương Tây. Sản phẩm nổi tiếng với chất lượng vượt trội.',
    shortDescription: 'Bút Pilot Parallel 2.4mm',
    price: 380000,
    originalPrice: 450000,
    images: [
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600',
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600'
    ],
    category: '507f1f77bcf86cd799439011',
    brand: 'Pilot',
    stock: 60,
    sold: 38,
    rating: 4.8,
    isFeatured: true,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Độ rộng đầu', value: '2.4mm' },
      { name: 'Loại', value: 'Bút song song' },
      { name: 'Màu', value: 'Đen + Đỏ' }
    ],
    tags: ['but-thu-phap', 'pilot', 'parallel']
  },
  {
    name: 'Mực Thư Pháp Dr. Ph. Martin - Hydrus',
    slug: 'muc-thu-phap-dr-ph-martin',
    sku: 'MUC003',
    description: 'Mực Dr. Ph. Martin Hydrus Watercolors là sự kết hợp hoàn hảo giữa mực thư pháp và màu nước. Có thể pha trộn và tạo gradient đẹp mắt.',
    shortDescription: 'Mực thư pháp màu nước cao cấp',
    price: 320000,
    originalPrice: null,
    images: [
      'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600'
    ],
    category: '507f1f77bcf86cd799439012',
    brand: 'Dr. Ph. Martin',
    stock: 70,
    sold: 35,
    rating: 4.9,
    isFeatured: false,
    isNewProduct: true,
    isHot: false,
    specifications: [
      { name: 'Dung tích', value: '30ml' },
      { name: 'Loại', value: 'Mực + Màu nước' },
      { name: 'Số lượng màu', value: '6 màu' }
    ],
    tags: ['muc-thu-phap', 'dr-ph-martin', 'mau-nuoc']
  },
  {
    name: 'Giấy Giác Khoan Trắng Đục',
    slug: 'giay-giac-khoan-trang-duc',
    sku: 'GIA003',
    description: 'Giấy giác khoan trắng đục chuyên dụng cho thư pháp Nhật Bản. Bề mặt giấy mịn màng, không thấm mực quá nhanh, giữ được độ sắc nét của nét chữ.',
    shortDescription: 'Giấy giác khoan 100 tờ',
    price: 220000,
    originalPrice: 280000,
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600'
    ],
    category: '507f1f77bcf86cd799439013',
    brand: 'JapanesePaper',
    stock: 120,
    sold: 68,
    rating: 4.6,
    isFeatured: false,
    isNewProduct: false,
    isHot: true,
    specifications: [
      { name: 'Số lượng', value: '100 tờ' },
      { name: 'Kích thước', value: 'A4' },
      { name: 'Định lượng', value: '120gsm' }
    ],
    tags: ['giay-thu-phap', 'giac-khoan', 'nhat-ban']
  },
  {
    name: 'Bộ Nghiên Mực Đồng Cao Cấp 4 Món',
    slug: 'bo-nghien-muc-dong-cao-cap',
    sku: 'NGH003',
    description: 'Bộ nghiên mực đồng cao cấp 4 món với nhiều kích thước khác nhau, phù hợp cho mọi nhu cầu thư pháp. Được chế tác tinh xảo với hoa văn truyền thống.',
    shortDescription: 'Bộ nghiên mực đồng 4 món',
    price: 890000,
    originalPrice: 1100000,
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600'
    ],
    category: '507f1f77bcf86cd799439014',
    brand: 'PremiumCraft',
    stock: 25,
    sold: 15,
    rating: 4.9,
    isFeatured: true,
    isNewProduct: false,
    isHot: false,
    specifications: [
      { name: 'Số lượng', value: '4 nghiên' },
      { name: 'Chất liệu', value: 'Đồng đắp nổi' },
      { name: 'Kích thước', value: 'Đa dạng' }
    ],
    tags: ['nghien-muc', 'dong', 'bo-set']
  }
];

const seedDatabase = async () => {
  try {
    // Kết nối database nếu chưa kết nối
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thuphap');
    }

    await Category.deleteMany({});
    await Product.deleteMany({});

    await Category.insertMany(categories);
    console.log('Categories seeded successfully!');

    await Product.insertMany(products);
    console.log('Products seeded successfully!');

    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    return false;
  }
};

module.exports = seedDatabase;
