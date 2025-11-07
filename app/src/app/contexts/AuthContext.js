"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext effect:', { status, session: !!session, hasLocalStorage: !!localStorage.getItem("user") });
    
    if (status === "loading") {
      setLoading(true);
      return;
    }

    if (session?.user) {
      console.log('Setting user from session:', session.user);
      setUser(session.user);
      setLoading(false);
    } else {
      // Check cookies first (from LINE login)
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      const userDataCookie = getCookie('user_data');
      const authTokenCookie = getCookie('auth_token');

      if (userDataCookie && authTokenCookie) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataCookie));
          console.log('Setting user from cookie:', userData);
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", authTokenCookie);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing user cookie:", error);
        }
      }

      // Check localStorage (fallback)
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('Setting user from localStorage:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } else {
        console.log('No user found in session, cookie, or localStorage');
      }
      setLoading(false);
    }
  }, [session, status]);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        const userData = result.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return { success: true, user: userData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        const newUser = result.data;
        setUser(newUser);
        localStorage.setItem("user", JSON.stringify(newUser));
        return { success: true, user: newUser };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
    }
  };

  const logout = async () => {
    if (session) {
      await signOut({ redirect: false });
    }
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear cookies
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const loginWithLine = () => {
    signIn("line");
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithLine,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
