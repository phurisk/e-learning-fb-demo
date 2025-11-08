import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // ตรวจสอบเฉพาะ admin routes แต่ไม่รวม admin/login และ api routes
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') &&
      !pathname.startsWith('/api/')) {
    
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      });
      
      console.log('Middleware check:', { 
        pathname, 
        hasToken: !!token, 
        role: token?.role 
      });
      
      // ถ้าไม่มี token หรือไม่ได้ล็อกอิน
      if (!token) {
        console.log('No token, redirecting to login');
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // ถ้าล็อกอินแล้วแต่ไม่ใช่ admin
      if (token.role !== 'ADMIN') {
        console.log('Not admin, redirecting to dashboard');
        const dashboardUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
      
      console.log('Admin access granted');
    } catch (error) {
      console.error('Middleware error:', error);
      // ถ้าเกิด error ให้ผ่านไปที่ client-side auth check
      return NextResponse.next();
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ]
};
