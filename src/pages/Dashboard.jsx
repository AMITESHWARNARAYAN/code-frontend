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
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1F1F1F] transition-colors">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-[#2D2D2D] border-b border-[#E8E4DD] dark:border-[#3D3D3D] sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7C2D3A] to-[#A53E4C] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black">CA</span>
              </div>
              <span className="font-black text-[#1F1F1F] dark:text-[#FAF8F5] text-lg">CodeAuction</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[#E8E4DD] dark:hover:bg-[#3D3D3D] transition"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#7C2D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <div className="text-sm">
                <span className="text-[#6B6B6B] dark:text-[#8C8C8C]">Hi, </span>
                <span className="font-bold text-[#1F1F1F] dark:text-[#FAF8F5]">{user?.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-[#6B6B6B] dark:text-[#8C8C8C] hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] font-semibold transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
            {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
          </h1>
          <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
            Team: <span className="font-bold text-[#D97706]">{user?.teamName}</span>
            {isAdmin && <span className="ml-3 px-3 py-1 bg-gradient-to-r from-[#7C2D3A]/10 to-[#A53E4C]/10 text-[#7C2D3A] dark:text-[#F59E0B] rounded-full text-xs font-bold border border-[#7C2D3A]/20">Admin</span>}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin ? (
            <>
              {/* Auction Control Card */}
              <div
                onClick={() => navigate('/admin/auction')}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-8 cursor-pointer hover:shadow-warm card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition shadow-lg">
                    🎯
                  </div>
                  <svg className="w-6 h-6 text-[#8C8C8C] group-hover:text-[#D97706] group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                  Auction Control
                </h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
                  Push questions and monitor live bids
                </p>
              </div>

              {/* Control Panel Card */}
              <div
                onClick={() => navigate('/admin/control')}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-8 cursor-pointer hover:shadow-warm card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-rose-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition shadow-lg">
                    ⚙️
                  </div>
                  <svg className="w-6 h-6 text-[#8C8C8C] group-hover:text-[#D97706] group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                  Control Panel
                </h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
                  Manage questions and users
                </p>
              </div>

              {/* Scheduled Auctions Card */}
              <div
                onClick={() => navigate('/admin/schedule')}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-8 cursor-pointer hover:shadow-warm card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition shadow-lg">
                    📅
                  </div>
                  <svg className="w-6 h-6 text-[#8C8C8C] group-hover:text-[#D97706] group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                  Scheduled Auctions
                </h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
                  Create and manage events
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Join Live Auction Card */}
              <div
                onClick={() => navigate('/auction')}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-8 cursor-pointer hover:shadow-warm card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition shadow-lg">
                    🎪
                  </div>
                  <svg className="w-6 h-6 text-[#8C8C8C] group-hover:text-[#D97706] group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                  Join Live Auction
                </h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
                  Participate in real-time auctions
                </p>
              </div>

              {/* Scheduled Auctions Card */}
              <div
                onClick={() => navigate('/scheduled')}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-8 cursor-pointer hover:shadow-warm card-hover group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-3 transition shadow-lg">
                    📆
                  </div>
                  <svg className="w-6 h-6 text-[#8C8C8C] group-hover:text-[#D97706] group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                  Scheduled Auctions
                </h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
                  View and join upcoming events
                </p>
              </div>
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                ⚡
              </div>
              <div>
                <p className="text-xs text-[#6B6B6B] dark:text-[#8C8C8C] font-semibold uppercase tracking-wide">Active Users</p>
                <p className="text-2xl font-black gradient-text">10K+</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-rose-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                📝
              </div>
              <div>
                <p className="text-xs text-[#6B6B6B] dark:text-[#8C8C8C] font-semibold uppercase tracking-wide">Total Questions</p>
                <p className="text-2xl font-black gradient-text">500+</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🏆
              </div>
              <div>
                <p className="text-xs text-[#6B6B6B] dark:text-[#8C8C8C] font-semibold uppercase tracking-wide">Submissions</p>
                <p className="text-2xl font-black gradient-text">50K+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10 bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft border border-[#E8E4DD] dark:border-[#3D3D3D] overflow-hidden">
          <div className="px-8 py-6 border-b border-[#E8E4DD] dark:border-[#3D3D3D]">
            <h3 className="text-lg font-black text-[#1F1F1F] dark:text-[#FAF8F5] uppercase tracking-wide">Recent Activity</h3>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6B8E23] to-[#85A438] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#1F1F1F] dark:text-[#FAF8F5]">Welcome to CodeAuction!</p>
                  <p className="text-xs text-[#6B6B6B] dark:text-[#8C8C8C] mt-1">Start by joining a live auction or browsing scheduled events</p>
                </div>
                <span className="text-xs text-[#8C8C8C]">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
