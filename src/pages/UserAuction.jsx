import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { auctionAPI } from '../services/api';
import socketService from '../services/socket';
import Editor from '@monaco-editor/react';

const UserAuction = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(200);
  const [bidAmount, setBidAmount] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentBid, setCurrentBid] = useState({ amount: 0, bidderUsername: '', bidderTeam: '' });
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCodingPhase, setIsCodingPhase] = useState(false);
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [allottedQuestions, setAllottedQuestions] = useState([]);

  useEffect(() => {
    loadWallet();
    loadAllottedQuestions();
    setupSocketListeners();

    return () => {
      socketService.off('question-pushed');
      socketService.off('new-bid');
      socketService.off('timer-update');
      socketService.off('auction-ended');
      socketService.off('coding-started');
      socketService.off('coding-timer-update');
      socketService.off('coding-ended');
    };
  }, []);

  const loadWallet = async () => {
    try {
      const response = await auctionAPI.getWallet();
      setWallet(response.data.wallet);
    } catch (error) {
      console.error('Error loading wallet:', error);
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
      if (data.winner && data.winner.username === user.username) {
        loadWallet();
      }
      loadAllottedQuestions();
    });

    socketService.on('coding-started', (data) => {
      if (data.userId === user.id) {
        setCodingQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setCode(data.questions[0]?.question.starterCode || '');
        setIsCodingPhase(true);
        setTimeRemaining(data.timeRemaining);
      }
    });

    socketService.on('coding-timer-update', (data) => {
      if (isCodingPhase) {
        setTimeRemaining(data.timeRemaining);
      }
    });

    socketService.on('coding-ended', (data) => {
      setIsCodingPhase(false);
      setCodingQuestions([]);
      setCurrentQuestionIndex(0);
      alert('Coding phase ended! Check results.');
    });
  };

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    if (amount > wallet) {
      alert('Insufficient balance');
      return;
    }

    if (amount <= currentBid.amount) {
      alert('Bid must be higher than current bid');
      return;
    }

    socketService.placeBid(user.id, amount);
    setBidAmount('');
  };

  const handleSubmitCode = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting');
      return;
    }

    const currentQuestion = codingQuestions[currentQuestionIndex];
    if (!currentQuestion) return;

    if (window.confirm('Are you sure you want to submit your code?')) {
      setSubmitting(true);
      try {
        const response = await auctionAPI.submitCode(currentQuestion.allottedQuestionId, code);
        alert(`Code submitted! Score: ${response.data.score}% (${response.data.testCasesPassed}/${response.data.totalTestCases} test cases passed)`);

        // Move to next question if available
        if (currentQuestionIndex < codingQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCode(codingQuestions[nextIndex].question.starterCode || '');
          alert(`Moving to question ${nextIndex + 1} of ${codingQuestions.length}`);
        } else {
          // All questions completed
          setIsCodingPhase(false);
          setCodingQuestions([]);
          setCurrentQuestionIndex(0);
          alert('All questions completed! Well done!');
        }
      } catch (error) {
        alert('Error submitting code: ' + (error.response?.data?.message || error.message));
      }
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-submit when timer reaches 0 during coding phase
  useEffect(() => {
    if (isCodingPhase && timeRemaining === 0 && codingQuestions.length > 0) {
      handleSubmitCode();
    }
  }, [timeRemaining, isCodingPhase]);

  if (isCodingPhase && codingQuestions.length > 0) {
    const currentQuestion = codingQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-2xl p-4 md:p-6 border-b border-gray-700">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💻</span>
                <h1 className="text-2xl md:text-3xl font-black text-white">{currentQuestion.question.title}</h1>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-400">
                  Question <span className="font-bold text-blue-400">{currentQuestionIndex + 1}</span> of <span className="font-bold">{codingQuestions.length}</span>
                </p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  currentQuestion.question.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                  currentQuestion.question.difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {currentQuestion.question.difficulty}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`text-3xl md:text-4xl font-black ${
                timeRemaining < 60 ? 'text-red-500 animate-pulse' : 'text-blue-400'
              }`}>
                ⏱️ {formatTime(timeRemaining)}
              </div>
              <button
                onClick={handleSubmitCode}
                disabled={submitting}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 active:scale-95 transition-all disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed btn-ripple"
              >
                {submitting ? '⏳ Submitting...' : currentQuestionIndex < codingQuestions.length - 1 ? '✅ Submit & Next' : '🏁 Submit Final'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-120px)]">
          {/* Problem Description */}
          <div className="p-6 overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 border-r border-gray-700">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📋</span>
                  <h2 className="text-2xl font-black text-gray-800">Description</h2>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{currentQuestion.question.description}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🧪</span>
                  <h2 className="text-2xl font-black text-gray-800">Test Cases</h2>
                </div>
                <div className="space-y-4">
                  {currentQuestion.question.testCases.map((tc, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
                      <p className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">{index + 1}</span>
                        Test Case {index + 1}
                      </p>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Input:</span>
                          <pre className="bg-white p-3 rounded-lg mt-2 text-sm font-mono border border-gray-300 shadow-sm">{tc.input}</pre>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Expected Output:</span>
                          <pre className="bg-white p-3 rounded-lg mt-2 text-sm font-mono border border-gray-300 shadow-sm">{tc.expectedOutput}</pre>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-gray-900 relative">
            <div className="absolute top-4 left-4 z-10 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 shadow-lg">
              <span className="text-yellow-400 font-mono text-sm font-bold">JavaScript</span>
            </div>
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 16,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                fontFamily: 'Fira Code, monospace',
                fontLigatures: true,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: true
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">CA</span>
                </div>
                <span className="font-bold text-gray-900">Auction Arena</span>
              </div>
              <div className="hidden md:flex items-center gap-1 text-sm">
                <span className="text-gray-500">Wallet:</span>
                <span className="font-bold text-green-600">{wallet} pts</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-medium text-gray-700">{isActive ? 'Live' : 'Idle'}</span>
              </div>
              <div className="text-lg font-bold text-gray-900">{formatTime(timeRemaining)}</div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Current Question - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Question</h3>
              {currentQuestion && (
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              )}
            </div>
            {currentQuestion ? (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentQuestion.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{currentQuestion.description}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2 opacity-30">📝</div>
                <p className="text-gray-500 text-sm">No active question</p>
              </div>
            )}
          </div>

          {/* Bidding Panel */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Place Bid</h3>

            {currentBid.bidderUsername && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-gray-600 mb-1">Current Highest</p>
                <p className="text-2xl font-black text-yellow-700">{currentBid.amount}</p>
                <p className="text-xs text-gray-600 mt-1">{currentBid.bidderUsername}</p>
              </div>
            )}

            <div className="space-y-3">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={!isActive}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
              <button
                onClick={handlePlaceBid}
                disabled={!isActive || !bidAmount}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {!isActive ? 'Bidding Closed' : 'Place Bid'}
              </button>
            </div>
          </div>

          {/* Current Question Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">📝</span>
                Current Question
              </h2>
              {currentQuestion && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                  Active
                </span>
              )}
            </div>
            {currentQuestion ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{currentQuestion.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{currentQuestion.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                    'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">Difficulty Level</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 opacity-50">🎯</div>
                <p className="text-gray-500 text-lg font-medium">No active question</p>
                <p className="text-gray-400 text-sm mt-2">Waiting for admin to push a question...</p>
              </div>
            )}
          </div>

          {/* Bidding Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 card-hover border border-gray-100 animate-slide-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-3xl">🎪</span>
                Place Your Bid
              </h2>
              {isActive && (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Open
                </span>
              )}
            </div>

            {currentBid.bidderUsername && (
              <div className="mb-6 p-5 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border-2 border-yellow-300 shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Current Highest Bid</p>
                    <p className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                      {currentBid.amount} <span className="text-lg">PTS</span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      by <span className="font-bold">{currentBid.bidderUsername}</span>
                      <span className="text-gray-500"> ({currentBid.bidderTeam})</span>
                    </p>
                  </div>
                  <div className="text-5xl">👑</div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  disabled={!isActive}
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  PTS
                </div>
              </div>
              <button
                onClick={handlePlaceBid}
                disabled={!isActive || !bidAmount}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none btn-ripple"
              >
                {!isActive ? '⏸️ Bidding Closed' : !bidAmount ? '💰 Enter Amount' : '🚀 Place Bid'}
              </button>
            </div>
          </div>
        </div>

        {/* Allotted Questions Section */}
        <div className="bg-white rounded-lg shadow border border-gray-200 mt-4">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">My Questions</h3>
            <span className="text-xs text-gray-500">{allottedQuestions.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Bid</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allottedQuestions.map((aq) => (
                  <tr key={aq._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{aq.question?.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-purple-600 font-semibold">{aq.bidAmount}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        aq.status === 'submitted' ? 'bg-green-100 text-green-700' :
                        aq.status === 'coding' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {aq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {aq.score !== null ? (
                        <span className={`font-bold ${
                          aq.score >= 80 ? 'text-green-600' :
                          aq.score >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {aq.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {allottedQuestions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">No questions allotted yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuction;

