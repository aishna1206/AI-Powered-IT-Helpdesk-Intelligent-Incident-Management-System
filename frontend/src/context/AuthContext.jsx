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


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    const token =
      localStorage.getItem(
        "authToken"
      );


    if (!token) {

      setLoading(false);

      return;
    }


    const restoreUser =
      async () => {

        try {

          const response =
            await getCurrentUser();

          setUser(
            response.user
          );

        } catch (error) {

          console.error(
            "Session restore failed:",
            error
          );

          localStorage.removeItem(
            "authToken"
          );

          setUser(null);

        } finally {

          setLoading(false);

        }
      };


    restoreUser();

  }, []);


  const login =
    async (
      email,
      password
    ) => {

      const response =
        await loginUser({
          email,
          password,
        });


      localStorage.setItem(
        "authToken",
        response.token
      );


      setUser(
        response.user
      );


      return response.user;
    };


  const logout = () => {

    localStorage.removeItem(
      "authToken"
    );

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

  const context =
    useContext(
      AuthContext
    );


  if (!context) {

    throw new Error(
      "useAuth must be used inside AuthProvider"
    );

  }


  return context;
};