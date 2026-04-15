import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaPhone, FaUser, FaWrench, FaCheckCircle, FaSpinner,
  FaEnvelope, FaMoneyBillWave
} from 'react-icons/fa';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';

const JobDetailScreen = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/bookings/${jobId}`);
      if (response.data.success) {
        setJob(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch job details:', error);
      toast.error('Failed to load job details');
      navigate('/technician');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);
      const response = await axiosInstance.patch(
        `/technicians/jobs/${jobId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(`Job marked as ${newStatus}`);
        fetchJobDetails();
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-700 border-purple-200',
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Job not found</p>
        <button
          onClick={() => navigate('/technician')}
          className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/technician')}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-all"
        >
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Job Details</h1>
          <p className="text-slate-500 mt-1">Complete information about this service job</p>
        </div>
      </div>

      {/* Job Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <FaWrench className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{job.service?.name || 'Service'}</h2>
                <p className="text-emerald-100">Booking #{job._id?.slice(-6).toUpperCase()}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold bg-white ${getStatusBadge(job.status)}`}>
              {job.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Information */}
          <div className="bg-slate-50 rounded-xl p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FaUser className="text-emerald-600" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Name</p>
                <p className="font-semibold text-slate-900">{job.firstName} {job.lastName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-slate-400 text-sm" />
                  <p className="font-medium text-slate-900">{job.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-slate-400 text-sm" />
                  <p className="font-medium text-slate-900">{job.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Alternate Phone</p>
                <p className="font-medium text-slate-900">{job.alternatePhone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Service Address */}
          <div className="bg-blue-50 rounded-xl p-5">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Service Address
            </h3>
            <div className="space-y-2">
              <p className="font-medium text-slate-900">{job.address}</p>
              <p className="text-slate-600">{job.city}, {job.pincode}</p>
            </div>
          </div>

          {/* Schedule & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaCalendarAlt className="text-purple-600" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Date</p>
              </div>
              <p className="font-bold text-slate-900">
                {new Date(job.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaClock className="text-amber-600" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Time Slot</p>
              </div>
              <p className="font-bold text-slate-900">{job.timeSlot || 'Not specified'}</p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <FaMoneyBillWave className="text-emerald-600" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Payment</p>
              </div>
              <p className="font-bold text-emerald-600">₹{job.price}</p>
              <p className="text-xs text-slate-600 capitalize">{job.paymentMethod} • {job.paymentStatus}</p>
            </div>
          </div>

          {/* Notes */}
          {job.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-amber-900 mb-2">📝 Customer Notes</h3>
              <p className="text-amber-800">{job.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            {job.status === 'confirmed' && (
              <button
                onClick={() => handleStatusUpdate('in-progress')}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaSpinner />
                    Start Job
                  </>
                )}
              </button>
            )}

            {(job.status === 'in-progress' || job.status === 'confirmed') && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                disabled={updating}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Complete Job
                  </>
                )}
              </button>
            )}

            {job.status === 'completed' && (
              <div className="flex-1 px-6 py-3 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <FaCheckCircle />
                Job Completed Successfully
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailScreen;

