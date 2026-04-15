import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, 
  FaUser, FaWrench, FaCheckCircle, FaHistory
} from 'react-icons/fa';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';

const JobHistoryScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobHistory();
  }, []);

  const fetchJobHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/technicians/my-jobs');
      if (response.data.success) {
        // Filter only completed and cancelled jobs
        const historyJobs = response.data.data.filter(
          job => job.status === 'completed' || job.status === 'cancelled'
        );
        setJobs(historyJobs);
      }
    } catch (error) {
      console.error('Failed to fetch job history:', error);
      toast.error('Failed to load job history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'cancelled': 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Job History</h1>
        <p className="text-slate-500 mt-1">View your completed and cancelled jobs.</p>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHistory className="text-slate-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
          <p className="text-slate-500">Your completed jobs will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div 
              key={job._id} 
              onClick={() => navigate(`/technician/job/${job._id}`)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
            >
              {/* Job Header */}
              <div className="bg-gradient-to-r from-slate-50 to-white p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FaWrench className="text-emerald-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg">{job.service?.name || 'Service'}</h3>
                      <p className="text-sm text-slate-500">Booking #{job._id?.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Customer Info */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Customer</p>
                      <p className="font-semibold text-slate-900">{job.firstName} {job.lastName}</p>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <FaPhone size={10} /> {job.phone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Address</p>
                      <p className="font-medium text-slate-900 text-sm">{job.address}</p>
                      <p className="text-sm text-slate-600">{job.city} - {job.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule & Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-slate-400" />
                    <span className="text-slate-700 font-medium">{formatDate(job.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaClock className="text-slate-400" />
                    <span className="text-slate-700 font-medium">{job.timeSlot || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 font-semibold">Price:</span>
                    <span className="text-emerald-600 font-bold">₹{job.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobHistoryScreen;
