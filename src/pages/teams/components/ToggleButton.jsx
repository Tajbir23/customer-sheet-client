import React from 'react'

const ToggleButton = ({ isActive, isLoading, onClick }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isActive ? 'bg-green-500' : 'bg-gray-400'}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
          transition duration-200 ease-in-out
          ${isActive ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );

  export default ToggleButton;