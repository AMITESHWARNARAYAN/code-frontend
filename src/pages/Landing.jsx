import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Bidding',
      description: 'Compete with peers in live auctions for coding challenges with instant updates',
      color: 'from-amber-50 to-orange-50'
    },
    {
      icon: '💻',
      title: 'Code Editor',
      description: 'Professional Monaco editor with syntax highlighting and auto-completion',
      color: 'from-red-50 to-rose-50'
    },
    {
      icon: '🏆',
      title: 'Competitive Scoring',
      description: 'Test case evaluation with detailed performance metrics and rankings',
      color: 'from-yellow-50 to-amber-50'
    },
    {
      icon: '📅',
      title: 'Scheduled Events',
      description: 'Join scheduled auctions with auto-start and team-based competitions',
      color: 'from-orange-50 to-red-50'
    },
    {
      icon: '👥',
      title: 'Team Battles',
      description: 'Form teams and compete against others in collaborative coding challenges',
      color: 'from-rose-50 to-pink-50'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Track your progress with detailed statistics and performance insights',
      color: 'from-amber-50 to-yellow-50'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users', icon: '👥' },
    { value: '500+', label: 'Challenges', icon: '🎯' },
    { value: '50K+', label: 'Submissions', icon: '📝' },
    { value: '99.9%', label: 'Uptime', icon: '⚡' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer at Google',
      avatar: '👩‍💻',
      text: 'The auction format makes coding practice incredibly engaging. Best platform I\'ve used!'
    },
    {
      name: 'Alex Kumar',
      role: 'CS Student at MIT',
      avatar: '👨‍🎓',
      text: 'Helped me ace my technical interviews. The real-time competition is addictive!'
    },
    {
      name: 'Maria Garcia',
      role: 'Tech Lead at Amazon',
      avatar: '👩‍💼',
      text: 'Perfect for team building and skill development. Highly recommend!'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#1F1F1F] transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FDFCFA]/95 dark:bg-[#2D2D2D]/95 border-b border-[#E8E4DD] dark:border-[#3D3D3D] z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#7C2D3A] to-[#A53E4C] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">CA</span>
              </div>
              <span className="text-xl font-black text-[#1F1F1F] dark:text-[#FAF8F5]">CodeAuction</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#6B6B6B] dark:text-[#8C8C8C] hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] font-semibold transition">Features</a>
              <a href="#how-it-works" className="text-[#6B6B6B] dark:text-[#8C8C8C] hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] font-semibold transition">How It Works</a>
              <a href="#testimonials" className="text-[#6B6B6B] dark:text-[#8C8C8C] hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] font-semibold transition">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-[#6B6B6B] dark:text-[#8C8C8C] font-bold hover:text-[#7C2D3A] dark:hover:text-[#F59E0B] transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2.5 bg-gradient-to-r from-[#7C2D3A] to-[#A53E4C] text-white font-bold rounded-xl hover:shadow-warm-lg transition transform hover:scale-105 btn-ripple shine-effect"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#FAF8F5] via-[#FFF9F0] to-[#FAF8F5] dark:from-[#1F1F1F] dark:via-[#2D2D2D] dark:to-[#1F1F1F] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#D97706] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7C2D3A] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C2D3A]/10 to-[#D97706]/10 dark:from-[#A53E4C]/20 dark:to-[#F59E0B]/20 px-5 py-2.5 rounded-full text-sm font-bold mb-8 border border-[#7C2D3A]/20">
                <span className="text-2xl">🚀</span>
                <span className="gradient-text">The Future of Competitive Coding</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-6 leading-tight">
                Master Coding Through
                <span className="block gradient-text mt-2">Live Auctions</span>
              </h1>

              <p className="text-xl text-[#6B6B6B] dark:text-[#8C8C8C] mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Bid on coding challenges, compete in real-time, and level up your skills with our innovative auction-based learning platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/register')}
                  className="px-10 py-4 bg-gradient-to-r from-[#7C2D3A] to-[#A53E4C] text-white font-bold rounded-xl hover:shadow-warm-lg transition transform hover:scale-105 text-lg btn-ripple shine-effect"
                >
                  Start Free Trial →
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 bg-white dark:bg-[#2D2D2D] text-[#7C2D3A] dark:text-[#F59E0B] font-bold rounded-xl border-2 border-[#E8E4DD] dark:border-[#3D3D3D] hover:border-[#7C2D3A] dark:hover:border-[#F59E0B] transition shadow-soft hover:shadow-warm transform hover:scale-105 text-lg"
                >
                  Watch Demo ▶
                </button>
              </div>

              <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓', '👨‍💼'].map((emoji, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C2D3A] to-[#D97706] flex items-center justify-center border-4 border-[#FAF8F5] dark:border-[#1F1F1F] shadow-lg">
                      <span className="text-lg">{emoji}</span>
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="font-black text-[#1F1F1F] dark:text-[#FAF8F5] text-lg">10,000+ developers</div>
                  <div className="text-[#6B6B6B] dark:text-[#8C8C8C] text-sm">already competing</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-elevated p-8 border border-[#E8E4DD] dark:border-[#3D3D3D]">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-[#8B0000]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#D97706]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#6B8E23]"></div>
                </div>
                <div className="bg-[#1F1F1F] dark:bg-[#0D0D0D] rounded-xl p-6 font-mono text-sm">
                  <div className="text-[#8C8C8C]">function <span className="text-[#F59E0B]">solveProblem</span>() {'{'}</div>
                  <div className="text-[#8C8C8C] ml-4">// Your code here</div>
                  <div className="text-[#FAF8F5] ml-4">const <span className="text-white font-bold">result</span> = <span className="text-[#6B8E23]">bidAndWin</span>();</div>
                  <div className="text-[#8C8C8C] ml-4">return <span className="text-white font-bold">result</span>;</div>
                  <div className="text-[#8C8C8C]">{'}'}</div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#6B8E23] to-[#85A438] flex items-center justify-center text-white font-bold shadow-lg">
                      ✓
                    </div>
                    <span className="text-sm font-bold text-[#6B8E23]">All tests passed</span>
                  </div>
                  <div className="text-sm text-[#6B6B6B] dark:text-[#8C8C8C]">Runtime: <span className="font-bold text-[#D97706]">42ms</span></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white px-8 py-4 rounded-xl shadow-warm-lg font-black text-lg">
                🏆 Top 1% Solver
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-[#2D2D2D] border-y border-[#E8E4DD] dark:border-[#3D3D3D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl mb-3 group-hover:scale-110 transition">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-[#6B6B6B] dark:text-[#8C8C8C] font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#1F1F1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-[#6B6B6B] dark:text-[#8C8C8C] max-w-2xl mx-auto">
              Powerful features designed to accelerate your coding journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#2D2D2D] rounded-2xl p-8 shadow-soft hover:shadow-warm border border-[#E8E4DD] dark:border-[#3D3D3D] card-hover group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} dark:from-[#3D3D3D] dark:to-[#4D4D4D] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-3">{feature.title}</h3>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#2D2D2D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-[#6B6B6B] dark:text-[#8C8C8C]">Simple, fast, and effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Join Auction', desc: 'Browse live or scheduled coding auctions', icon: '🎯', gradient: 'from-[#7C2D3A] to-[#A53E4C]' },
              { step: '2', title: 'Place Bid', desc: 'Bid on challenges that match your skill level', icon: '💰', gradient: 'from-[#D97706] to-[#F59E0B]' },
              { step: '3', title: 'Code & Win', desc: 'Solve problems and climb the leaderboard', icon: '🏆', gradient: 'from-[#C65D3B] to-[#E67E50]' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-warm-lg transform hover:scale-110 hover:rotate-6 transition`}>
                    {item.step}
                  </div>
                  <div className="text-5xl mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-3">{item.title}</h3>
                  <p className="text-[#6B6B6B] dark:text-[#8C8C8C]">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-[#D97706] to-transparent -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF8F5] dark:bg-[#1F1F1F]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-[#1F1F1F] dark:text-[#FAF8F5] mb-6">
              Loved by Developers
            </h2>
            <p className="text-xl text-[#6B6B6B] dark:text-[#8C8C8C]">See what our community has to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-[#2D2D2D] rounded-2xl p-8 shadow-soft hover:shadow-warm border border-[#E8E4DD] dark:border-[#3D3D3D] card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#7C2D3A] to-[#D97706] rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#1F1F1F] dark:text-[#FAF8F5]">{testimonial.name}</div>
                    <div className="text-sm text-[#6B6B6B] dark:text-[#8C8C8C]">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-[#6B6B6B] dark:text-[#8C8C8C] italic leading-relaxed">"{testimonial.text}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#F59E0B] text-xl">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#7C2D3A] via-[#A53E4C] to-[#7C2D3A] dark:from-[#2D2D2D] dark:via-[#1F1F1F] dark:to-[#2D2D2D] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
            Ready to Start Your Journey?
          </h2>
          <p className="text-2xl text-white/90 mb-10">
            Join thousands of developers improving their skills every day
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-12 py-5 bg-white dark:bg-[#FAF8F5] text-[#7C2D3A] font-black rounded-xl hover:shadow-elevated transition transform hover:scale-105 text-xl btn-ripple shine-effect"
          >
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F1F1F] dark:bg-[#0D0D0D] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7C2D3A] to-[#A53E4C] rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black">CA</span>
                </div>
                <span className="text-xl font-black">CodeAuction</span>
              </div>
              <p className="text-[#8C8C8C] text-sm leading-relaxed">Revolutionizing coding education through competitive auctions.</p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#F59E0B]">Product</h4>
              <ul className="space-y-3 text-sm text-[#8C8C8C]">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#F59E0B]">Company</h4>
              <ul className="space-y-3 text-sm text-[#8C8C8C]">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-[#F59E0B]">Legal</h4>
              <ul className="space-y-3 text-sm text-[#8C8C8C]">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#3D3D3D] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-[#8C8C8C]">
              © 2025 Code Auction. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-gradient-to-br hover:from-[#7C2D3A] hover:to-[#D97706] transition">
                <span>𝕏</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-gradient-to-br hover:from-[#7C2D3A] hover:to-[#D97706] transition">
                <span>in</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-gradient-to-br hover:from-[#7C2D3A] hover:to-[#D97706] transition">
                <span>GH</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
