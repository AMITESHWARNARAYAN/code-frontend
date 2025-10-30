import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserAuction from './pages/UserAuction';
import AdminAuction from './pages/AdminAuction';
import AdminControl from './pages/AdminControl';
import AdminSchedule from './pages/AdminSchedule';
import UserScheduled from './pages/UserScheduled';
import ScheduledAuctionRoom from './pages/ScheduledAuctionRoom';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/auction"
            element={
              <PrivateRoute>
                <UserAuction />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/auction"
            element={
              <PrivateRoute adminOnly>
                <AdminAuction />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/control"
            element={
              <PrivateRoute adminOnly>
                <AdminControl />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/schedule"
            element={
              <PrivateRoute adminOnly>
                <AdminSchedule />
              </PrivateRoute>
            }
          />

          <Route
            path="/scheduled"
            element={
              <PrivateRoute>
                <UserScheduled />
              </PrivateRoute>
            }
          />

          <Route
            path="/scheduled-auction/:id"
            element={
              <PrivateRoute>
                <ScheduledAuctionRoom />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
