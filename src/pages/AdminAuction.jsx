import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { questionAPI, auctionAPI } from '../services/api';
import socketService from '../services/socket';

const AdminAuction = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [currentBid, setCurrentBid] = useState({ amount: 0, bidderUsername: '', bidderTeam: '' });
  const [allottedQuestions, setAllottedQuestions] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCodingPhase, setIsCodingPhase] = useState(false);
  const [topPerformers, setTopPerformers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    loadQuestions();
    loadAllottedQuestions();
    setupSocketListeners();

    return () => {
      socketService.off('question-pushed');
      socketService.off('new-bid');
      socketService.off('timer-update');
      socketService.off('auction-ended');
      socketService.off('coding-timer-update');
      socketService.off('coding-ended');
    };
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadAllottedQuestions = async () => {
    try {
      const response = await auctionAPI.getAllotted();
      setAllottedQuestions(response.data);
    } catch (error) {
      console.error('Error loading allotted questions:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('question-pushed', (data) => {
      setCurrentQuestion(data.question);
      setTimeRemaining(data.timeRemaining);
      setIsActive(true);
      setCurrentBid({ amount: 0, bidderUsername: '', bidderTeam: '' });
    });

    socketService.on('new-bid', (data) => {
      setCurrentBid({
        amount: data.amount,
        bidderUsername: data.bidderUsername,
        bidderTeam: data.bidderTeam
      });
      setTimeRemaining(data.timeRemaining);
    });

    socketService.on('timer-update', (data) => {
      setTimeRemaining(data.timeRemaining);
    });

    socketService.on('auction-ended', (data) => {
      setIsActive(false);
      setCurrentQuestion(null);
      loadAllottedQuestions();
    });

    socketService.on('coding-timer-update', (data) => {
      setTimeRemaining(data.timeRemaining);
    });

    socketService.on('coding-ended', (data) => {
      setIsCodingPhase(false);
      setTopPerformers(data.topPerformers);
    });
  };

  const handlePushQuestion = () => {
    if (!selectedQuestion) {
      alert('Please select a question');
      return;
    }
    socketService.pushQuestion(selectedQuestion, user.id);
  };

  const handleStartCoding = () => {
    if (window.confirm('Are you sure you want to start the coding phase?')) {
      socketService.startCoding(user.id);
      setIsCodingPhase(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
            👑 Admin Auction Control
          </h1>
          <p className="text-gray-600 text-lg">Manage auctions, monitor bids, and control the flow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Push Question Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                Push Question
              </h2>
              {isActive && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  🔴 Live
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-base font-medium focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none transition-all"
                  disabled={isActive}
                >
                  <option value="">🎯 Select a question to push</option>
                  {questions.map((q) => (
                    <option key={q._id} value={q._id}>
                      {q.title} ({q.difficulty})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handlePushQuestion}
                disabled={isActive || !selectedQuestion}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none btn-ripple"
              >
                {isActive ? '⏸️ Auction in Progress' : selectedQuestion ? '🚀 Push Question' : '📝 Select Question First'}
              </button>
              {selectedQuestion && !isActive && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200">
                  <p className="text-sm text-gray-700">✨ Ready to start the auction!</p>
                </div>
              )}
            </div>
          </div>

          {/* Timer Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">⏱️</span>
                Timer
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isCodingPhase ? 'bg-green-100 text-green-700 animate-pulse' :
                isActive ? 'bg-blue-100 text-blue-700 animate-pulse' :
                'bg-gray-100 text-gray-600'
              }`}>
                {isCodingPhase ? '💻 Coding' : isActive ? '🔴 Live' : '⚪ Idle'}
              </div>
            </div>
            <div className="text-center py-4">
              <div className={`text-7xl font-black mb-4 ${
                timeRemaining < 10 && (isActive || isCodingPhase)
                  ? 'text-red-600 animate-bounce'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'
              }`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  isCodingPhase || isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <p className="text-lg font-semibold text-gray-700">
                  {isCodingPhase ? '💻 Coding Phase Active' :
                   isActive ? '🎪 Bidding Active' :
                   '⏳ No Active Auction'}
                </p>
              </div>
            </div>
          </div>

          {/* Current Highest Bidder Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">👑</span>
                Current Highest Bidder
              </h2>
              {currentBid.bidderUsername && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Leading
                </span>
              )}
            </div>
            {currentBid.bidderUsername ? (
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Top Bidder</p>
                    <p className="font-black text-2xl text-gray-800">{currentBid.bidderUsername}</p>
                    <p className="text-gray-600 mt-1">
                      Team: <span className="font-semibold">{currentBid.bidderTeam}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {currentBid.amount}
                    </p>
                    <p className="text-sm text-gray-600 font-bold">POINTS</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-30">🎯</div>
                <p className="text-gray-500 text-lg font-medium">No bids yet</p>
                <p className="text-gray-400 text-sm mt-2">Waiting for participants to bid...</p>
              </div>
            )}
          </div>

          {/* Start Coding Button */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">💻</span>
                Coding Phase
              </h2>
              {isCodingPhase && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  Active
                </span>
              )}
            </div>
            <button
              onClick={handleStartCoding}
              disabled={isCodingPhase || isActive}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none btn-ripple"
            >
              {isCodingPhase ? '⏸️ Coding in Progress' : '🚀 Start Coding Phase'}
            </button>
            <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-gray-700">
                ⚡ This will push allotted questions to users and start 15-minute timer
              </p>
            </div>
          </div>
        </div>

        {/* Allotted Questions Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Allotted Questions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bid Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allottedQuestions.map((aq) => (
                  <tr key={aq._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{aq.username}</td>
                    <td className="px-4 py-3 text-sm">{aq.teamName}</td>
                    <td className="px-4 py-3 text-sm">{aq.question?.title}</td>
                    <td className="px-4 py-3 text-sm font-semibold">{aq.bidAmount} pts</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        aq.status === 'evaluated' ? 'bg-green-100 text-green-800' :
                        aq.status === 'coding' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {aq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {aq.status === 'evaluated' ? `${aq.score}% (${aq.testCasesPassed}/${aq.totalTestCases})` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allottedQuestions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No questions allotted yet</p>
            )}
          </div>
        </div>

        {/* Top Performers Section */}
        {topPerformers.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Top 3 Performers</h2>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  index === 0 ? 'bg-yellow-50 border-2 border-yellow-400' :
                  index === 1 ? 'bg-gray-50 border-2 border-gray-400' :
                  'bg-orange-50 border-2 border-orange-400'
                }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        #{index + 1} {performer.username}
                      </p>
                      <p className="text-gray-600">Team: {performer.teamName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{performer.score}%</p>
                      <p className="text-sm text-gray-600">
                        {performer.testCasesPassed}/{performer.totalTestCases} test cases
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuction;

