import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Twitter, Facebook, Youtube, ArrowRight } from 'lucide-react';

const LINKS = {
  Collections: [
    { label: 'Solitaire Rings', to: '/#collection' },
    { label: 'High Necklaces', to: '/#collection' },
    { label: 'Diamond Earrings', to: '/#collection' },
    { label: 'Sculpted Cuffs', to: '/#collection' },
    { label: 'Rose Gold', to: '/#collection' },
  ],
  Services: [
    { label: 'Bespoke Consultations', to: '/' },
    { label: 'Care & Cleaning', to: '/' },
    { label: 'Insured Shipping', to: '/' },
    { label: 'Returns & Exchange', to: '/' },
    { label: 'GIA Certification', to: '/' },
  ],
  Company: [
    { label: 'Our Story', to: '/' },
    { label: 'Sustainability', to: '/' },
    { label: 'Press', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Admin Portal', to: '/admin/login' },
  ],
};

const SOCIALS = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Facebook, label: 'Facebook' },
  { icon: Youtube, label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #1C1C1E 0%, #111113 100%)' }} className="text-cream-100">

      {/* Top CTA Strip */}
      <div className="border-b border-charcoal-700">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="section-label text-gold-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Private Gazette
            </p>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
              Join the Inner Circle
            </h3>
            <p className="font-sans text-sm text-charcoal-300 font-light mt-2">
              Exclusive invitations to capsule launches and private salon viewings.
            </p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-charcoal-800 border border-charcoal-700 focus:border-gold-500 rounded-lg font-sans text-sm text-white placeholder-charcoal-400 outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-gold-gradient text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest rounded-lg hover:shadow-gold transition-all duration-200 whitespace-nowrap flex items-center gap-1.5"
            >
              Subscribe <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="col-span-2 space-y-5">
          <Link to="/" className="inline-block group">
            <span className="font-display text-3xl font-bold tracking-[0.2em] text-white group-hover:text-gold-400 transition-colors">
              AURA
            </span>
            <span className="block font-sans text-[9px] font-bold uppercase tracking-[0.4em] text-gold-500 mt-0.5">
              Haute Joaillerie
            </span>
          </Link>
          <p className="font-sans text-sm text-charcoal-300 font-light leading-relaxed max-w-xs">
            Architectural high jewellery handcrafted with 18k solid gold and ethically sourced
            brilliant gemstones. Designed in Geneva, worn worldwide.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                aria-label={label}
                className="w-9 h-9 rounded-lg bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-charcoal-300 hover:text-gold-400 hover:border-gold-500/50 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {Object.entries(LINKS).map(([heading, items]) => (
          <div key={heading} className="space-y-4">
            <h5 className="font-display text-sm font-semibold text-gold-400 tracking-wide">
              {heading}
            </h5>
            <ul className="space-y-2.5">
              {items.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-sans text-xs text-charcoal-300 hover:text-gold-400 transition-colors font-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-700">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-charcoal-400 font-light">
            © 2026 AURA Haute Joaillerie. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Authenticity'].map((item) => (
              <button
                key={item}
                className="font-sans text-[11px] text-charcoal-400 hover:text-gold-400 transition-colors uppercase tracking-widest font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
