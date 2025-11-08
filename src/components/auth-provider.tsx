"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { exchangeToken } from "@/lib/api-utils"
import http from "@/lib/http"

type User = any

type AuthContextValue = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>
  register: (userData: any) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => Promise<void>
  loginWithLine: () => void
  updateUser: (u: User) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// Default value for SSR
const defaultAuthValue: AuthContextValue = {
  user: null,
  loading: false,
  isAuthenticated: false,
  login: async () => ({ success: false, error: "Not initialized" }),
  register: async () => ({ success: false, error: "Not initialized" }),
  logout: async () => {},
  loginWithLine: () => {},
  updateUser: () => {},
}

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const init = async () => {
      try {
        // Guard against SSR
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }
        
        // check login success callback with token
        const urlParams = new URLSearchParams(window.location.search)
        const loginSuccess = urlParams.get('login_success')
        const userId = urlParams.get('user_id')
        const token = urlParams.get('token')
        const lineId = urlParams.get('line_id')
        
        if (loginSuccess === 'true' && userId && token) {
          // มี token จาก callback แล้ว
          try {
            // Validate token
            const { data: result } = await http.post(`/api/external/auth/validate`, { token })
            if (result.valid && result.user) {
              if (active) {
                setUser(result.user)
                localStorage.setItem('user', JSON.stringify(result.user))
                localStorage.setItem('token', token)
                console.log('✅ LINE login success:', result.user.name)
              }
            } else {
              console.error('Token validation failed')
            }
          } catch (error) {
            console.error('Token validation error:', error)
          }

          // remove parameters from URL
          window.history.replaceState({}, document.title, window.location.pathname)
          if (active) setLoading(false)
          return
        }

        // ตรวจสอบ cookie ก่อน (จาก LINE callback)
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(';').shift();
          return null;
        };

        const userDataCookie = getCookie('user_data');
        const authTokenCookie = getCookie('auth_token');

        if (userDataCookie && authTokenCookie) {
          try {
            const userData = JSON.parse(decodeURIComponent(userDataCookie));
            if (active) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('token', authTokenCookie);
              console.log('✅ Restored session from cookie:', userData.name);
            }
            if (active) setLoading(false);
            return;
          } catch (e) {
            console.error('Failed to parse user cookie:', e);
          }
        }

        // check LINE callback code 
        const code = urlParams.get('code')
        
        if (code) {
          //  LINE callback code -  login
          try {
            const { data: result } = await http.post(`/api/external/auth/line`, {
              code,
              // Must match the redirect URI used in the LINE authorize request
              redirectUri: `${window.location.origin}/api/auth/callback/line`,
            })
            if (result.success && result.data) {
              const userData = result.data.user
              setUser(userData)
              localStorage.setItem('user', JSON.stringify(userData))
              localStorage.setItem('token', result.data.token)

              // remove code from URL
              window.history.replaceState({}, document.title, window.location.pathname)
              if (active) setLoading(false)
              return
            }
          } catch (error) {
            console.error('LINE login error:', error)
            // remove code from URL error
            window.history.replaceState({}, document.title, window.location.pathname)
          }
        }

        // check token 
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
          try {
            const { data: result } = await http.post(`/api/external/auth/validate`, { token: savedToken })
            if (result.valid && result.user) {
              if (active) setUser(result.user)
              localStorage.setItem('user', JSON.stringify(result.user))
              if (active) setLoading(false)
              return
            } else {
              // Token expired - remove
              localStorage.removeItem('token')
              localStorage.removeItem('user')
            }
          } catch (error) {
            console.error('Token validation error:', error)
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }

        // check user  (fallback)
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          if (active) setUser(JSON.parse(savedUser))
          return
        }

        // Try to recover session from server cookie (LINE login)
        const res = await http.get("/api/auth/me")
        const data: any = res.data || {}
        if (active && res.status >= 200 && res.status < 300 && data && data.success !== false && data.data) {
          setUser(data.data)
          try { localStorage.setItem("user", JSON.stringify(data.data)) } catch {}
        }
      } catch (e) {
        console.error("Failed to initialize auth", e)
        try { 
          localStorage.removeItem("user")
          localStorage.removeItem("token")
        } catch {}
      } finally {
        if (active) setLoading(false)
      }
    }
    init()
    return () => { active = false }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await http.post("/api/auth/login", { email, password })
      const data = res.data || {}

      if ((res.status < 200 || res.status >= 300) || data?.success === false) {
        return { success: false, error: (data as any)?.error || (data as any)?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }
      }

      const userData = (data?.data && (data?.data.user || data?.data)) || null
      const token = (data?.data && data?.data.token) || data?.token || null
      if (userData) {
        setUser(userData)
        try {
          localStorage.setItem("user", JSON.stringify(userData))
          if (token) localStorage.setItem("token", token)
        } catch {}
      }
      return { success: true, user: userData }
    } catch (err) {
      console.error("Login error", err)
      return { success: false, error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" }
    }
  }

  const register = async (userData: any) => {
    try {
      const res = await http.post("/api/auth/register", userData)
      const data = res.data || {}

      if ((res.status < 200 || res.status >= 300) || data?.success === false) {
        return { success: false, error: (data as any)?.error || (data as any)?.message || "ลงทะเบียนไม่สำเร็จ" }
      }

      const newUser = (data?.data && (data?.data.user || data?.data)) || null
      const token = (data?.data && data?.data.token) || data?.token || null
      if (newUser) {
        setUser(newUser)
        try {
          localStorage.setItem("user", JSON.stringify(newUser))
          if (token) localStorage.setItem("token", token)
        } catch {}
      }
      return { success: true, user: newUser }
    } catch (err) {
      console.error("Register error", err)
      return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" }
    }
  }

  const logout = async () => {
    
    try {
      await http.post("/api/auth/logout").catch(() => {})
    } catch {}
    setUser(null)
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    } catch {}
  }

  const loginWithLine = () => {
    const redirectUri = `${window.location.origin}/api/auth/callback/line`

    const clientId = process.env.NEXT_PUBLIC_LINE_CLIENT_ID
    const state = JSON.stringify({ returnUrl: window.location.href })
    const lineURL =
      'https://access.line.me/oauth2/v2.1/authorize?' +
      'response_type=code' +
      `&client_id=${clientId}` +
      '&redirect_uri=' + encodeURIComponent(redirectUri) +
      '&scope=profile%20openid' +
      '&state=' + encodeURIComponent(state)

    window.location.href = lineURL
  }

  const updateUser = (u: User) => {
    setUser(u)
    try {
      localStorage.setItem("user", JSON.stringify(u))
    } catch {}
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithLine,
    updateUser,
  }), [user, loading])

  // @ts-expect-error - React 19 type compatibility issue with Context.Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  // Return default value during SSR instead of throwing
  if (!ctx) {
    if (typeof window === 'undefined') {
      return defaultAuthValue
    }
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
