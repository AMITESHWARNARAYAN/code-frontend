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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-[#FFF9F0] to-[#FAF8F5] dark:from-[#1F1F1F] dark:via-[#2D2D2D] dark:to-[#1F1F1F] p-4 md:p-6">
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
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft p-6 card-hover border border-[#E8E4DD] dark:border-[#3D3D3D] animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">🚀</span>
                Push Question
              </h2>
              {isActive && (
                <span className="bg-[#8B0000]/10 text-[#8B0000] px-3 py-1 rounded-full text-sm font-semibold animate-pulse border border-[#8B0000]/20">
                  🔴 Live
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="relative">
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#E8E4DD] dark:border-[#3D3D3D] rounded-xl text-base font-medium focus:outline-none focus:border-[#D97706] focus:ring-4 focus:ring-[#D97706]/10 disabled:bg-[#E8E4DD] dark:disabled:bg-[#3D3D3D] disabled:cursor-not-allowed appearance-none transition-all text-[#1F1F1F] dark:text-[#FAF8F5] bg-white dark:bg-[#2D2D2D]"
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
                className="w-full bg-gradient-to-r from-[#7C2D3A] to-[#A53E4C] text-white py-4 rounded-xl font-bold text-lg shadow-warm hover:shadow-warm-lg hover:from-[#6B2531] hover:to-[#933A45] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-[#8C8C8C] disabled:to-[#6B6B6B] disabled:cursor-not-allowed disabled:transform-none btn-ripple"
              >
                {isActive ? '⏸️ Auction in Progress' : selectedQuestion ? '🚀 Push Question' : '📝 Select Question First'}
              </button>
              {selectedQuestion && !isActive && (
                <div className="bg-gradient-to-r from-[#7C2D3A]/10 to-[#D97706]/10 rounded-lg p-3 border border-[#7C2D3A]/20">
                  <p className="text-sm text-gray-700">✨ Ready to start the auction!</p>
                </div>
              )}
            </div>
          </div>

          {/* Timer Section */}
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft p-6 card-hover border border-[#E8E4DD] dark:border-[#3D3D3D] animate-slide-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">⏱️</span>
                Timer
              </h2>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${isCodingPhase ? 'bg-[#6B8E23]/10 text-[#6B8E23] animate-pulse border border-[#6B8E23]/20' :
                  isActive ? 'bg-[#D97706]/10 text-[#D97706] animate-pulse border border-[#D97706]/20' :
                    'bg-[#8C8C8C]/10 text-[#8C8C8C] border border-[#8C8C8C]/20'
                }`}>
                {isCodingPhase ? '💻 Coding' : isActive ? '🔴 Live' : '⚪ Idle'}
              </div>
            </div>
            <div className="text-center py-4">
              <div className={`text-7xl font-black mb-4 ${timeRemaining < 10 && (isActive || isCodingPhase)
                  ? 'text-[#8B0000] animate-bounce'
                  : 'gradient-text'
                }`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isCodingPhase || isActive ? 'bg-[#6B8E23] animate-pulse' : 'bg-[#8C8C8C]'
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
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft p-6 card-hover border border-[#E8E4DD] dark:border-[#3D3D3D] animate-slide-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">👑</span>
                Current Highest Bidder
              </h2>
              {currentBid.bidderUsername && (
                <span className="bg-[#F59E0B]/10 text-[#D97706] px-3 py-1 rounded-full text-sm font-semibold border border-[#D97706]/20">
                  Leading
                </span>
              )}
            </div>
            {currentBid.bidderUsername ? (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-[#D97706]/30 shadow-md">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Top Bidder</p>
                    <p className="font-black text-2xl text-gray-800">{currentBid.bidderUsername}</p>
                    <p className="text-gray-600 mt-1">
                      Team: <span className="font-semibold">{currentBid.bidderTeam}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-black gradient-text">
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
          <div className="bg-white dark:bg-[#2D2D2D] rounded-2xl shadow-soft p-6 card-hover border border-[#E8E4DD] dark:border-[#3D3D3D] animate-slide-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">💻</span>
                Coding Phase
              </h2>
              {isCodingPhase && (
                <span className="bg-[#6B8E23]/10 text-[#6B8E23] px-3 py-1 rounded-full text-sm font-semibold animate-pulse border border-[#6B8E23]/20">
                  Active
                </span>
              )}
            </div>
            <button
              onClick={handleStartCoding}
              disabled={isCodingPhase || isActive}
              className="w-full bg-gradient-to-r from-[#6B8E23] to-[#85A438] text-white py-4 rounded-xl font-bold text-lg shadow-warm hover:shadow-warm-lg hover:from-[#5A7A1C] hover:to-[#709330] transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-[#8C8C8C] disabled:to-[#6B6B6B] disabled:cursor-not-allowed disabled:transform-none btn-ripple"
            >
              {isCodingPhase ? '⏸️ Coding in Progress' : '🚀 Start Coding Phase'}
            </button>
            <div className="mt-4 bg-gradient-to-r from-[#6B8E23]/10 to-[#85A438]/10 rounded-lg p-3 border border-[#6B8E23]/20">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${aq.status === 'evaluated' ? 'bg-[#6B8E23]/10 text-[#6B8E23] border border-[#6B8E23]/20' :
                          aq.status === 'coding' ? 'bg-[#D97706]/10 text-[#D97706] border border-[#D97706]/20' :
                            'bg-[#F59E0B]/10 text-[#CC5500] border border-[#CC5500]/20'
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
                <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-amber-50 border-2 border-[#D97706]' :
                    index === 1 ? 'bg-[#E8E4DD] border-2 border-[#8C8C8C]' :
                      'bg-orange-50 border-2 border-[#E67333]'
                  }`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">
                        #{index + 1} {performer.username}
                      </p>
                      <p className="text-gray-600">Team: {performer.teamName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#7C2D3A]">{performer.score}%</p>
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

