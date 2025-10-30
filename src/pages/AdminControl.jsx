import { useState, useEffect } from 'react';
import { questionAPI, adminAPI } from '../services/api';

const AdminControl = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    tags: '',
    starterCode: '',
    testCases: [{ input: '', expectedOutput: '' }]
  });

  useEffect(() => {
    if (activeTab === 'questions') {
      loadQuestions();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadQuestions = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const [usersRes, countRes] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getUserCount()
      ]);
      setUsers(usersRes.data);
      setUserCount(countRes.data.count);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleQuestionFormChange = (e) => {
    setQuestionForm({
      ...questionForm,
      [e.target.name]: e.target.value
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...questionForm.testCases];
    newTestCases[index][field] = value;
    setQuestionForm({ ...questionForm, testCases: newTestCases });
  };

  const addTestCase = () => {
    setQuestionForm({
      ...questionForm,
      testCases: [...questionForm.testCases, { input: '', expectedOutput: '' }]
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = questionForm.testCases.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, testCases: newTestCases });
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...questionForm,
        tags: questionForm.tags.split(',').map(t => t.trim()).filter(t => t)
      };
      await questionAPI.create(data);
      alert('Question created successfully!');
      setShowQuestionForm(false);
      setQuestionForm({
        title: '',
        description: '',
        difficulty: 'Easy',
        tags: '',
        starterCode: '',
        testCases: [{ input: '', expectedOutput: '' }]
      });
      loadQuestions();
    } catch (error) {
      alert('Error creating question: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionAPI.delete(id);
        alert('Question deleted successfully!');
        loadQuestions();
      } catch (error) {
        alert('Error deleting question: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeactivateUser = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await adminAPI.deactivateUser(id);
        alert('User deactivated successfully!');
        loadUsers();
      } catch (error) {
        alert('Error deactivating user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await adminAPI.deleteUser(id);
        alert('User deleted successfully!');
        loadUsers();
      } catch (error) {
        alert('Error deleting user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">
            ⚙️ Admin Control Panel
          </h1>
          <p className="text-gray-600 text-lg">Manage questions, users, and platform settings</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl mb-6 border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all relative ${
                activeTab === 'questions'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl">📝</span>
                Questions
              </span>
              {activeTab === 'questions' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-all relative ${
                activeTab === 'users'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl">👥</span>
                Users
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-bold">
                  {userCount}
                </span>
              </span>
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">DSA Questions</h2>
                <button
                  onClick={() => setShowQuestionForm(!showQuestionForm)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {showQuestionForm ? 'Cancel' : 'Add Question'}
                </button>
              </div>

              {showQuestionForm && (
                <form onSubmit={handleSubmitQuestion} className="mb-6 p-6 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={questionForm.title}
                      onChange={handleQuestionFormChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={questionForm.description}
                      onChange={handleQuestionFormChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Difficulty</label>
                      <select
                        name="difficulty"
                        value={questionForm.difficulty}
                        onChange={handleQuestionFormChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={questionForm.tags}
                        onChange={handleQuestionFormChange}
                        placeholder="array, sorting, dynamic-programming"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Starter Code</label>
                    <textarea
                      name="starterCode"
                      value={questionForm.starterCode}
                      onChange={handleQuestionFormChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-700 font-medium">Test Cases</label>
                      <button
                        type="button"
                        onClick={addTestCase}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        + Add Test Case
                      </button>
                    </div>
                    {questionForm.testCases.map((tc, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4 mb-3 p-3 bg-white rounded border">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Input</label>
                          <input
                            type="text"
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Expected Output</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={tc.expectedOutput}
                              onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                              required
                              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {questionForm.testCases.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTestCase(index)}
                                className="text-red-600 hover:text-red-700 px-2"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Create Question
                  </button>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tags</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Test Cases</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {questions.map((q) => (
                      <tr key={q._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{q.title}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{q.tags?.join(', ') || '-'}</td>
                        <td className="px-4 py-3 text-sm">{q.testCases?.length || 0}</td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            onClick={() => handleDeleteQuestion(q._id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Registered Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Team</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wallet</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{user.username}</td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.teamName}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{user.wallet} pts</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm space-x-2">
                        {user.isActive && (
                          <button
                            onClick={() => handleDeactivateUser(user._id)}
                            className="text-orange-600 hover:text-orange-800 font-semibold"
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminControl;

