import React, { useState, useRef } from 'react';
import { ShoppingBag, Check, Sparkles, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const cardRef = useRef(null);

  /* ── 3D Tilt on mouse move ─────────────────────────────────── */
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.01)`;
    card.style.boxShadow = `${rotateY * -2}px ${rotateX * 2}px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(201,168,76,0.25)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    card.style.boxShadow = '';
    setIsHovered(false);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="relative bg-white overflow-hidden flex flex-col cursor-pointer group"
      style={{
        borderRadius: '10px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* ── Image ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-cream-100" style={{ aspectRatio: '1 / 1' }}>
        <img
          src={
            isHovered && product.secondary_image_url
              ? product.secondary_image_url
              : product.image_url
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-elegant group-hover:scale-[1.07]"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/65 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Badges */}
        {product.is_featured && !isOutOfStock && (
          <span className="badge-featured">
            <Sparkles className="w-2.5 h-2.5 inline mr-1" />
            Featured
          </span>
        )}
        {isOutOfStock && (
          <span className="badge-sold-out">Sold Out</span>
        )}
        {isLowStock && !isOutOfStock && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-amber-500/90 text-white rounded-sm">
            Only {product.stock} Left
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted(!wishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 shadow-sm opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 z-10 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-charcoal-700'
            }`}
          />
        </button>

        {/* Quick Add (slides up on hover) */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-elegant z-10 flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 font-sans text-[11px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
              added
                ? 'bg-gold-500 text-charcoal-900'
                : isOutOfStock
                ? 'bg-charcoal-400/70 text-white cursor-not-allowed'
                : 'bg-white text-charcoal-900 hover:bg-gold-500 hover:text-charcoal-900'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Added!
              </>
            ) : isOutOfStock ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Bag
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Product Info ───────────────────────────────────────── */}
      <div className="p-4 flex flex-col flex-grow space-y-2.5">
        {/* Category */}
        <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-500">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="font-display text-[15px] font-semibold text-charcoal-900 leading-snug group-hover:text-gold-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Materials */}
        {product.materials && (
          <p className="font-sans text-xs text-charcoal-400 font-light line-clamp-1">
            {product.materials}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-cream-200">
          <span className="price-tag text-lg">
            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
          {!isOutOfStock && (
            <span className="font-sans text-[10px] uppercase tracking-widest text-charcoal-400 font-medium">
              {isLowStock ? `${product.stock} left` : 'In Stock'}
            </span>
          )}
        </div>

        {/* Add to bag CTA (always visible) */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 mt-1 font-sans text-[11px] font-bold uppercase tracking-widest rounded-md transition-all duration-300 flex items-center justify-center gap-2 ${
            added
              ? 'bg-gold-500 text-charcoal-900'
              : isOutOfStock
              ? 'bg-cream-200 text-charcoal-400 cursor-not-allowed'
              : 'bg-charcoal-900 text-white hover:bg-gold-500 hover:text-charcoal-900'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Added to Bag!
            </>
          ) : isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </>
          )}
        </button>
      </div>
    </div>
  );
}
