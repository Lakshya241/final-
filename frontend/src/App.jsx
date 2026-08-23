import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

function LayoutWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className="min-h-screen flex flex-col justify-between bg-cream-100 font-sans text-charcoal-900">
      {/* Hide storefront Navbar on Admin internal dashboard pages */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Customer Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Routes>
      </main>

      {/* Hide storefront Footer on Admin internal dashboard pages */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Router>
        <LayoutWrapper />
      </Router>
    </CartProvider>
  );
}
