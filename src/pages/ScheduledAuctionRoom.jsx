import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { scheduledAuctionAPI, auctionAPI } from '../services/api';
import socketService from '../services/socket';
import Editor from '@monaco-editor/react';

export default function ScheduledAuctionRoom() {
  const { id } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  
  const [auction, setAuction] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isCodingPhase, setIsCodingPhase] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentBid, setCurrentBid] = useState({ amount: 0, bidderUsername: '', bidderTeam: '' });
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [wallet, setWallet] = useState(0);
  
  // Coding phase states
  const [codingQuestions, setCodingQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [allottedQuestions, setAllottedQuestions] = useState([]);

  useEffect(() => {
    loadAuction();
    loadWallet();
    loadAllottedQuestions();
    setupSocketListeners();

    // Join the auction room
    socketService.connect();
    socketService.socket.emit('join-scheduled-auction', { auctionId: id });

    return () => {
      socketService.socket.emit('leave-scheduled-auction', { auctionId: id });
      cleanupSocketListeners();
    };
  }, [id]);

  const loadAuction = async () => {
    try {
      const response = await scheduledAuctionAPI.getById(id);
      setAuction(response.data);
    } catch (error) {
      console.error('Error loading auction:', error);
      alert('Error loading auction');
      navigate('/scheduled');
    }
  };

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
    socketService.on('scheduled-auction-started', (data) => {
      alert(`Auction "${data.title}" is starting now!`);
    });

    socketService.on('scheduled-question-pushed', (data) => {
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

    socketService.on('scheduled-timer-update', (data) => {
      setTimeRemaining(data.timeRemaining);
    });

    socketService.on('scheduled-auction-ended', (data) => {
      setIsActive(false);
      setCurrentQuestion(null);
      loadWallet();
      loadAllottedQuestions();
    });

    socketService.on('scheduled-coding-started', (data) => {
      if (data.userId === user.id) {
        setCodingQuestions(data.questions);
        setCurrentQuestionIndex(0);
        setCode(data.questions[0]?.question.starterCode || '');
        setIsCodingPhase(true);
        setTimeRemaining(data.timeRemaining);
      }
    });

    socketService.on('scheduled-coding-timer-update', (data) => {
      if (isCodingPhase) {
        setTimeRemaining(data.timeRemaining);
      }
    });

    socketService.on('scheduled-auction-completed', (data) => {
      setIsCodingPhase(false);
      setCodingQuestions([]);
      setResults(data.results);
    });

    socketService.on('scheduled-auction-cancelled', (data) => {
      alert('This auction has been cancelled');
      navigate('/scheduled');
    });
  };

  const cleanupSocketListeners = () => {
    socketService.off('scheduled-auction-started');
    socketService.off('scheduled-question-pushed');
    socketService.off('new-bid');
    socketService.off('scheduled-timer-update');
    socketService.off('scheduled-auction-ended');
    socketService.off('scheduled-coding-started');
    socketService.off('scheduled-coding-timer-update');
    socketService.off('scheduled-auction-completed');
    socketService.off('scheduled-auction-cancelled');
  };

  const handlePlaceBid = () => {
    const amount = parseInt(bidAmount);
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid bid amount');
      return;
    }

    if (amount > wallet) {
      alert('Insufficient wallet balance');
      return;
    }

    if (amount <= currentBid.amount) {
      alert('Bid must be higher than current bid');
      return;
    }

    socketService.socket.emit('scheduled:place-bid', {
      auctionId: id,
      userId: user.id,
      amount
    });

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
        
        if (currentQuestionIndex < codingQuestions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setCode(codingQuestions[nextIndex].question.starterCode || '');
          alert(`Moving to question ${nextIndex + 1} of ${codingQuestions.length}`);
        } else {
          alert('All questions completed! Waiting for results...');
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

  // Results view
  if (results) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">🏆 Auction Results</h1>
            
            <div className="space-y-4">
              {results.map((result, index) => (
                <div 
                  key={result.user}
                  className={`p-4 rounded-lg flex items-center justify-between ${
                    index === 0 ? 'bg-yellow-100 border-2 border-yellow-400' :
                    index === 1 ? 'bg-gray-100 border-2 border-gray-400' :
                    index === 2 ? 'bg-orange-100 border-2 border-orange-400' :
                    'bg-white border'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-600">#{result.rank}</span>
                    <div>
                      <p className="font-bold text-lg">{result.username}</p>
                      <p className="text-sm text-gray-600">{result.teamName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{result.totalScore}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{result.questionsCompleted}/{result.questionsWon} completed</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/scheduled')}
              className="w-full mt-6 bg-slate-800 dark:bg-slate-700 text-white py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-slate-600 transition"
            >
              Back to Scheduled Auctions
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Coding phase view
  if (isCodingPhase && codingQuestions.length > 0) {
    const currentQ = codingQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg p-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{currentQ.question.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Question {currentQuestionIndex + 1} of {codingQuestions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
              {formatTime(timeRemaining)}
            </div>
            <button
              onClick={handleSubmitCode}
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {submitting ? 'Submitting...' : currentQuestionIndex < codingQuestions.length - 1 ? 'Submit & Next' : 'Submit Final'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 h-[calc(100vh-80px)]">
          <div className="p-6 overflow-y-auto bg-white border-r">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                currentQ.question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentQ.question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQ.question.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap mb-6">{currentQ.question.description}</p>

            <h2 className="text-xl font-bold mb-4">Test Cases</h2>
            <div className="space-y-4">
              {currentQ.question.testCases.map((tc, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Test Case {index + 1}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Input:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-sm">{tc.input}</pre>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Expected Output:</span>
                      <pre className="bg-white p-2 rounded mt-1 text-sm">{tc.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Waiting/Bidding view
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {auction && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{auction.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{auction.description}</p>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Participants</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{auction.joinedUsers?.length || 0}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Wallet</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{wallet} pts</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Questions</p>
                  <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{auction.questions?.length || 0}</p>
                </div>
              </div>
            </div>

            {isActive && currentQuestion ? (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentQuestion.title}</h2>
                  <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{formatTime(timeRemaining)}</div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Bid</p>
                  {currentBid.amount > 0 ? (
                    <div>
                      <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{currentBid.amount} pts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">by {currentBid.bidderUsername} ({currentBid.bidderTeam})</p>
                    </div>
                  ) : (
                    <p className="text-xl text-gray-400 dark:text-gray-500">No bids yet</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter bid amount"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg text-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    min={currentBid.amount + 1}
                  />
                  <button
                    onClick={handlePlaceBid}
                    className="bg-slate-800 dark:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-900 dark:hover:bg-slate-600 transition text-lg"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-xl text-gray-600">Waiting for auction to start...</p>
                <p className="text-gray-400 mt-2">The auction will begin automatically when enough users join</p>
              </div>
            )}

            {/* Allotted Questions Section */}
            {allottedQuestions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Allotted Questions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Question</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bid Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allottedQuestions.map((aq) => (
                        <tr key={aq._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{aq.user.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{aq.user.teamName}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{aq.question.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              aq.question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              aq.question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {aq.question.difficulty}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">{aq.bidAmount} pts</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              aq.status === 'submitted' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                              aq.status === 'coding' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300' :
                              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {aq.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {aq.score !== null ? (
                              <span className={`font-semibold ${
                                aq.score >= 80 ? 'text-green-600' :
                                aq.score >= 50 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {aq.score}%
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

