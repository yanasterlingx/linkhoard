import React, { createContext, useState, useContext, useEffect,useCallback  } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  const apiURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  axios.defaults.baseURL = `${apiURL}/api`;
  axios.defaults.headers.common["Accept"] = "application/json"; //baru tambah

  useEffect(() => {
    const storedToken = localStorage.getItem('auth-token');
    const storedUser = localStorage.getItem('auth-user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  //Fix by moving logout above the useEffect that calls it.
  const logout = useCallback(async () => {
  try {
    if (token) {
      await axios.post('/logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    delete axios.defaults.headers.common['Authorization'];
  }
}, [token]);

  // Axios interceptor for handling authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token,logout]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password });
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password, passwordConfirmation) => {
    try {
      const response = await axios.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        errors: error.response?.data?.errors || {}
      };
    }
  };

//   const logout = async () => {
//     try {
//       if (token) {
//         await axios.post('/logout');
//       }
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       setToken(null);
//       localStorage.removeItem('auth-token');
//       localStorage.removeItem('auth-user');
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};