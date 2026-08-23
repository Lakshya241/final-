import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Menu, X, Search, Heart, ChevronDown, Gem } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

export default function Navbar() {
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCategoryOpen(false);
  }, [location.pathname]);

  const handleCategoryNav = (cat) => {
    setCategoryOpen(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Announcement Bar */}
      <div
        className="bg-charcoal-900 text-cream-100 overflow-hidden"
        style={{ height: '36px' }}
      >
        <div className="flex items-center h-full justify-center relative">
          <div className="marquee-track flex items-center gap-16 text-[11px] font-sans font-medium tracking-widest uppercase text-cream-200">
            {[
              '✦ Free Insured Shipping on Orders Over $500',
              '✦ Ethically Sourced Gemstones',
              '✦ Lifetime Craft Warranty',
              '✦ GIA Certified Diamonds',
              '✦ Handcrafted in Geneva',
              '✦ Free Insured Shipping on Orders Over $500',
              '✦ Ethically Sourced Gemstones',
              '✦ Lifetime Craft Warranty',
              '✦ GIA Certified Diamonds',
              '✦ Handcrafted in Geneva',
            ].map((item, i) => (
              <span key={i} className="flex-shrink-0">{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'navbar-glass shadow-card py-0'
            : 'bg-warm-white/95 backdrop-blur-sm border-b border-cream-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-[70px] flex items-center justify-between gap-6">

          {/* ── Logo ───────────────────────────────────────── */}
          <Link to="/" className="flex flex-col items-start shrink-0 group">
            <span className="font-display text-[26px] font-bold tracking-[0.18em] text-charcoal-900 group-hover:text-gold-500 transition-colors leading-none">
              AURA
            </span>
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.4em] text-gold-500 leading-none mt-0.5">
              Haute Joaillerie
            </span>
          </Link>

          {/* ── Desktop Navigation ─────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-widest text-charcoal-700">

            <Link to="/" className={`nav-link relative py-1 hover:text-gold-500 transition-colors ${location.pathname === '/' ? 'text-gold-500' : ''}`}>
              Home
              {location.pathname === '/' && (
                <span className="absolute -bottom-0.5 left-0 w-full h-[1.5px] bg-gold-500 rounded-full" />
              )}
            </Link>

            {/* Category Dropdown */}
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`flex items-center gap-1 py-1 hover:text-gold-500 transition-colors ${categoryOpen ? 'text-gold-500' : ''}`}
              >
                Collections
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${categoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-48 bg-white rounded-xl shadow-card-hover border border-cream-200 overflow-hidden animate-scale-in">
                  <div className="p-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryNav(cat)}
                        className="w-full text-left px-4 py-2.5 text-[11px] uppercase tracking-widest font-semibold text-charcoal-700 hover:bg-gold-100 hover:text-gold-600 rounded-lg transition-colors"
                      >
                        {cat === 'All' ? 'All Collections' : cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleCategoryNav('All')}
              className="py-1 hover:text-gold-500 transition-colors"
            >
              New Arrivals
            </button>
            <button
              onClick={() => handleCategoryNav('All')}
              className="py-1 hover:text-gold-500 transition-colors"
            >
              Bestsellers
            </button>
          </nav>

          {/* ── Right Actions ──────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Admin Icon */}
            <Link
              to={localStorage.getItem('aura_admin_auth') ? '/admin' : '/admin/login'}
              title="Admin Portal"
              className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold uppercase tracking-widest transition-all duration-200 ${
                isAdmin
                  ? 'bg-gold-500/15 text-gold-600'
                  : 'text-charcoal-500 hover:text-gold-500 hover:bg-gold-100/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden lg:block">Admin</span>
            </Link>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white transition-all duration-200 group"
              aria-label={`Cart: ${itemCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:block text-[11px] font-semibold uppercase tracking-widest">
                Bag
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-charcoal-900 font-bold text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-gold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-charcoal-900 hover:text-gold-500 transition-colors rounded-lg hover:bg-cream-200"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Drawer ──────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-cream-200 shadow-card-hover animate-fade-in-up">
            <nav className="max-w-7xl mx-auto px-5 py-6 space-y-1">
              {[
                { label: 'Home', to: '/' },
                { label: 'All Collections', action: () => handleCategoryNav('All') },
                { label: 'Rings', action: () => handleCategoryNav('Rings') },
                { label: 'Necklaces', action: () => handleCategoryNav('Necklaces') },
                { label: 'Earrings', action: () => handleCategoryNav('Earrings') },
                { label: 'Bracelets', action: () => handleCategoryNav('Bracelets') },
              ].map((item) =>
                item.to ? (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="block px-4 py-3 text-sm font-semibold uppercase tracking-widest text-charcoal-700 hover:text-gold-500 hover:bg-cream-100 rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-widest text-charcoal-700 hover:text-gold-500 hover:bg-cream-100 rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                )
              )}
              <div className="pt-3 border-t border-cream-200">
                <Link
                  to="/admin/login"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-gold-600 hover:bg-gold-100/60 rounded-lg transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Portal
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
