import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Products from './pages/Products';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Header /><main className="flex-grow"><Home /></main><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<><Header /><main className="flex-grow"><Products /></main><Footer /></>} />
          <Route path="/product/:id" element={<><Header /><main className="flex-grow"><ProductDetail /></main><Footer /></>} />
          <Route path="/category/:slug" element={<><Header /><main className="flex-grow"><Products /></main><Footer /></>} />
          <Route path="/search" element={<><Header /><main className="flex-grow"><Products /></main><Footer /></>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
