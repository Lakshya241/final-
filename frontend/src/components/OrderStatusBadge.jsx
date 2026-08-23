import React from 'react';

export default function OrderStatusBadge({ status }) {
  const styles = {
    Pending: 'bg-amber-100 text-amber-900 border-amber-300',
    Processing: 'bg-blue-100 text-blue-900 border-blue-300',
    Shipped: 'bg-purple-100 text-purple-900 border-purple-300',
    Delivered: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    Cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
  };

  const badgeStyle = styles[status] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <span
      className={`px-3 py-1 text-[11px] font-sans font-medium uppercase tracking-wider rounded-full border inline-block ${badgeStyle}`}
    >
      {status}
    </span>
  );
}
