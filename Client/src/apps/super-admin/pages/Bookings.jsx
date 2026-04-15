import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, FaCheckCircle, FaClock, FaEllipsisH, 
  FaFilter, FaSearch, FaUser, FaMapMarkerAlt, FaCreditCard,
  FaSync, FaUserCog, FaTimes
} from 'react-icons/fa';
import { useBookings } from '../../../queries/useBookings';
import { formatDate, formatCurrency } from '../../../shared/utils/helpers';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';

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
  const toast = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [technicians, setTechnicians] = useState([]);
  const [assignModal, setAssignModal] = useState({ open: false, bookingId: null, currentTechId: null });
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assigning, setAssigning] = useState(false);
  
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

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await axiosInstance.get('/technicians');
      if (response.data.success) {
        setTechnicians(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnician) {
      toast.error('Please select a technician');
      return;
    }

    try {
      setAssigning(true);
      const response = await axiosInstance.patch(
        `/bookings/${assignModal.bookingId}/assign-technician`,
        { technicianId: selectedTechnician }
      );

      if (response.data.success) {
        toast.success('Technician assigned successfully');
        setAssignModal({ open: false, bookingId: null, currentTechId: null });
        setSelectedTechnician('');
        refetch();
      }
    } catch (error) {
      console.error('Assign technician error:', error);
      toast.error(error.response?.data?.message || 'Failed to assign technician');
    } finally {
      setAssigning(false);
    }
  };

  const openAssignModal = (booking) => {
    setAssignModal({
      open: true,
      bookingId: booking._id,
      currentTechId: booking.technician?._id || null
    });
    setSelectedTechnician(booking.technician?._id || '');
  };

  const closeAssignModal = () => {
    setAssignModal({ open: false, bookingId: null, currentTechId: null });
    setSelectedTechnician('');
  };

  const filteredData = bookings.filter(b => {
    const customerName = b.firstName && b.lastName ? `${b.firstName} ${b.lastName}` : 
                         b.customer?.name || 'N/A';
    const serviceName = b.service?.name || 'Service not specified';
    const bookingId = b._id?.slice(-6).toUpperCase() || 'N/A';
    
    const matchesFilter = filter === 'All' || b.status === filter.toLowerCase();
    const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) || 
                          bookingId.toLowerCase().includes(search.toLowerCase()) ||
                          serviceName.toLowerCase().includes(search.toLowerCase());
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
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Technician</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Schedule</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.length > 0 ? (
              filteredData.map((b) => {
                const customerName = b.firstName && b.lastName ? `${b.firstName} ${b.lastName}` : 
                                     b.customer?.name || 'N/A';
                const serviceName = b.service?.name || 'Service not specified';
                const bookingId = b._id?.slice(-6).toUpperCase() || 'N/A';
                const formattedDate = b.date ? new Date(b.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                }) : 'Not scheduled';
                
                return (
                <tr key={b._id} className="group hover:bg-slate-50/30 transition-colors">
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-slate-400">#{bookingId}</span>
                  </td>

                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 tracking-tight">{customerName}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <FaMapMarkerAlt size={10}/> {b.address && b.city ? `${b.address}, ${b.city}` : b.address || b.city || 'Not specified'}
                    </span>
                  </div>
                </td>

                {/* Service */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700">{serviceName}</span>
                    <span className="text-[11px] font-bold text-emerald-600">₹{b.price || 0}</span>
                  </div>
                </td>

                {/* Technician */}
                <td className="px-6 py-4">
                  {b.technician ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                        {b.technician.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-900">{b.technician.name}</span>
                        <span className="text-[10px] text-slate-500 block">{b.technician.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium italic">Not Assigned</span>
                  )}
                </td>

                {/* Schedule */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <FaCalendarAlt size={10} className="text-slate-300" /> {formattedDate}
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
                  <button 
                    onClick={() => openAssignModal(b)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                    title="Assign Technician"
                  >
                    <FaUserCog size={16} />
                  </button>
                </td>
              </tr>
            )})) : (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500">
                  No bookings found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Technician Assignment Modal */}
      {assignModal.open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Assign Technician</h2>
                <p className="text-sm text-slate-500 mt-1">Select a technician for this booking</p>
              </div>
              <button
                onClick={closeAssignModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Booking Info */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-mono font-bold text-slate-900">#{assignModal.bookingId?.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Technician:</span>
                  <span className="font-medium text-slate-900">
                    {technicians.find(t => t._id === assignModal.currentTechId)?.name || 'Not Assigned'}
                  </span>
                </div>
              </div>

              {/* Technician Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Technician *
                </label>
                <select
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all bg-white"
                >
                  <option value="">Choose a technician...</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name} - {tech.phone}
                      {tech.skills?.length > 0 ? ` (${tech.skills.join(', ')})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Available Technicians Info */}
              {technicians.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">Available Technicians ({technicians.length})</p>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {technicians.map((tech) => (
                      <div key={tech._id} className="flex items-center gap-2 text-xs text-emerald-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="font-medium">{tech.name}</span>
                        <span className="text-emerald-500">•</span>
                        <span>{tech.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {technicians.length === 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-amber-800">
                    ⚠️ No technicians available. Please add technicians first.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeAssignModal}
                disabled={assigning}
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTechnician}
                disabled={assigning || !selectedTechnician}
                className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {assigning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <FaUserCog size={14} />
                    Assign Technician
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;