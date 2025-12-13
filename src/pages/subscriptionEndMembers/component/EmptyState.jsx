import React from "react";
import { FaHistory } from "react-icons/fa";

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FaHistory className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No Subscription End History
    </h3>
    <p className="text-gray-600">
      There are no records of expired subscriptions yet.
    </p>
  </div>
);

export default EmptyState;
