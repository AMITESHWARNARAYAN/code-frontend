export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  icon = null,
  pulse = false,
  className = ''
}) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-300',
    primary: 'bg-blue-100 text-blue-800 border-blue-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    danger: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-bold border shadow-sm
      ${variantClasses[variant]}
      ${sizeClasses[size]}
      ${pulse ? 'animate-pulse' : ''}
      ${className}
    `}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
}

