import React, { useState } from 'react';
import { ChevronDown, ChevronUp, User, Mail, MapPin } from 'lucide-react';

const T = {
  surface:    '#18181B',
  surfaceAlt: '#1F1F23',
  border:     '#27272A',
  rowHover:   'rgba(255,255,255,0.03)',
  textPrimary:'#F4F4F5',
  textMuted:  '#71717A',
  textGold:   '#C9A84C',
  goldLight:  '#E8C96A',
};

const STATUS_COLOURS = {
  Pending:    { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.3)', color: '#FCD34D' },
  Processing: { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)', color: '#93C5FD' },
  Shipped:    { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.3)', color: '#C4B5FD' },
  Delivered:  { bg: 'rgba(34,197,94,0.12)',  border: 'rgba(34,197,94,0.3)',  color: '#6EE7B7' },
  Cancelled:  { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#FCA5A5' },
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
  background: T.surfaceAlt,
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

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderTable({ orders, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);

  if (!orders || orders.length === 0) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', background: T.surface, borderRadius: '16px', border: `1px solid ${T.border}` }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: T.textMuted }}>
          No orders recorded yet.
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
              {['Order ID', 'Customer', 'Date', 'Total', 'Status', ''].map((h, i) => (
                <th key={i} style={{ ...th, textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const expanded = expandedId === order.id;
              const sc = STATUS_COLOURS[order.status] || STATUS_COLOURS.Pending;
              const date = new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

              return (
                <React.Fragment key={order.id}>
                  {/* Main row */}
                  <tr
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = T.rowHover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => setExpandedId(expanded ? null : order.id)}
                  >
                    {/* Order ID */}
                    <td style={td}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', color: T.goldLight, fontSize: '13px' }}>
                        {order.order_number || `#${order.id}`}
                      </span>
                    </td>

                    {/* Customer */}
                    <td style={td}>
                      <p style={{ margin: 0, fontWeight: '600', color: T.textPrimary }}>{order.customer_name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '11px', color: T.textMuted }}>{order.customer_email}</p>
                    </td>

                    {/* Date */}
                    <td style={{ ...td, color: T.textMuted }}>{date}</td>

                    {/* Total */}
                    <td style={{ ...td, fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: '600', color: T.textPrimary }}>
                      ₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    {/* Status select */}
                    <td style={td} onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        style={{
                          padding: '6px 12px',
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          borderRadius: '20px',
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: sc.color,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} style={{ background: '#18181B', color: '#F4F4F5' }}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Expand toggle */}
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: T.textMuted, padding: '4px', display: 'inline-flex', alignItems: 'center' }}>
                        {expanded
                          ? <ChevronUp style={{ width: '16px', height: '16px' }} />
                          : <ChevronDown style={{ width: '16px', height: '16px' }} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded detail row */}
                  {expanded && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0', borderBottom: `1px solid ${T.border}`, background: T.surfaceAlt }}>
                        <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>

                          {/* Customer info */}
                          <div style={{ background: '#18181B', borderRadius: '12px', border: `1px solid ${T.border}`, padding: '16px' }}>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textGold, marginBottom: '12px' }}>
                              Customer &amp; Shipping
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {[
                                { icon: User,   text: `${order.customer_name} · ${order.customer_phone}` },
                                { icon: Mail,   text: order.customer_email },
                                { icon: MapPin, text: order.shipping_address },
                              ].map(({ icon: Icon, text }) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                  <Icon style={{ width: '13px', height: '13px', color: T.textGold, flexShrink: 0, marginTop: '2px' }} />
                                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#D4D4D8', lineHeight: 1.5 }}>{text}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Items */}
                          <div style={{ background: '#18181B', borderRadius: '12px', border: `1px solid ${T.border}`, padding: '16px' }}>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: '700', letterSpacing: '0.18em', textTransform: 'uppercase', color: T.textGold, marginBottom: '12px' }}>
                              Items ({order.items?.length || 0})
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {order.items?.map((item) => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {item.image_url && (
                                      <img src={item.image_url} alt={item.product_name}
                                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px', border: `1px solid ${T.border}`, flexShrink: 0 }} />
                                    )}
                                    <div>
                                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', fontWeight: '600', color: T.textPrimary, margin: 0 }}>{item.product_name}</p>
                                      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: T.textMuted, margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: '600', color: T.goldLight, whiteSpace: 'nowrap' }}>
                                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
