import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, Users, 
  LogOut, ChevronRight, Home 
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: Layers, label: 'Danh mục' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">T</span>
          </div>
          <div>
            <h1 className="font-bold text-lg">Admin Panel</h1>
            <p className="text-xs text-gray-400">Thư Pháp Văn Phòng</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <div className="px-4 mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wider">Menu</span>
        </div>
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive(item.path) && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-800">
        {/* Back to Website */}
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors mb-3"
        >
          <Home className="w-5 h-5" />
          <span>Quay lại Website</span>
        </Link>

        {/* User Info */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-800 rounded-lg mb-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="font-semibold">{user?.username?.[0]?.toUpperCase() || 'A'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'admin'}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
