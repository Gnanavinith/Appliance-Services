import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  HiChevronLeft, 
  HiOutlineWrenchScrewdriver, 
  HiOutlineMapPin, 
  HiOutlinePhone, 
  HiOutlineShieldCheck,
  HiCheckCircle
} from 'react-icons/hi2';
import { FiLoader } from 'react-icons/fi';
import { useCreateBooking } from '../../../queries/useBookings';
import { useToast } from '../../../shared/hooks/useToast';

/* ── Detail row ─────────────────────────────────────── */
const Row = ({ label, value, accent, last }) => (
  <div className={`flex justify-between items-start py-4 ${!last ? 'border-b border-neutral-100' : ''}`}>
    <span className="text-[13px] text-neutral-500 font-medium font-geist">{label}</span>
    <span className={`text-[13px] font-bold text-right max-w-[65%] leading-relaxed font-geist ${accent ? 'text-green-600' : 'text-neutral-900'}`}>
      {value || '—'}
    </span>
  </div>
);

/* ── Section card ───────────────────────────────────── */
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-[24px] border border-neutral-200 overflow-hidden mb-4 shadow-sm">
    <div className="px-5 py-4 bg-neutral-50/50 border-b border-neutral-100 flex items-center gap-3">
      <Icon className="text-xl text-green-600" />
      <span className="text-[12px] font-black text-neutral-900 uppercase tracking-wider font-geist">
        {title}
      </span>
    </div>
    <div className="px-5 py-1">
      {children}
    </div>
  </div>
);

/* ── Assurance pill ─────────────────────────────────── */
const Assurance = ({ text }) => (
  <div className="flex items-center gap-3 py-3.5 border-b border-neutral-100 last:border-0">
    <HiCheckCircle className="text-green-500 text-lg shrink-0" />
    <span className="text-[13px] text-neutral-700 font-semibold font-geist">{text}</span>
  </div>
);

const SummaryScreen = () => {
  const navigate = useNavigate();
  const { success, error, contextHolder } = useToast();

  const draftBooking = useSelector((s) => s.booking.draftBooking);
  const auth = useSelector((s) => s.auth);
  const { mutate: createBooking, isLoading: isCreating } = useCreateBooking();

  const userData = auth.user || { name: '', phone: '', email: '' };

  const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleConfirm = () => {
    console.log('🔍 DEBUG - Draft Booking:', draftBooking);
    console.log('🔍 DEBUG - Service ID being sent:', draftBooking.serviceId);
    console.log('🔍 DEBUG - Service ID type:', typeof draftBooking.serviceId);
    
    const parts = (userData?.name || '').split(' ').filter(Boolean);
    const bookingData = {
      serviceId: draftBooking.serviceId,
      firstName: parts[0] || draftBooking.firstName || 'User',
      lastName: parts.slice(1).join(' ') || draftBooking.lastName || '',
      email: userData?.email || draftBooking.email,
      phone: userData?.phone || draftBooking.phone,
      address: draftBooking.address,
      city: draftBooking.city,
      pincode: draftBooking.pincode,
      date: draftBooking.date,
      timeSlot: draftBooking.timeSlot,
      paymentMethod: draftBooking.paymentMethod || 'cash',
    };

    console.log('🚀 Sending booking data:', bookingData);

    createBooking(bookingData, {
      onSuccess: (data) => {
        success('Booking successful');
        navigate('/dashboard/confirmation', {
          state: {
            bookingId: data.data._id,
            serviceName: draftBooking.serviceName,
            price: draftBooking.price,
            date: draftBooking.date,
            timeSlot: draftBooking.timeSlot,
            address: draftBooking.address,
            phone: userData?.phone,
          },
        });
      },
      onError: (err) => error('Error', err?.response?.data?.message || 'Failed to book'),
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-geist antialiased">
      {contextHolder}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Geist:wght@400;500;600;700;800&display=swap');
        .sum-fade { animation: sfade 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
        @keyframes sfade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="max-w-[640px] mx-auto px-5 py-10 pb-32 sum-fade">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="group bg-white border border-neutral-200 rounded-xl px-4 py-2 text-[12px] font-bold cursor-pointer flex items-center gap-2 mb-6 text-neutral-600 transition-all hover:border-neutral-300 hover:bg-neutral-50"
          >
            <HiChevronLeft className="text-lg transition-transform group-hover:-translate-x-0.5" />
            Back
          </button>
          <h1 className="font-syne text-[34px] font-extrabold text-neutral-900 leading-tight mb-2 tracking-tight">
            Review Booking
          </h1>
          <p className="text-neutral-500 text-sm font-medium">
            Confirm your details before we assign an expert.
          </p>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          <Section title="Service Details" icon={HiOutlineWrenchScrewdriver}>
            <Row label="Service" value={draftBooking.serviceName} />
            <Row label="Booking Date" value={fmtDate(draftBooking.date)} />
            <Row label="Arrival Window" value={draftBooking.timeSlot} />
            <Row label="Payment Mode" value={draftBooking.paymentMethod === 'cash' ? 'Cash after service' : 'Online Payment'} last />
          </Section>

          <Section title="Service Location" icon={HiOutlineMapPin}>
            <Row label="Address" value={draftBooking.address} />
            <Row label="City / Pincode" value={`${draftBooking.city} - ${draftBooking.pincode}`} last />
          </Section>

          <Section title="Contact Info" icon={HiOutlinePhone}>
            <Row label="Customer" value={userData?.name || 'Guest User'} />
            <Row label="Mobile" value={`+91 ${userData?.phone || draftBooking.phone}`} last />
          </Section>

          <Section title="Trust & Safety" icon={HiOutlineShieldCheck}>
            <Assurance text="90-day warranty on all repairs" />
            <Assurance text="Fully background-verified professionals" />
            <Assurance text="Technician calls 30 mins before arrival" />
          </Section>
        </div>

        {/* Price Summary */}
        <div className="bg-green-50 p-6 rounded-[24px] border border-green-100 mt-6">
          <div className="flex justify-between mb-3">
            <span className="text-[14px] text-green-800 font-semibold italic">Expert Service Fee</span>
            <span className="text-[14px] text-green-800 font-bold">₹{draftBooking.price}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-[13px] text-green-800/70 font-medium">Taxes & Fees</span>
            <span className="text-[13px] text-green-800 font-bold">Included</span>
          </div>
          <div className="border-t border-green-200/60 pt-4 flex justify-between items-center">
            <span className="text-base font-extrabold text-neutral-900 font-geist">Total Payable</span>
            <span className="font-syne text-[36px] font-extrabold text-green-600 leading-none">
              ₹{draftBooking.price}
            </span>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-5 border-t border-neutral-200 flex justify-center z-[100]">
          <button
            onClick={handleConfirm}
            disabled={isCreating}
            className={`max-w-[600px] w-full py-4.5 rounded-2xl border-0 text-white text-[15px] font-black cursor-pointer shadow-[0_12px_24px_rgba(22,163,74,0.25)] flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${
              isCreating ? 'bg-neutral-400 cursor-not-allowed shadow-none' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isCreating ? (
              <>
                <FiLoader className="animate-spin text-xl" />
                Processing...
              </>
            ) : 'Confirm & Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;