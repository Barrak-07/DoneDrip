import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { User, UserState } from '../../types/user';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const signup = async (formData: User) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signup`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setIsRegistered(true);
        setError('');
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const signin = async (formData: User) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/signin`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setError('');
        await loadUser();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Signin failed');
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/auth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        setIsAuthenticated(true);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const clearError = () => setError('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // safe async pattern
    const init = async () => {
      await loadUser();
    };

    init();
  }, []);

  const value: UserState = {
    loading,
    error,
    user,
    isAuthenticated,
    isRegistered,
    signup,
    signin,
    logout,
    loadUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
