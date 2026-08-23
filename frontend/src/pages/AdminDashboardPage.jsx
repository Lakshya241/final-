import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { getProducts, getOrders } from '../services/api';
import { Package, ShoppingCart, DollarSign, Clock, ArrowUpRight, Plus, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [prodsData, ordersData] = await Promise.all([getProducts(), getOrders()]);
        setProducts(prodsData);
        setOrders(ordersData);
      } catch (err) {
        console.error('Admin data fetch failed:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const pendingCount = orders.filter((o) => o.status === 'Pending').length;

  const STATS = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      sub: 'All-time earnings',
      color: 'text-gold-500',
      bg: 'bg-gold-500/10',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingCart,
      sub: 'Across all customers',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Products',
      value: products.length,
      icon: Package,
      sub: 'Active in catalogue',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Pending',
      value: pendingCount,
      icon: Clock,
      sub: 'Awaiting dispatch',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F0F11' }}>
      <AdminSidebar />

      <main style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', background: '#0F0F11' }}>

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-charcoal-800">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Dashboard</h1>
            <p className="font-sans text-xs text-charcoal-400 uppercase tracking-widest font-medium mt-1">
              Live Overview · AURA Management
            </p>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-gradient text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-gold transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        {/* ── Stats ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map(({ label, value, icon: Icon, sub, color, bg }) => (
            <div key={label} className="bg-charcoal-900 border border-charcoal-800 rounded-2xl p-6 space-y-3 hover:border-charcoal-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal-400">
                  {label}
                </span>
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${color}`} />
                </div>
              </div>
              <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
              <p className="font-sans text-xs text-charcoal-500">{sub}</p>
            </div>
          ))}
        </div>

        {/* ── Recent Orders ────────────────────────────────────────── */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-800">
            <h3 className="font-display text-lg font-bold text-white">Recent Orders</h3>
            <Link
              to="/admin/orders"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 skeleton rounded-lg" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-10 text-center">
              <ShoppingCart className="w-10 h-10 text-charcoal-600 mx-auto mb-3" />
              <p className="font-sans text-sm text-charcoal-400">No orders yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal-800">
              {orders.slice(0, 8).map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-charcoal-800/50 transition-colors">
                  <div className="flex items-center gap-4 min-w-0">
                    <div>
                      <p className="font-sans text-xs font-bold text-gold-400">
                        {order.order_number || `#${order.id}`}
                      </p>
                      <p className="font-sans text-xs text-charcoal-300 truncate max-w-[180px]">
                        {order.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 shrink-0">
                    <span className="font-display text-base font-bold text-white">
                      ${Number(order.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick Product List ───────────────────────────────────── */}
        <div className="bg-charcoal-900 border border-charcoal-800 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-800">
            <h3 className="font-display text-lg font-bold text-white">Top Products</h3>
            <Link
              to="/admin/products"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-gold-500 hover:text-gold-400 flex items-center gap-1"
            >
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-10 skeleton rounded-lg" />)}
            </div>
          ) : (
            <div className="divide-y divide-charcoal-800">
              {products.slice(0, 5).map((p) => (
                <div key={p.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-charcoal-800/50 transition-colors">
                  <img src={p.image_url} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border border-charcoal-700 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-sm font-semibold text-white truncate">{p.name}</p>
                    <p className="font-sans text-[10px] text-charcoal-400 uppercase tracking-widest">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-sm font-bold text-gold-400">
                      ${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </p>
                    <p className="font-sans text-[10px] text-charcoal-400">Stock: {p.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
