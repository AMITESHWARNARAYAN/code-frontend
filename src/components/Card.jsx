export default function Card({ 
  children, 
  title = null, 
  subtitle = null,
  icon = null,
  badge = null,
  hover = false,
  className = '',
  headerClassName = '',
  bodyClassName = ''
}) {
  return (
    <div className={`
      bg-white rounded-2xl shadow-xl border border-gray-100 
      ${hover ? 'card-hover cursor-pointer' : ''}
      ${className}
    `}>
      {(title || subtitle || icon || badge) && (
        <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${headerClassName}`}>
          <div className="flex items-center gap-3">
            {icon && <span className="text-3xl">{icon}</span>}
            <div>
              {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
              {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
            </div>
          </div>
          {badge && (
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
              {badge}
            </div>
          )}
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}

