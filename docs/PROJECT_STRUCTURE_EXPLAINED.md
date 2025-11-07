# โครงสร้างโปรเจกต์หลังรวม Frontend + Backend

## สถานะปัจจุบัน

✅ **โปรเจกต์รวมกันแล้ว** - ทุกอย่างอยู่ใน `app/` folder
❌ **โฟลเดอร์ frontend เดิม** - ยังอยู่แต่ไม่ได้ใช้งานแล้ว (สามารถลบได้)

## โครงสร้างที่ใช้งานจริง (app/)

```
app/
├── src/
│   ├── app/
│   │   ├── (site)/              # 🌐 Frontend Pages (จาก frontend เดิม)
│   │   │   ├── layout.tsx       # Layout สำหรับ frontend
│   │   │   ├── page.tsx         # หน้าแรก
│   │   │   ├── courses/         # หน้าคอร์ส
│   │   │   ├── books/           # หน้าหนังสือ
│   │   │   ├── profile/         # หน้าโปรไฟล์
│   │   │   └── ...
│   │   │
│   │   ├── admin/               # 🔧 Admin Pages (backend เดิม)
│   │   │   ├── layout.js        # Layout สำหรับ admin
│   │   │   ├── dashboard/       # Dashboard
│   │   │   ├── courses/         # จัดการคอร์ส
│   │   │   ├── orders/          # จัดการคำสั่งซื้อ
│   │   │   └── ...
│   │   │
│   │   ├── api/                 # 🔌 API Routes (backend)
│   │   │   ├── auth/            # Authentication
│   │   │   ├── courses/         # Course APIs
│   │   │   ├── orders/          # Order APIs
│   │   │   └── ...
│   │   │
│   │   ├── layout.js            # 🌍 Root Layout (ครอบทั้งหมด)
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # 🎨 UI Components (รวมจาก frontend)
│   │   ├── ui/                  # Shadcn/ui components
│   │   ├── sections/            # Page sections
│   │   ├── admin/               # Admin components
│   │   ├── navigation.tsx       # Navigation bar
│   │   ├── auth-provider.tsx    # Frontend auth
│   │   └── ...
│   │
│   ├── lib/                     # 🛠️ Utilities
│   ├── hooks/                   # 🪝 React hooks
│   └── contexts/                # 📦 Contexts (backend auth)
│
├── prisma/                      # 💾 Database
├── public/                      # 📁 Static files
└── package.json                 # Dependencies (รวมแล้ว)
```

## การทำงานของ Next.js App Router

### 1. Root Layout (`src/app/layout.js`)
```javascript
// ครอบทั้งโปรเจกต์
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <BackendAuthProvider>
            <AntdRegistry>
              {children}  // ← ทุก page จะมาแสดงที่นี่
            </AntdRegistry>
          </BackendAuthProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
```

### 2. Route Groups - แยก Layout

#### Frontend Routes: `(site)/`
```
URL: /
URL: /courses
URL: /profile
↓
ใช้ Layout: src/app/(site)/layout.tsx
↓
แสดง: Navigation + Content + Footer (Shadcn/ui style)
```

#### Admin Routes: `admin/`
```
URL: /admin/dashboard
URL: /admin/courses
↓
ใช้ Layout: src/app/admin/layout.js
↓
แสดง: Navigation + Sidebar + Content + Footer (Ant Design + Tailwind)
```

#### API Routes: `api/`
```
URL: /api/courses
URL: /api/auth/login
↓
ไม่มี Layout (เป็น API endpoint)
↓
Return: JSON response
```

## การทำงานของ Authentication

### 2 ระบบ Auth ที่ทำงานร่วมกัน:

#### 1. Frontend Auth (`components/auth-provider.tsx`)
- ใช้สำหรับ: Frontend pages (/, /courses, /profile)
- เก็บข้อมูล: localStorage + cookies
- Features: LINE login, cart, user profile

#### 2. Backend Auth (`contexts/AuthContext.js`)
- ใช้สำหรับ: Admin pages (/admin/*)
- เก็บข้อมูล: NextAuth session + localStorage + cookies
- Features: Admin authentication, role checking

#### การซิงค์ระหว่าง 2 ระบบ:
```javascript
// ทั้ง 2 ระบบอ่านจาก:
1. Cookies (auth_token, user_data)
2. localStorage (user, token)

// เมื่อ login ด้วย LINE:
LINE Callback → Set cookies → ทั้ง 2 ระบบอ่านได้
```

## การ Import Components

### Path Aliases (tsconfig.json)
```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/components/*": ["./src/components/*"],
    "@/lib/*": ["./src/lib/*"]
  }
}
```

### ตัวอย่างการใช้งาน:
```typescript
// ใน frontend page
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"

// ใน admin page
import AdminSidebar from "@/components/admin/AdminSidebar"

// ใน API route
import prisma from "@/lib/prisma"
```

## ทำไมโฟลเดอร์ frontend ยังอยู่?

### โฟลเดอร์ที่ยังมี:
```
e-learning-fb-demo/
├── frontend/          # ❌ ไม่ได้ใช้แล้ว (สามารถลบได้)
│   ├── app/
│   ├── components/
│   └── ...
│
└── app/           # ✅ ใช้งานจริง (มีทุกอย่างแล้ว)
    ├── src/
    ├── prisma/
    └── ...
```

### สามารถลบ frontend/ ได้หรือไม่?
✅ **ได้** - เพราะทุกอย่างถูกคัดลอกมาที่ `app/src/` แล้ว

### ถ้าอยากเก็บไว้:
- เป็น backup
- เปรียบเทียบโค้ดเดิม
- แต่ไม่มีผลต่อการทำงาน

## การรัน Development

```bash
# รันเฉพาะ backend (มีทุกอย่างแล้ว)
cd backend
npm run dev

# เปิดที่ http://localhost:3000
# - Frontend: http://localhost:3000
# - Admin: http://localhost:3000/admin/dashboard
# - API: http://localhost:3000/api/*
```

## ข้อดีของการรวม

### ✅ ข้อดี:
1. **รันครั้งเดียว** - ไม่ต้องรัน 2 servers
2. **ไม่มี CORS** - API อยู่ใน domain เดียวกัน
3. **Share Code** - Components, utilities ใช้ร่วมกันได้
4. **Deploy ง่าย** - Deploy แค่ที่เดียว
5. **Authentication ง่าย** - Share cookies/session ได้

### ⚠️ ข้อควรระวัง:
1. **2 Auth Systems** - ต้องซิงค์กัน (แก้ไขแล้ว)
2. **2 UI Libraries** - Ant Design (admin) + Shadcn/ui (frontend)
3. **Bundle Size** - ใหญ่ขึ้นเพราะรวมกัน

## สรุป

### โครงสร้างปัจจุบัน:
```
1 Project (app/)
├── Frontend (Next.js App Router)
├── Admin Panel (Next.js App Router)
└── API (Next.js API Routes)
```

### การทำงาน:
- **Next.js** อ่าน `src/app/` และสร้าง routes อัตโนมัติ
- **Route Groups** `(site)` และ `admin` แยก layout
- **Components** ใช้ร่วมกันผ่าน `@/` alias
- **Authentication** ซิงค์ผ่าน cookies + localStorage

### โฟลเดอร์ frontend เดิม:
- ❌ ไม่ได้ใช้งาน
- ✅ สามารถลบได้
- 💡 หรือเก็บไว้เป็น backup

---

**คำแนะนำ:** ถ้าทุกอย่างทำงานได้ดีแล้ว สามารถลบโฟลเดอร์ `frontend/` เพื่อความเรียบร้อย หรือเปลี่ยนชื่อเป็น `frontend-backup/` เพื่อเก็บไว้อ้างอิง
