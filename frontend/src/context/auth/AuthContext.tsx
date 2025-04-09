import { createContext } from 'react';
import { User, UserState } from '../../types/user';

const AuthContext = createContext<UserState>({
  loading: false,
  error: '',
  user: null,
  isAuthenticated: false,
  isRegistered: false,
  clearError: () => {},
  signup: async (_user: User) => {},
  signin: async (_user: User) => {},
  logout: () => {},
  loadUser: () => {},
});

export default AuthContext;
