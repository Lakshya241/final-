import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2, Package, CreditCard, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

const STEPS = [
  { id: 1, label: 'Contact', icon: User },
  { id: 2, label: 'Shipping', icon: Package },
  { id: 3, label: 'Review', icon: CreditCard },
];

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address_line: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  if (!cart || cart.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const shipping_address = `${formData.address_line}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };
      const order = await createOrder(orderPayload);
      clearCart();
      navigate('/order-success', { state: { order } });
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Complete =
    formData.customer_name && formData.customer_email && formData.customer_phone;
  const isStep2Complete =
    formData.address_line && formData.city && formData.state && formData.zip;

  return (
    <div className="bg-warm-white min-h-screen">
      <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12 space-y-8">

        {/* ── Back ──────────────────────────────────────────────── */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-charcoal-400 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Bag
        </Link>

        {/* ── Title ─────────────────────────────────────────────── */}
        <div className="pb-4 border-b border-cream-200">
          <h1 className="font-display text-4xl font-bold text-charcoal-900">Checkout</h1>
          <p className="font-sans text-xs text-charcoal-400 uppercase tracking-widest font-medium mt-1">
            Secure, insured delivery worldwide
          </p>
        </div>

        {/* ── Step Indicator ────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {STEPS.map(({ id, label, icon: Icon }, idx) => (
            <React.Fragment key={id}>
              <button
                onClick={() => {
                  if (id < step || (id === 2 && isStep1Complete) || (id === 3 && isStep1Complete && isStep2Complete)) {
                    setStep(id);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  step === id
                    ? 'bg-charcoal-900 text-white shadow-card'
                    : step > id
                    ? 'bg-gold-500/20 text-gold-700 cursor-pointer hover:bg-gold-500/30'
                    : 'bg-cream-100 text-charcoal-400 cursor-not-allowed'
                }`}
              >
                {step > id ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:block">{label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${step > idx + 1 ? 'bg-gold-500/50' : 'bg-cream-300'} transition-colors duration-300`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* ── Form Panel ────────────────────────────────────────── */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-cream-200 shadow-card p-6 sm:p-8">

            {/* Step 1: Contact */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="font-display text-xl font-bold text-charcoal-900">Contact Details</h2>
                <div className="space-y-4">
                  <InputField label="Full Name" name="customer_name" value={formData.customer_name} onChange={handleChange} placeholder="Jane Smith" required />
                  <InputField label="Email Address" name="customer_email" type="email" value={formData.customer_email} onChange={handleChange} placeholder="jane@example.com" required />
                  <InputField label="Phone Number" name="customer_phone" type="tel" value={formData.customer_phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required />
                </div>
                <button
                  onClick={() => isStep1Complete && setStep(2)}
                  disabled={!isStep1Complete}
                  className="btn-gold w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="font-display text-xl font-bold text-charcoal-900">Shipping Address</h2>
                <div className="space-y-4">
                  <InputField label="Street Address" name="address_line" value={formData.address_line} onChange={handleChange} placeholder="123 Luxury Avenue" required />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" name="city" value={formData.city} onChange={handleChange} placeholder="New York" required />
                    <InputField label="State / Province" name="state" value={formData.state} onChange={handleChange} placeholder="NY" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleChange} placeholder="10001" required />
                    <div className="space-y-1.5">
                      <label className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal-500">Country</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {['United States', 'United Kingdom', 'Canada', 'Australia', 'France', 'Germany', 'India', 'Japan', 'Singapore', 'UAE'].map(c => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-outline-gold flex-1">Back</button>
                  <button
                    onClick={() => isStep2Complete && setStep(3)}
                    disabled={!isStep2Complete}
                    className="btn-gold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review & Place */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in-up">
                <h2 className="font-display text-xl font-bold text-charcoal-900">Review Your Order</h2>

                {/* Summary rows */}
                <div className="space-y-4 p-5 bg-cream-100 rounded-xl border border-cream-200">
                  <ReviewRow label="Name" value={formData.customer_name} />
                  <ReviewRow label="Email" value={formData.customer_email} />
                  <ReviewRow label="Phone" value={formData.customer_phone} />
                  <ReviewRow label="Ship To" value={shipping_address} />
                </div>

                {/* Payment notice */}
                <div className="flex items-start gap-3 p-4 bg-gold-100/50 border border-gold-200 rounded-xl">
                  <CreditCard className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-charcoal-900">Secure Payment</p>
                    <p className="font-sans text-xs text-charcoal-500 font-light mt-0.5">
                      Our concierge team will contact you within 24 hours to arrange secure payment and confirm your bespoke order.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-outline-gold flex-1">Back</button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="btn-gold flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-charcoal-900/30 border-t-charcoal-900 rounded-full animate-spin" />
                    ) : (
                      'Place Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order Summary Sidebar ─────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-cream-200 shadow-card p-6 space-y-5 sticky top-28">
              <h3 className="font-display text-lg font-bold text-charcoal-900 pb-3 border-b border-cream-200">
                Your Items ({cart.length})
              </h3>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg border border-cream-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-sm font-semibold text-charcoal-900 line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="font-sans text-xs text-charcoal-400 font-light">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display text-sm font-semibold text-charcoal-900 shrink-0">
                      ${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-cream-200 pt-4 space-y-2 font-sans text-sm">
                <div className="flex justify-between text-charcoal-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gold-600 text-xs font-semibold">
                  <span>Shipping & Insurance</span>
                  <span>COMPLIMENTARY</span>
                </div>
                <div className="flex justify-between font-bold text-charcoal-900 text-base pt-2 border-t border-cream-200">
                  <span>Total</span>
                  <span className="font-display text-xl">
                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 font-sans text-xs text-charcoal-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
                SSL secured & fully insured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */
function InputField({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block font-sans text-[11px] font-semibold uppercase tracking-widest text-charcoal-500">
        {label} {required && <span className="text-gold-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="input-field"
        autoComplete={name}
      />
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex gap-4">
      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-charcoal-400 w-16 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-sans text-sm text-charcoal-900">{value}</span>
    </div>
  );
}
