import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Star } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) return <Navigate to="/" replace />;

  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="bg-warm-white min-h-screen py-16 px-5 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">

        {/* ── Confirmation Header ────────────────────────────────── */}
        <div className="text-center space-y-4 animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gold-500/15 border border-gold-300/30 flex items-center justify-center animate-pulse-gold">
            <CheckCircle2 className="w-10 h-10 text-gold-500" />
          </div>
          <div>
            <p className="section-label justify-center mb-2">Order Confirmed</p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal-900">
              Thank You!
            </h1>
            <p className="font-sans text-sm text-charcoal-400 font-light mt-3 max-w-md mx-auto leading-relaxed">
              Your order has been placed successfully. Our concierge team will be in touch within 24 hours to arrange secure delivery.
            </p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
            ))}
          </div>
        </div>

        {/* ── Order Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-card overflow-hidden animate-scale-in animate-delay-200">

          {/* Order meta bar */}
          <div className="bg-charcoal-900 px-6 py-5 grid grid-cols-3 gap-4 text-center text-white">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal-300 mb-1">Order Ref</p>
              <p className="font-display text-sm font-bold text-gold-400">
                {order.order_number || `#${order.id}`}
              </p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal-300 mb-1">Date</p>
              <p className="font-sans text-sm font-semibold">{formattedDate}</p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal-300 mb-1">Total</p>
              <p className="font-display text-lg font-bold text-gold-400">
                ₹{Number(order.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-7">

            {/* Customer + Shipping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-cream-100 rounded-xl space-y-1.5">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-charcoal-400">Client</p>
                <p className="font-display text-sm font-bold text-charcoal-900">{order.customer_name}</p>
                <p className="font-sans text-xs text-charcoal-500">{order.customer_email}</p>
                <p className="font-sans text-xs text-charcoal-500">{order.customer_phone}</p>
              </div>
              <div className="p-4 bg-cream-100 rounded-xl space-y-1.5">
                <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-charcoal-400">Ship To</p>
                <p className="font-sans text-xs text-charcoal-700 leading-relaxed">
                  {order.shipping_address}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="font-display text-lg font-bold text-charcoal-900 mb-4">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-cream-50 border border-cream-200">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.product_name}
                        className="w-14 h-14 object-cover rounded-lg border border-cream-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-charcoal-900 line-clamp-1">
                        {item.product_name}
                      </p>
                      <p className="font-sans text-xs text-charcoal-400">
                        Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <p className="font-display text-base font-bold text-charcoal-900 shrink-0">
                      ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping note */}
            <div className="flex items-start gap-3 p-4 bg-gold-100/60 border border-gold-200 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <p className="font-sans text-xs text-charcoal-700 leading-relaxed">
                A dispatch confirmation with insured tracking details will be sent to{' '}
                <strong className="text-charcoal-900">{order.customer_email}</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-in-up animate-delay-400">
          <Link to="/" className="btn-gold inline-flex gap-2">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
