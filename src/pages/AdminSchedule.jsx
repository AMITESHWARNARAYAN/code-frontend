import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { scheduledAuctionAPI, questionAPI } from '../services/api';

export default function AdminSchedule() {
  const { user } = useAuth();
  const [scheduledAuctions, setScheduledAuctions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledTime: '',
    questions: [],
    minUsers: 2,
    maxUsers: '',
    auctionDuration: 60,
    codingDuration: 900
  });

  useEffect(() => {
    loadScheduledAuctions();
    loadQuestions();
  }, []);

  const loadScheduledAuctions = async () => {
    try {
      const response = await scheduledAuctionAPI.getAllAdmin();
      setScheduledAuctions(response.data);
    } catch (error) {
      console.error('Error loading scheduled auctions:', error);
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionToggle = (questionId) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.includes(questionId)
        ? prev.questions.filter(id => id !== questionId)
        : [...prev.questions, questionId]
    }));
  };

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      alert('Please select at least one question');
      return;
    }

    try {
      await scheduledAuctionAPI.create({
        ...formData,
        maxUsers: formData.maxUsers ? parseInt(formData.maxUsers) : null
      });
      
      alert('Scheduled auction created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        scheduledTime: '',
        questions: [],
        minUsers: 2,
        maxUsers: '',
        auctionDuration: 60,
        codingDuration: 900
      });
      loadScheduledAuctions();
    } catch (error) {
      alert('Error creating scheduled auction: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancelAuction = async (id) => {
    if (window.confirm('Are you sure you want to cancel this auction?')) {
      try {
        await scheduledAuctionAPI.cancel(id);
        alert('Auction cancelled successfully');
        loadScheduledAuctions();
      } catch (error) {
        alert('Error cancelling auction: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteAuction = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await scheduledAuctionAPI.delete(id);
        alert('Auction deleted successfully');
        loadScheduledAuctions();
      } catch (error) {
        alert('Error deleting auction: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-fuchsia-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
              📅 Scheduled Auctions
            </h1>
            <p className="text-gray-600 text-lg">Create and manage scheduled auction events</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 transition-all btn-ripple whitespace-nowrap"
          >
            {showCreateForm ? '❌ Cancel' : '➕ Create New Auction'}
          </button>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Scheduled Auction</h2>
            <form onSubmit={handleCreateAuction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Weekly Coding Challenge"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Time</label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the auction..."
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Min Users</label>
                  <input
                    type="number"
                    name="minUsers"
                    value={formData.minUsers}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Max Users (optional)</label>
                  <input
                    type="number"
                    name="maxUsers"
                    value={formData.maxUsers}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Unlimited"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Auction Duration (sec)</label>
                  <input
                    type="number"
                    name="auctionDuration"
                    value={formData.auctionDuration}
                    onChange={handleInputChange}
                    min="10"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Coding Duration (sec)</label>
                  <input
                    type="number"
                    name="codingDuration"
                    value={formData.codingDuration}
                    onChange={handleInputChange}
                    min="60"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Questions ({formData.questions.length} selected)
                </label>
                <div className="border rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
                  {questions.map(question => (
                    <label key={question._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.questions.includes(question._id)}
                        onChange={() => handleQuestionToggle(question._id)}
                        className="w-4 h-4"
                      />
                      <span className="flex-1">{question.title}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Create Scheduled Auction
              </button>
            </form>
          </div>
        )}

        {/* Auctions List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">All Scheduled Auctions</h2>
          <div className="space-y-4">
            {scheduledAuctions.map(auction => (
              <div key={auction._id} className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{auction.title}</h3>
                    <p className="text-gray-600 text-sm">{auction.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(auction.status)}`}>
                    {auction.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-gray-600">Scheduled:</span>
                    <p className="font-semibold">{formatDateTime(auction.scheduledTime)}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Questions:</span>
                    <p className="font-semibold">{auction.questions.length}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Users:</span>
                    <p className="font-semibold">{auction.joinedUsers?.length || 0} / {auction.minUsers} min</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-semibold">{auction.auctionDuration}s / {auction.codingDuration}s</p>
                  </div>
                </div>

                {auction.status === 'scheduled' && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleCancelAuction(auction._id)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteAuction(auction._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {scheduledAuctions.length === 0 && (
              <p className="text-center text-gray-500 py-8">No scheduled auctions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

