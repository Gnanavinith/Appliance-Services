import React, { useState, useMemo } from 'react';
import {
  HiOutlineCalendarDays,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineUserCircle,
  HiOutlineInboxArrowDown,
  HiOutlineArrowPath,
  HiOutlineMapPin,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineEye,
} from 'react-icons/hi2';
import { useBookings, useConfirmBooking, useCancelBooking } from '../../../queries/useBookings';
import { formatDate } from '../../../shared/utils/helpers';

/* ── Service image map ───────────────────────────────── */
const SERVICE_IMAGES = {
  'ac repair':        'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  'ac':               'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  'refrigerator':     'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80',
  'fridge':           'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600&q=80',
  'washing machine':  'https://images.unsplash.com/photo-1626806787461-102c1a0c13c7?w=600&q=80',
  'washer':           'https://images.unsplash.com/photo-1626806787461-102c1a0c13c7?w=600&q=80',
  'tv':               'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&q=80',
  'television':       'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=600&q=80',
  'microwave':        'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&q=80',
  'geyser':           'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
  'water heater':     'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
  default:            'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
};

const getServiceImage = (name = '') => {
  const lower = name.toLowerCase();
  return (
    Object.entries(SERVICE_IMAGES).find(([key]) => lower.includes(key))?.[1] ||
    SERVICE_IMAGES.default
  );
};

/* ── Status config ───────────────────────────────────── */
const STATUS = {
  confirmed:     { label: 'Confirmed',    bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6', bar: '#3B82F6' },
  pending:       { label: 'Pending',      bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', bar: '#F59E0B' },
  completed:     { label: 'Completed',    bg: '#F0FDF4', color: '#15803D', dot: '#16A34A', bar: '#16A34A' },
  cancelled:     { label: 'Cancelled',    bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444', bar: '#EF4444' },
  'in-progress': { label: 'In Progress',  bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6', bar: '#8B5CF6' },
  inprogress:    { label: 'In Progress',  bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6', bar: '#8B5CF6' },
};

/* ── StatusChip ─────────────────────────────────────── */
const StatusChip = ({ status }) => {
  const c = STATUS[status] || STATUS.pending;
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0"
      style={{ background: c.bg }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: c.dot,
          boxShadow: status === 'in-progress' || status === 'inprogress'
            ? `0 0 0 3px ${c.dot}33`
            : 'none',
          animation: status === 'in-progress' || status === 'inprogress'
            ? 'pulse 1.5s infinite'
            : 'none',
        }}
      />
      <span
        className="text-[10px] font-extrabold uppercase tracking-wider"
        style={{ color: c.color }}
      >
        {c.label}
      </span>
    </div>
  );
};

/* ── BookingCard ────────────────────────────────────── */
const BookingCard = ({ booking, onConfirm, onCancel, onView }) => {
  const isInProgress = booking.status === 'in-progress' || booking.status === 'inprogress';
  const isCompleted  = booking.status === 'completed';
  const isCancelled  = booking.status === 'cancelled';
  const isPending    = booking.status === 'pending';
  const sc = STATUS[booking.status] || STATUS.pending;
  const img = getServiceImage(booking.serviceName);

  return (
    <div
      className="group relative bg-white border border-slate-100 rounded-[20px] mb-4 overflow-hidden transition-all duration-300 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/6 active:scale-[0.985]"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* ── Colored status bar (top edge) ── */}
      <div className="h-[3px] w-full" style={{ background: sc.bar }} />

      {/* ── Image Banner ── */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={img}
          alt={booking.serviceName}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            isCancelled ? 'grayscale opacity-60' : ''
          }`}
        />
        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Service name over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="text-white font-black text-base leading-tight truncate mb-0.5"
            style={{ fontFamily: "'DM Serif Display', serif", textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
          >
            {booking.serviceName}
          </h3>
          <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
            ID: {booking.id?.slice(-8).toUpperCase() || booking.id}
          </p>
        </div>

        {/* Status chip — top right */}
        <div className="absolute top-3 right-3">
          <StatusChip status={booking.status} />
        </div>

        {/* Price badge — top left */}
        <div
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            color: '#fff',
            letterSpacing: '0.02em',
          }}
        >
          ₹{booking.price}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">
        {/* Customer info */}
        <div className="mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs text-white" style={{ background:'#111' }}>
              {booking.customerName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{booking.customerName || 'Customer'}</p>
              <p className="text-[10px] text-slate-500 truncate">{booking.email}</p>
            </div>
          </div>
          {booking.phone && (
            <p className="text-[11px] text-slate-600 font-medium">📞 {booking.phone}</p>
          )}
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 mb-5">
          <MetaItem icon={HiOutlineCalendarDays} label="Date" value={formatDate(booking.date)} />
          <MetaItem icon={HiOutlineClock}         label="Time" value={booking.timeSlot} />
          {booking.technicianName && (
            <MetaItem icon={HiOutlineUserCircle} label="Technician" value={booking.technicianName} />
          )}
          {booking.city && (
            <MetaItem icon={HiOutlineMapPin} label="Location" value={booking.city} />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onView(booking); }}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors active:scale-95 flex items-center justify-center gap-1.5"
          >
            <HiOutlineEye size={14} />
            View
          </button>
          {isPending && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onConfirm(booking.id); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors active:scale-95 flex items-center justify-center gap-1.5"
              >
                <HiOutlineCheckCircle size={14} />
                Confirm
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onCancel(booking.id); }}
                className="flex-1 py-2.5 rounded-xl bg-red-50 border border-red-100 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors active:scale-95 flex items-center justify-center gap-1.5"
              >
                <HiOutlineXMark size={14} />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── MetaItem ───────────────────────────────────────── */
const MetaItem = ({ icon: Icon, label, value }) => (
  <div className="flex flex-col gap-1 min-w-0">
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate">
      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span className="truncate">{value}</span>
    </div>
  </div>
);

/* ── Skeleton loader ────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-[20px] mb-4 overflow-hidden animate-pulse" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div className="h-[3px] bg-slate-100" />
    <div className="h-36 bg-slate-100" />
    <div className="p-6 space-y-3">
      <div className="h-16 bg-slate-100 rounded-xl" />
      <div className="h-3 bg-slate-100 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      <div className="h-10 bg-slate-100 rounded-xl mt-4" />
    </div>
  </div>
);

/* ── Tag ─── */
const Tag = ({ children }) => (
  <div className="inline-flex items-center gap-2 mb-5">
    <div className="w-7 h-[2px] rounded-full bg-amber-500" />
    <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#d97706" }}>
      {children}
    </span>
  </div>
);

/* ── Main Component ────────────────────────────────── */
const Bookings = () => {
  const [filter, setFilter] = useState('all');
  const { data: bookingsResponse, isLoading, error, refetch } = useBookings({});
  const confirmMutation = useConfirmBooking();
  const cancelMutation = useCancelBooking();
  
  const bookings = bookingsResponse?.data || [];

  // Debug: Log the response to see what we're getting
  console.log('📊 Bookings Response:', bookingsResponse);
  console.log('📋 Bookings Data:', bookings);
  console.log('⚠️ Error:', error);

  const counts = useMemo(() =>
    bookings.reduce(
      (acc, b) => ({ ...acc, [b.status]: (acc[b.status] || 0) + 1, all: acc.all + 1 }),
      { all: 0 }
    ),
    [bookings]
  );

  const filtered = useMemo(
    () => filter === 'all' ? bookings : bookings.filter((b) => b.status === filter),
    [filter, bookings]
  );

  const transformBooking = (b) => ({
    id:            b._id || b.id,
    serviceName:   b.service?.name || 'Service',
    date:          b.date,
    timeSlot:      b.timeSlot,
    status:        b.status,
    price:         b.price || 0,
    technicianName:b.technician?.name || null,
    customerName:  b.customer?.name || `${b.firstName || ''} ${b.lastName || ''}`.trim() || 'Customer',
    email:         b.email || b.customer?.email || 'N/A',
    phone:         b.phone || b.customer?.phone || 'N/A',
    address:       b.address,
    city:          b.city,
  });

  const FILTERS = [
    { id: 'all',        label: 'All'      },
    { id: 'pending',    label: 'Pending'  },
    { id: 'confirmed',  label: 'Confirmed' },
    { id: 'in-progress', label: 'Running'  },
    { id: 'completed',  label: 'Completed' },
    { id: 'cancelled',  label: 'Cancelled' },
  ];

  const handleConfirm = (bookingId) => {
    if (window.confirm('Confirm this booking?')) {
      confirmMutation.mutate(bookingId);
    }
  };

  const handleCancel = (bookingId) => {
    if (window.confirm('Cancel this booking?')) {
      cancelMutation.mutate(bookingId);
    }
  };

  const handleView = (booking) => {
    // You can implement a modal or navigation here
    console.log('View booking:', booking);
  };

  return (
    <section style={{ background:'#f9fafb' }} className="min-h-screen py-[40px] px-4 md:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bk-fade { animation: bfade 0.45s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes bfade { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>

      <div className="max-w-[1200px] mx-auto">

        {/* ── Header ── */}
        <div className="bk-fade mb-10 flex justify-between items-start">
          <div>
            <Tag>Booking Management</Tag>
            <h1 style={{ 
              fontSize: 'clamp(28px, 4vw, 48px)', 
              fontWeight: 700, 
              lineHeight: 1.06, 
              letterSpacing: '-0.03em', 
              color: '#111', 
              fontFamily: "'DM Serif Display', serif",
              marginBottom: '8px'
            }}>
              Branch Bookings
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Manage and track all bookings for your branch
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all active:scale-95"
            title="Refresh"
          >
            <HiOutlineArrowPath className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ── Stats row ── */}
        {!isLoading && !error && (
          <div
            className="bk-fade rounded-[20px] px-8 py-8 grid grid-cols-2 md:grid-cols-5 gap-4 mb-10"
            style={{ background:'#fff', border:'1px solid #efefef', boxShadow:'0 4px 20px rgba(0,0,0,0.04)' }}
          >
            {[
              { label: 'Total',        val: counts.all         || 0, color: '#111',      bg: '#f9fafb' },
              { label: 'Pending',      val: counts.pending     || 0, color: '#F59E0B',   bg: '#FFFBEB' },
              { label: 'Confirmed',    val: counts.confirmed   || 0, color: '#3B82F6',   bg: '#EFF6FF' },
              { label: 'In Progress',  val: (counts['in-progress'] || 0) + (counts.inprogress || 0), color: '#8B5CF6', bg: '#F5F3FF' },
              { label: 'Completed',    val: counts.completed   || 0, color: '#10B981',   bg: '#F0FDF4' },
            ].map((s, i) => (
              <div
                key={s.label}
                className="text-center px-4 py-2"
                style={{ borderLeft: i > 0 ? '1px solid #e5e7eb' : 'none' }}
              >
                <div className="flex items-center justify-center mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: s.bg }}
                  >
                    <div style={{ color: s.color, fontSize: 16, fontWeight: 'bold' }}>
                      {s.val}
                    </div>
                  </div>
                </div>
                <p className="text-xs font-bold" style={{ color:'#374151' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter bar ── */}
        <div
          className="bk-fade no-scrollbar flex gap-2 pb-4 mb-6 overflow-x-auto"
          style={{
            animationDelay: '0.13s',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '16px',
            padding: '8px',
            border: '1px solid #efefef',
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border active:scale-95"
              style={{
                fontFamily: 'inherit',
                background: filter === f.id ? '#111' : '#fff',
                color:      filter === f.id ? '#fff'    : '#64748b',
                border:     filter === f.id ? '1px solid #111' : '1px solid #e5e7eb',
                boxShadow:  filter === f.id ? '0 4px 12px rgba(17,17,17,0.2)' : 'none',
              }}
            >
              {f.label}
              {counts[f.id] > 0 && (
                <span className="ml-1.5 opacity-50">({counts[f.id]})</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Loading skeletons ── */}
        {isLoading && (
          <div className="bk-fade" style={{ animationDelay: '0.18s' }}>
            {[0, 1, 2].map((i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Error state ── */}
        {error && (
          <div className="py-20 text-center flex flex-col items-center bk-fade">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>Failed to load bookings</h3>
            <p className="text-sm text-slate-400 mb-5">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-100 active:scale-95"
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Booking Cards ── */}
        {!isLoading && !error && (
          <div className="bk-fade" style={{ animationDelay: '0.18s' }}>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((b) => {
                  const t = transformBooking(b);
                  return (
                    <BookingCard
                      key={t.id}
                      booking={t}
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                      onView={handleView}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <HiOutlineInboxArrowDown className="w-8 h-8 text-slate-300" />
                </div>
                <h3
                  className="text-base font-black text-slate-800 mb-1"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  No bookings found
                </h3>
                <p className="text-sm text-slate-400 max-w-[220px] mb-6">
                  No bookings match the current filter.
                </p>
                <button
                  onClick={() => setFilter('all')}
                  className="px-7 py-3 bg-amber-500 text-white text-sm font-bold rounded-full shadow-md shadow-amber-100 active:scale-95 transition-transform"
                >
                  View All Bookings
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

export default Bookings;
