import { useLocation } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (title) return title;
    
    switch (true) {
      case location.pathname === '/admin':
        return 'Dashboard';
      case location.pathname.startsWith('/admin/products'):
        return 'Quản lý sản phẩm';
      case location.pathname.startsWith('/admin/categories'):
        return 'Quản lý danh mục';
      case location.pathname.startsWith('/admin/orders'):
        return 'Quản lý đơn hàng';
      case location.pathname.startsWith('/admin/users'):
        return 'Quản lý người dùng';
      default:
        return 'Admin';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
