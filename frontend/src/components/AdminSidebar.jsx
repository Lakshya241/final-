import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart,
  ArrowLeft, ShieldCheck, LogOut, Gem, ChevronRight,
} from 'lucide-react';

const NAV = [
  { name: 'Dashboard', path: '/admin',          icon: LayoutDashboard },
  { name: 'Products',  path: '/admin/products', icon: Package },
  { name: 'Orders',    path: '/admin/orders',   icon: ShoppingCart },
];

export default function AdminSidebar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('aura_admin_auth');
    navigate('/admin/login');
  };

  /* ── helpers ───────────────────────────────────────────────── */
  const navItemStyle = (active, isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    cursor: 'pointer',
    width: '100%',
    border: 'none',
    textAlign: 'left',
    transition: 'background 0.18s ease, color 0.18s ease',
    /* Active = gold tint + gold left border; hover = white tint; default = fully visible grey */
    background: active
      ? 'rgba(201,168,76,0.14)'
      : isHovered
      ? 'rgba(255,255,255,0.07)'
      : 'transparent',
    borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
    /* CRITICAL: always use a colour bright enough to read on #18181B */
    color: active ? '#E8C96A' : '#D4D4D8',
  });

  const iconStyle = { width: '16px', height: '16px', flexShrink: 0 };

  const labelStyle = (active) => ({
    fontFamily: 'Inter, sans-serif',
    fontSize: '13px',
    fontWeight: active ? '700' : '500',
    letterSpacing: '0.03em',
    whiteSpace: 'nowrap',
  });

  return (
    <aside style={{
      width: '236px',
      minWidth: '236px',
      minHeight: '100vh',
      background: '#18181B',
      borderRight: '1px solid #27272A',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0,
    }}>

      {/* ── TOP ────────────────────────────────────────────────── */}
      <div>
        {/* Brand header */}
        <div style={{
          padding: '26px 20px 22px',
          borderBottom: '1px solid #27272A',
        }}>
          <Link to="/admin" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Gold gem icon */}
            <div style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'rgba(201,168,76,0.15)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Gem style={{ width: '20px', height: '20px', color: '#C9A84C' }} />
            </div>

            <div>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '19px',
                fontWeight: '700',
                color: '#FFFFFF',           /* pure white — never invisible */
                letterSpacing: '0.18em',
                lineHeight: 1,
                margin: 0,
              }}>
                AURA
              </p>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '9px',
                fontWeight: '700',
                color: '#C9A84C',           /* gold — always visible on dark */
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                lineHeight: 1,
                marginTop: '4px',
              }}>
                Admin Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Section label */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: '600',
          color: '#52525B',                /* muted but legible section divider */
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          padding: '20px 20px 8px',
          margin: 0,
        }}>
          Menu
        </p>

        {/* Nav items */}
        <nav style={{ padding: '0 10px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {NAV.map(({ name, path, icon: Icon }) => {
            const active = location.pathname === path;
            const isHov  = hovered === name;
            return (
              <Link
                key={name}
                to={path}
                style={navItemStyle(active, isHov)}
                onMouseEnter={() => setHovered(name)}
                onMouseLeave={() => setHovered(null)}
              >
                <Icon style={{ ...iconStyle, color: active ? '#E8C96A' : '#A1A1AA' }} />
                <span style={labelStyle(active)}>{name}</span>
                {active && (
                  <ChevronRight style={{
                    marginLeft: 'auto',
                    width: '14px', height: '14px',
                    color: '#C9A84C', flexShrink: 0,
                  }} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── BOTTOM ─────────────────────────────────────────────── */}
      <div style={{
        padding: '10px',
        borderTop: '1px solid #27272A',
        display: 'flex',
        flexDirection: 'column',
        gap: '3px',
      }}>
        {/* Back to store */}
        <Link
          to="/"
          style={navItemStyle(false, hovered === 'store')}
          onMouseEnter={() => setHovered('store')}
          onMouseLeave={() => setHovered(null)}
        >
          <ArrowLeft style={{ ...iconStyle, color: '#A1A1AA' }} />
          <span style={labelStyle(false)}>Back to Store</span>
        </Link>

        {/* Sign out */}
        <button
          onClick={handleLogout}
          style={{
            ...navItemStyle(false, hovered === 'logout'),
            background: hovered === 'logout' ? 'rgba(239,68,68,0.12)' : 'transparent',
            color: hovered === 'logout' ? '#FCA5A5' : '#D4D4D8',
          }}
          onMouseEnter={() => setHovered('logout')}
          onMouseLeave={() => setHovered(null)}
        >
          <LogOut style={{
            ...iconStyle,
            color: hovered === 'logout' ? '#FCA5A5' : '#A1A1AA',
          }} />
          <span style={labelStyle(false)}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
