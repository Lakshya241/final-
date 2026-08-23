import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import OrderTable from '../components/OrderTable';
import { getOrders, updateOrderStatus } from '../services/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders from Laravel API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status.');
    }
  };

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: '#0F0F11' }}>
      <AdminSidebar />

      <main className="admin-main" style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#0F0F11' }}>
        {/* Header */}
        <div style={{ paddingBottom: '24px', borderBottom: '1px solid #27272A', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
            Client Orders
          </h1>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '600', color: '#71717A', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px' }}>
            Review &amp; Update Dispatch Statuses — Live Laravel API
          </p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', marginBottom: '24px' }}>
            <AlertCircle style={{ width: '16px', height: '16px', color: '#F87171', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#FCA5A5' }}>{error}</span>
          </div>
        )}

        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', background: '#18181B', borderRadius: '16px', border: '1px solid #27272A' }}>
            <Loader2 style={{ width: '28px', height: '28px', color: '#C9A84C', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#71717A', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Loading orders…
            </p>
          </div>
        ) : (
          <OrderTable orders={orders} onStatusChange={handleStatusChange} />
        )}
      </main>
    </div>
  );
}
