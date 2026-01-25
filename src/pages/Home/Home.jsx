import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import { FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaUserClock, FaRobot } from 'react-icons/fa';
import DashboardCharts from './components/DashboardCharts';
import CountdownTimer from './components/CountdownTimer';
import { Helmet } from 'react-helmet';

const StatCard = ({ icon: Icon, title, value, subValue, gradient, delay = 0 }) => (
  <div
    className="relative group animate-fade-in-up overflow-hidden"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div
      className="relative p-6 rounded-2xl transition-all duration-500 h-full"
      style={{
        background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Gradient Overlay on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: gradient, opacity: 0.05 }}
      />

      {/* Glow Effect */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"
        style={{ background: gradient }}
      />

      <div className="relative flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--text-tertiary)] uppercase tracking-wider">
            {title}
          </p>
          <p
            className="text-3xl font-bold"
            style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {value}
          </p>
          {subValue && (
            <p className="text-sm text-[var(--text-tertiary)] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
              {subValue}
            </p>
          )}
        </div>

        {/* Icon Container */}
        <div
          className="p-4 rounded-2xl transform group-hover:scale-110 transition-all duration-500"
          style={{
            background: gradient,
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)',
          }}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: gradient }}
      />
    </div>
  </div>
);

const NextSubscriptionCard = ({ data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div
      className="relative animate-fade-in-up rounded-2xl overflow-hidden"
      style={{ animationDelay: '400ms' }}
    >
      <div
        className="relative p-6"
        style={{
          background: 'linear-gradient(145deg, var(--bg-card) 0%, var(--bg-surface) 100%)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1rem',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
              }}
            >
              <FaCalendarAlt className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Next Subscription Ending</h3>
          </div>
          <span
            className="text-sm font-medium px-4 py-2 rounded-full"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: 'var(--accent-purple-light)',
            }}
          >
            {formatDate(data.subscriptionEnd)}
          </span>
        </div>

        {/* Countdown Timer */}
        <div className="mb-6">
          <CountdownTimer endDate={data.subscriptionEnd} />
        </div>

        {/* GPT Account Info */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'var(--bg-surface)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[var(--bg-elevated)]">
                <FaRobot className="w-4 h-4 text-[var(--accent-cyan)]" />
              </div>
              <span className="text-sm text-[var(--text-tertiary)]">GPT Account</span>
            </div>
            <span className="text-sm font-semibold text-white break-all max-w-[200px] text-right">
              {data.gptAccount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const response = await handleApi('/summery', 'GET')
      setData(response.data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <Helmet>
          <title>Loading...</title>
        </Helmet>

        {/* Loading Skeleton */}
        <div className="space-y-8">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-48 h-8 skeleton rounded-lg" />
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="h-36 skeleton rounded-2xl"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="h-80 skeleton rounded-2xl" />

          {/* Bottom Card Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-48 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
      <Helmet>
        <title>Dashboard - Customer Sheet</title>
      </Helmet>

      {/* Page Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-[var(--text-tertiary)]">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={data?.orderSummery?.totalOrder || 0}
          gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
          delay={50}
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={`${data?.orderSummery?.totalRevenue?.toLocaleString() || 0} TK`}
          gradient="linear-gradient(135deg, #10b981 0%, #34d399 100%)"
          delay={100}
        />
        <StatCard
          icon={FaUserClock}
          title="Pending Orders"
          value={data?.orderSummery?.totalPending || 0}
          subValue={`${data?.orderSummery?.totalPaid || 0} orders paid`}
          gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
          delay={150}
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="My Revenue"
          value={`${data?.orderSummery?.myRevenue?.toLocaleString() || 0} TK`}
          subValue={`${data?.orderSummery?.totalMyOrder || 0} personal orders`}
          gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)"
          delay={200}
        />
      </div>

      {/* Charts Section */}
      {data?.orderSummery && (
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <DashboardCharts data={data.orderSummery} />
        </div>
      )}

      {/* Next Subscription Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NextSubscriptionCard data={data?.nextSubsEnding} />
      </div>
    </div>
  )
}

export default Home