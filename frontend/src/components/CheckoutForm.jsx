import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';

export default function CheckoutForm() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customer_name.trim()) errors.customer_name = 'Full name is required';
    if (!formData.customer_email.trim() || !/\S+@\S+\.\S+/.test(formData.customer_email)) {
      errors.customer_email = 'Valid email address is required';
    }
    if (!formData.customer_phone.trim()) errors.customer_phone = 'Phone number is required';
    if (!formData.shipping_address.trim()) errors.shipping_address = 'Shipping address is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    if (!cart || cart.length === 0) {
      setError('Your shopping bag is empty.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        shipping_address: formData.shipping_address,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const createdOrder = await createOrder(payload);
      clearCart();

      // Navigate to Order Success screen with state
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err) {
      console.error('Checkout failed:', err);
      setError(
        err.response?.data?.message || 'Failed to place order. Please verify your information and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-800 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="font-serif text-xl text-charcoal-950 border-b border-cream-200 pb-2">
          Contact Details
        </h4>

        {/* Customer Name */}
        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-charcoal-800 mb-1.5 font-medium">
            Full Name *
          </label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="e.g. Eleanor Vance"
            className={`w-full px-4 py-3 bg-white border ${
              fieldErrors.customer_name ? 'border-red-500' : 'border-cream-300 focus:border-gold-500'
            } rounded-sm font-sans text-sm focus:outline-none transition-colors`}
          />
          {fieldErrors.customer_name && (
            <p className="text-red-600 text-[11px] mt-1">{fieldErrors.customer_name}</p>
          )}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-charcoal-800 mb-1.5 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              name="customer_email"
              value={formData.customer_email}
              onChange={handleChange}
              placeholder="eleanor@example.com"
              className={`w-full px-4 py-3 bg-white border ${
                fieldErrors.customer_email ? 'border-red-500' : 'border-cream-300 focus:border-gold-500'
              } rounded-sm font-sans text-sm focus:outline-none transition-colors`}
            />
            {fieldErrors.customer_email && (
              <p className="text-red-600 text-[11px] mt-1">{fieldErrors.customer_email}</p>
            )}
          </div>

          <div>
            <label className="block font-sans text-xs uppercase tracking-wider text-charcoal-800 mb-1.5 font-medium">
              Phone Number *
            </label>
            <input
              type="tel"
              name="customer_phone"
              value={formData.customer_phone}
              onChange={handleChange}
              placeholder="+1 (555) 019-2834"
              className={`w-full px-4 py-3 bg-white border ${
                fieldErrors.customer_phone ? 'border-red-500' : 'border-cream-300 focus:border-gold-500'
              } rounded-sm font-sans text-sm focus:outline-none transition-colors`}
            />
            {fieldErrors.customer_phone && (
              <p className="text-red-600 text-[11px] mt-1">{fieldErrors.customer_phone}</p>
            )}
          </div>
        </div>

        <h4 className="font-serif text-xl text-charcoal-950 border-b border-cream-200 pb-2 pt-4">
          Shipping Address
        </h4>

        <div>
          <label className="block font-sans text-xs uppercase tracking-wider text-charcoal-800 mb-1.5 font-medium">
            Complete Delivery Address *
          </label>
          <textarea
            name="shipping_address"
            rows="3"
            value={formData.shipping_address}
            onChange={handleChange}
            placeholder="Street Address, Apartment/Suite, City, State, ZIP Code, Country"
            className={`w-full px-4 py-3 bg-white border ${
              fieldErrors.shipping_address ? 'border-red-500' : 'border-cream-300 focus:border-gold-500'
            } rounded-sm font-sans text-sm focus:outline-none transition-colors`}
          />
          {fieldErrors.shipping_address && (
            <p className="text-red-600 text-[11px] mt-1">{fieldErrors.shipping_address}</p>
          )}
        </div>
      </div>

      <div className="p-4 bg-cream-50 border border-cream-300 rounded-sm text-xs text-charcoal-800 flex items-center gap-3">
        <Lock className="w-4 h-4 text-gold-600 flex-shrink-0" />
        <span>Assessment Mode: Payment simulation enabled. No real charges will occur.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-charcoal-950 hover:bg-gold-600 text-cream-50 hover:text-charcoal-950 font-sans text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Order...</span>
          </>
        ) : (
            <span>Place Order (₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
        )}
      </button>
    </form>
  );
}
