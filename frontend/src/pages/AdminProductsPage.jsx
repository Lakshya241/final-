import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminProductTable from '../components/AdminProductTable';
import ProductForm from '../components/ProductForm';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { Plus, Loader2, AlertCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products from Laravel API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this jewellery item from the database?')) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteProduct(id);
      await fetchProducts();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      setFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error('Form submission failed:', err);
      alert(err.response?.data?.message || 'Failed to save product details.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-shell" style={{ display: 'flex', minHeight: '100vh', background: '#0F0F11' }}>
      <AdminSidebar />

      <main className="admin-main" style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#0F0F11' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #27272A', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
              Catalogue Products
            </h1>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '600', color: '#71717A', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px' }}>
              Add · Edit · Delete — Live Laravel API
            </p>
          </div>

          <button
            onClick={handleCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
              color: '#1C1C1E',
              fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '700',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(201,168,76,0.3)',
            }}
          >
            <Plus style={{ width: '15px', height: '15px' }} />
            Add Product
          </button>
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
              Loading products…
            </p>
          </div>
        ) : (
          <AdminProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {formOpen && (
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onClose={() => setFormOpen(false)}
            loading={actionLoading}
          />
        )}
      </main>
    </div>
  );
}
