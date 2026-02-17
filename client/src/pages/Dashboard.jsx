import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertCircle, Bell, Plus, ArrowDownLeft, Search, MapPin, 
  ArrowRight, Activity, Package, CheckCircle, Clock, RefreshCcw 
} from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const response = await api.get('/assets/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="relative flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <Activity className="absolute h-6 w-6 text-blue-600" />
      </div>
      <p className="mt-4 text-gray-500 font-medium animate-pulse">Analyzing system data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      {/* 1. TOP NAVIGATION & STATUS */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            System Overview
          </h1>
          <p className="text-slate-500 text-lg">Welcome back, <span className="text-blue-600 font-semibold">{user?.name}</span></p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">Live System</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. CORE KPI CARDS (High Professionalism) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Assets', value: stats?.overview?.total || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Requests', value: stats?.overview?.pendingRequests || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Return Tasks', value: stats?.overview?.pendingReturns || 0, icon: ArrowDownLeft, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Deployments', value: stats?.overview?.active || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">{kpi.value}</h3>
              </div>
              <div className={`p-3 ${kpi.bg} ${kpi.color} rounded-xl`}>
                <kpi.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ALERT / ACTION ZONE */}
      {(stats?.overview?.pendingRequests > 0 || stats?.overview?.pendingReturns > 0) && (
        <div className="bg-slate-900 rounded-2xl p-6 mb-10 shadow-xl flex flex-col md:flex-row gap-6 items-center">
          <div className="bg-blue-500/20 p-4 rounded-full">
            <Bell className="w-8 h-8 text-blue-400 animate-bounce" />
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold">Action Items Require Attention</h2>
            <p className="text-slate-400">You have {stats.overview.pendingRequests + stats.overview.pendingReturns} priority tasks to review.</p>
          </div>
          <div className="flex gap-3">
             <Link to="/admin-requests" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors">
              Approve Requests
             </Link>
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Charts (8/12) */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Analytics Performance</h2>
            <select className="bg-slate-50 border-none text-sm rounded-lg focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <DashboardCharts stats={stats} />
        </div>

        {/* Right: Quick Actions (4/12) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2 px-2">Quick Commands</h2>
          <ActionLink to="/assets?action=add" title="New Asset" desc="Inventory intake" icon={Plus} color="bg-blue-600" />
          <ActionLink to="/receive-process" title="Receive / Return" desc="Process logic" icon={ArrowDownLeft} color="bg-indigo-600" />
          <ActionLink to="/assets" title="Global Search" desc="Find anything" icon={Search} color="bg-slate-700" />
          <ActionLink to="/stores" title="Location Manager" desc="Site coordinates" icon={MapPin} color="bg-emerald-600" />
        </div>
      </div>
    </div>
  );
};

// Reusable Action Component for Cleanliness
const ActionLink = ({ to, title, desc, icon: Icon, color }) => (
  <Link to={to} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all group">
    <div className={`p-3 ${color} text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
  </Link>
);

export default Dashboard;
