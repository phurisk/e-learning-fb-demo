"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => Promise<void>;
  loginWithLine: () => void;
  updateUser: (updatedUser: User) => void;
  isAuthenticated: boolean;
}

// Default value for SSR
const defaultAuthValue: AuthContextType = {
  user: null,
  loading: false,
  login: async () => ({ success: false, error: "Not initialized" }),
  register: async () => ({ success: false, error: "Not initialized" }),
  logout: async () => {},
  loginWithLine: () => {},
  updateUser: () => {},
  isAuthenticated: false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthValue);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Guard against SSR
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }
    
    console.log('AuthContext effect:', { status, session: !!session, hasLocalStorage: !!localStorage.getItem("user") });

    if (status === "loading") {
      setLoading(true);
      return;
    }

    // ให้ NextAuth session เป็นหลัก
    if (session?.user) {
      console.log('Setting user from session:', session.user);
      setUser(session.user as User);
      // Sync กับ localStorage
      localStorage.setItem("user", JSON.stringify(session.user));
      setLoading(false);
      return;
    }

    // ถ้าไม่มี session แต่มี localStorage (อาจจะ refresh page)
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Setting user from localStorage:', parsedUser);
        setUser(parsedUser);
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    // Check cookies (from LINE login)
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
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

    // ไม่มี user ที่ไหนเลย
    console.log('No user found in session, cookie, or localStorage');
    setUser(null);
    setLoading(false);
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      // ใช้ NextAuth signIn แทน custom API
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok && !result?.error) {
        // รอให้ session update
        return { success: true };
      } else {
        return { success: false, error: result?.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
    }
  };

  const register = async (userData: any) => {
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

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithLine,
    updateUser,
    isAuthenticated: !!user,
  };

  // @ts-expect-error - React 19 type compatibility issue with Context.Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  // Return default value during SSR instead of throwing
  if (!context || context === defaultAuthValue) {
    if (typeof window === 'undefined') {
      return defaultAuthValue;
    }
  }
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
