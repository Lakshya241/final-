import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';
import ThreeDHero from '../three/ThreeDHero';

export default function Hero({ onExploreClick }) {
  const textRef = useRef(null);

  useEffect(() => {
    // Stagger reveal on mount
    const children = textRef.current?.querySelectorAll('.hero-reveal');
    children?.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, i * 140);
    });
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-106px)] flex items-center overflow-hidden">
      {/* ── Background ─────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-cream-gradient" />

      {/* Decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #C9A84C 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Decorative blurred orbs */}
      <div className="absolute top-1/4 left-[5%] w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8C96A, transparent)' }} />
      <div className="absolute bottom-1/4 right-[8%] w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B76E79, transparent)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 py-16 lg:py-24 items-center">

        {/* ── Left: Copy ──────────────────────────────────────── */}
        <div ref={textRef} className="space-y-7 text-center lg:text-left">

          {/* Rating pill */}
          <div className="hero-reveal reveal flex items-center gap-3 justify-center lg:justify-start">
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full glass-gold">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <span className="font-sans text-[11px] font-semibold text-gold-700 tracking-wide">
                5M+ Happy Customers
              </span>
            </div>
          </div>

          {/* Main headline */}
          <div className="hero-reveal reveal space-y-2">
            <p className="section-label justify-center lg:justify-start">
              <Sparkles className="w-3.5 h-3.5" />
              2026 High Jewellery Edition
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] text-charcoal-900 leading-[1.08] tracking-tight">
              Timeless{' '}
              <span className="text-gold-gradient italic">Elegance,</span>
              <br />
              <span className="font-light">Sculpted in</span>
              <br />
              Gold{' '}
              <span className="text-gold-gradient">&</span>{' '}
              Light.
            </h1>
          </div>

          {/* Subtext */}
          <p className="hero-reveal reveal font-sans text-charcoal-600 text-base lg:text-lg font-light leading-relaxed max-w-lg mx-auto lg:mx-0">
            Discover hand-crafted masterpieces created with ethically sourced
            gemstones, 18k solid champagne gold, and precision artistry
            designed to transcend generations.
          </p>

          {/* CTAs */}
          <div className="hero-reveal reveal flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <button
              onClick={onExploreClick}
              className="btn-gold w-full sm:w-auto"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreClick}
              className="btn-outline-gold w-full sm:w-auto"
            >
              Shop Now
            </button>
          </div>

          {/* Trust stats */}
          <div className="hero-reveal reveal pt-4 border-t border-cream-300 grid grid-cols-3 gap-4">
            {[
              { value: '18K', label: 'Solid Gold' },
              { value: 'VVS1', label: 'Certified' },
              { value: '∞', label: 'Warranty' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <p className="font-display text-2xl font-bold text-charcoal-900">{value}</p>
                <p className="font-sans text-[10px] uppercase tracking-widest text-charcoal-500 mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 3D Canvas ────────────────────────────────── */}
        <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[560px] animate-scale-in animate-delay-300">
          {/* Glow backdrop behind the 3D scene */}
          <div className="absolute inset-12 rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, #E8C96A 30%, transparent 80%)' }} />

          <ThreeDHero />

          {/* Floating badge overlays */}
          <div className="absolute bottom-8 left-4 glass px-4 py-3 rounded-xl shadow-card animate-float-slow hidden sm:block">
            <p className="font-sans text-[10px] uppercase tracking-widest text-gold-700 font-semibold">
              Ethically Sourced
            </p>
            <p className="font-display text-sm font-bold text-charcoal-900 mt-0.5">
              Conflict-Free Gems
            </p>
          </div>
          <div className="absolute top-10 right-4 glass px-4 py-3 rounded-xl shadow-card animate-float-medium hidden sm:block">
            <p className="font-sans text-[10px] uppercase tracking-widest text-gold-700 font-semibold">
              Certified
            </p>
            <p className="font-display text-sm font-bold text-charcoal-900 mt-0.5">
              GIA Graded
            </p>
          </div>
        </div>
      </div>

      {/* Bottom scroll cue */}
      <button
        onClick={onExploreClick}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity group"
        aria-label="Scroll to collection"
      >
        <span className="font-sans text-[9px] uppercase tracking-widest text-charcoal-500 font-semibold">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border-2 border-charcoal-400 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-charcoal-400 animate-bounce" />
        </div>
      </button>
    </section>
  );
}
