import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Mock data - replace with real data when available
const monthlyData = [
  { month: 'Jan', users: 2100, revenue: 3200, matches: 450 },
  { month: 'Feb', users: 2400, revenue: 3800, matches: 520 },
  { month: 'Mar', users: 2200, revenue: 3400, matches: 480 },
  { month: 'Apr', users: 2800, revenue: 4200, matches: 580 },
  { month: 'May', users: 3100, revenue: 4600, matches: 650 },
  { month: 'Jun', users: 3400, revenue: 4900, matches: 720 },
  { month: 'Jul', users: 3200, revenue: 4700, matches: 690 },
  { month: 'Aug', users: 3600, revenue: 5200, matches: 780 },
  { month: 'Sep', users: 3900, revenue: 5600, matches: 850 },
  { month: 'Oct', users: 4200, revenue: 6100, matches: 920 },
  { month: 'Nov', users: 4500, revenue: 6500, matches: 980 },
  { month: 'Dec', users: 4800, revenue: 7000, matches: 1050 }
];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">New User Registrations</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#4F46E5" 
                strokeWidth={2}
                name="New Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value}`, 'Revenue']}
              />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#D6482B"
                name="Revenue (₹)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Successful Matches Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Successful Matches</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="matches" 
                stroke="#059669" 
                strokeWidth={2}
                name="Successful Matches"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demographics Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Demographics</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { age: '18-25', male: 2500, female: 2100 },
              { age: '26-35', male: 3500, female: 3000 },
              { age: '36-45', male: 2000, female: 1800 },
              { age: '46+', male: 1000, female: 900 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="male" fill="#3B82F6" name="Male Users" />
              <Bar dataKey="female" fill="#EC4899" name="Female Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;