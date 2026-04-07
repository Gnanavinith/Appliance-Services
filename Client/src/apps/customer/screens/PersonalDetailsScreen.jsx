import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HiOutlineUser, 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineCheck,
  HiOutlineArrowLeft
} from 'react-icons/hi2';
import { useToast } from '../../../shared/hooks/useToast';

const PersonalDetailsScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success } = useToast();
  const user = useSelector((state) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+91 9876543210',
    alternatePhone: '',
    address: {
      street: '123 Main Street',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
    },
    dateOfBirth: '1990-01-15',
    gender: 'male',
    occupation: 'Software Engineer',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically dispatch an action to update user profile
    success('Profile updated successfully!', 'Your personal details have been saved.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
  };

  const InputField = ({ icon: Icon, label, name, type = 'text', value, disabled, placeholder }) => (
    <div className="mb-5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon className="w-5 h-5" />
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          disabled={disabled || !isEditing}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 ${
            disabled || !isEditing
              ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
              : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap');
        .fade-in { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-slate-500 bg-transparent border-none cursor-pointer hover:bg-slate-50 rounded-xl transition-all"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-black text-slate-800 m-0" style={{ fontFamily: 'Geist, sans-serif' }}>
            Personal Details
          </h1>
          <button
            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer border-none ${
              isEditing
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-200'
            }`}
          >
            {isEditing ? (
              <>
                <HiOutlineBriefcase className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <HiOutlinePencil className="w-4 h-4" />
                Edit
              </>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 fade-in">
        {/* Profile Summary Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-emerald-900/20">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-black border-4 border-white/30">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>
                {user?.name || 'User Name'}
              </h2>
              <p className="text-emerald-100 text-sm font-medium">{user?.role || 'Customer'}</p>
              <p className="text-emerald-200 text-xs mt-1">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3" style={{ fontFamily: 'Geist, sans-serif' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <HiOutlineUser className="w-5 h-5" />
              </div>
              Personal Information
            </h3>

            <InputField
              icon={HiOutlineUser}
              label="Full Name"
              name="name"
              value={formData.name}
              disabled={true} // Usually name is not editable
              placeholder="Enter your full name"
            />

            <InputField
              icon={HiOutlineEnvelope}
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              disabled={true} // Usually email is not editable
              placeholder="your@email.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={HiOutlinePhone}
                label="Primary Phone"
                name="phone"
                value={formData.phone}
                placeholder="+91 XXXXXXXXXX"
              />
              <InputField
                icon={HiOutlinePhone}
                label="Alternate Phone"
                name="alternatePhone"
                value={formData.alternatePhone}
                placeholder="+91 XXXXXXXXXX (Optional)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                icon={HiOutlineCalendar}
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
              />
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3.5 rounded-xl border transition-all duration-200 ${
                    !isEditing
                      ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Occupation
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineBriefcase className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Your profession"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 ${
                    !isEditing
                      ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-3xl p-8 mb-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3" style={{ fontFamily: 'Geist, sans-serif' }}>
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700">
                <HiOutlineMapPin className="w-5 h-5" />
              </div>
              Address Information
            </h3>

            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Street Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <HiOutlineBuildingOffice className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="House no., Street name"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all duration-200 ${
                    !isEditing
                      ? 'bg-slate-50 border-slate-200 text-slate-600 cursor-not-allowed'
                      : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                icon={HiOutlineBuildingOffice}
                label="City"
                name="address.city"
                value={formData.address.city}
                placeholder="City"
              />
              <InputField
                icon={HiOutlineMapPin}
                label="State"
                name="address.state"
                value={formData.address.state}
                placeholder="State"
              />
            </div>

            <InputField
              icon={HiOutlineMapPin}
              label="Pincode"
              name="address.pincode"
              value={formData.address.pincode}
              placeholder="6-digit pincode"
            />
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4 mb-8">
              <button
                type="submit"
                className="flex-1 py-4 rounded-xl font-bold text-white bg-emerald-700 border-none cursor-pointer shadow-lg shadow-emerald-200 hover:bg-emerald-800 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <HiOutlineCheck className="w-5 h-5" />
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 border-none cursor-pointer hover:bg-slate-200 transition-all active:scale-95"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Account Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-lg font-black text-slate-800 mb-4" style={{ fontFamily: 'Geist, sans-serif' }}>
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Account Type</span>
              <span className="text-sm font-bold text-slate-900 capitalize">{user?.role || 'Customer'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-500">Member Since</span>
              <span className="text-sm font-bold text-slate-900">January 2024</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-semibold text-slate-500">Account Status</span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalDetailsScreen;
