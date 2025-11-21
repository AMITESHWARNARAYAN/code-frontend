import LoadingSpinner from './LoadingSpinner';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  fullWidth = false,
  icon = null,
  onClick,
  type = 'button',
  className = ''
}) {
  const baseClasses = 'font-bold rounded-xl shadow-lg transition-all transform active:scale-95 btn-ripple flex items-center justify-center gap-2';
  
  const variantClasses = {
    primary: 'bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900 dark:hover:bg-slate-600 hover:shadow-xl',
    secondary: 'bg-slate-600 dark:bg-slate-500 text-white hover:bg-slate-700 dark:hover:bg-slate-400 hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 hover:shadow-xl',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:shadow-xl',
    outline: 'border-2 border-slate-600 dark:border-slate-400 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
    ghost: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = 'opacity-50 cursor-not-allowed transform-none hover:shadow-lg';
  const widthClass = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${isDisabled ? disabledClasses : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="text-xl">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

