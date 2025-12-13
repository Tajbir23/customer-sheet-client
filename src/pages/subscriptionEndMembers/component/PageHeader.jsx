import React from "react";
import { FaHistory } from "react-icons/fa";

const PageHeader = () => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-2">
      <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg">
        <FaHistory className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Subscription End History
        </h1>
        <p className="text-gray-600 mt-1">
          Track members removed due to subscription expiration
        </p>
      </div>
    </div>
  </div>
);

export default PageHeader;
