import { useState, useEffect } from 'react';
import { adminProductAPI, adminCategoryAPI } from '../../services/api';
import { Package, Layers, ShoppingBag, Users, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: { total: 0, active: 0, inactive: 0, outOfStock: 0, lowStock: 0 },
    categories: { total: 0, active: 0, inactive: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [productStats, categoryStats] = await Promise.all([
        adminProductAPI.getStats(),
        adminCategoryAPI.getStats()
      ]);

      setStats({
        products: productStats.data.data,
        categories: categoryStats.data.data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtext, color }) => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
          {subtext && <p className="text-sm text-gray-400 mt-1">{subtext}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Tổng sản phẩm"
          value={stats.products.total}
          subtext={`${stats.products.active} đang hoạt động`}
          color="text-blue-600"
        />
        <StatCard
          icon={Layers}
          title="Tổng danh mục"
          value={stats.categories.total}
          subtext={`${stats.categories.active} đang hoạt động`}
          color="text-green-600"
        />
        <StatCard
          icon={ShoppingBag}
          title="Hết hàng"
          value={stats.products.outOfStock}
          subtext={`${stats.products.lowStock} sắp hết`}
          color="text-orange-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Tổng quan"
          value={stats.products.active + stats.categories.active}
          subtext="Đang hoạt động"
          color="text-purple-600"
        />
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/admin/products?action=create"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <Package className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Thêm sản phẩm</span>
            </a>
            <a
              href="/admin/categories?action=create"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Layers className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-600">Thêm danh mục</span>
            </a>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo</h3>
          <div className="space-y-3">
            {stats.products.outOfStock > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-700">
                    {stats.products.outOfStock} sản phẩm đã hết hàng
                  </p>
                  <a href="/admin/products?filter=outOfStock" className="text-xs text-red-500 hover:underline">
                    Xem ngay
                  </a>
                </div>
              </div>
            )}
            {stats.products.lowStock > 0 && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-orange-700">
                    {stats.products.lowStock} sản phẩm sắp hết hàng
                  </p>
                  <a href="/admin/products?filter=lowStock" className="text-xs text-orange-500 hover:underline">
                    Xem ngay
                  </a>
                </div>
              </div>
            )}
            {stats.products.outOfStock === 0 && stats.products.lowStock === 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <p className="text-sm text-green-700">Tất cả sản phẩm đều còn hàng!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity placeholder */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
        <div className="text-center py-8 text-gray-400">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Chưa có hoạt động nào</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
