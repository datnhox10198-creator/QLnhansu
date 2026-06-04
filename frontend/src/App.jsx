import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Attendance from './pages/Attendance';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Login from './pages/Login';
import Payroll from './pages/Payroll';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import UserDashboard from './pages/UserDashboard';

const Protected = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const home = user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;

  return (
    <div key={location.pathname} className="page-enter">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<Protected><Layout /></Protected>}>
          <Route index element={home} />
          <Route path="employees" element={<Protected roles={['admin']}><Employees /></Protected>} />
          <Route path="departments" element={<Protected roles={['admin']}><Departments /></Protected>} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="tasks" element={<Protected roles={['admin', 'user']}><Tasks /></Protected>} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="leaves" element={<Leaves />} />
          <Route path="reports" element={<Protected roles={['admin']}><Reports /></Protected>} />
          <Route path="profile" element={<Protected roles={['user']}><Profile /></Protected>} />
        </Route>
      </Routes>
    </div>
  );
}
