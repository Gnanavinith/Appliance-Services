import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { 
  HiCheck, 
  HiOutlineDocumentText, 
  HiOutlineShare, 
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineEnvelope,
  HiOutlineWrenchScrewdriver,
  HiOutlinePhoneArrowUpRight,
  HiOutlineHome
} from 'react-icons/hi2';
import { formatCurrency, formatDate } from '../../../shared/utils/helpers';

/* ── Design tokens ───────────────────────────────────── */
const T = {
  green:   '#16A34A',
  greenDk: '#15803D',
  greenLt: '#F0FDF4',
  greenMd: '#DCFCE7',
  ink:     '#0A0A0A',
  ink2:    '#404040',
  ink3:    '#737373',
  line:    '#E5E5E5',
  surface: '#FFFFFF',
  bg:      '#FAFAF9',
};

/* ── Timeline step ───────────────────────────────────── */
const TimelineStep = ({ icon, title, body, done, last }) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-base transition-colors duration-300 ${done ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-200'}`}>
        {done ? (
          <HiCheck className="w-4 h-4" />
        ) : <span>{icon}</span>}
      </div>
      {!last && <div className={`w-0.5 flex-1 min-h-[24px] mt-1 ${done ? 'bg-emerald-600' : 'bg-slate-200'}`} />}
    </div>
    <div className={`${last ? 'pb-0' : 'pb-6'}`}>
      <h4 className="text-sm font-bold text-slate-900 mb-1 leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed m-0">{body}</p>
    </div>
  </div>
);

/* ── Info row ────────────────────────────────────────── */
const InfoRow = ({ label, value, accent, last }) => (
  <div className={`flex justify-between items-start py-3.5 ${last ? '' : 'border-b border-slate-100'}`}>
    <span className="text-[13px] text-slate-500 font-medium">{label}</span>
    <span className={`text-[13px] font-bold text-right max-w-[60%] ${accent ? 'text-emerald-600' : 'text-slate-900'}`}>
      {value}
    </span>
  </div>
);

const ConfirmationScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const b = location.state || {
    bookingId: `BK${Date.now()}`,
    serviceName: 'AC Repair & Service',
    price: 499,
    date: new Date().toISOString(),
    timeSlot: '11:00 AM – 01:00 PM',
    address: '123, Sample Street, Chennai – 600001',
    phone: '9876543210',
  };

  const copyId = () => {
    navigator.clipboard.writeText(b.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsApp = () => {
    const txt = encodeURIComponent(`Booking Confirmed!\nID: ${b.bookingId}\nService: ${b.serviceName}\nDate: ${formatDate(b.date)}`);
    window.open(`https://wa.me/91${b.phone}?text=${txt}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-12">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .conf-pop { animation: cpop .6s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes cpop { from { opacity:0; transform:scale(.5); } to { opacity:1; transform:scale(1); } }
        .conf-fade { animation: cfade .5s .2s cubic-bezier(.22,1,.36,1) both; }
        @keyframes cfade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
      `}</style>

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4 pt-10">
        
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="conf-pop inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-6 shadow-xl shadow-emerald-200">
            <HiCheck className="w-9 h-9 text-white" />
          </div>
          <div className="conf-fade">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Success
            </span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 m-0" style={{ fontFamily: 'Syne, sans-serif' }}>
              Booking Confirmed!
            </h1>
            <p className="text-slate-500 text-sm m-0 px-4">
              Your technician will be assigned shortly. You'll receive updates via SMS.
            </p>
          </div>
        </div>

        {/* Booking ID Plate */}
        <div className="conf-fade bg-white rounded-3xl p-6 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 shadow-sm">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order Identifier</p>
            <h2 className="text-2xl font-black text-slate-900 m-0 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              {b.bookingId}
            </h2>
          </div>
          <button 
            onClick={copyId}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200 border' : 'bg-slate-900 text-white border-none active:scale-95'}`}
          >
            {copied ? (
              <><HiCheck className="w-4 h-4" /> Copied</>
            ) : (
              <><HiOutlineClipboardDocumentList className="w-4 h-4" /> Copy ID</>
            )}
          </button>
        </div>

        {/* Action Grid */}
        <div className="conf-fade grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm active:bg-slate-50 transition-colors">
            <HiOutlineDocumentText className="w-[18px] h-[18px]" />
            Download Invoice
          </button>
          <button 
            onClick={() => setShareOpen(true)}
            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 text-sm active:bg-slate-50 transition-colors"
          >
            <HiOutlineShare className="w-[18px] h-[18px]" />
            Share Booking
          </button>
        </div>

        {/* Details Card */}
        <div className="conf-fade bg-white rounded-3xl overflow-hidden border border-slate-200 mb-4 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            <HiOutlineClipboardDocumentList className="text-xl" />
            <h3 className="font-bold text-slate-800 m-0 text-sm uppercase tracking-wider">Booking Summary</h3>
          </div>
          <div className="px-6 py-2">
            <InfoRow label="Service Type" value={b.serviceName} />
            <InfoRow label="Total Amount" value={formatCurrency(b.price, 'INR')} accent />
            <InfoRow label="Schedule Date" value={formatDate(b.date)} />
            <InfoRow label="Time Window" value={b.timeSlot} />
            <InfoRow label="Site Address" value={b.address} last />
          </div>
        </div>

        {/* Timeline Section */}
        <div className="conf-fade bg-white rounded-3xl overflow-hidden border border-slate-200 mb-6 shadow-sm">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
            <HiOutlineCalendarDays className="text-xl" />
            <h3 className="font-bold text-slate-800 m-0 text-sm uppercase tracking-wider">Next Steps</h3>
          </div>
          <div className="px-6 py-6">
            <TimelineStep done icon={<HiOutlineEnvelope className="text-xl" />} title="Confirmation Processed" body="SMS details have been dispatched to your mobile." />
            <TimelineStep done icon={<HiOutlineWrenchScrewdriver className="text-xl" />} title="Assigning Professional" body="A local expert will be assigned within the hour." />
            <TimelineStep icon={<HiOutlinePhone className="text-xl" />} title="Contact Verification" body="Technician will call to verify site entry." />
            <TimelineStep icon={<HiOutlineHome className="text-xl" />} title="On-site Fulfillment" body="Expert arrival scheduled for your chosen slot." last />
          </div>
        </div>

        {/* Help Actions */}
        <div className="conf-fade bg-emerald-50 rounded-3xl p-6 border border-emerald-100 mb-8">
            <h4 className="text-[11px] font-black text-emerald-800 uppercase tracking-widest mb-4">Need Assistance?</h4>
            <div className="grid grid-cols-2 gap-3">
                <a href={`tel:+91${b.phone}`} className="flex items-center justify-center gap-2 py-3 bg-white border border-emerald-200 rounded-xl font-bold text-emerald-700 text-xs no-underline shadow-sm">
                    <HiOutlinePhone className="w-[14px] h-[14px]" />
                    Call Support
                </a>
                <button onClick={whatsApp} className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white border-none rounded-xl font-bold text-xs shadow-md shadow-emerald-200">
                    <HiOutlineChatBubbleLeftRight className="w-[14px] h-[14px]" />
                    WhatsApp
                </button>
            </div>
        </div>

        {/* Final Navigation */}
        <div className="conf-fade grid grid-cols-2 gap-3 sticky bottom-4">
          <button 
            onClick={() => navigate('/bookings')}
            className="py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-lg"
          >
            My Bookings
          </button>
          <button 
            onClick={() => navigate('/')}
            className="py-4 bg-emerald-600 text-white border-none rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-transform"
          >
            Back to Home
          </button>
        </div>

      </div>

      {/* Mobile Friendly Share Modal */}
      <Modal
        title={<span className="font-black text-slate-800" style={{ fontFamily: 'Syne' }}>Share Booking</span>}
        open={shareOpen}
        onCancel={() => setShareOpen(false)}
        footer={null}
        centered
        className="rounded-3xl overflow-hidden"
      >
        <div className="flex flex-col gap-3 py-4">
          <button onClick={copyId} className="py-4 border border-slate-200 bg-slate-50 rounded-2xl font-bold text-slate-700">
            {copied ? '✓ Booking ID Copied' : 'Copy Booking ID'}
          </button>
          <button onClick={whatsApp} className="py-4 bg-emerald-600 text-white rounded-2xl font-bold border-none">
            Share on WhatsApp
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationScreen;