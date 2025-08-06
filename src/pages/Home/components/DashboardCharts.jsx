import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

export const OrderStatusChart = ({ data }) => {
  const chartData = [
    {
      name: 'Total Orders',
      total: data.totalOrder,
      pending: data.totalPending,
      paid: data.totalPaid
    },
    {
      name: 'My Orders',
      total: data.totalMyOrder,
      pending: data.totalMyPending,
      paid: data.totalMyPaid
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Orders Overview</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3B82F6" name="Total" />
            <Bar dataKey="pending" fill="#EF4444" name="Pending" />
            <Bar dataKey="paid" fill="#10B981" name="Paid" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RevenuePieChart = ({ data }) => {
  const chartData = [
    { name: 'Total Revenue', value: data.totalRevenue },
    { name: 'My Revenue', value: data.myRevenue }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Distribution</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCharts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <OrderStatusChart data={data} />
      <RevenuePieChart data={data} />
    </div>
  );
};

export default DashboardCharts; 