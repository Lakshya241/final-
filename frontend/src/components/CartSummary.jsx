import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Truck, ArrowRight } from 'lucide-react';

export default function CartSummary({ subtotal, itemCount }) {
  const shipping = subtotal > 0 ? 0 : 0; // Complimentary express shipping
  const total = subtotal + shipping;

  return (
    <div className="bg-white border border-cream-300 p-8 rounded-sm space-y-6 sticky top-28">
      <h3 className="font-serif text-2xl text-charcoal-950 font-normal border-b border-cream-200 pb-4">
        Order Summary
      </h3>

      <div className="space-y-3 font-sans text-xs uppercase tracking-wider text-charcoal-800">
        <div className="flex justify-between">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-serif text-base text-charcoal-950 font-normal">
            ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between text-gold-600 font-semibold">
          <span>Insured Shipping</span>
          <span>COMPLIMENTARY</span>
        </div>

        <div className="border-t border-cream-200 pt-4 flex justify-between text-sm font-semibold text-charcoal-950">
          <span className="tracking-[0.2em]">Total</span>
          <span className="font-serif text-2xl text-charcoal-950 font-normal">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="w-full py-4 bg-charcoal-950 hover:bg-gold-600 text-cream-50 hover:text-charcoal-950 font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg group"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>

      <div className="pt-4 border-t border-cream-200 space-y-3 font-sans text-[11px] text-charcoal-800">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-gold-600" />
          <span>Authenticity Certificate Included</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-gold-600" />
          <span>Discreet & Insured Delivery</span>
        </div>
      </div>
    </div>
  );
}
