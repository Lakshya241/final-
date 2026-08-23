import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity } = item;
  const itemTotal = product.price * quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white rounded-2xl border border-cream-200 shadow-card hover:border-gold-200 hover:shadow-card-hover transition-all duration-300">

      {/* Image */}
      <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl bg-cream-100 border border-cream-200">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-500">
          {product.category}
        </p>
        <h4 className="font-display text-base font-semibold text-charcoal-900 line-clamp-1">
          {product.name}
        </h4>
        {product.materials && (
          <p className="font-sans text-xs text-charcoal-400 font-light line-clamp-1">
            {product.materials}
          </p>
        )}
        <p className="font-display text-sm font-semibold text-charcoal-800">
          ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })} each
        </p>
      </div>

      {/* Quantity + Total + Remove */}
      <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">

        {/* Qty stepper */}
        <div className="flex items-center gap-1 bg-cream-100 rounded-full p-1">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-charcoal-700 hover:text-gold-600 transition-colors"
            aria-label="Decrease"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-sans text-sm font-bold text-charcoal-900 w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={product.stock && quantity >= product.stock}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-charcoal-700 hover:text-gold-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Line total */}
        <p className="font-display text-lg font-bold text-charcoal-900 min-w-[80px] text-right">
          ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>

        {/* Remove */}
        <button
          onClick={() => onRemove(product.id)}
          className="p-2 rounded-lg text-charcoal-300 hover:text-red-500 hover:bg-red-50 transition-all"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
