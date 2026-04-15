import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HiOutlineHeart, HiHeart,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineBolt,
  HiOutlineArrowRight,
  HiOutlineFunnel,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';
import {
  TbWind, TbFridge, TbWashMachine, TbDeviceTv,
  TbMicrowave, TbBath,
} from 'react-icons/tb';
import BrandStrip from './BrandStrip';

const SERVICES = [
  {
    icon: TbWind, name:'AC Repair & Service', price:499, original:799,
    desc:'Gas refill, repair & installation for all brands',
    category:'Cooling', rating:4.8, reviews:2340, badge:'Best Seller',
    badgeBg:'#fbbf24', image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
    features:['Gas refill', 'All brands', 'Same day'],
    accentColor:'#fffbeb', accentText:'#d97706',
  },
  {
    icon: TbFridge, name:'Refrigerator Repair', price:399, original:649,
    desc:'Double door, single door & no-frost specialists',
    category:'Cooling', rating:4.7, reviews:1890, badge:'Popular',
    badgeBg:'#111', image:'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80',
    features:['Double door', 'No-frost', 'Warranty'],
    accentColor:'#f3f4f6', accentText:'#111',
  },
  {
    icon: TbWashMachine, name:'Washing Machine', price:349, original:599,
    desc:'Front load, top load & semi-automatic service',
    category:'Laundry', rating:4.9, reviews:3120, badge:'Top Rated',
    badgeBg:'#059669', image:'https://images.unsplash.com/photo-1626806787461-102c1a0c13c7?w=600&q=80',
    features:['Front load', 'Top load', 'Drum clean'],
    accentColor:'#d1fae5', accentText:'#059669',
  },
  {
    icon: TbDeviceTv, name:'TV Repair', price:299, original:499,
    desc:'LED, OLED, LCD & Smart TV diagnostics & repair',
    category:'Electronics', rating:4.6, reviews:1560, badge:null,
    badgeBg:'', image:'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&q=80',
    features:['LED/OLED', 'Smart TV', 'Panel repair'],
    accentColor:'#f3e8ff', accentText:'#9333ea',
  },
  {
    icon: TbMicrowave, name:'Microwave Repair', price:249, original:449,
    desc:'Solo, convection & grill — installation & repair',
    category:'Kitchen', rating:4.5, reviews:980, badge:'Best Value',
    badgeBg:'#f97316', image:'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80',
    features:['Solo', 'Convection', 'Grill'],
    accentColor:'#ffedd5', accentText:'#f97316',
  },
  {
    icon: TbBath, name:'Geyser Service', price:599, original:899,
    desc:'Storage, instant & solar water heater specialists',
    category:'Kitchen', rating:4.8, reviews:2010, badge:'Premium',
    badgeBg:'#dc2626', image:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    features:['Storage', 'Instant', 'Solar'],
    accentColor:'#fee2e2', accentText:'#dc2626',
  },
];

const FILTERS = ['All', 'Cooling', 'Kitchen', 'Laundry', 'Electronics'];
const SORTS   = ['Relevance', 'Price: Low → High', 'Top Rated', 'Most Booked'];

/* ─── PILL BUTTON ─── */
const PillBtn = ({ label, primary = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full py-2.5 pl-5 pr-3 cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
      style={{
        fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
        background: primary ? "#111" : "transparent",
        color: primary ? "#fff" : "#111",
        borderColor: primary ? "#111" : "rgba(0,0,0,0.18)",
      }}
    >
      <span>{label}</span>
      <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: primary ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.06)" }}>
        <HiOutlineArrowRight size={12} />
      </span>
    </button>
  );
};

/* ─── TAG ─── */
const Tag = ({ children }) => (
  <div className="inline-flex items-center gap-2 mb-5">
    <div className="w-7 h-[2px] rounded-full bg-amber-500" />
    <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#d97706" }}>
      {children}
    </span>
  </div>
);

const ServiceCard = ({ svc, onBook }) => {
  const [wished, setWished] = useState(false);
  const disc = Math.round(((svc.original - svc.price) / svc.original) * 100);
  const Icon = svc.icon;

  return (
    <div
      className="rounded-[20px] overflow-hidden flex flex-col group transition-all duration-300"
      style={{
        background:'#fff',
        border:'1px solid #efefef',
        boxShadow:'0 2px 8px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.09)';
        e.currentTarget.style.borderColor = '#e5e5e5';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#efefef';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image */}
      <div className="relative h-44 md:h-52 overflow-hidden" style={{ background:'#f9fafb' }}>
        <img
          src={svc.image}
          alt={svc.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Overlay on hover - Desktop only */}
        <div
          className="absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex"
          style={{ background:'rgba(17,17,17,0.45)' }}
        >
          <button
            onClick={onBook}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95"
            style={{ background:'#111', boxShadow:'0 4px 16px rgba(0,0,0,0.3)' }}
          >
            Book Now <HiOutlineArrowRight />
          </button>
        </div>

        {/* Badge */}
        {svc.badge && (
          <div
            className="absolute top-3 md:top-4 left-3 md:left-4 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold text-white"
            style={{ background: svc.badgeBg }}
          >
            {svc.badge}
          </div>
        )}

        {/* Discount */}
        <div
          className="absolute top-3 md:top-4 right-11 md:right-12 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold"
          style={{ background:'#dcfce7', color:'#15803d' }}
        >
          {disc}% OFF
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          className="absolute top-2 md:top-3 right-2 md:right-3 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background:'rgba(255,255,255,0.95)', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {wished
            ? <HiHeart style={{ color:'#ef4444', fontSize:14 }} />
            : <HiOutlineHeart style={{ color:'#9ca3af', fontSize:14 }} />}
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">

        {/* Category + Icon */}
        <div className="flex items-center gap-2 md:gap-2.5 mb-2.5 md:mb-3">
          <div
            className="w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: svc.accentColor }}
          >
            <Icon style={{ color: svc.accentText, fontSize:15 }} />
          </div>
          <span
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider"
            style={{ color: svc.accentText }}
          >
            {svc.category}
          </span>
        </div>

        <h3
          className="text-sm md:text-base font-bold mb-1 md:mb-1.5 line-clamp-1"
          style={{ color:'#111', letterSpacing:'-0.01em', fontFamily:"'DM Serif Display', serif" }}
        >
          {svc.name}
        </h3>
        <p className="text-xs md:text-sm leading-relaxed mb-2.5 md:mb-3 line-clamp-2" style={{ color:'#6b7280' }}>
          {svc.desc}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 md:gap-2 mb-3 md:mb-4">
          <div
            className="flex items-center gap-1 px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg text-[10px] md:text-[11px] font-bold text-white"
            style={{ background:'#111' }}
          >
            <HiOutlineStar className="text-[10px] md:text-xs" />
            {svc.rating}
          </div>
          <span className="text-[10px] md:text-[11px]" style={{ color:'#9ca3af' }}>
            ({svc.reviews.toLocaleString()})
          </span>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
          {svc.features.map((f) => (
            <span
              key={f}
              className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-[10px] font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full"
              style={{ background:'#f9fafb', border:'1px solid #f3f4f6', color:'#374151' }}
            >
              <HiOutlineCheckCircle style={{ color:'#d97706', fontSize:9 }} />
              {f}
            </span>
          ))}
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 md:gap-2 mb-3 md:mb-4 mt-auto">
          <span className="text-lg md:text-xl font-bold" style={{ color:'#111', fontFamily:"'DM Serif Display', serif" }}>₹{svc.price}</span>
          <span className="text-xs md:text-sm line-through" style={{ color:'#9ca3af' }}>₹{svc.original}</span>
          <span className="text-[10px] md:text-xs font-bold" style={{ color:'#d97706' }}>Save ₹{svc.original - svc.price}</span>
        </div>

        {/* Same-day note */}
        <div className="flex items-center gap-1 md:gap-1.5 text-[10px] md:text-[11px] font-semibold mb-3 md:mb-4" style={{ color:'#374151' }}>
          <HiOutlineBolt style={{ color:'#d97706', fontSize:12 }} />
          Same-day available
        </div>

        {/* CTA - Mobile: Full width, Desktop: Pill button */}
        <button
          onClick={onBook}
          className="w-full md:w-auto flex items-center justify-center gap-2 md:gap-3 rounded-full py-2.5 md:py-2.5 pl-4 md:pl-5 pr-3 md:pr-3 text-xs md:text-[11px] font-bold cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: "transparent",
            color: "#111",
            borderColor: "rgba(0,0,0,0.18)",
          }}
        >
          <span>Book Now</span>
          <span className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(0,0,0,0.06)" }}>
            <HiOutlineArrowRight size={11} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default function ServicesSection({ onServiceClick }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeSort,   setActiveSort]   = useState('Relevance');

  // Add no-scrollbar style
  const noScrollbarStyle = `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;

  const handleBook = (svc) => {
    if (isAuthenticated) {
      navigate('/customer/book', {
        state: {
          selectedService: {
            id: svc.name.toLowerCase().replace(/\s+/g, '-'),
            name: svc.name, price: svc.price,
            description: svc.desc, category: svc.category,
          },
        },
      });
    } else {
      onServiceClick(svc);
    }
  };

  const filtered = activeFilter === 'All'
    ? SERVICES
    : SERVICES.filter((s) => s.category === activeFilter);

  return (
    <section id="services" style={{ background:'#f9fafb' }} className="py-12 md:py-16 px-4 md:px-8">
      <style>{noScrollbarStyle}</style>
      <div className="max-w-[1200px] mx-auto">

        {/* ── Section header ── */}
        <div className="text-center mb-10 md:mb-14">
          <Tag>All Services</Tag>
          <h2 style={{ 
            fontSize: 'clamp(28px, 5vw, 62px)', 
            fontWeight: 700, 
            lineHeight: 1.1, 
            letterSpacing: '-0.03em', 
            color: '#111', 
            fontFamily: "'DM Serif Display', serif",
            marginBottom: '16px'
          }}>
            Fixed pricing, no hidden charges{" "}
            <em style={{ fontStyle: 'italic', color: '#d97706' }}>same-day slots available</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 md:gap-8">

          {/* ── Sidebar - Hidden on mobile, shown on lg ── */}
          <div className="hidden lg:block">
            <div
              className="rounded-[20px] overflow-hidden sticky top-20"
              style={{ background:'#fff', border:'1px solid #efefef', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}
            >
              <div
                className="px-5 py-4 flex items-center gap-2"
                style={{ borderBottom:'1px solid #f3f4f6' }}
              >
                <HiOutlineAdjustmentsHorizontal style={{ color:'#d97706', fontSize:16 }} />
                <p className="text-sm font-bold" style={{ color:'#111' }}>Filters</p>
              </div>

              {/* Category */}
              <div className="px-5 py-5" style={{ borderBottom:'1px solid #f3f4f6' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color:'#9ca3af' }}>
                  Category
                </p>
                {['Cooling', 'Kitchen', 'Laundry', 'Electronics'].map((c) => (
                  <label key={c} className="flex items-center gap-3 py-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      style={{ accentColor:'#d97706' }}
                    />
                    <span
                      className="text-sm font-medium transition-colors"
                      style={{ color:'#374151' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#d97706'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                    >
                      {c}
                    </span>
                  </label>
                ))}
              </div>

              {/* Price */}
              <div className="px-5 py-5" style={{ borderBottom:'1px solid #f3f4f6' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color:'#9ca3af' }}>
                  Price Range
                </p>
                {['Under ₹300', '₹300 – ₹500', 'Above ₹500'].map((r) => (
                  <label key={r} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" style={{ accentColor:'#d97706' }} />
                    <span className="text-sm font-medium" style={{ color:'#374151' }}>{r}</span>
                  </label>
                ))}
              </div>

              {/* Rating */}
              <div className="px-5 py-5">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color:'#9ca3af' }}>
                  Minimum Rating
                </p>
                {['4 stars & above', '3 stars & above'].map((r) => (
                  <label key={r} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" style={{ accentColor:'#d97706' }} />
                    <span className="text-sm font-medium" style={{ color:'#374151' }}>{r}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          <div>
            {/* Mobile filter chips - Horizontal scroll */}
            <div 
              className="flex lg:hidden gap-2 pb-3 mb-4 overflow-x-auto no-scrollbar sticky top-0 z-10 -mx-4 px-4 pt-2"
              style={{
                background: 'rgba(249,250,251,0.95)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border"
                  style={
                    activeFilter === f
                      ? { background:'#111', color:'#fff', borderColor:'#111', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }
                      : { background:'#fff', color:'#374151', borderColor:'#efefef' }
                  }
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Desktop filter chips */}
            <div className="hidden lg:flex flex-wrap gap-2 mb-6">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border"
                  style={
                    activeFilter === f
                      ? { background:'#111', color:'#fff', borderColor:'#111', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }
                      : { background:'#fff', color:'#374151', borderColor:'#efefef' }
                  }
                  onMouseEnter={(e) => { if (activeFilter !== f) e.currentTarget.style.borderColor = '#111'; }}
                  onMouseLeave={(e) => { if (activeFilter !== f) e.currentTarget.style.borderColor = '#efefef'; }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort bar */}
            <div
              className="rounded-[20px] px-4 md:px-6 py-3 md:py-4 mb-6 flex items-center gap-3 md:gap-4 flex-wrap"
              style={{ background:'#fff', border:'1px solid #efefef' }}
            >
              <div className="flex items-center gap-2">
                <HiOutlineFunnel style={{ color:'#d97706', fontSize:14 }} />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color:'#6b7280' }}>Sort:</span>
              </div>
              <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="flex gap-3 md:gap-4 pb-1">
                  {SORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSort(s)}
                      className="text-xs font-bold whitespace-nowrap transition-colors pb-0.5"
                      style={{
                        color: activeSort === s ? '#d97706' : '#6b7280',
                        borderBottom: activeSort === s ? '2px solid #d97706' : '2px solid transparent',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-xs font-medium whitespace-nowrap" style={{ color:'#9ca3af' }}>
                {filtered.length} services
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {filtered.map((svc, i) => (
                <ServiceCard key={i} svc={svc} onBook={() => handleBook(svc)} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Trust bar ── */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { icon: HiOutlineShieldCheck, title:'Verified Technicians', desc:'Background checked & ID-verified'    },
            { icon: HiOutlineBolt,        title:'Same Day Service',      desc:'Book before 12 PM for today'         },
            { icon: HiOutlineCheckCircle, title:'Fixed Pricing',         desc:'Transparent rates, no surprises'     },
            { icon: HiOutlineStar,        title:'30-Day Warranty',       desc:'On all completed service jobs'       },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex items-start gap-3 p-4 md:p-5 rounded-[20px]"
                style={{ background:'#fff', border:'1px solid #efefef', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:'#fffbeb' }}
                >
                  <Icon style={{ color:'#d97706', fontSize:16 }} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold" style={{ color:'#111' }}>{b.title}</p>
                  <p className="text-[11px] md:text-xs mt-1" style={{ color:'#6b7280' }}>{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Brand strip with infinity scroll */}
        <BrandStrip />
      </div>
    </section>
  );
}
