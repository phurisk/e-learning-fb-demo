"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import AdminSidebarNew from "../../components/admin/AdminSidebarNew";
import AdminLoadingScreen from "../../components/admin/AdminLoadingScreen";
import AdminAccessDenied from "../../components/admin/AdminAccessDenied";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/sections/footer";
import { AuthProvider as FrontendAuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();



  // Authentication and authorization check
  useEffect(() => {
    console.log("Admin Layout Check:", {
      loading,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      isAuthenticated,
      userRole: user?.role,
    });

    // รอให้ loading เสร็จก่อน
    if (loading) {
      return;
    }

    // ตรวจสอบว่ามี user และ authenticated หรือไม่
    if (!user || !isAuthenticated) {
      console.log("No user or not authenticated, redirecting to login");
      setAuthChecking(false);
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/admin/dashboard"));
      return;
    }

    // ตรวจสอบว่าเป็น admin หรือไม่
    if (user.role !== "ADMIN") {
      console.log("User is not admin, redirecting to dashboard");
      setAuthChecking(false);
      router.push("/dashboard");
      return;
    }

    console.log("Auth check passed, setting authChecking to false");
    setAuthChecking(false);
  }, [user, isAuthenticated, loading, router, pathname]);

  // Show loading screen while checking authentication
  if (loading || authChecking) {
    return <AdminLoadingScreen />;
  }

  // Show access denied if not admin
  if (!user || user.role !== "ADMIN") {
    return <AdminAccessDenied />;
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle sidebar toggle
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  return (
    <FrontendAuthProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {/* Frontend Navigation */}
          <Navigation />

          {/* Admin Content with Sidebar */}
          <div className="flex pt-16 lg:pt-20">
            {/* Admin Sidebar */}
            <aside
              className={`fixed left-0 top-16 lg:top-20 h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-gray-900 text-white transition-all duration-300 z-30 overflow-y-auto ${
                collapsed ? "w-20" : "w-64"
              }`}
            >
              {/* Toggle Button */}
              <button
                onClick={handleToggle}
                className="w-full p-4 hover:bg-gray-800 transition-colors flex items-center justify-center border-b border-gray-800 sticky top-0 bg-gray-900 z-10"
              >
                {collapsed ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                )}
              </button>

              <AdminSidebarNew collapsed={collapsed} pathname={pathname} />
            </aside>

            {/* Main Content */}
            <main
              className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)] ${
                collapsed ? "ml-20" : "ml-64"
              }`}
            >
              {children}
            </main>
          </div>

          {/* Frontend Footer - with margin to avoid sidebar overlap */}
          <div className={`transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
            <Footer />
          </div>
        </div>
      </CartProvider>
    </FrontendAuthProvider>
  );
}
