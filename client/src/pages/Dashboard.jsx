import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Package, Users, Settings, Search, Bell, 
  MoreVertical, DollarSign, TrendingUp, CheckCircle, Clock, 
  ArrowUpRight, ArrowDownRight, ArrowDownLeft, MapPin, Activity
} from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/assets/stats');
        setStats(response.data);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans">
      {/* 1. SIDEBAR (Fixed Left) */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
            A
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">AssetManager</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={Package} label="Inventory" />
          <SidebarItem icon={Users} label="Technicians" />
          <SidebarItem icon={MapPin} label="Locations" />
          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</div>
          <SidebarItem icon={Clock} label="Requests" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">System Administrator</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search assets, serial numbers..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-600/20"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold uppercase border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live System
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Bell className="w-6 h-6" />
              {(stats?.overview?.pendingRequests > 0) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Hello {user?.name}, here is an overview of the current asset health.</p>
          </div>

          {/* 3. KPI METRICS (Sample Aesthetic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard label="Total Assets" value={stats?.overview?.total || "1,234"} trend="+2.4%" icon={Package} color="text-blue-600" bg="bg-blue-50" />
            <KpiCard label="Active Deploy" value={stats?.overview?.active || "856"} trend="+5.3%" icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
            <KpiCard label="Pending Approval" value={stats?.overview?.pendingRequests || "12"} trend="Priority" icon={Clock} color="text-amber-600" bg="bg-amber-50" />
            <KpiCard label="Maintenance" value="8" trend="-1.2%" icon={Activity} color="text-rose-600" bg="bg-rose-50" />
          </div>

          {/* 4. CHARTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartBox title="Asset Utilization (30 Days)">
              <DashboardCharts type="area" stats={stats} />
            </ChartBox>
            <ChartBox title="Category Distribution">
              <DashboardCharts type="bar" stats={stats} />
            </ChartBox>
          </div>

          {/* 5. DATA TABLES (Sample Aesthetic) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Asset Requests */}
            <TableBox title="Recent Requests">
              <TableRow name="John Smith" sub="MacBook Pro M2" val="Pending" status="warning" />
              <TableRow name="Sarah Connor" sub="Dell XPS 15" val="Approved" status="success" />
              <TableRow name="Mike Ross" sub="Cisco Router" val="Processing" status="info" />
              <TableRow name="Harvey Specter" sub="iPhone 14 Pro" val="Pending" status="warning" />
            </TableBox>

            {/* High-Value Inventory */}
            <TableBox title="High Value Assets">
              <ProductRow name="Server Rack A1" sub="Hardware" val="$12,450.00" growth="+4.5%" />
              <ProductRow name="Network Switch B4" sub="Infrastructure" val="$8,200.00" growth="+2.1%" />
              <ProductRow name="Professional Camera" sub="Media" val="$3,500.00" growth="+1.2%" />
              <ProductRow name="LTO Tape Library" sub="Storage" val="$15,900.00" growth="+0.8%" />
            </TableBox>
          </div>
        </main>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-semibold text-sm ${active ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <Icon className="w-5 h-5" />
    {label}
  </div>
);

const KpiCard = ({ label, value, trend, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h2 className="text-3xl font-black text-slate-900">{value}</h2>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'Priority' ? 'text-amber-500' : trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
           {trend} <span className="text-slate-400 font-normal ml-1">vs last week</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      <select className="bg-slate-50 border-none text-[10px] font-bold text-slate-500 px-3 py-1.5 rounded-lg focus:ring-0 cursor-pointer">
        <option>This Month</option>
        <option>Yearly</option>
      </select>
    </div>
    <div className="h-72 w-full">{children}</div>
  </div>
);

const TableBox = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
      <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      <MoreVertical className="w-5 h-5 text-slate-300 cursor-pointer" />
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

const TableRow = ({ name, sub, val, status }) => {
  const badgeStyles = {
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700'
  };
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-slate-800">{name}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <div className="text-right">
        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${badgeStyles[status]}`}>
          {val}
        </span>
      </div>
    </div>
  );
};

const ProductRow = ({ name, sub, val, growth }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-bold text-slate-800">{name}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold text-slate-900">{val}</p>
      <span className="text-[10px] font-bold text-emerald-500 flex items-center justify-end gap-0.5">
        <ArrowUpRight className="w-2.5 h-2.5" /> {growth}
      </span>
    </div>
  </div>
);

export default Dashboard;
