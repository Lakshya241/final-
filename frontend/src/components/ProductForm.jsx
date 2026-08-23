import React, { useState, useEffect } from 'react';
import { X, Loader2, ImageIcon } from 'lucide-react';

const inp = {
  width: '100%',
  padding: '11px 14px',
  background: '#0F0F11',
  border: '1px solid #27272A',
  borderRadius: '8px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: '#F4F4F5',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const lbl = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#71717A',
  marginBottom: '6px',
};

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  );
}

export default function ProductForm({ initialData, onSubmit, onClose, loading }) {
  const [form, setForm] = useState({
    name: '',
    category: 'Rings',
    price: '',
    stock: 10,
    description: '',
    image_url: '',
    secondary_image_url: '',
    materials: '',
    is_featured: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name:                initialData.name ?? '',
        category:            initialData.category ?? 'Rings',
        price:               initialData.price ?? '',
        stock:               initialData.stock ?? 10,
        description:         initialData.description ?? '',
        image_url:           initialData.image_url ?? '',
        secondary_image_url: initialData.secondary_image_url ?? '',
        materials:           initialData.materials ?? '',
        is_featured:         initialData.is_featured ?? true,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const focusStyle = (e) => { e.target.style.borderColor = '#C9A84C'; e.target.style.boxShadow = '0 0 0 3px rgba(201,168,76,0.12)'; };
  const blurStyle  = (e) => { e.target.style.borderColor = '#27272A'; e.target.style.boxShadow = 'none'; };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock, 10) });
  };

  return (
    /* ── Backdrop ─── */
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px', overflowY: 'auto',
    }}>
      {/* ── Modal ─── */}
      <div className="product-form-modal" style={{
        background: '#18181B',
        border: '1px solid #27272A',
        borderRadius: '20px',
        width: '100%', maxWidth: '640px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', color: '#A1A1AA', display: 'flex', alignItems: 'center' }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Title */}
        <div style={{ marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #27272A' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h3>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#71717A', marginTop: '5px' }}>
            {initialData ? 'Update the product details below.' : 'Fill in the details to add to the catalogue.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Row: Name + Category */}
          <div className="product-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Product Title *">
              <input type="text" name="name" required value={form.name} onChange={handleChange}
                onFocus={focusStyle} onBlur={blurStyle}
                placeholder="Aura Solitaire Ring"
                style={inp} />
            </Field>
            <Field label="Category *">
              <select name="category" value={form.category} onChange={handleChange}
                onFocus={focusStyle} onBlur={blurStyle}
                style={{ ...inp, cursor: 'pointer' }}>
                {['Rings', 'Necklaces', 'Earrings', 'Bracelets'].map((c) => (
                  <option key={c} value={c} style={{ background: '#18181B' }}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          {/* Row: Price + Stock */}
          <div className="product-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Price (USD) *">
              <input type="number" step="0.01" min="0" name="price" required value={form.price}
                onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle}
                placeholder="2850.00" style={inp} />
            </Field>
            <Field label="Stock Qty *">
              <input type="number" min="0" name="stock" required value={form.stock}
                onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle} style={inp} />
            </Field>
          </div>

          {/* Row: Primary Image + Secondary Image */}
          <div className="product-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Primary Image URL *">
              <input type="url" name="image_url" required value={form.image_url}
                onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle}
                placeholder="https://images.unsplash.com/…" style={inp} />
            </Field>
            <Field label="Hover Image URL">
              <input type="url" name="secondary_image_url" value={form.secondary_image_url}
                onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle}
                placeholder="https://images.unsplash.com/…" style={inp} />
            </Field>
          </div>

          {/* Image preview strip */}
          {(form.image_url || form.secondary_image_url) && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {[form.image_url, form.secondary_image_url].filter(Boolean).map((url, i) => (
                <div key={i} style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #27272A', background: '#0F0F11', flexShrink: 0 }}>
                  <img src={url} alt="preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              ))}
            </div>
          )}

          {/* Materials */}
          <Field label="Materials & Gemstones">
            <input type="text" name="materials" value={form.materials}
              onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle}
              placeholder="18k Champagne Gold, 1.8ct VVS1 Diamond" style={inp} />
          </Field>

          {/* Description */}
          <Field label="Description *">
            <textarea name="description" rows={3} required value={form.description}
              onChange={handleChange} onFocus={focusStyle} onBlur={blurStyle}
              placeholder="Describe the craftsmanship and design…"
              style={{ ...inp, resize: 'vertical', lineHeight: 1.6 }} />
          </Field>

          {/* Featured toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div
              onClick={() => setForm((p) => ({ ...p, is_featured: !p.is_featured }))}
              style={{
                width: '42px', height: '24px', borderRadius: '12px', flexShrink: 0,
                background: form.is_featured ? 'rgba(201,168,76,0.8)' : '#27272A',
                position: 'relative', transition: 'background 0.2s', cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute', top: '3px',
                left: form.is_featured ? '21px' : '3px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#FFFFFF',
                transition: 'left 0.2s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </div>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#D4D4D8' }}>
              Feature on homepage
            </span>
          </label>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px', borderTop: '1px solid #27272A' }}>
            <button type="button" onClick={onClose}
              style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.06)', border: '1px solid #27272A', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A1A1AA', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: 'linear-gradient(135deg, #E8C96A, #C9A84C)', border: 'none', borderRadius: '8px', fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1C1C1E', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(201,168,76,0.3)' }}>
              {loading && <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />}
              {initialData ? 'Update' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
