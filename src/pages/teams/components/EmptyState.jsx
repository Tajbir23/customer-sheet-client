import React from 'react'

const EmptyState = ({ message, icon: Icon, type = 'default', actionButton }) => {
  const getStateStyles = () => {
    switch (type) {
      case 'error':
        return {
          iconBg: 'bg-red-50 text-red',
          textColor: 'text-red',
          subTextColor: 'text-gray-500'
        }
      case 'search':
        return {
          iconBg: 'bg-blue-50 text-blue',
          textColor: 'text-blue',
          subTextColor: 'text-gray-500'
        }
      default:
        return {
          iconBg: 'bg-gray-100 text-gray-600',
          textColor: 'text-gray-700',
          subTextColor: 'text-gray-500'
        }
    }
  }

  const styles = getStateStyles()

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="card max-w-md mx-auto text-center">
        <div className="card-body">
          {/* Icon */}
          <div className={`${styles.iconBg} w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4`}>
            <Icon className="text-2xl" />
          </div>
          
          {/* Message */}
          <h3 className={`text-xl font-semibold ${styles.textColor} mb-2`}>
            {message}
          </h3>
          
          {/* Sub Message */}
          {type !== 'error' && (
            <p className={`${styles.subTextColor} mb-4`}>
              {type === 'search' 
                ? 'Try adjusting your search criteria or check your spelling'
                : 'No teams are available at the moment'
              }
            </p>
          )}
          
          {/* Action Button */}
          {actionButton && (
            <div className="mt-4">
              {actionButton}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmptyState 