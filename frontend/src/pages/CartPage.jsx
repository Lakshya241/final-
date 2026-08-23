import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 py-20 text-center space-y-6 bg-warm-white">
        <div className="w-20 h-20 rounded-2xl bg-cream-200 flex items-center justify-center">
          <ShoppingBag className="w-9 h-9 text-charcoal-400" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-charcoal-900">
            Your Bag is Empty
          </h2>
          <p className="font-sans text-sm text-charcoal-400 font-light mt-2 max-w-md mx-auto">
            Explore our haute collection and find the perfect piece to add to your bag.
          </p>
        </div>
        <Link to="/" className="btn-dark inline-flex gap-2">
          <ArrowLeft className="w-4 h-4" />
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-warm-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 space-y-8">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
          <div>
            <h1 className="font-display text-4xl font-bold text-charcoal-900">Shopping Bag</h1>
            <p className="font-sans text-xs text-charcoal-400 uppercase tracking-widest mt-1 font-medium">
              {itemCount} {itemCount === 1 ? 'piece' : 'pieces'} selected
            </p>
          </div>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-charcoal-400 hover:text-red-600 transition-colors font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Clear Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Cart Items ───────────────────────────────────────── */}
          <div className="lg:col-span-8 space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Back link */}
            <div className="pt-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-500 hover:text-gold-500 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* ── Order Summary ────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-cream-200 shadow-card p-6 space-y-5 sticky top-28">

              <h3 className="font-display text-xl font-bold text-charcoal-900 pb-3 border-b border-cream-200">
                Order Summary
              </h3>

              <div className="space-y-3 font-sans text-sm">
                <div className="flex justify-between text-charcoal-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-charcoal-900">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gold-600">
                  <span>Express Shipping</span>
                  <span className="font-semibold uppercase text-xs tracking-wider">Complimentary</span>
                </div>
                <div className="flex justify-between text-gold-600">
                  <span>Insurance</span>
                  <span className="font-semibold uppercase text-xs tracking-wider">Included</span>
                </div>
              </div>

              <div className="border-t border-cream-200 pt-4 flex justify-between items-center">
                <span className="font-sans text-sm font-bold uppercase tracking-wider text-charcoal-900">
                  Total
                </span>
                <span className="font-display text-2xl font-bold text-charcoal-900">
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <Link
                to="/checkout"
                className="btn-gold w-full flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Trust badges */}
              <div className="flex flex-col gap-2 pt-1">
                {[
                  { icon: Shield, text: 'Fully insured delivery' },
                  { icon: Sparkles, text: 'GIA certificate included' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 font-sans text-xs text-charcoal-400">
                    <Icon className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
