import React from 'react'

const EmptyState = ({ message, type = 'default', actionButton }) => {
  const getStateConfig = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-[var(--error-bg)]',
          iconColor: 'text-[var(--error)]',
          borderColor: 'border-[var(--error)]/30'
        }
      case 'search':
        return {
          bg: 'bg-[var(--info-bg)]',
          iconColor: 'text-[var(--info)]',
          borderColor: 'border-[var(--info)]/30'
        }
      default:
        return {
          bg: 'bg-[var(--bg-elevated)]',
          iconColor: 'text-[var(--accent-purple)]',
          borderColor: 'border-[var(--border-subtle)]'
        }
    }
  }

  const styles = getStateConfig()

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`rounded-2xl p-8 max-w-sm mx-auto text-center border ${styles.borderColor}`}
        style={{ background: 'var(--bg-card)' }}
      >
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 
          ${styles.bg} ${styles.iconColor}
        `}>
          <span className="text-3xl font-bold">
            {type === 'error' ? '!' : type === 'search' ? '?' : '∅'}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          {message}
        </h3>

        {type !== 'error' && (
          <p className="text-[var(--text-secondary)] text-sm font-medium mb-4">
            {type === 'search'
              ? 'Try adjusting your search criteria or check your spelling'
              : 'No teams are available at the moment'
            }
          </p>
        )}

        {actionButton && (
          <div className="mt-2">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmptyState