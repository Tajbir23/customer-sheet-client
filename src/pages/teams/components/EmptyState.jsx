import React from 'react'

const EmptyState = ({ message, icon: Icon, type = 'default', actionButton }) => {
  const getStateStyles = () => {
    switch (type) {
      case 'error':
        return {
          containerBg: 'bg-gradient-to-br from-red-50 to-red-100',
          iconBg: 'bg-gradient-to-r from-red-500 to-red-600',
          textColor: 'text-red-800',
          subTextColor: 'text-red-600'
        }
      case 'search':
        return {
          containerBg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          iconBg: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-blue-800',
          subTextColor: 'text-blue-600'
        }
      default:
        return {
          containerBg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          iconBg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          textColor: 'text-gray-800',
          subTextColor: 'text-gray-600'
        }
    }
  }

  const styles = getStateStyles()

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className={`${styles.containerBg} rounded-3xl p-12 max-w-md mx-auto shadow-lg border border-gray-200`}>
        {/* Background Pattern */}
        <div className="relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-current rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-current rounded-full translate-y-10 -translate-x-10"></div>
          </div>
          
          <div className="relative z-10 text-center">
            {/* Icon */}
            <div className={`${styles.iconBg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
              <Icon className="text-white text-3xl" />
            </div>
            
            {/* Message */}
            <h3 className={`text-2xl font-bold ${styles.textColor} mb-3`}>
              {message}
            </h3>
            
            {/* Sub Message */}
            {type !== 'error' && (
              <p className={`${styles.subTextColor} font-medium mb-6`}>
                {type === 'search' 
                  ? 'Try adjusting your search criteria or check your spelling'
                  : 'No teams are available at the moment'
                }
              </p>
            )}
            
            {/* Action Button */}
            {actionButton && (
              <div className="mt-6">
                {actionButton}
              </div>
            )}
            
            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 mt-8">
              <div className={`w-2 h-2 ${styles.iconBg} rounded-full opacity-60`}></div>
              <div className={`w-2 h-2 ${styles.iconBg} rounded-full opacity-40`}></div>
              <div className={`w-2 h-2 ${styles.iconBg} rounded-full opacity-20`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmptyState 