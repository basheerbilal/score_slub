/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShoppingCart, CheckCircle, Heart, 
  Star, Truck, RefreshCw, ArrowLeft, Box,
  SlidersHorizontal, ChevronRight, Tag, Zap, Award
} from 'lucide-react';
import { Product, User as UserType } from '../types';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
}

const CATEGORIES = ['All', 'Jerseys', 'Footwear', 'Training Wear', 'Equipment', 'Accessories', 'Fan Gear'] as const;
type Category = typeof CATEGORIES[number];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

// Category banner data (inspired by The Shoppies 4-column grid)
const CATEGORY_BANNERS = [
  { label: 'Jerseys', emoji: '👕', desc: 'Official Club Kits', color: 'from-blue-900 to-blue-700', cat: 'Jerseys' as Category },
  { label: 'Footwear', emoji: '👟', desc: 'Pro Football Boots', color: 'from-slate-800 to-slate-600', cat: 'Footwear' as Category },
  { label: 'Equipment', emoji: '⚽', desc: 'Training & Match', color: 'from-amber-900 to-amber-700', cat: 'Equipment' as Category },
  { label: 'Fan Gear', emoji: '🏆', desc: 'Supporter Merch', color: 'from-emerald-900 to-emerald-700', cat: 'Fan Gear' as Category },
];

export default function ShopView({ products, onAddToCart, currentUser, onNavigate }: ShopViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<'none' | 'priceAsc' | 'priceDesc'>('none');
  const [successItem, setSuccessItem] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`soccer_wishlist_${currentUser.id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Product detail page state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailSelectedSize, setDetailSelectedSize] = useState<string>('M');

  // Hero slider state
  const [heroSlide, setHeroSlide] = useState(0);
  const heroSlides = [
    { title: 'New Season', subtitle: '2026 Official Match Jerseys', cta: 'Shop Jerseys', cat: 'Jerseys' as Category, bg: 'from-slate-950 via-blue-950 to-slate-900' },
    { title: 'FIFA World Cup', subtitle: '2026 Supporter Collection', cta: 'Shop Now', cat: 'Fan Gear' as Category, bg: 'from-slate-950 via-amber-950 to-slate-900' },
    { title: 'Pro Equipment', subtitle: 'Training & Match Ready Gear', cta: 'Explore', cat: 'Equipment' as Category, bg: 'from-slate-950 via-emerald-950 to-slate-900' },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroSlide(s => (s + 1) % heroSlides.length), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`soccer_wishlist_${currentUser.id}`);
      setWishlist(saved ? JSON.parse(saved) : []);
    } else {
      setWishlist([]);
    }
  }, [currentUser?.id]);

  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    const next = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    setWishlist(next);
    localStorage.setItem(`soccer_wishlist_${currentUser.id}`, JSON.stringify(next));
  };

  const handleAddToCart = (prod: Product, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onAddToCart(prod);
    setSuccessItem(prod.id);
    setTimeout(() => setSuccessItem(null), 1500);
  };

  const filteredProducts = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || p.category === category ||
        (category === 'Footwear' && p.category === 'Shoes') ||
        (category === 'Fan Gear' && p.category === 'Accessories');
      const matchPrice = p.price <= maxPrice;
      const matchSize = selectedSizes.length === 0 || true; // sizes are UI only for demo
      return matchSearch && matchCat && matchPrice && matchSize;
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });

  // ─── Product Detail View ───────────────────────────────────────────────────
  if (selectedProduct) {
    return (
      <motion.div
        key={selectedProduct.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6" id="product-detail-view"
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="flex items-center gap-2 text-[11px] font-mono text-slate-500"
        >
          <button onClick={() => setSelectedProduct(null)} className="hover:text-amber-500 transition cursor-pointer flex items-center gap-1 group">
            <motion.span whileHover={{ x: -3 }} transition={{ type: 'spring', stiffness: 400 }}>
              <ArrowLeft className="w-3 h-3" />
            </motion.span>
            Store
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-400">{selectedProduct.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-bold truncate max-w-xs">{selectedProduct.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Images — slide in from left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 grid grid-cols-2 gap-4"
          >
            {['Front View', 'Back View'].map((label, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(212,175,55,0.12)' }}
                className="relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden aspect-square flex items-center justify-center group cursor-zoom-in"
              >
                <span className="absolute top-2 left-2 text-[8px] font-mono text-slate-500 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">{label}</span>
                <motion.img
                  src={selectedProduct.image_url}
                  alt={selectedProduct.name}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`max-h-52 object-contain ${i === 1 ? 'scale-x-[-1]' : ''}`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Detail Panel — slide in from right with stagger */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest block mb-1">Official Soccer FC Gear</span>
              <h1 className="text-2xl font-extrabold text-white leading-tight">{selectedProduct.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                  className="text-2xl font-black text-amber-500 font-mono"
                >
                  ${selectedProduct.price.toFixed(2)}
                </motion.span>
                {selectedProduct.stock > 0 && selectedProduct.stock < 10 && (
                  <span className="text-[9px] font-mono font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded animate-pulse">
                    Only {selectedProduct.stock} left!
                  </span>
                )}
              </div>
            </motion.div>

            {/* Ratings — stagger stars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center gap-1.5"
            >
              {[1,2,3,4,5].map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.45 + i * 0.06, type: 'spring', stiffness: 400 }}
                >
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </motion.div>
              ))}
              <span className="text-[10px] text-slate-500 font-mono ml-1">(128 reviews)</span>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-slate-400 text-sm leading-relaxed border-t border-slate-900 pt-4"
            >
              {selectedProduct.description}
            </motion.p>

            {/* Size Selector */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500 uppercase font-bold tracking-wider">Size: <span className="text-white">{detailSelectedSize}</span></span>
                <span className="text-amber-500 cursor-pointer hover:text-amber-400">Size Guide →</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((sz, i) => (
                  <motion.button
                    key={sz}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.04, type: 'spring', stiffness: 350 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDetailSelectedSize(sz)}
                    className={`w-12 h-10 rounded-xl font-mono text-xs font-black border transition cursor-pointer ${
                      detailSelectedSize === sz
                        ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/50 hover:text-white'
                    }`}
                  >{sz}</motion.button>
                ))}
              </div>
            </motion.div>

            {/* Add to Bag */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: selectedProduct.stock === 0 ? 1 : 1.02 }}
              disabled={selectedProduct.stock === 0}
              onClick={() => handleAddToCart(selectedProduct)}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                successItem === selectedProduct.id
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                  : selectedProduct.stock === 0
                  ? 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              <AnimatePresence mode="wait">
                {successItem === selectedProduct.id ? (
                  <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Added to Bag!
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Add to Bag
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.4 }}
              className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-900"
            >
              {[
                { icon: <Truck className="w-4 h-4 text-amber-500" />, label: 'Fast Delivery' },
                { icon: <Box className="w-4 h-4 text-amber-500" />, label: '14-Day Returns' },
                { icon: <Award className="w-4 h-4 text-amber-500" />, label: 'Official Gear' },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 + i * 0.07, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(212,175,55,0.3)' }}
                  className="bg-slate-950/50 border border-slate-900 rounded-xl p-3 flex flex-col items-center gap-1.5 text-center cursor-default"
                >
                  {b.icon}
                  <span className="text-[9px] font-mono font-bold text-white uppercase">{b.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // ─── Main Store View ───────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fade-in" id="shop-view-container">

      {/* 1. Hero Slider (like The Shoppies full-width banner) */}
      <div className="relative rounded-3xl overflow-hidden h-56 sm:h-72 border border-slate-800 shadow-2xl">
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 bg-gradient-to-r ${slide.bg} ${i === heroSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/shop_hero2.jpg')" }} />
            <div className="relative h-full flex items-center px-8 sm:px-14">
              <div className="space-y-3 max-w-md">
                <span className="text-[10px] font-mono font-extrabold text-amber-500 uppercase tracking-[0.3em] bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  ⚽ NEW COLLECTION
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-none">{slide.title}</h1>
                <p className="text-slate-400 text-sm">{slide.subtitle}</p>
                <button
                  onClick={() => setCategory(slide.cat)}
                  className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer"
                >
                  {slide.cta} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Slider dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button key={i} onClick={() => setHeroSlide(i)}
              className={`rounded-full transition-all cursor-pointer ${i === heroSlide ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-slate-600'}`} />
          ))}
        </div>
      </div>

      {/* 2. Category Banners (4-column grid like The Shoppies) */}
      <div>
        <h2 className="text-white font-extrabold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORY_BANNERS.map(b => (
            <button
              key={b.cat}
              onClick={() => setCategory(b.cat)}
              className={`group relative rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-b ${b.color} p-5 flex flex-col items-center justify-center gap-2 hover:-translate-y-1 transition-all duration-300 cursor-pointer min-h-[120px]`}
            >
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{b.emoji}</span>
              <span className="text-white font-extrabold text-sm uppercase tracking-wide">{b.label}</span>
              <span className="text-slate-400 text-[9px] font-mono">{b.desc}</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition duration-300 rounded-2xl" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 space-y-5 bg-slate-900/30 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-white font-extrabold text-xs uppercase tracking-wider">Filters</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Category filter */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Category</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                  category === cat
                    ? 'bg-amber-500/15 text-amber-500 border-l-2 border-amber-500'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span>{cat}</span>
                {category === cat && <ChevronRight className="w-3 h-3" />}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
              <span className="uppercase">Max Price</span>
              <span className="text-amber-500">${maxPrice}</span>
            </div>
            <input type="range" min="10" max="200" value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer" />
          </div>

          {/* Size filter */}
          <div className="space-y-2 border-t border-slate-800 pt-4">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Sizes</span>
            <div className="grid grid-cols-3 gap-1.5">
              {SIZES.map(sz => (
                <button
                  key={sz}
                  onClick={() => setSelectedSizes(p => p.includes(sz) ? p.filter(s => s !== sz) : [...p, sz])}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-black border transition cursor-pointer ${
                    selectedSizes.includes(sz)
                      ? 'bg-amber-500 border-amber-500 text-slate-950'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40'
                  }`}
                >{sz}</button>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setCategory('All'); setMaxPrice(200); setSelectedSizes([]); setSearch(''); }}
            className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-9 space-y-5">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="relative flex-grow max-w-sm">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500 focus:outline-none rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-mono">{filteredProducts.length} products</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-950/60 border border-slate-800 focus:border-amber-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-400 cursor-pointer">
                <option value="none">Sort: Featured</option>
                <option value="priceAsc">Price: Low → High</option>
                <option value="priceDesc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  category === cat
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >{cat}</button>
            ))}
          </div>

          {/* Product Grid — The Shoppies style: clean cards, image dominant, hover overlay */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-500 font-mono text-xs">No products found.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-5" id="products-grid">
              {filteredProducts.map(prod => {
                const isOOS = prod.stock === 0;
                const isAdded = successItem === prod.id;
                const isWished = wishlist.includes(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className="group bg-slate-900/40 border border-slate-800 hover:border-amber-500/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative aspect-square bg-slate-950/60 border-b border-slate-800 overflow-hidden flex items-center justify-center p-4">
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="max-h-36 object-contain group-hover:scale-108 transition-transform duration-500"
                        style={{ transform: 'scale(1)' }}
                        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      />

                      {/* Badges */}
                      {isOOS && (
                        <span className="absolute top-2 left-2 text-[8px] font-mono font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase">
                          Sold Out
                        </span>
                      )}
                      {!isOOS && prod.stock < 10 && (
                        <span className="absolute top-2 left-2 text-[8px] font-mono font-black bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full uppercase animate-pulse">
                          {prod.stock} Left
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={e => toggleWishlist(prod.id, e)}
                        className={`absolute top-2 right-2 p-1.5 rounded-full border transition ${
                          isWished
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <Heart className={`w-3 h-3 ${isWished ? 'fill-rose-400' : ''}`} />
                      </button>

                      {/* Hover quick-add */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-2 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent hidden md:block z-10">
                        <button
                          disabled={isOOS}
                          onClick={e => handleAddToCart(prod, e)}
                          className={`w-full py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            isAdded
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isOOS
                              ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                          }`}
                        >
                          {isAdded ? <><CheckCircle className="w-3.5 h-3.5" /> Added!</> : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Bag</>}
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3.5 space-y-1.5 flex flex-col flex-grow">
                      <h3 className="text-white font-bold text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-amber-500 transition">{prod.name}</h3>
                      
                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />)}
                        <span className="text-[8px] text-slate-600 ml-0.5 font-mono">(128)</span>
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-1.5">
                        <span className="text-white font-black font-mono text-sm">${prod.price.toFixed(2)}</span>
                        <button
                          disabled={isOOS}
                          onClick={e => handleAddToCart(prod, e)}
                          className={`md:hidden p-2 rounded-xl transition cursor-pointer ${
                            isAdded ? 'bg-emerald-500/20 text-emerald-400' : isOOS ? 'bg-slate-900 text-slate-600' : 'bg-amber-500 text-slate-950 active:scale-95'
                          }`}
                        >
                          {isAdded ? <CheckCircle className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 4. Trust bar (like The Shoppies footer widgets) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800 pt-6">
        {[
          { icon: <Truck className="w-5 h-5 text-amber-500" />, title: 'Free Delivery', sub: 'On orders over $75' },
          { icon: <Tag className="w-5 h-5 text-amber-500" />, title: 'Member Discount', sub: '10% OFF for members' },
          { icon: <RefreshCw className="w-5 h-5 text-amber-500" />, title: '14-Day Returns', sub: 'Hassle-free policy' },
          { icon: <Award className="w-5 h-5 text-amber-500" />, title: 'Official Gear', sub: 'Authenticated products' },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-3 bg-slate-900/30 border border-slate-800 rounded-2xl p-4">
            {t.icon}
            <div>
              <span className="text-white font-extrabold text-xs block">{t.title}</span>
              <span className="text-slate-500 text-[9px] font-mono">{t.sub}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
