import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
} from "../services/api";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "authToken";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await getCurrentUser();

        setUser(response.user);
      } catch (error) {
        console.error("Session restore failed:", error);

        sessionStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async (email, password) => {
    const response = await loginUser({
      email,
      password,
    });

    sessionStorage.setItem(
      AUTH_TOKEN_KEY,
      response.token
    );

    setUser(response.user);

    return response.user;
  };

  const logout = () => {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};