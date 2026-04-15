import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, FaClock, FaMapMarkerAlt, FaPhone, 
  FaUser, FaWrench, FaCheckCircle, FaSpinner, FaSync
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';

const TodayJobsScreen = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayCount: 0, completedCount: 0, pendingCount: 0 });
  const [updating, setUpdating] = useState({});

  React.useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/technicians/my-jobs');
      if (response.data.success) {
        setJobs(response.data.data);
        setStats(response.data.stats || { todayCount: 0, completedCount: 0, pendingCount: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      setUpdating(prev => ({ ...prev, [jobId]: true }));
      const response = await axiosInstance.patch(
        `/technicians/jobs/${jobId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        toast.success(`Job marked as ${newStatus}`);
        fetchJobs(); // Refresh the list
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(prev => ({ ...prev, [jobId]: false }));
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

  const formatTimeSlot = (timeSlot) => {
    return timeSlot || 'Time not specified';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Today's Jobs</h1>
          <p className="text-slate-500 mt-1">View and manage your scheduled jobs for today.</p>
        </div>
        <button
          onClick={fetchJobs}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer"
          title="Refresh jobs"
        >
          <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Today's Jobs</p>
              <p className="text-3xl font-bold mt-1">{stats.todayCount}</p>
            </div>
            <FaCalendarAlt className="text-blue-200 text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-1">{stats.pendingCount}</p>
            </div>
            <FaSpinner className="text-purple-200 text-3xl opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completedCount}</p>
            </div>
            <FaCheckCircle className="text-emerald-200 text-3xl opacity-50" />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaWrench className="text-slate-400 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Scheduled</h3>
          <p className="text-slate-500">You don't have any jobs assigned yet. Check back later!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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
              <div className="p-5 space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Customer</p>
                      <p className="font-semibold text-slate-900">{job.firstName} {job.lastName}</p>
                      <p className="text-sm text-slate-600">{job.phone}</p>
                    </div>
                  </div>

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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-sm">
                    <FaCalendarAlt className="text-slate-400" />
                    <span className="text-slate-700 font-medium">{formatDate(job.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaClock className="text-slate-400" />
                    <span className="text-slate-700 font-medium">{formatTimeSlot(job.timeSlot)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 font-semibold">Price:</span>
                    <span className="text-emerald-600 font-bold">₹{job.price}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  {job.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(job._id, 'in-progress')}
                      disabled={updating[job._id]}
                      className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {updating[job._id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                      onClick={() => handleStatusUpdate(job._id, 'completed')}
                      disabled={updating[job._id]}
                      className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {updating[job._id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    <div className="flex-1 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold rounded-xl text-center">
                      ✓ Job Completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodayJobsScreen;

