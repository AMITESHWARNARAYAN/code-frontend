import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">⚡</span>
              </div>
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">CodeAuction</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Hi, </span>
                <span className="font-semibold text-gray-900 dark:text-white">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Team: <span className="font-semibold text-gray-900 dark:text-white">{user?.teamName}</span>
            {isAdmin && <span className="ml-2 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-semibold">Admin</span>}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isAdmin ? (
            <>
              {/* Auction Control Card */}
              <div
                onClick={() => navigate('/admin/auction')}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition">
                    🎯
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Auction Control
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Push questions and monitor live bids
                </p>
              </div>

              {/* Control Panel Card */}
              <div
                onClick={() => navigate('/admin/control')}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-teal-400 dark:hover:border-teal-600 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition">
                    ⚙️
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Control Panel
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage questions and users
                </p>
              </div>

              {/* Scheduled Auctions Card */}
              <div
                onClick={() => navigate('/admin/schedule')}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-cyan-400 dark:hover:border-cyan-600 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition">
                    📅
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Scheduled Auctions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Create and manage events
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Join Live Auction Card */}
              <div
                onClick={() => navigate('/auction')}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition">
                    🎪
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Join Live Auction
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Participate in real-time auctions
                </p>
              </div>

              {/* Scheduled Auctions Card */}
              <div
                onClick={() => navigate('/scheduled')}
                className="bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700 p-5 cursor-pointer hover:shadow-lg hover:border-teal-400 dark:hover:border-teal-600 transition group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition">
                    📆
                  </div>
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Scheduled Auctions
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View and join upcoming events
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg shadow border border-emerald-200 dark:border-emerald-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-lg">
                ⚡
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">10K+</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg shadow border border-teal-200 dark:border-teal-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-lg">
                📝
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Questions</p>
                <p className="text-xl font-bold text-teal-700 dark:text-teal-300">500+</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg shadow border border-cyan-200 dark:border-cyan-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center text-lg">
                🏆
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Submissions</p>
                <p className="text-xl font-bold text-cyan-700 dark:text-cyan-300">50K+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg shadow border border-gray-200 dark:border-slate-700">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Recent Activity</h3>
          </div>
          <div className="p-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Welcome to CodeAuction!</p>
                  <p className="text-xs text-gray-600">Start by joining a live auction or browsing scheduled events</p>
                </div>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

