import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scheduledAuctionAPI } from '../services/api';
import socketService from '../services/socket';

export default function UserScheduled() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadScheduledAuctions();
    setupSocketListeners();

    return () => {
      socketService.off('scheduled-auction-ready');
      socketService.off('user-joined-scheduled');
      socketService.off('user-left-scheduled');
      socketService.off('scheduled-auction-cancelled');
    };
  }, []);

  const loadScheduledAuctions = async () => {
    try {
      const response = await scheduledAuctionAPI.getAll();
      setScheduledAuctions(response.data);
    } catch (error) {
      console.error('Error loading scheduled auctions:', error);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('scheduled-auction-ready', (data) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: `${data.title} is ready to start!`,
        auctionId: data.auctionId
      }]);
      loadScheduledAuctions();
    });

    socketService.on('user-joined-scheduled', (data) => {
      setScheduledAuctions(prev => prev.map(auction => 
        auction._id === data.auctionId
          ? { ...auction, joinedUsers: [...(auction.joinedUsers || []), { user: { _id: data.userId } }] }
          : auction
      ));
    });

    socketService.on('user-left-scheduled', (data) => {
      setScheduledAuctions(prev => prev.map(auction => 
        auction._id === data.auctionId
          ? { ...auction, joinedUsers: auction.joinedUsers.filter(ju => ju.user._id !== data.userId) }
          : auction
      ));
    });

    socketService.on('scheduled-auction-cancelled', (data) => {
      alert(`Auction "${data.title}" has been cancelled`);
      loadScheduledAuctions();
    });
  };

  const handleJoinAuction = async (auctionId) => {
    try {
      await scheduledAuctionAPI.join(auctionId);
      alert('Joined auction successfully!');
      loadScheduledAuctions();
      
      // Navigate to the auction room
      navigate(`/scheduled-auction/${auctionId}`);
    } catch (error) {
      alert('Error joining auction: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLeaveAuction = async (auctionId) => {
    if (window.confirm('Are you sure you want to leave this auction?')) {
      try {
        await scheduledAuctionAPI.leave(auctionId);
        alert('Left auction successfully');
        loadScheduledAuctions();
      } catch (error) {
        alert('Error leaving auction: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const isUserJoined = (auction) => {
    return auction.joinedUsers?.some(ju => ju.user._id === user.id);
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date - now;
    
    if (diff < 0) return 'Started';
    if (diff < 60000) return 'Starting soon...';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours`;
    return `${Math.floor(diff / 86400000)} days`;
  };

  const getTimeUntil = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
            📅 Scheduled Auctions
          </h1>
          <p className="text-gray-600 text-lg">Browse and join upcoming coding auctions</p>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.map(notif => (
              <div key={notif.id} className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded flex justify-between items-center">
                <p className="text-blue-800 font-semibold">{notif.message}</p>
                <button
                  onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scheduledAuctions.map(auction => {
            const joined = isUserJoined(auction);
            const isFull = auction.maxUsers && auction.joinedUsers?.length >= auction.maxUsers;
            
            return (
              <div key={auction._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{auction.title}</h2>
                    <p className="text-gray-600 mt-1">{auction.description}</p>
                  </div>
                  {joined && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Joined
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Starts in:</span>
                    <span className="font-bold text-blue-600">{formatDateTime(auction.scheduledTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Scheduled Time:</span>
                    <span className="font-semibold">{getTimeUntil(auction.scheduledTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-semibold">{auction.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Participants:</span>
                    <span className="font-semibold">
                      {auction.joinedUsers?.length || 0} / {auction.minUsers} min
                      {auction.maxUsers ? ` (max ${auction.maxUsers})` : ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Auction Duration:</span>
                    <span className="font-semibold">{auction.auctionDuration}s per question</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Coding Duration:</span>
                    <span className="font-semibold">{Math.floor(auction.codingDuration / 60)} minutes</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Participants</span>
                    <span>{auction.joinedUsers?.length || 0} / {auction.minUsers}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        (auction.joinedUsers?.length || 0) >= auction.minUsers 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ 
                        width: `${Math.min(((auction.joinedUsers?.length || 0) / auction.minUsers) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {joined ? (
                    <>
                      <button
                        onClick={() => navigate(`/scheduled-auction/${auction._id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Enter Auction Room
                      </button>
                      <button
                        onClick={() => handleLeaveAuction(auction._id)}
                        className="px-4 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                      >
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleJoinAuction(auction._id)}
                      disabled={isFull}
                      className={`w-full py-2 rounded-lg font-semibold transition ${
                        isFull 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {isFull ? 'Auction Full' : 'Join Auction'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {scheduledAuctions.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No scheduled auctions available at the moment</p>
            <p className="text-gray-400 mt-2">Check back later for upcoming auctions!</p>
          </div>
        )}
      </div>
    </div>
  );
}

