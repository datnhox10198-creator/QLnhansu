import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import Departments from './pages/Departments';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import UserDashboard from './pages/UserDashboard';

const Protected = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { user } = useAuth();
  const home = user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<Protected><Layout /></Protected>}>
        <Route index element={home} />
        <Route path="employees" element={<Protected roles={['admin']}><Employees /></Protected>} />
        <Route path="departments" element={<Protected roles={['admin']}><Departments /></Protected>} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="reports" element={<Protected roles={['admin']}><Reports /></Protected>} />
        <Route path="profile" element={<Protected roles={['user']}><Profile /></Protected>} />
      </Route>
    </Routes>
  );
}
