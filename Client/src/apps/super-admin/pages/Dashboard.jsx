import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area, Legend 
} from 'recharts';
import { 
  FaBuilding, FaCheckCircle, FaClipboardList, FaWallet, 
  FaChartLine, FaMapMarkerAlt, FaHistory 
} from 'react-icons/fa';
import { branchesApi } from '../../../api/branches.api';
import { useToast } from '../../../shared/hooks/useToast';

const Dashboard = () => {
  const toast = useToast();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBranches: 0,
    activeBranches: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await branchesApi.getBranches({ limit: 100 });
      console.log('📊 Dashboard branches response:', response);
      if (response.success) {
        const data = response.data;
        console.log('📊 Branches data:', data);
        setBranches(data);
        setStats({
          totalBranches: data.length,
          activeBranches: data.filter(b => b.isActive).length,
          totalBookings: data.reduce((sum, b) => sum + (b.totalBookings || 0), 0),
          totalRevenue: data.reduce((sum, b) => sum + (b.revenue || 0), 0),
        });
      }
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      toast.error('Failed to load analytical data', error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Data Transformations for Charts ---
  const revenueData = branches.length > 0 ? branches.slice(0, 6).map(b => ({
    name: b.name.split(' ')[0],
    revenue: b.revenue || 0,
    bookings: b.totalBookings || 0
  })) : [{ name: 'No Data', revenue: 0, bookings: 0 }];

  const statusData = [
    { name: 'Active', value: stats.activeBranches || 0, color: '#10b981' },
    { name: 'Inactive', value: (stats.totalBranches - stats.activeBranches) || 0, color: '#94a3b8' },
  ];

  // Mocking a growth trend based on existing totals
  const trendData = [
    { month: 'Jan', val: 400 }, { month: 'Feb', val: 700 },
    { month: 'Mar', val: 1200 }, { month: 'Apr', val: stats.totalBookings || 1500 },
  ];

  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-pulse text-slate-400 font-medium">Synchronizing data...</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500">Real-time performance metrics across your service network.</p>
        </div>
        <div className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-slate-500 border border-slate-200">
          Last Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Branches', val: stats.totalBranches, icon: <FaBuilding />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Sites', val: stats.activeBranches, icon: <FaCheckCircle />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Total Bookings', val: stats.totalBookings.toLocaleString(), icon: <FaClipboardList />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Gross Revenue', val: `₹${stats.totalRevenue.toLocaleString()}`, icon: <FaWallet />, color: 'text-amber-600', bg: 'bg-amber-50' },
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

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FaChartLine className="text-slate-400" /> Revenue by Branch
            </h3>
          </div>
          <div style={{ height: '300px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution (Pie) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 mb-8">Operational Status</h3>
          <div style={{ height: '240px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto pt-4 text-center text-xs text-slate-400 border-t border-slate-50">
            Based on {stats.totalBranches} total locations
          </div>
        </div>
      </div>

      {/* Secondary Row: Trend and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart: Bookings Growth */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-8 flex items-center gap-2">
            <FaHistory className="text-slate-400" /> Bookings Growth
          </h3>
          <div style={{ height: '250px', width: '100%', minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <Tooltip />
                <Area type="monotone" dataKey="val" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Branch Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <h3 className="font-bold text-slate-800 mb-6">Recently Added</h3>
          <div className="space-y-4">
            {branches.slice(0, 4).map((branch) => (
              <div key={branch._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{branch.name}</div>
                    <div className="text-xs text-slate-400">{branch.address.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">₹{branch.revenue?.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;