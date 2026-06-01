import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('session') || 'null'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('session', JSON.stringify({ user: data.user, employee: data.employee }));
    setSession({ user: data.user, employee: data.employee });
  };

  const refreshMe = async () => {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('session', JSON.stringify(data));
    setSession(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('session');
    setSession(null);
  };

  const value = useMemo(() => ({ session, user: session?.user, employee: session?.employee, login, logout, refreshMe }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
