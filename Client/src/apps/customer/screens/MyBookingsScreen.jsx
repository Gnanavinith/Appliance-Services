import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiOutlineCalendarDays, 
  HiOutlineClock, 
  HiOutlineCurrencyRupee,
  HiOutlineUserCircle,
  HiOutlineInboxArrowDown,
  HiOutlineArrowPath
} from 'react-icons/hi2';
import { formatDate } from '../../../shared/utils/helpers';
import { useCustomerBookings } from '../../../queries/useBookings';
import { useSelector } from 'react-redux';

/* ── Design tokens ───────────────────────────────────── */
const T = {
  green:    '#16A34A',
  greenDk:  '#15803D',
  greenLt:  '#F0FDF4',
  greenMd:  '#DCFCE7',
  ink:      '#0A0A0A',
  ink2:     '#404040',
  ink3:     '#737373',
  line:     '#E5E5E5',
  surface:  '#FFFFFF',
  bg:       '#FAFAF9',
};

/* ── Status config ───────────────────────────────────── */
const STATUS = {
  confirmed:  { label: 'Upcoming',    bg: '#EFF6FF', color: '#1D4ED8', dot: '#3B82F6' },
  pending:    { label: 'Pending',     bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  completed:  { label: 'Completed',   bg: '#F0FDF4', color: '#15803D', dot: '#16A34A' },
  cancelled:  { label: 'Cancelled',   bg: '#FEF2F2', color: '#991B1B', dot: '#EF4444' },
  inprogress: { label: 'In Progress', bg: '#F5F3FF', color: '#5B21B6', dot: '#8B5CF6' },
};

/* ── Components ─────────────────────────────────────── */

const StatusChip = ({ status }) => {
  const c = STATUS[status] || STATUS.pending;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0" style={{ background: c.bg }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: c.color }}>
        {c.label}
      </span>
    </div>
  );
};

const BookingCard = ({ booking, onClick }) => {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-slate-200 rounded-3xl p-5 mb-4 cursor-pointer transition-all hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-900/5 active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-black text-slate-900 mb-0.5 truncate leading-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
            {booking.serviceName}
          </h3>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest m-0">
            ID: {booking.id}
          </p>
        </div>
        <StatusChip status={booking.status} />
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-5">
        {[
          { icon: HiOutlineCalendarDays, label: 'Schedule', val: formatDate(booking.date) },
          { icon: HiOutlineClock, label: 'Time Slot', val: booking.timeSlot },
          { icon: HiOutlineCurrencyRupee, label: 'Bill Amount', val: `₹${booking.price}` },
          booking.technicianName && { icon: HiOutlineUserCircle, label: 'Technician', val: booking.technicianName },
        ].filter(Boolean).map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <item.icon className="w-4 h-4 grayscale-[0.5]" /> {item.val}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {booking.status === 'completed' ? (
          <>
            <button className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 active:bg-slate-50">
              Invoice
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700 active:bg-emerald-100">
              Rate Service
            </button>
          </>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/booking/${booking.id}`); }}
            className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg shadow-slate-200 active:scale-95 transition-transform"
          >
            Manage Booking
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Main Screen ────────────────────────────────────── */

const MyBookingsScreen = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const user = useSelector((state) => state.auth.user);
  
  // Fetch real customer bookings from API - only enabled when user.id exists
  const { data: bookingsResponse, isLoading, error, refetch } = useCustomerBookings(
    user?.id || '', 
    {},
    {
      enabled: !!user?.id, // Only fetch when we have a valid user ID
    }
  );
  const bookings = bookingsResponse?.data || [];

  const counts = useMemo(() => {
    return bookings.reduce((acc, b) => ({ ...acc, [b.status]: (acc[b.status] || 0) + 1 }), { all: bookings.length });
  }, [bookings]);

  const filtered = useMemo(() => {
    return filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  }, [filter, bookings]);

  // Transform API data for display
  const transformBooking = (b) => ({
    id: b._id || b.id,
    serviceName: b.service?.name || 'Service not specified',
    date: b.date,
    timeSlot: b.timeSlot,
    status: b.status,
    price: b.price || 0,
    technicianName: b.technician?.name || null,
    address: b.address,
    city: b.city,
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20 px-4 pt-8 overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bk-fade { animation: bfade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes bfade { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8 bk-fade flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>
              My Bookings
            </h1>
            <p className="text-sm font-semibold text-slate-400 m-0">
              Review and manage your home service history
            </p>
          </div>
          <button 
            onClick={() => refetch()}
            className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer"
            title="Refresh bookings"
          >
            <HiOutlineArrowPath className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Loading your bookings...</h3>
            <p className="text-sm text-slate-400">Please wait a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-red-700 mb-2">Failed to load bookings</h3>
            <p className="text-sm text-red-500 max-w-[240px] mb-4">{error.message}</p>
            <button 
              onClick={() => refetch()}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8 bk-fade" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Upcoming', val: counts.confirmed || 0, color: '#3B82F6', bg: '#EFF6FF' },
            { label: 'Finished', val: counts.completed || 0, color: '#10B981', bg: '#F0FDF4' },
            { label: 'Cancelled', val: counts.cancelled || 0, color: '#EF4444', bg: '#FEF2F2' },
          ].map((s) => (
            <div key={s.label} className="p-4 rounded-3xl border border-white shadow-sm flex flex-col items-center" style={{ background: s.bg }}>
              <span className="text-2xl font-black mb-0.5" style={{ color: s.color, fontFamily: 'Geist, sans-serif' }}>{s.val}</span>
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: s.color }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Filter bar */}
        <div className="bk-fade overflow-x-auto no-scrollbar flex gap-2 pb-6 mb-2 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 -mx-4 px-4" style={{ animationDelay: '0.15s' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'confirmed', label: 'Upcoming' },
            { id: 'inprogress', label: 'Running' },
            { id: 'completed', label: 'Done' },
            { id: 'cancelled', label: 'History' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                filter === f.id 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200'
              }`}
              style={{ fontFamily: 'Geist, sans-serif' }}
            >
              {f.label} {counts[f.id] > 0 && <span className="ml-1 opacity-50">({counts[f.id]})</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bk-fade" style={{ animationDelay: '0.2s' }}>
          {!isLoading && !error && filtered.length > 0 ? (
            filtered.map((b) => {
              const transformed = transformBooking(b);
              return (
                <BookingCard 
                  key={transformed.id} 
                  booking={transformed} 
                  onClick={() => navigate(`/booking/${transformed.id}`)} 
                />
              );
            })
          ) : !isLoading && !error ? (
            <div className="py-20 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <HiOutlineInboxArrowDown className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>Nothing to show</h3>
              <p className="text-sm text-slate-500 max-w-[240px] mb-8">
                We couldn't find any bookings in this category.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-8 py-3.5 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100"
              >
                Browse Services
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsScreen;