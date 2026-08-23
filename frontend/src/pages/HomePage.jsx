import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ArrowRight, Shield, Award, Gem, Star, Zap } from 'lucide-react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';

/* ── Category banner images ─────────────────────────────────────────────── */
const CATEGORY_BANNERS = [
  {
    label: 'Rings',
    subtitle: 'Solitaire & Band',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    bg: 'from-amber-100 to-yellow-50',
  },
  {
    label: 'Necklaces',
    subtitle: 'Pendant & Chain',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    bg: 'from-rose-100 to-pink-50',
  },
  {
    label: 'Earrings',
    subtitle: 'Halo & Drop',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    bg: 'from-emerald-100 to-teal-50',
  },
  {
    label: 'Bracelets',
    subtitle: 'Tennis & Cuff',
    image: 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=600&q=80',
    bg: 'from-purple-100 to-indigo-50',
  },
];

/* ── Rose Gold Collection tiles ─────────────────────────────────────────── */
const ROSE_GOLD_TILES = [
  { label: 'Rose Gold Rings', image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=500&q=80' },
  { label: 'Rose Gold Necklaces', image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=500&q=80' },
  { label: 'Rose Gold Earrings', image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=500&q=80' },
  { label: 'Rose Gold Bracelets', image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=500&q=80' },
];

/* ── Celebrity quotes ───────────────────────────────────────────────────── */
const CELEB_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80', name: 'Atelier Paris', tag: 'Exclusive Partner' },
  { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80', name: 'Vogue Feature', tag: 'As Seen In' },
  { src: 'https://images.unsplash.com/photo-1558171813-0c7e7565bef8?auto=format&fit=crop&w=400&q=80', name: 'Luxury Gala 2026', tag: 'Red Carpet' },
  { src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80', name: 'Global Exhibition', tag: 'World Tour' },
];

/* ── Static fallback products (shown when API is offline / loading) ────────── */
const FALLBACK_PRODUCTS = [
  {
    id: 'f1',
    name: 'Aura Solitaire Diamond Ring',
    category: 'Rings',
    price: 2850,
    image_url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=600&q=80',
    materials: '18k Champagne Gold, 1.8ct VVS1 Diamond',
    stock: 8,
    is_featured: true,
  },
  {
    id: 'f2',
    name: 'Celestial Pavé Diamond Necklace',
    category: 'Necklaces',
    price: 4600,
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
    materials: '18k Solid Yellow Gold, 2.4ct Pavé Diamonds',
    stock: 5,
    is_featured: true,
  },
  {
    id: 'f3',
    name: 'Étoile Emerald & Diamond Earrings',
    category: 'Earrings',
    price: 3200,
    image_url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
    materials: '950 Platinum, Natural Emeralds, Diamonds',
    stock: 6,
    is_featured: true,
  },
  {
    id: 'f4',
    name: 'Solstice Tennis Diamond Bracelet',
    category: 'Bracelets',
    price: 5200,
    image_url: 'https://images.unsplash.com/photo-1611591475179-42cd34264d64?auto=format&fit=crop&w=600&q=80',
    secondary_image_url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=600&q=80',
    materials: '950 Platinum, 5.0ct VS Diamonds',
    stock: 4,
    is_featured: true,
  },
];

/* ── Budget price points ─────────────────────────────────────────────────── */
const BUDGET_RANGES = [
  { label: 'Under $1,500', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80' },
  { label: '$1,500 – $3,000', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=400&q=80' },
  { label: '$3,000 – $5,000', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80' },
  { label: '$5,000 & Above', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80' },
];

/* ── Scroll-reveal hook ─────────────────────────────────────────────────── */
/* Observes ALL .reveal elements, including those added after first render.   */
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target); // stop watching once revealed
        }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach((el) => io.observe(el));
    };

    // observe immediately existing elements
    observe();

    // re-observe whenever new nodes are added to the DOM (handles async renders)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
}

/* ── Section Header ─────────────────────────────────────────────────────── */
function SectionHeader({ tag, title, subtitle, light = false }) {
  return (
    <div className={`text-center space-y-3 max-w-2xl mx-auto reveal ${light ? 'text-white' : ''}`}>
      {tag && (
        <p className={`section-label justify-center ${light ? 'text-gold-300' : ''}`}>
          <Sparkles className="w-3.5 h-3.5" />
          {tag}
        </p>
      )}
      <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight ${light ? 'text-white' : 'text-charcoal-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`font-sans text-sm font-light leading-relaxed ${light ? 'text-cream-300' : 'text-charcoal-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const collectionRef = useRef(null);

  useScrollReveal();

  const fetchProducts = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(cat);
      setProducts(data);
    } catch {
      setError('Unable to load the collection from the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(selectedCategory); }, [selectedCategory, fetchProducts]);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /* featured / new / bestsellers — fall back to static cards when API is unavailable */
  const featuredProducts = products.filter((p) => p.is_featured);
  const newArrivals = products.length > 0 ? products.slice(0, 4) : FALLBACK_PRODUCTS;
  const bestsellers  = products.length > 0 ? products.filter((p) => p.is_featured).slice(0, 4) : FALLBACK_PRODUCTS;

  return (
    <div className="bg-warm-white">

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <Hero onExploreClick={scrollToCollection} />

      {/* ══ 2. FEATURE BAR ════════════════════════════════════════════════ */}
      <section className="bg-charcoal-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Gem, title: 'Ethically Sourced', sub: '100% conflict-free gemstones' },
            { icon: Award, title: 'Atelier Craft', sub: '200+ hours per piece' },
            { icon: Shield, title: 'GIA Certified', sub: 'Lifetime authenticity guarantee' },
            { icon: Zap, title: 'Free Shipping', sub: 'Insured express worldwide' },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="space-y-2 reveal">
              <div className="w-11 h-11 mx-auto rounded-full bg-gold-500/15 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gold-400" />
              </div>
              <p className="font-display text-[15px] font-semibold">{title}</p>
              <p className="font-sans text-xs text-cream-300 font-light">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 3. SHOP BY CATEGORY ═══════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          tag="Shop by Category"
          title="Find Your Perfect Piece"
          subtitle="Browse our curated collections handcrafted with the finest materials."
        />

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORY_BANNERS.map(({ label, subtitle, image, bg }, i) => (
            <button
              key={label}
              onClick={() => {
                setSelectedCategory(label);
                scrollToCollection();
              }}
              className="category-banner reveal text-left"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
                <img
                  src={image}
                  alt={label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/75 via-charcoal-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                  <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold-300 mb-0.5">
                    {subtitle}
                  </p>
                  <p className="font-display text-xl font-bold text-white">{label}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ 4. ROSE GOLD COLLECTION ════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8" style={{ background: 'linear-gradient(135deg, #F5EFE3 0%, #EFE5D3 50%, #F9EEE8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Rose Gold Collection"
            title={<>Warm. Radiant. <span className="text-rose-gradient">Feminine.</span></>}
            subtitle="Our rose gold line blends warm hues with precision craftsmanship for a look that's effortlessly sophisticated."
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-5">
            {ROSE_GOLD_TILES.map(({ label, image }, i) => (
              <button
                key={label}
                onClick={scrollToCollection}
                className="group relative overflow-hidden rounded-xl reveal"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1.2' }}>
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-0 right-0 text-center px-2">
                    <p className="font-display text-sm font-bold text-white leading-tight">{label}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. NEW ARRIVALS ════════════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8 max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div className="text-center sm:text-left space-y-2 max-w-xl">
            <p className="section-label">
              <Sparkles className="w-3.5 h-3.5" />
              New Arrivals
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-charcoal-900">
              Just Landed
            </h2>
            <p className="font-sans text-sm font-light text-charcoal-500 leading-relaxed">
              Fresh from the atelier — the latest additions to our haute collection.
            </p>
          </div>
          <button
            onClick={scrollToCollection}
            className="hidden sm:flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gold-600 hover:text-gold-500 transition-colors shrink-0 mb-1"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {newArrivals.map((p, i) => (
            <div
              key={p.id}
              style={{
                opacity: 1,
                animation: `fadeInUp 0.6s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 100}ms both`,
              }}
            >
              <ProductCardCompact product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ 6. YOUR BUDGET, YOUR BLING ════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8 bg-cream-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="Shop by Budget"
            title="Your Budget, Your Bling"
            subtitle="Luxury within reach — find the perfect piece at every price point."
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {BUDGET_RANGES.map(({ label, image }, i) => (
              <button
                key={label}
                onClick={scrollToCollection}
                className="group relative overflow-hidden rounded-xl reveal shadow-card hover:shadow-card-hover transition-all duration-400"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="glass px-3 py-2 rounded-lg text-center">
                      <p className="font-display text-sm font-bold text-charcoal-900">{label}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. FULL COLLECTION (with filter) ══════════════════════════════ */}
      <section ref={collectionRef} id="collection" className="py-20 px-5 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          tag="Bestsellers"
          title="The Haute Collection"
          subtitle="Filter our curated catalogue by category to discover every masterpiece."
        />

        <div className="mt-8">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="mt-10">
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </section>

      {/* ══ 8. AS SEEN ON ═════════════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            tag="As Seen On"
            title={<>Glamour meets grace —<br /><span className="italic font-light text-gold-gradient">worn by the stars.</span></>}
            light
          />

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {CELEB_IMAGES.map(({ src, name, tag }, i) => (
              <div key={name} className="reveal group" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={src}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="font-sans text-[10px] uppercase tracking-widest text-gold-400 font-semibold">{tag}</p>
                    <p className="font-display text-sm font-bold text-white mt-0.5">{name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-16 max-w-3xl mx-auto text-center reveal">
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
              ))}
            </div>
            <blockquote className="font-display text-2xl sm:text-3xl font-light italic text-cream-100 leading-relaxed">
              "Jewellery is emotion sculpted into tangible light."
            </blockquote>
            <p className="font-sans text-xs uppercase tracking-widest text-gold-400 mt-5 font-semibold">
              — AURA Design Manifesto
            </p>
          </div>
        </div>
      </section>

      {/* ══ 9. BRAND STORY ════════════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image grid */}
          <div className="grid grid-cols-2 gap-3 reveal">
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80"
                  alt="Atelier crafting"
                  className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80"
                  alt="Gold jewellery"
                  className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="space-y-3 mt-8">
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=500&q=80"
                  alt="Diamond ring"
                  className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=500&q=80"
                  alt="Emerald earrings"
                  className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="space-y-7 reveal">
            <p className="section-label">Our Story</p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-900 leading-tight">
              Sparkle That <br />
              <span className="text-gold-gradient">Stays With You</span>
            </h2>
            <p className="font-sans text-charcoal-600 leading-relaxed text-sm lg:text-base">
              AURA is a leading haute joaillerie house, offering over 10,000 unique designs crafted
              with elegance and quality. With 95% in-house manufacturing and a dedication to sustainable
              practices, every piece reflects our commitment to excellence.
            </p>

            <div className="grid grid-cols-2 gap-5">
              {[
                { value: '35+', label: 'Years of Craft' },
                { value: '5M+', label: 'Happy Customers' },
                { value: '10K+', label: 'Unique Designs' },
                { value: '100%', label: 'Conflict-Free' },
              ].map(({ value, label }) => (
                <div key={label} className="p-4 bg-cream-100 rounded-xl border border-cream-200">
                  <p className="font-display text-2xl font-bold text-charcoal-900">{value}</p>
                  <p className="font-sans text-xs uppercase tracking-widest text-charcoal-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              {[
                { title: 'Anti-Tarnish Technology', desc: 'Specialized coatings that keep your jewellery radiant for years.' },
                { title: '24Kt Gold Plating', desc: 'Advanced plating techniques for a radiant, long-lasting finish.' },
                { title: 'Skin-Friendly Materials', desc: 'Hypoallergenic metals tested for safe, comfortable daily wear.' },
                { title: 'Lifetime Warranty', desc: 'Our commitment: every piece backed by a lifetime craftsmanship promise.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-charcoal-900">{title}</p>
                    <p className="font-sans text-xs text-charcoal-500 font-light leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToCollection}
              className="btn-gold inline-flex"
            >
              Shop the Collection
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ══ 10. NEWSLETTER BANNER ═════════════════════════════════════════ */}
      <section className="py-20 px-5 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2A2A2E 100%)' }}>
        <div className="max-w-2xl mx-auto text-center space-y-6 reveal">
          <p className="section-label justify-center text-gold-400">
            <Sparkles className="w-3.5 h-3.5" />
            Private Gazette
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Be the First to Know
          </h2>
          <p className="font-sans text-sm text-cream-300 font-light leading-relaxed">
            Receive private invitations to new capsule releases, exclusive atelier previews,
            and early access to limited-edition pieces.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-lg font-sans text-sm bg-charcoal-800 border border-charcoal-700 text-white placeholder-charcoal-400 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <button type="submit" className="btn-gold px-6 py-3.5 whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="font-sans text-[11px] text-charcoal-400">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ── Compact product card for New Arrivals / inline grids ─────────────── */
function ProductCardCompact({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div
      className="group cursor-pointer"
      style={{
        background: '#fff',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid #EAE0D0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)';
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '1 / 1.1' }}>
        <img
          src={hovered && product.secondary_image_url ? product.secondary_image_url : product.image_url}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
        />

        {/* NEW badge */}
        {product.is_featured && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px', zIndex: 10,
            padding: '4px 10px',
            background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
            borderRadius: '4px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '9px', fontWeight: '800',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#1C1C1E',
          }}>
            ✦ New
          </span>
        )}

        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
          opacity: 0, transition: 'opacity 0.3s ease',
        }}
          className="group-hover:opacity-100"
        />

        {/* Add to bag button */}
        <button
          onClick={handleAdd}
          style={{
            position: 'absolute', bottom: '12px', left: '12px', right: '12px',
            padding: '9px',
            background: added ? '#C9A84C' : 'rgba(255,255,255,0.95)',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#1C1C1E',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease, background 0.2s',
          }}
          className="group-hover:opacity-100 group-hover:translate-y-0"
        >
          {added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{
          fontFamily: 'Inter, sans-serif', fontSize: '10px', fontWeight: '800',
          letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C',
          margin: '0 0 4px',
        }}>
          {product.category}
        </p>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '600',
          color: '#1C1C1E', margin: '0 0 8px',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.name}
        </p>
        <p style={{
          fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: '700',
          color: '#1C1C1E', margin: 0,
        }}>
          ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
}


