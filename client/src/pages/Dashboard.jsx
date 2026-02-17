import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, BarChart3, Users, ShoppingCart, Settings, 
  Search, Bell, MoreVertical, DollarSign, TrendingUp, 
  Package, CheckCircle, Clock, ArrowUpRight, ArrowDownRight 
} from 'lucide-react';
import DashboardCharts from '../components/DashboardCharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/assets/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] font-sans">
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
            T
          </div>
          <span className="text-2xl font-bold text-slate-800 tracking-tight">TailPanel</span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={Users} label="User Management" />
          <div className="pt-6 pb-2 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Showcase</div>
          <SidebarItem icon={ShoppingCart} label="E-Commerce" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="p-6 border-t border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search data, reports..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-sm">
              AS
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your business today.</p>
          </div>

          {/* 3. KPI METRICS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard label="Total Revenue" value="$45,231.89" trend="+20.1%" icon={DollarSign} color="text-emerald-600" bg="bg-emerald-50" />
            <KpiCard label="Active Users" value="2,350" trend="+15.3%" icon={Users} color="text-blue-600" bg="bg-blue-50" />
            <KpiCard label="Total Orders" value="1,234" trend="+4.2%" icon={ShoppingCart} color="text-orange-600" bg="bg-orange-50" />
            <KpiCard label="Conversion Rate" value="3.42%" trend="-0.7%" icon={TrendingUp} color="text-purple-600" bg="bg-purple-50" />
          </div>

          {/* 4. CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Revenue Overview">
              <DashboardCharts type="area" stats={stats} />
            </ChartContainer>
            <ChartContainer title="Profit vs Expenses">
              <DashboardCharts type="bar" stats={stats} />
            </ChartContainer>
          </div>

          {/* 5. DATA TABLES GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Recent Orders</h3>
                <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer" />
              </div>
              <div className="p-6 space-y-6">
                <TableRow name="John Doe" sub="Wireless Headphones" val="$129.99" status="completed" />
                <TableRow name="Jane Smith" sub="Smart Watch" val="$299.99" status="pending" />
                <TableRow name="Bob Johnson" sub="Laptop Stand" val="$49.99" status="completed" />
                <TableRow name="Alice Williams" sub="USB-C Cable" val="$19.99" status="processing" />
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Top Products</h3>
                <MoreVertical className="w-5 h-5 text-slate-400 cursor-pointer" />
              </div>
              <div className="p-6 space-y-6">
                <ProductRow name="Wireless Headphones" sub="1,234 sales" val="$160,410.00" growth="+12.5%" />
                <ProductRow name="Smart Watch" sub="987 sales" val="$296,003.00" growth="+7.8%" />
                <ProductRow name="Laptop Stand" sub="856 sales" val="$42,784.00" growth="+3.2%" />
                <ProductRow name="USB-C Hub" sub="743 sales" val="$51,901.00" growth="+10.7%" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* Sub-Components for Clean Code */

const SidebarItem = ({ icon: Icon, label, active = false }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-semibold text-sm ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
    <Icon className="w-5 h-5" />
    {label}
  </div>
);

const KpiCard = ({ label, value, trend, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <h2 className="text-2xl font-black text-slate-900">{value}</h2>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend} <span className="text-slate-400 font-normal ml-1 text-[10px]">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const ChartContainer = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      <select className="bg-slate-50 border-none text-[11px] font-bold text-slate-500 rounded-lg px-3 py-1.5 uppercase tracking-wider focus:ring-0">
        <option>Monthly</option>
        <option>Weekly</option>
      </select>
    </div>
    <div className="h-72 w-full">{children}</div>
  </div>
);

const TableRow = ({ name, sub, val, status }) => {
  const colors = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700'
  };
  return (
    <div className="flex items-center justify-between group cursor-pointer">
      <div>
        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900">{val}</p>
        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-1 ${colors[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};

const ProductRow = ({ name, sub, val, growth }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div>
      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{name}</p>
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
