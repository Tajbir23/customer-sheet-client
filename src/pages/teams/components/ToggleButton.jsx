import React, { useState, useEffect } from 'react'

const ToggleButton = ({ isActive, isLoading, onClick, justChanged }) => {
  const [showSuccessPulse, setShowSuccessPulse] = useState(false);

  useEffect(() => {
    if (justChanged) {
      setShowSuccessPulse(true);
      const timer = setTimeout(() => setShowSuccessPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [justChanged]);

  return (
    <div className="relative">
      {/* Success pulse animation */}
      {showSuccessPulse && (
        <div className={`absolute inset-0 rounded-full animate-ping ${isActive ? 'bg-green-400' : 'bg-gray-400'} opacity-75`} />
      )}
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${isActive ? 'bg-green-500' : 'bg-gray-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          ${showSuccessPulse ? 'ring-4 ring-offset-2 ' + (isActive ? 'ring-green-300' : 'ring-gray-300') : ''}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition-all duration-300 ease-in-out
            ${isActive ? 'translate-x-5' : 'translate-x-0'}
            ${showSuccessPulse ? 'scale-110' : ''}
          `}
        />
      </button>
    </div>
  );
};

export default ToggleButton;