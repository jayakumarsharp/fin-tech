import { createContext, useState, useEffect } from "react";
import PortfolioApi from "../Api/api";
import { jwtDecode } from "jwt-decode";
import useLocalStorage from "../hooks/useLocalStorage";
export const TOKEN_STORAGE_ID = "portfolio-token";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  useEffect(
    function loadInfo() {
      console.debug("App useEffect loadUserInfo", "token=", token);
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwtDecode(token);
            PortfolioApi.token = token;
            let currentUser = await PortfolioApi.getUser(username);
            setCurrentUser(currentUser);
            console.log("current user", currentUser);
          } catch (errors) {
            setCurrentUser(null);
          }
        }
        setIsLoading(true);
      }
      setIsLoading(false);
      getCurrentUser();
    },
    [token]
  );

  const logout = () => {
    // setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  const login = async (data) => {
    try {
      let token = await PortfolioApi.login(data);
      let decode = jwtDecode(token);
      setToken(token);
      setIsAuthenticated(true);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  const signup = async (data) => {
    try {
      let token = await PortfolioApi.signup(data);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated,currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
