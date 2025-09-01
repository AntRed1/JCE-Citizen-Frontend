import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User } from "../types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUserFromStorage();
          if (currentUser) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token exists but no user data, fetch from server
            const fetchedUser = await authService.getCurrentUser();
            setUser(fetchedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login({ email, password });
      setUser(authResponse.user);
      setIsAuthenticated(true);
      return authResponse;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.adminLogin({ email, password });
      setUser(authResponse.user);
      setIsAuthenticated(true);
      return authResponse;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.register(userData);
      setUser(authResponse.user);
      setIsAuthenticated(true);
      return authResponse;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      throw error;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    adminLogin,
    register,
    logout,
    refreshUserData,
    isAdmin: user?.role === "ADMIN",
  };
};
