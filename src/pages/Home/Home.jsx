import React, { useEffect, useState } from 'react'
import handleApi from '../../libs/handleAPi'
import { FaCalendarAlt, FaMoneyBillWave, FaShoppingCart, FaUserClock } from 'react-icons/fa';
import DashboardCharts from './components/DashboardCharts';
import CountdownTimer from './components/CountdownTimer';

const StatCard = ({ icon: Icon, title, value, subValue, colorClass }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold mt-2 ${colorClass}`}>
          {value}
        </p>
        {subValue && (
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${colorClass.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
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
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Next Subscription Ending</h3>
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
          {formatDate(data.subscriptionEnd)}
        </span>
      </div>
      
      {/* Countdown Timer */}
      <div className="mb-6">
        <CountdownTimer endDate={data.subscriptionEnd} />
      </div>

      {/* GPT Account Info */}
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">GPT Account</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white break-all">
            {data.gptAccount}
          </span>
        </div>
      </div>
    </div>
  );
};

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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FaShoppingCart}
          title="Total Orders"
          value={data?.orderSummery?.totalOrder || 0}
          colorClass="text-blue-600 dark:text-blue-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="Total Revenue"
          value={`${data?.orderSummery?.totalRevenue?.toLocaleString() || 0} TK`}
          colorClass="text-green-600 dark:text-green-500"
        />
        <StatCard
          icon={FaUserClock}
          title="Pending Orders"
          value={data?.orderSummery?.totalPending || 0}
          subValue={`${data?.orderSummery?.totalPaid || 0} orders paid`}
          colorClass="text-yellow-600 dark:text-yellow-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          title="My Revenue"
          value={`${data?.orderSummery?.myRevenue?.toLocaleString() || 0} TK`}
          subValue={`${data?.orderSummery?.totalMyOrder || 0} personal orders`}
          colorClass="text-purple-600 dark:text-purple-500"
        />
      </div>

      {/* Charts */}
      {data?.orderSummery && (
        <DashboardCharts data={data.orderSummery} />
      )}

      {/* Next Subscription Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <NextSubscriptionCard data={data?.nextSubsEnding} />
      </div>
    </div>
  )
}

export default Home