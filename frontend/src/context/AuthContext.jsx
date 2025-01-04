import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State to store logged-in user
  const navigate = useNavigate();

  // Helper function to decode a JWT
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
      return payload;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // Function to load user data from localStorage and decode the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = decodeToken(token); // Decode token payload to extract user info
      if (decodedUser) {
        setUser(decodedUser); // Set user state if decoding succeeds
      } else {
        localStorage.removeItem('token'); // Remove invalid token
      }
    }
  }, []);

  // Function to log in the user
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData); // Set user state based on provided data
  };

  // Function to log out the user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
