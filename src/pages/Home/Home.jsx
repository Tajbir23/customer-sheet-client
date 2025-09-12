import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import { FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaUserClock, FaClock } from 'react-icons/fa';
import DashboardCharts from './components/DashboardCharts';
import CountdownTimer from './components/CountdownTimer';

const StatCard = ({ icon: Icon, title, value, subValue, colorClass }) => (
  <div className="card hover:shadow-md transition-shadow">
    <div className="card-body">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${colorClass}`}>
            {value}
          </p>
          {subValue && (
            <p className="text-sm text-gray-500 mt-1">
              {subValue}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          colorClass === 'text-blue' ? 'bg-blue-50 text-blue' :
          colorClass === 'text-green' ? 'bg-green-50 text-green' :
          colorClass === 'text-orange' ? 'bg-orange-50 text-orange' :
          colorClass === 'text-primary' ? 'bg-gray-50 text-primary' :
          'bg-gray-50 text-primary'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
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
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <FaClock className="w-5 h-5 text-orange" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">Next Subscription Ending</h3>
          </div>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red">
            {formatDate(data.subscriptionEnd)}
          </span>
        </div>
      </div>
      
      <div className="card-body">
        {/* Countdown Timer */}
        <div className="mb-6">
          <CountdownTimer endDate={data.subscriptionEnd} />
        </div>

        {/* GPT Account Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">GPT Account</span>
            <span className="text-sm font-semibold text-gray-700 break-all">
              {data.gptAccount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton h-32"></div>
      ))}
    </div>
    <div className="skeleton h-64"></div>
    <div className="skeleton h-48"></div>
  </div>
);

const Home = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async() => {
      const response = await handleApi('/summery', 'GET')
      setData(response.data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={data?.orderSummery?.totalOrder || 0}
          colorClass="text-blue"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={`${data?.orderSummery?.totalRevenue?.toLocaleString() || 0} TK`}
          colorClass="text-green"
        />
        <StatCard
          icon={FaUserClock}
          title="Pending Orders"
          value={data?.orderSummery?.totalPending || 0}
          subValue={`${data?.orderSummery?.totalPaid || 0} orders paid`}
          colorClass="text-orange"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="My Revenue"
          value={`${data?.orderSummery?.myRevenue?.toLocaleString() || 0} TK`}
          subValue={`${data?.orderSummery?.totalMyOrder || 0} personal orders`}
          colorClass="text-primary"
        />
      </div>

      {/* Charts */}
      {data?.orderSummery && (
        <div>
          <DashboardCharts data={data.orderSummery} />
        </div>
      )}

      {/* Next Subscription Card */}
      {data?.nextSubsEnding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NextSubscriptionCard data={data?.nextSubsEnding} />
        </div>
      )}
    </div>
  )
}

export default Home