# สรุปการแก้ไข Layout และ CSS

## ปัญหาที่พบ

1. **Layout ซ้อนกัน**: มี root layout 2 ตัว (`layout.js` และ `(site)/layout.tsx`) ทำให้มี `<html>` และ `<body>` ซ้อนกัน
2. **CSS ไม่ครบ**: Tailwind CSS variables และ styles ไม่ถูกโหลดครบ
3. **Font conflicts**: มี font definitions ซ้ำกัน

## การแก้ไข

### 1. Root Layout (`src/app/layout.js`)
- รวม font definitions ทั้งหมด (Geist, Geist_Mono, Sarabun)
- เก็บ SessionProvider และ AntdRegistry สำหรับ admin
- เพิ่ม suppressHydrationWarning
- เปลี่ยนชื่อ AuthProvider เป็น BackendAuthProvider เพื่อไม่ให้สับสน

### 2. Site Layout (`src/app/(site)/layout.tsx`)
- เปลี่ยนจาก root layout เป็น nested layout
- ลบ `<html>` และ `<body>` tags
- ใช้ `<div>` wrapper แทน
- เปลี่ยนเป็น client component
- ย้าย metadata ไปที่ page.tsx แทน

### 3. CSS (`src/app/globals.css`)
- รวม Tailwind CSS variables จาก frontend
- เก็บ Ant Design custom styles
- รวม responsive styles

## โครงสร้าง Layout ใหม่

```
Root Layout (layout.js)
├── SessionProvider
├── BackendAuthProvider (สำหรับ admin)
├── AntdRegistry
└── AntdConfigProvider
    ├── Admin Layout (admin/layout.js) - ใช้ Ant Design
    │   └── Admin Pages
    └── Site Layout ((site)/layout.tsx) - ใช้ Shadcn/ui
        ├── AuthProvider (สำหรับ frontend)
        ├── CartProvider
        ├── Navigation
        └── Site Pages
```

## การทำงาน

### Frontend (Site)
- URL: `/`, `/courses`, `/books`, etc.
- Layout: `(site)/layout.tsx`
- Styles: Tailwind + Shadcn/ui
- Auth: Frontend AuthProvider
- Font: Sarabun (Thai)

### Backend (Admin)
- URL: `/admin/*`
- Layout: `admin/layout.js`
- Styles: Ant Design
- Auth: Backend AuthProvider (from contexts/AuthContext)
- Font: Geist Sans

## ไฟล์ที่แก้ไข

1. ✅ `src/app/layout.js` - Root layout
2. ✅ `src/app/(site)/layout.tsx` - Site nested layout
3. ✅ `src/app/(site)/page.tsx` - เพิ่ม metadata
4. ✅ `src/app/globals.css` - รวม CSS variables

## การทดสอบ

```bash
cd backend
npm run dev
```

เปิดเบราว์เซอร์:
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin/dashboard

## หมายเหตุ

- ไม่มี layout conflicts อีกต่อไป
- CSS ทำงานถูกต้องทั้ง frontend และ admin
- Font loading ถูกต้อง
- Authentication แยกกันชัดเจน
