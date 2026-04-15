import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaSearch, 
  FaMapMarkerAlt as MapPin, 
  FaPhone as Phone, 
  FaEnvelope as Mail, 
  FaEdit as Edit, 
  FaTrashAlt as Trash,
  FaStore as BranchIcon,
  FaEllipsisV
} from 'react-icons/fa';
import { branchesApi } from '../../../api/branches.api';
import { useToast } from '../../../shared/hooks/useToast';
import Button from '../../../shared/components/Button';

const Branches = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchesApi.getBranches({ limit: 100 });
      if (response.success) {
        setBranches(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load branches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch?')) return;
    try {
      const response = await branchesApi.deleteBranch(branchId);
      if (response.success) {
        toast.success('Branch deleted successfully');
        fetchBranches();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete branch');
    }
  };

  const filteredBranches = branches.filter((branch) =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <div className="relative w-12 h-12 mb-4">
          <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium">Loading branches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Branch Management</h1>
          <p className="text-slate-500 text-sm">Organize and monitor all physical facility locations.</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/branches/create')} 
          variant="primary" 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
        >
          <FaPlus size={14} /> Create Branch
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200/60 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search by name, city, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total: {filteredBranches.length}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200/60">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Branch Info</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Location</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Contact</th>
                <th className="px-6 py-4 font-semibold text-slate-600 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-600 uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBranches.map((branch) => (
                <tr key={branch._id} className="group hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100 group-hover:scale-110 transition-transform">
                        <BranchIcon size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{branch.name}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{branch.code || 'NO-CODE'}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 max-w-[200px]">
                      <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <div className="text-slate-600 leading-relaxed">
                        <span className="block truncate font-medium">{branch.address?.street}</span>
                        <span className="text-xs text-slate-400">{branch.address?.city}, {branch.address?.state}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={12} className="text-slate-400" />
                        <span>{branch.phone}</span>
                      </div>
                      {branch.email && (
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate max-w-[150px]">{branch.email}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${
                      branch.isActive 
                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                        : 'bg-slate-50 text-slate-600 ring-slate-600/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${branch.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/branches/edit/${branch._id}`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Branch"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Branch"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBranches.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-dashed border-slate-300">
              <BranchIcon size={24} className="text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-semibold text-lg">No Branches Found</h3>
            <p className="text-slate-500 text-sm max-w-[280px] mx-auto mt-1">
              {searchTerm 
                ? `We couldn't find anything matching "${searchTerm}"` 
                : "It looks like you haven't added any branch locations yet."}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => navigate('/admin/branches/create')} 
                variant="primary" 
                className="mt-6"
              >
                + Create Your First Branch
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Branches;