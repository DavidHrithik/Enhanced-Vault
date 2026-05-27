import { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { API_BASE_URL } from '../utils/config';
import UserStatus from '../components/UserStatus';
import BackNav from '../components/BackNav';
import Loader from '../components/Loader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE_URL}/api/devices/stats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (_) {
        setError('Could not load dashboard data');
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <div className="text-red-400 text-center mt-20 font-bold">{error}</div>;

  // Prepare data for charts
  const statusData = Object.keys(stats.statusCounts).map((key) => ({
    name: key,
    value: stats.statusCounts[key],
  }));

  const ownerData = Object.keys(stats.topOwners).map((key) => ({
    name: key,
    value: stats.topOwners[key],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-start via-bg-mid to-bg-end text-white p-8 overflow-auto">
      <UserStatus />
      <BackNav />

      <div className="max-w-7xl mx-auto mt-4">
        <h1 className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary/80">
          Device Dashboard
        </h1>
        <p className="text-center text-cyan-200 mb-12">Overview of device inventory and usage</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="text-primary font-bold text-lg uppercase tracking-wider">
              Total Devices
            </h3>
            <span className="text-5xl font-extrabold text-white mt-2">{stats.totalDevices}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="text-primary font-bold text-lg uppercase tracking-wider">
              Active Users
            </h3>
            <span className="text-5xl font-extrabold text-white mt-2">
              {Object.keys(stats.topOwners).length}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col items-center">
            <h3 className="text-primary font-bold text-lg uppercase tracking-wider">
              Status Types
            </h3>
            <span className="text-5xl font-extrabold text-white mt-2">{statusData.length}</span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Distribution Chart */}
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative group">
            <h3 className="text-xl font-bold text-center mb-6 text-white">
              Device Status Distribution
            </h3>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded">
              Click slice to filter
            </div>
            <div className="h-[300px] w-full cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(data) => (window.location.href = `/devices?search=${data.name}`)}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--bg-start))',
                      borderRadius: '8px',
                      border: '1px solid rgb(var(--primary))',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Owners Chart */}
          <div className="bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative group">
            <h3 className="text-xl font-bold text-center mb-6 text-white">Top 5 Device Owners</h3>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-200 bg-blue-500/20 px-2 py-1 rounded">
              Click bar to filter
            </div>
            <div className="h-[300px] w-full cursor-pointer">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ownerData}
                  layout="vertical"
                  onClick={(data) => {
                    if (data && data.activePayload && data.activePayload.length > 0) {
                      window.location.href = `/devices?search=${data.activePayload[0].payload.name}`;
                    }
                  }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fill: 'rgb(var(--primary))' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'rgb(var(--bg-start))',
                      borderRadius: '8px',
                      border: '1px solid rgb(var(--primary))',
                    }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                    {ownerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Device Possession Tracker */}
        <div className="mt-12 bg-surface/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
          <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Device Possession Tracker (All Devices)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-primary border-b border-white/10">
                  <th className="p-4 font-semibold">Owner</th>
                  <th className="p-4 font-semibold">Device Model</th>
                  <th className="p-4 font-semibold">Assigned Date</th>
                  <th className="p-4 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {stats.devicePossessions && stats.devicePossessions.length > 0 ? (
                  stats.devicePossessions.map((item, idx) => {
                    const isStale = item.daysHeld > 30;
                    return (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="p-4 font-bold text-white">{item.owner}</td>
                        <td className="p-4 text-cyan-100">{item.model}</td>
                        <td className="p-4 text-gray-300 text-sm">
                          {item.assignedDate
                            ? new Date(item.assignedDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold border ${isStale ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-primary/20 text-primary border-primary/30'}`}
                            >
                              {item.daysHeld} days
                            </span>
                            {isStale && (
                              <div className="relative group cursor-help">
                                <span className="text-xl">⏰</span>
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-black/80 text-white text-xs p-2 rounded hidden group-hover:block z-50">
                                  Device held for over 30 days! Check if still needed.
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 italic">
                      No tracking data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
