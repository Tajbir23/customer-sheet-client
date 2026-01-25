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

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-4 rounded-xl shadow-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <p className="text-sm font-semibold text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-[var(--text-tertiary)]">{entry.name}:</span>
            <span className="font-semibold text-white">{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }) => (
  <div className="flex justify-center gap-6 mt-4">
    {payload.map((entry, index) => (
      <div key={index} className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="text-sm text-[var(--text-tertiary)]">{entry.value}</span>
      </div>
    ))}
  </div>
);

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
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:border-[var(--border-default)]"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Orders Overview</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--text-tertiary)', fontSize: 12 }}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
            <Legend content={<CustomLegend />} />
            <Bar dataKey="total" fill="#3b82f6" name="Total" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
            <Bar dataKey="paid" fill="#10b981" name="Paid" radius={[4, 4, 0, 0]} />
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
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:border-[var(--border-default)]"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)' }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">Revenue Distribution</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              innerRadius={60}
              fill="#8884d8"
              dataKey="value"
              stroke="var(--bg-surface)"
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))',
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              formatter={(value) => `${value.toLocaleString()} TK`}
            />
            <Legend
              content={<CustomLegend />}
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DashboardCharts = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <OrderStatusChart data={data} />
      <RevenuePieChart data={data} />
    </div>
  );
};

export default DashboardCharts;