import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: '⚡',
      title: 'Real-Time Bidding',
      description: 'Compete with peers in live auctions for coding challenges with instant updates'
    },
    {
      icon: '💻',
      title: 'Code Editor',
      description: 'Professional Monaco editor with syntax highlighting and auto-completion'
    },
    {
      icon: '🏆',
      title: 'Competitive Scoring',
      description: 'Test case evaluation with detailed performance metrics and rankings'
    },
    {
      icon: '📅',
      title: 'Scheduled Events',
      description: 'Join scheduled auctions with auto-start and team-based competitions'
    },
    {
      icon: '👥',
      title: 'Team Battles',
      description: 'Form teams and compete against others in collaborative coding challenges'
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Track your progress with detailed statistics and performance insights'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '500+', label: 'Challenges' },
    { value: '50K+', label: 'Submissions' },
    { value: '99.9%', label: 'Uptime' }
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
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">⚡</span>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">CodeAuction</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition">Features</a>
              <a href="#how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition">How It Works</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition">Pricing</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 font-semibold hover:text-gray-900 dark:hover:text-white transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-bold mb-6">
                🚀 The Future of Competitive Coding
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                Master Coding Through
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"> Live Auctions</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                Bid on coding challenges, compete in real-time, and level up your skills with our innovative auction-based learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition shadow-lg hover:shadow-xl transform hover:scale-105 text-lg"
                >
                  Watch Demo
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {['👨‍💻', '👩‍💻', '👨‍🎓', '👩‍🎓'].map((emoji, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center border-2 border-white dark:border-slate-800">
                      <span>{emoji}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-bold text-gray-900 dark:text-white">10,000+ developers</div>
                  <div className="text-gray-600 dark:text-gray-400">already competing</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="bg-gray-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <div className="text-slate-400">function <span className="text-yellow-300">solveProblem</span>() {'{'}</div>
                  <div className="text-gray-500 ml-4">// Your code here</div>
                  <div className="text-slate-300 ml-4">const <span className="text-white">result</span> = <span className="text-green-400">bidAndWin</span>();</div>
                  <div className="text-slate-400 ml-4">return <span className="text-white">result</span>;</div>
                  <div className="text-slate-400">{'}'}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                      ✓
                    </div>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">All tests passed</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Runtime: <span className="font-bold text-gray-900 dark:text-white">42ms</span></div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-xl shadow-xl font-bold">
                🏆 Top 1% Solver
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-gray-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to accelerate your coding journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-gray-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 group"
              >
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Simple, fast, and effective</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Join Auction', desc: 'Browse live or scheduled coding auctions', icon: '🎯' },
              { step: '2', title: 'Place Bid', desc: 'Bid on challenges that match your skill level', icon: '💰' },
              { step: '3', title: 'Code & Win', desc: 'Solve problems and climb the leaderboard', icon: '🏆' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 dark:bg-slate-700 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-slate-300 dark:bg-slate-600 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">See what our community has to say</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of developers improving their skills every day
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-600 transition shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
          >
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-slate-800 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">CA</span>
                </div>
                <span className="text-lg font-black">CodeAuction</span>
              </div>
              <p className="text-gray-400 text-sm">Revolutionizing coding education through competitive auctions.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            © 2025 CodeAuction. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

