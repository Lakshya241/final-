import React from 'react';
import ProductCard from './ProductCard';
import { Gem } from 'lucide-react';

export default function ProductGrid({ products, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden border border-cream-200 shadow-card">
            <div className="skeleton" style={{ aspectRatio: '1/1' }} />
            <div className="p-4 space-y-2.5">
              <div className="skeleton h-2.5 w-1/3 rounded-full" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-9 w-full rounded-lg mt-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-2xl border border-red-100 shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <Gem className="w-7 h-7 text-red-400" />
        </div>
        <p className="font-display text-xl font-bold text-red-600">Connection Error</p>
        <p className="font-sans text-sm text-charcoal-400 mt-2 font-light">{error}</p>
        <p className="font-sans text-xs text-charcoal-300 mt-1">
          Make sure the Laravel backend is running on port 8000.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-2xl border border-cream-200 shadow-card">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
          <Gem className="w-7 h-7 text-charcoal-300" />
        </div>
        <p className="font-display text-2xl font-bold text-charcoal-900">No Pieces Found</p>
        <p className="font-sans text-sm text-charcoal-400 font-light mt-2">
          There are no products in this category yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
      {products.map((product, i) => (
        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
