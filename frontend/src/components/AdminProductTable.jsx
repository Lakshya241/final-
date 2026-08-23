import React from 'react';
import { Edit2, Trash2, Sparkles } from 'lucide-react';

/* ── Shared dark-theme token colours ────────────────────────────────────── */
const T = {
  surface:    '#18181B',
  border:     '#27272A',
  headerBg:   '#1F1F23',
  rowHover:   'rgba(255,255,255,0.03)',
  textPrimary:'#F4F4F5',
  textMuted:  '#71717A',
  textGold:   '#C9A84C',
  goldLight:  '#E8C96A',
};

const th = {
  padding: '14px 20px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: T.textMuted,
  borderBottom: `1px solid ${T.border}`,
  background: T.headerBg,
  whiteSpace: 'nowrap',
};

const td = {
  padding: '16px 20px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '13px',
  color: T.textPrimary,
  borderBottom: `1px solid ${T.border}`,
  verticalAlign: 'middle',
};

export default function AdminProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: T.textMuted }}>
          No products in catalogue yet.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}`, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map((h, i) => (
                <th key={h} style={{ ...th, textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = T.rowHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Product */}
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${T.border}`, flexShrink: 0 }}
                    />
                    <div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: '600', color: T.textPrimary, margin: 0 }}>
                        {product.name}
                      </p>
                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: T.textMuted, marginTop: '3px', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {product.materials || product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td style={td}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    background: 'rgba(201,168,76,0.12)',
                    border: '1px solid rgba(201,168,76,0.25)',
                    borderRadius: '20px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: T.textGold,
                  }}>
                    {product.category}
                  </span>
                </td>

                {/* Price */}
                <td style={{ ...td, fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '600', color: T.goldLight }}>
                  ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>

                {/* Stock */}
                <td style={td}>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: product.stock === 0 ? '#F87171'
                         : product.stock <= 5  ? '#FCD34D'
                         :                       '#6EE7B7',
                  }}>
                    {product.stock} units
                  </span>
                </td>

                {/* Featured */}
                <td style={td}>
                  {product.is_featured ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: T.textGold, fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <Sparkles style={{ width: '12px', height: '12px' }} />
                      Yes
                    </span>
                  ) : (
                    <span style={{ color: T.textMuted, fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>—</span>
                  )}
                </td>

                {/* Actions */}
                <td style={{ ...td, textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      onClick={() => onEdit(product)}
                      title="Edit"
                      style={{ padding: '7px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', cursor: 'pointer', color: T.textGold, display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.22)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.1)'; }}
                    >
                      <Edit2 style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      title="Delete"
                      style={{ padding: '7px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', cursor: 'pointer', color: '#F87171', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.22)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    >
                      <Trash2 style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
