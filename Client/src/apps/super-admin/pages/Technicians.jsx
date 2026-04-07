import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  FaUserPlus, FaTrash, FaEdit, FaPlus, FaFilter, 
  FaCircle, FaEnvelope, FaPhoneAlt 
} from 'react-icons/fa';

import { branchesApi } from '../../../api/branches.api';
import axiosInstance from '../../../api/axiosInstance';
import { useToast } from '../../../shared/hooks/useToast';
import Button from '../../../shared/components/Button';

const Technicians = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Queries & Mutations
  const { data: techniciansData, isLoading: loadingTechnicians } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => (await axiosInstance.get('/technicians')).data,
  });

  const { data: branchesData, isLoading: loadingBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => (await branchesApi.getBranches({ limit: 100 })).data,
  });

  const assignToBranch = useMutation({
    mutationFn: async ({ branchId, technicianId }) => await branchesApi.addTechnicianToBranch(branchId, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches', 'technicians']);
      toast.success('Assigned successfully');
    },
  });

  const removeFromBranch = useMutation({
    mutationFn: async ({ branchId, technicianId }) => await branchesApi.removeTechnicianFromBranch(branchId, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches', 'technicians']);
      toast.success('Removed from branch');
    },
  });

  const deleteTechnician = useMutation({
    mutationFn: async (id) => await axiosInstance.delete(`/technicians/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['technicians']);
      toast.success('Technician deleted');
    },
  });

  const technicians = techniciansData?.data || [];
  const branches = branchesData?.data || [];

  const filteredTechnicians = selectedBranch === 'all' 
    ? technicians 
    : technicians.filter(t => branches.find(b => b._id === selectedBranch)?.technicians?.some(tech => tech._id === t._id));

  if (loadingTechnicians || loadingBranches) return (
    <div className="flex flex-col items-center justify-center h-96 space-y-4">
      <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
      <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Syncing Personnel...</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">Technicians</h1>
          <p className="text-sm text-slate-500">Manage workforce assignments across {branches.length} branches.</p>
        </div>
        <Button onClick={() => navigate('/admin/technicians/new')} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold">
          <FaUserPlus size={14} /> Add New
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 w-fit">
        <FaFilter size={12} className="text-slate-400 ml-2" />
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="bg-transparent text-xs font-black uppercase tracking-wider text-slate-600 focus:outline-none cursor-pointer"
        >
          <option value="all">Global Fleet</option>
          {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
      </div>

      {/* Modern Table */}
      <div className="overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Personnel</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Jobs</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assignments</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTechnicians.map((tech) => (
              <tr key={tech._id} className="group hover:bg-slate-50/50 transition-colors">
                {/* Name & ID */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                      {tech.name?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 tracking-tight">{tech.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">ID: {tech._id.slice(-6)}</div>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 text-xs text-slate-600"><FaEnvelope size={10} className="text-slate-300"/> {tech.email}</span>
                    <span className="flex items-center gap-2 text-xs text-slate-600"><FaPhoneAlt size={10} className="text-slate-300"/> {tech.phone}</span>
                  </div>
                </td>

                {/* Jobs Stat */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tech.completedJobs || 0}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Done</div>
                    </div>
                    <div className="h-6 w-px bg-slate-100" />
                    <div>
                      <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <FaCircle size={6} className="animate-pulse" /> {tech.activeJobs || 0}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Live</div>
                    </div>
                  </div>
                </td>

                {/* Branch Assignments */}
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    {branches
                      .filter(b => b.technicians?.some(t => t._id === tech._id))
                      .map(b => (
                        <span key={b._id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-md text-[10px] font-bold text-slate-600 shadow-sm">
                          {b.name}
                          <button 
                            onClick={() => removeFromBranch.mutate({ branchId: b._id, technicianId: tech._id })}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    
                    {/* Inline Assign Select */}
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          assignToBranch.mutate({ branchId: e.target.value, technicianId: tech._id });
                          e.target.value = "";
                        }
                      }}
                      className="text-[10px] font-bold text-slate-400 bg-transparent border border-dashed border-slate-300 rounded-md px-2 py-1 hover:border-slate-400 hover:text-slate-600 outline-none transition-all cursor-pointer"
                    >
                      <option value="">+ Assign</option>
                      {branches.filter(b => !b.technicians?.some(t => t._id === tech._id)).map(b => (
                        <option key={b._id} value={b._id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => navigate(`/admin/technicians/${tech._id}`)}
                      className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button 
                      onClick={() => window.confirm('Delete technician?') && deleteTechnician.mutate(tech._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTechnicians.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-xs font-mono uppercase tracking-widest">
            No technicians matched the filter
          </div>
        )}
      </div>
    </div>
  );
};

export default Technicians;