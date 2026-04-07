import React, { useState } from 'react';
import { 
  FaCalendarAlt, FaCheckCircle, FaClock, FaEllipsisH, 
  FaFilter, FaSearch, FaUser, FaMapMarkerAlt, FaCreditCard,
  FaSync
} from 'react-icons/fa';
import { useBookings } from '../../../queries/useBookings';
import { formatDate, formatCurrency } from '../../../shared/utils/helpers';

/* ── Loading State ─────────────────────────────────── */
const TableSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
        <div className="h-4 bg-slate-200 rounded w-40"></div>
        <div className="h-4 bg-slate-200 rounded w-28"></div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
      </div>
    ))}
  </div>
);

const Bookings = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Fetch real bookings from API with retry logic
  const { data: bookingsResponse, isLoading, error, refetch } = useBookings({}, {
    retry: 1,
    onError: (error) => {
      console.error('❌ Failed to fetch bookings:', error);
      if (error?.response?.status === 403) {
        console.error('⚠️ You do not have permission to view all bookings. Please ensure you are logged in as admin.');
      }
    }
  });
  const bookings = bookingsResponse?.data || [];

  const filteredData = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const matchesSearch = b.customerName?.toLowerCase().includes(search.toLowerCase()) || 
                          b.id?.includes(search) ||
                          b.serviceName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'cancelled': return 'bg-slate-50 text-slate-500 border-slate-100';
      case 'inprogress': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-12">
        <div className="h-8 bg-slate-200 rounded w-48"></div>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Reservations</h1>
            <p className="text-slate-500 mt-1">Monitor and manage all service appointments.</p>
          </div>
        </div>

        {/* Error State */}
        <div className="flex items-center justify-center h-64 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
          <div className="text-center p-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-red-700 mb-2">Failed to load bookings</h3>
            <p className="text-sm text-red-600 mb-6 max-w-md">{error.message}</p>
            
            {error?.response?.status === 403 ? (
              <div className="bg-white rounded-xl p-6 border border-red-200">
                <p className="text-red-800 font-bold mb-4">⚠️ Access Denied</p>
                <p className="text-sm text-red-600 mb-4">
                  You need <strong>admin</strong> or <strong>branch-admin</strong> role to view all bookings.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => refetch()}
                    className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all cursor-pointer border-none"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => refetch()}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all cursor-pointer border-none"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Reservations</h1>
          <p className="text-slate-500 mt-1">Monitor and manage all service appointments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total: {bookings.length} | Revenue: ₹{bookings.reduce((acc, b) => acc + (b.price || 0), 0)}
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer"
            title="Refresh bookings"
          >
            <FaSync className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96 ml-2">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" 
            placeholder="Search customer or ID..." 
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:outline-none font-medium"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 pr-2">
          <div className="p-2 text-slate-400"><FaFilter size={12} /></div>
          {['All', 'Confirmed', 'Pending', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                filter === s ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Booking ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Service</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Schedule</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.length > 0 ? (
              filteredData.map((b) => (
                <tr key={b.id} className="group hover:bg-slate-50/30 transition-colors">
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">#{b.id}</span>
                  </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{b.customerName || 'N/A'}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FaMapMarkerAlt size={10}/> {b.address || b.location || 'Not specified'}
                    </span>
                  </div>
                </td>

                {/* Service */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700">{b.serviceName || 'Service not specified'}</span>
                    <span className="text-[11px] font-bold text-emerald-600">₹{b.price || 0}</span>
                  </div>
                </td>

                {/* Schedule */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <FaCalendarAlt size={10} className="text-slate-300" /> {formatDate(b.date)}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                      <FaClock size={10} className="text-slate-300" /> {b.timeSlot || 'Not scheduled'}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(b.status)}`}>
                    {b.status || 'Unknown'}
                  </span>
                </td>

                {/* Action */}
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
            ))) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500">
                  No bookings found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;