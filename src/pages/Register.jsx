import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    teamName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1F1F1F] flex transition-colors">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#7C2D3A] via-[#A53E4C] to-[#7C2D3A] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-warm-lg">
              <span className="text-3xl font-black text-[#7C2D3A]">CA</span>
            </div>
            <span className="text-3xl font-black text-white">CodeAuction</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-6xl font-black text-white mb-8 leading-tight">
              Start your coding journey today
            </h1>
            <p className="text-white/90 text-xl leading-relaxed mb-10">
              Create your account and join a community of passionate developers competing in real-time coding challenges.
            </p>

            <div className="space-y-5">
              {[
                'Real-time competitive coding',
                '500+ coding challenges',
                'Team-based competitions'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white text-lg font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/70 text-sm">
          © 2025 CodeAuction. All rights reserved.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-3 rounded-xl hover:bg-[#E8E4DD] dark:hover:bg-[#2D2D2D] transition"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-[#7C2D3A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#7C2D3A] to-[#A53E4C] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">CA</span>
              </div>
              <span className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5]">CodeAuction</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-3">Create your account</h2>
            <p className="text-[#6B6B6B] dark:text-[#8C8C8C] text-lg">Join the competitive coding community</p>
          </div>

          {error && (
            <div className={`mb-6 px-5 py-4 rounded-xl text-sm font-semibold ${error.includes('successful')
                ? 'bg-[#6B8E23]/10 dark:bg-[#85A438]/20 border border-[#6B8E23]/30 dark:border-[#85A438]/40 text-[#6B8E23] dark:text-[#85A438]'
                : 'bg-[#8B0000]/10 dark:bg-[#A52A2A]/20 border border-[#8B0000]/30 dark:border-[#A52A2A]/40 text-[#8B0000] dark:text-[#A52A2A]'
              }`}>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-[#6B8E23]/10 dark:bg-[#85A438]/20 border border-[#6B8E23]/30 dark:border-[#85A438]/40 text-[#6B8E23] dark:text-[#85A438] px-5 py-4 rounded-xl text-sm font-semibold">
              Account created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-[#E8E4DD] dark:border-[#3D3D3D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition text-[#1F1F1F] dark:text-[#FAF8F5] bg-white dark:bg-[#2D2D2D] placeholder-[#8C8C8C]"
                placeholder="Choose a username"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-[#E8E4DD] dark:border-[#3D3D3D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition text-[#1F1F1F] dark:text-[#FAF8F5] bg-white dark:bg-[#2D2D2D] placeholder-[#8C8C8C]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-[#E8E4DD] dark:border-[#3D3D3D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition text-[#1F1F1F] dark:text-[#FAF8F5] bg-white dark:bg-[#2D2D2D] placeholder-[#8C8C8C]"
                placeholder="Create a strong password"
              />
            </div>

            <div>
              <label htmlFor="teamName" className="block text-sm font-bold text-[#1F1F1F] dark:text-[#FAF8F5] mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 border-2 border-[#E8E4DD] dark:border-[#3D3D3D] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent transition text-[#1F1F1F] dark:text-[#FAF8F5] bg-white dark:bg-[#2D2D2D] placeholder-[#8C8C8C]"
                placeholder="Your team name"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="w-5 h-5 mt-1 text-[#7C2D3A] border-[#E8E4DD] dark:border-[#3D3D3D] rounded focus:ring-[#D97706]"
              />
              <label className="ml-3 text-sm text-[#6B6B6B] dark:text-[#8C8C8C]">
                I agree to the{' '}
                <a href="#" className="text-[#D97706] hover:text-[#F59E0B] font-bold transition">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#D97706] hover:text-[#F59E0B] font-bold transition">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-[#7C2D3A] to-[#A53E4C] text-white py-4 rounded-xl font-bold text-lg hover:shadow-warm-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] btn-ripple"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : success ? (
                'Account Created! ✓'
              ) : (
                'Create Account →'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-[#D97706] hover:text-[#F59E0B] transition">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-[#E8E4DD] dark:border-[#3D3D3D]">
            <div className="flex items-center justify-center gap-8 text-xs text-[#8C8C8C] font-semibold">
              <a href="#" className="hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] transition">Terms</a>
              <a href="#" className="hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] transition">Privacy</a>
              <a href="#" className="hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] transition">Help</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
