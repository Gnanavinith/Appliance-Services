import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, DatePicker, Select, Button, Space } from 'antd';
import dayjs from 'dayjs';
import { 
  HiOutlineUser, 
  HiOutlineMapPin, 
  HiOutlineCalendar, 
  HiOutlineCreditCard,
  HiOutlineArrowLeft,
  HiOutlineShoppingBag,
  HiCheck
} from 'react-icons/hi2';
import MapPicker from '../components/MapPicker';
import PaymentOptions from '../components/PaymentOptions';
import { useToast } from '../../../shared/hooks/useToast';
import { useDispatch, useSelector } from 'react-redux';
import { setDraftBooking } from '../../../store/slices/bookingSlice';

const { TextArea } = Input;
const { Option } = Select;

/* ── Step indicator ─────────────────────────────────── */
const StepBar = ({ steps, current }) => (
  <div className="flex items-center justify-between mb-8 px-2">
    {steps.map((s, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`
              w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300
              ${done ? 'bg-[#d97706] border-[#d97706]' : active ? 'bg-[#111] border-[#111]' : 'bg-white border-[#efefef]'}
            `}>
              {done ? (
                <HiCheck className="w-4 h-4 md:w-5 md:h-5 text-white" />
              ) : (
                <span className={`text-xs md:text-sm font-bold ${active ? 'text-white' : 'text-[#9ca3af]'}`}>{i + 1}</span>
              )}
            </div>
            <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wider ${active ? 'text-[#111]' : done ? 'text-[#d97706]' : 'text-[#9ca3af]'}`}>
              {s.title}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-[2px] mx-2 mb-6 transition-colors duration-300 ${i < current ? 'bg-[#d97706]' : 'bg-[#efefef]'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const SectionHead = ({ icon, label }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl bg-[#fffbeb] flex items-center justify-center text-[#d97706]">
      {icon}
    </div>
    <h2 className="text-xl font-bold text-[#111] m-0 tracking-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>{label}</h2>
  </div>
);

const TimeSlotPicker = ({ value, onChange }) => {
  const slots = ['09:00 AM – 11:00 AM', '11:00 AM – 01:00 PM', '01:00 PM – 03:00 PM', '03:00 PM – 05:00 PM', '05:00 PM – 07:00 PM'];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {slots.map((slot) => (
        <button
          key={slot} type="button" onClick={() => onChange(slot)}
          className={`py-3.5 px-4 rounded-xl border-2 text-sm font-semibold transition-all text-center
            ${value === slot ? 'border-[#d97706] bg-[#fffbeb] text-[#92400e]' : 'border-[#efefef] bg-white text-[#6b7280] hover:border-[#d97706]'}
          `}
        >
          {slot}
        </button>
      ))}
    </div>
  );
};

const BookingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { success, contextHolder } = useToast();
  const [form] = Form.useForm();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [timeSlot, setTimeSlot] = useState('');

  const locationService = location.state?.selectedService;
  const reduxService = useSelector((s) => s.booking.draftBooking);
  
  console.log('🔍 [BookingScreen] locationService:', locationService);
  console.log('🔍 [BookingScreen] reduxService:', reduxService);
  
  const selectedService = locationService || { _id: reduxService?.serviceId, id: reduxService?.serviceId, name: reduxService?.serviceName, price: reduxService?.price };
  
  console.log('🔍 [BookingScreen] selectedService:', selectedService);
  
  // Use _id (MongoDB ID) as the primary identifier, fallback to id if not available
  const serviceId = selectedService?._id || selectedService?.id;
  
  console.log('🔍 [BookingScreen] Final serviceId:', serviceId);

  const steps = [{ title: 'Details' }, { title: 'Location' }, { title: 'Schedule' }, { title: 'Payment' }];

  const save = (extra = {}) => {
    const v = form.getFieldsValue();
    const serialized = { ...v, ...extra };
    if (v.date?.toISOString) serialized.date = v.date.toISOString();
    dispatch(setDraftBooking({ ...serialized, timeSlot, serviceId, serviceName: selectedService?.name, price: selectedService?.price }));
  };

  const handleNext = async () => {
    try {
      await form.validateFields();
      save();
      setCurrentStep((s) => s + 1);
      window.scrollTo(0, 0);
    } catch (e) { console.log(e); }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      save();
      success('Booking Initiated', 'Moving to summary...');
      setTimeout(() => navigate('/dashboard/summary'), 800);
    } catch (e) { console.log(e); }
  };

  if (!serviceId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
        <div className="w-20 h-20 rounded-full bg-[#f9fafb] flex items-center justify-center mb-4">
          <HiOutlineShoppingBag className="w-10 h-10 text-[#9ca3af]" />
        </div>
        <h1 className="text-2xl font-bold text-[#111] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>No service selected</h1>
        <p className="text-[#6b7280] mb-6">Please select a service from our catalog to continue.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-[#d97706] text-white rounded-full font-bold border-none cursor-pointer">Browse Services</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {contextHolder}
      <style>{`
        .ant-input, .ant-select-selector, .ant-picker { 
          border-radius: 12px !important; padding: 10px 15px !important; border: 1.5px solid #efefef !important; background: #fff !important;
        }
        .ant-input:focus, .ant-select-selector:focus { border-color: #d97706 !important; background: #fff !important; }
        .ant-form-item-label label { font-size: 12px !important; font-weight: 700 !important; color: #6b7280 !important; text-transform: uppercase; }
      `}</style>

      {/* Header Section */}
      <header className="bg-white border-b border-[#efefef] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => currentStep === 0 ? navigate('/') : setCurrentStep(s => s-1)} className="p-2 -ml-2 text-[#6b7280] bg-transparent border-none cursor-pointer">
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-[#111] m-0" style={{ fontFamily: "'DM Serif Display', serif" }}>Book Service</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Service Summary Chip */}
        <div className="bg-[#111] rounded-[20px] p-5 mb-8 text-white flex justify-between items-center">
          <div>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Selected Plan</p>
            <h3 className="text-xl font-bold m-0" style={{ fontFamily: "'DM Serif Display', serif" }}>{selectedService.name}</h3>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black m-0" style={{ fontFamily: "'DM Serif Display', serif" }}>₹{selectedService.price}</p>
          </div>
        </div>

        <StepBar steps={steps} current={currentStep} />

        <div className="bg-white rounded-[20px] p-6 md:p-8 border border-[#efefef]">
          <Form form={form} layout="vertical" requiredMark={false} className="mb-0">
            
            {currentStep === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHead icon={<HiOutlineUser className="w-5 h-5" />} label="Contact Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'Required' }]}><Input placeholder="John" /></Form.Item>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Required' }]}><Input placeholder="Doe" /></Form.Item>
                </div>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}><Input placeholder="john@example.com" /></Form.Item>
                <Form.Item name="phone" label="Phone" rules={[{ required: true, pattern: /^[0-9]{10}$/ }]}><Input addonBefore="+91" placeholder="9876543210" /></Form.Item>
              </div>
            )}

            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHead icon={<HiOutlineMapPin className="w-5 h-5" />} label="Work Location" />
                <Form.Item name="addressType" label="Category" initialValue="home"><Select options={[{value:'home', label:'Home'},{value:'work', label:'Work'},{value:'other', label:'Other'}]}/></Form.Item>
                <Form.Item name="address" label="House/Flat/Street" rules={[{ required: true }]}><TextArea rows={3} /></Form.Item>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item name="city" label="City" rules={[{ required: true }]}><Input /></Form.Item>
                  <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}><Input maxLength={6} /></Form.Item>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-3">Precision Pinning</p>
                    <MapPicker onLocationSelect={(c) => { 
                      form.setFieldsValue({ 
                        lat: c.lat, 
                        lng: c.lng,
                        address: c.houseFlatStreet || c.address || form.getFieldValue('address'),
                        city: c.city || form.getFieldValue('city'),
                        pincode: c.pincode || form.getFieldValue('pincode')
                      }); 
                      if (c.address) success('Location pinned & address detected!'); 
                      else success('Location pinned!'); 
                    }} />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <SectionHead icon={<HiOutlineCalendar className="w-5 h-5" />} label="Schedule Slot" />
                <Form.Item name="date" label="Date" rules={[{ required: true }]}><DatePicker className="w-full" minDate={dayjs()} format="DD MMM YYYY" /></Form.Item>
                <div className="mb-6">
                  <label className="text-[12px] font-bold text-slate-500 uppercase block mb-3">Available Intervals</label>
                  <TimeSlotPicker value={timeSlot} onChange={(v) => { setTimeSlot(v); form.setFieldsValue({ timeSlot: v }); }} />
                </div>
                <Form.Item name="notes" label="Special Instructions"><TextArea rows={3} placeholder="Gate codes, pet info, etc." /></Form.Item>
              </div>
            )}

            {currentStep === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 text-center">
                <SectionHead icon={<HiOutlineCreditCard className="w-5 h-5" />} label="Payment Setup" />
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                  <p className="text-slate-500 text-sm mb-1">Total Payable Amount</p>
                  <h2 className="text-3xl font-black text-slate-900 m-0">₹{selectedService.price}</h2>
                </div>
                <PaymentOptions onSelect={(m) => { form.setFieldsValue({ paymentMethod: m }); success(`Method: ${m}`); }} />
                <Form.Item name="paymentMethod" hidden><Input /></Form.Item>
              </div>
            )}
          </Form>

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-[#efefef] flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => currentStep === 0 ? navigate('/') : setCurrentStep(s => s-1)}
              className="flex-1 py-4 rounded-full font-bold text-[#6b7280] bg-[#f9fafb] border-none cursor-pointer hover:bg-[#efefef] transition-colors order-2 sm:order-1"
            >
              {currentStep === 0 ? 'Cancel Booking' : 'Previous Step'}
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex-[2] py-4 rounded-full font-bold text-white bg-[#d97706] border-none cursor-pointer hover:bg-[#b45309] transition-all active:scale-95 order-1 sm:order-2"
              >
                Continue to {steps[currentStep+1].title}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-[2] py-4 rounded-full font-bold text-white bg-[#d97706] border-none cursor-pointer hover:bg-[#b45309] transition-all active:scale-95 order-1 sm:order-2"
              >
                Confirm & Pay
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookingScreen;