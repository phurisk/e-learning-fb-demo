# การทำงานของโปรเจกต์ - อธิบายแบบละเอียด

## 🎯 คำตอบสั้นๆ

**ใช่ครับ โปรเจกต์รวมกันแล้ว!** 

- ✅ ทุกอย่างอยู่ใน `backend/` folder
- ✅ รันแค่ `npm run dev` ครั้งเดียว
- ✅ Frontend + Backend + API ทำงานร่วมกัน
- ❌ โฟลเดอร์ `frontend/` เดิมไม่ได้ใช้แล้ว

---

## 📁 โครงสร้างไฟล์ที่ใช้งานจริง

```
backend/src/app/
│
├── layout.js                    # 🌍 Root Layout (ครอบทั้งหมด)
│   └── Providers: SessionProvider, BackendAuthProvider, AntdRegistry
│
├── (site)/                      # 🌐 FRONTEND PAGES
│   ├── layout.tsx               # Frontend Layout
│   │   └── Providers: FrontendAuthProvider, CartProvider
│   │   └── Components: <Navigation /> + <Footer />
│   │
│   ├── page.tsx                 # หน้าแรก (/)
│   ├── courses/
│   │   ├── page.tsx             # /courses
│   │   ├── [id]/page.tsx        # /courses/123
│   │   ├── middle/page.tsx      # /courses/middle
│   │   └── high/page.tsx        # /courses/high
│   │
│   ├── profile/
│   │   ├── page.tsx             # /profile
│   │   ├── my-courses/          # /profile/my-courses
│   │   └── orders/              # /profile/orders
│   │
│   └── ...
│
├── admin/                       # 🔧 ADMIN PAGES
│   ├── layout.js                # Admin Layout
│   │   └── Providers: FrontendAuthProvider (for Navigation)
│   │   └── Components: <Navigation /> + <Sidebar /> + <Footer />
│   │
│   ├── dashboard/page.js        # /admin/dashboard
│   ├── courses/page.js          # /admin/courses
│   ├── orders/page.js           # /admin/orders
│   └── ...
│
└── api/                         # 🔌 API ENDPOINTS
    ├── auth/
    │   ├── login/route.js       # POST /api/auth/login
    │   └── callback/
    │       └── line/route.js    # GET /api/auth/callback/line
    │
    ├── courses/
    │   ├── route.js             # GET /api/courses
    │   └── [id]/route.js        # GET /api/courses/123
    │
    └── orders/route.js          # GET /api/orders
```

---

## 🔄 การทำงานของ Next.js App Router

### 1. เมื่อเข้า URL ต่างๆ

```
User เข้า URL → Next.js อ่าน folder structure → เลือก Layout + Page ที่ถูกต้อง
```

#### ตัวอย่าง:

**URL: `/`** (หน้าแรก)
```
1. Root Layout (layout.js)
   ↓
2. Site Layout ((site)/layout.tsx)
   ↓ แสดง Navigation + Footer
3. Home Page ((site)/page.tsx)
```

**URL: `/courses/123`** (หน้าคอร์ส)
```
1. Root Layout (layout.js)
   ↓
2. Site Layout ((site)/layout.tsx)
   ↓ แสดง Navigation + Footer
3. Course Page ((site)/courses/[id]/page.tsx)
```

**URL: `/admin/dashboard`** (หน้า Admin)
```
1. Root Layout (layout.js)
   ↓
2. Admin Layout (admin/layout.js)
   ↓ แสดง Navigation + Sidebar + Footer
3. Dashboard Page (admin/dashboard/page.js)
```

**URL: `/api/courses`** (API)
```
1. Root Layout (layout.js)
   ↓
2. API Route (api/courses/route.js)
   ↓ Return JSON (ไม่มี HTML)
```

---

## 🎨 Components - ใช้ร่วมกันยังไง?

### Path Aliases
```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"]
  }
}
```

### การใช้งาน:

**ใน Frontend Page:**
```typescript
// src/app/(site)/courses/page.tsx
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

**ใน Admin Page:**
```javascript
// src/app/admin/dashboard/page.js
import AdminSidebar from "@/components/admin/AdminSidebar"
import { Button } from "antd"  // Ant Design
```

**ใน API Route:**
```javascript
// src/app/api/courses/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
```

---

## 🔐 Authentication - 2 ระบบทำงานร่วมกัน

### ทำไมมี 2 ระบบ?

1. **Frontend Auth** (`components/auth-provider.tsx`)
   - สำหรับ: หน้า frontend (/courses, /profile)
   - Features: LINE login, Cart, User profile
   - UI: Shadcn/ui components

2. **Backend Auth** (`contexts/AuthContext.js`)
   - สำหรับ: หน้า admin (/admin/*)
   - Features: Admin role checking
   - UI: Ant Design components

### การซิงค์ข้อมูล:

```javascript
// เมื่อ Login ด้วย LINE:
LINE OAuth
  ↓
Callback API (/api/auth/callback/line)
  ↓
สร้าง JWT Token
  ↓
Set Cookies:
  - auth_token (HTTP-only)
  - user_data (readable)
  ↓
Set localStorage:
  - user
  - token
  ↓
ทั้ง 2 Auth Systems อ่านได้
```

### ตัวอย่างโค้ด:

**Frontend Auth อ่าน Cookie:**
```typescript
// components/auth-provider.tsx
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const userDataCookie = getCookie('user_data');
if (userDataCookie) {
  const userData = JSON.parse(decodeURIComponent(userDataCookie));
  setUser(userData);
}
```

**Backend Auth อ่าน Cookie:**
```javascript
// contexts/AuthContext.js
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const userDataCookie = getCookie('user_data');
if (userDataCookie) {
  const userData = JSON.parse(decodeURIComponent(userDataCookie));
  setUser(userData);
}
```

---

## 🚀 การ Deploy

### Development:
```bash
cd backend
npm run dev
# เปิด http://localhost:3000
```

### Production:
```bash
cd backend
npm run build
npm start
```

### Environment Variables:
```env
# .env
DATABASE_URL="mysql://..."
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret"
LINE_CLIENT_ID="..."
LINE_CLIENT_SECRET="..."
```

---

## ❓ คำถามที่พบบ่อย

### Q: โฟลเดอร์ frontend เดิมทำอะไร?
**A:** ไม่ทำอะไรเลย! ไม่ได้ใช้งาน สามารถลบได้

### Q: ถ้าลบ frontend/ จะเสียอะไรไหม?
**A:** ไม่เสีย เพราะทุกอย่างถูกคัดลอกมาที่ `backend/src/` แล้ว

### Q: ทำไมต้องมี 2 Auth Systems?
**A:** เพราะ:
- Frontend ใช้ Shadcn/ui + React Context
- Admin ใช้ Ant Design + NextAuth
- แต่ซิงค์กันผ่าน cookies + localStorage

### Q: API อยู่ที่ไหน?
**A:** อยู่ใน `backend/src/app/api/`
- เข้าถึงได้ที่ `/api/*`
- ตัวอย่าง: `/api/courses`, `/api/auth/login`

### Q: Database อยู่ที่ไหน?
**A:** ใช้ Prisma
- Schema: `backend/prisma/schema.prisma`
- Client: `backend/src/lib/prisma.js`

---

## 📊 สรุปภาพรวม

```
┌─────────────────────────────────────────────────┐
│           1 Next.js Application                 │
│              (backend/ folder)                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   Frontend   │  │  Admin Panel │            │
│  │   (site)/    │  │   admin/     │            │
│  │              │  │              │            │
│  │ Shadcn/ui    │  │ Ant Design   │            │
│  │ + Tailwind   │  │ + Tailwind   │            │
│  └──────────────┘  └──────────────┘            │
│         │                  │                    │
│         └──────┬───────────┘                    │
│                │                                │
│         ┌──────▼──────┐                         │
│         │  API Routes │                         │
│         │   api/      │                         │
│         └──────┬──────┘                         │
│                │                                │
│         ┌──────▼──────┐                         │
│         │   Prisma    │                         │
│         │  Database   │                         │
│         └─────────────┘                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist - ตรวจสอบว่ารวมสำเร็จ

- [x] รัน `npm run dev` ใน backend/ ได้
- [x] เข้า http://localhost:3000 เห็นหน้าแรก
- [x] เข้า http://localhost:3000/admin/dashboard เห็นหน้า admin
- [x] Login ด้วย LINE ได้
- [x] Navigation แสดงชื่อผู้ใช้
- [x] Admin sidebar ทำงานได้
- [x] Footer แสดงถูกต้อง
- [x] API (/api/*) ทำงานได้

---

**สรุป:** โปรเจกต์รวมกันสำเร็จแล้ว! ทุกอย่างอยู่ใน `backend/` และทำงานได้ปกติ โฟลเดอร์ `frontend/` เดิมไม่ได้ใช้แล้ว สามารถลบหรือเปลี่ยนชื่อเป็น backup ได้
