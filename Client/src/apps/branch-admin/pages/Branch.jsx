import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, FaMapMarkerAlt, FaPhone, FaEnvelope, 
  FaEdit, FaSave, FaTimes, FaUserTie, FaCheckCircle,
  FaClock, FaChartLine
} from 'react-icons/fa';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';
import { useSelector } from 'react-redux';

const BranchPage = () => {
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalTechnicians: 0,
    activeBookings: 0,
    completedToday: 0,
    monthlyRevenue: 0,
  });

  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
    contact: {
      phone: '',
      email: '',
    },
    managerName: '',
  });

  useEffect(() => {
    fetchBranchDetails();
  }, []);

  const fetchBranchDetails = async () => {
    try {
      setLoading(true);
      // Fetch branch details - assuming branch admin has branchId in their user object
      const branchId = user?.branchId;
      
      if (!branchId) {
        toast.error('No branch assigned', 'Please contact super admin to assign a branch.');
        return;
      }

      const response = await axiosInstance.get(`/branches/${branchId}`);
      if (response.data.success) {
        const branchData = response.data.data;
        setBranch(branchData);
        setFormData({
          name: branchData.name || '',
          address: {
            street: branchData.address?.street || '',
            city: branchData.address?.city || '',
            state: branchData.address?.state || '',
            pincode: branchData.address?.pincode || '',
          },
          contact: {
            phone: branchData.contact?.phone || '',
            email: branchData.contact?.email || '',
          },
          managerName: branchData.managerName || '',
        });

        // Fetch stats
        fetchBranchStats(branchId);
      }
    } catch (error) {
      console.error('Failed to fetch branch details:', error);
      toast.error('Failed to load branch details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranchStats = async (branchId) => {
    try {
      // Fetch technicians count
      const techResponse = await axiosInstance.get(`/technicians?branchId=${branchId}`);
      if (techResponse.data.success) {
        setStats(prev => ({
          ...prev,
          totalTechnicians: techResponse.data.data.length,
        }));
      }

      // Fetch bookings stats
      const bookingsResponse = await axiosInstance.get(`/bookings?branchId=${branchId}`);
      if (bookingsResponse.data.success) {
        const bookings = bookingsResponse.data.data;
        const today = new Date().toISOString().split('T')[0];
        
        setStats(prev => ({
          ...prev,
          activeBookings: bookings.filter(b => ['confirmed', 'in-progress'].includes(b.status)).length,
          completedToday: bookings.filter(b => {
            const bookingDate = new Date(b.date).toISOString().split('T')[0];
            return b.status === 'completed' && bookingDate === today;
          }).length,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axiosInstance.patch(`/branches/${branch._id}`, formData);
      
      if (response.data.success) {
        toast.success('Branch updated successfully');
        setBranch(response.data.data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Failed to update branch:', error);
      toast.error('Failed to update branch', error.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: branch.name || '',
      address: {
        street: branch.address?.street || '',
        city: branch.address?.city || '',
        state: branch.address?.state || '',
        pincode: branch.address?.pincode || '',
      },
      contact: {
        phone: branch.contact?.phone || '',
        email: branch.contact?.email || '',
      },
      managerName: branch.managerName || '',
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-slate-400 font-medium">Loading branch details...</div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FaBuilding className="text-6xl text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">No Branch Assigned</h2>
          <p className="text-slate-500">Please contact super admin to assign you to a branch.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Branch Management</h1>
          <p className="text-slate-500">View and manage your branch details</p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2"
          >
            <FaEdit size={14} />
            Edit Branch
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaTimes size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <FaSave size={14} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Technicians', 
            val: stats.totalTechnicians, 
            icon: <FaUserTie />, 
            color: 'text-blue-600', 
            bg: 'bg-blue-50' 
          },
          { 
            label: 'Active Bookings', 
            val: stats.activeBookings, 
            icon: <FaClock />, 
            color: 'text-amber-600', 
            bg: 'bg-amber-50' 
          },
          { 
            label: 'Completed Today', 
            val: stats.completedToday, 
            icon: <FaCheckCircle />, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50' 
          },
          { 
            label: 'Status', 
            val: branch.isActive ? 'Active' : 'Inactive', 
            icon: <FaChartLine />, 
            color: branch.isActive ? 'text-emerald-600' : 'text-slate-600', 
            bg: branch.isActive ? 'bg-emerald-50' : 'bg-slate-100' 
          },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${s.bg} ${s.color} text-xl`}>{s.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.val}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Branch Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaBuilding className="text-slate-400" /> Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Branch Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Branch Manager</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.managerName}
                  onChange={(e) => handleInputChange(null, 'managerName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.managerName || 'Not assigned'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Branch ID</label>
              <p className="text-sm font-mono py-3 px-4 bg-slate-50 rounded-xl text-slate-700">#{branch._id?.slice(-6).toUpperCase()}</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaPhone className="text-slate-400" /> Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.contact?.phone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email</label>
              {editing ? (
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.contact?.email || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-slate-400" /> Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Street</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.address?.street || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">City</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.address?.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">State</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.address?.state || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pincode</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 py-3 px-4 bg-slate-50 rounded-xl">{branch.address?.pincode || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchPage;
