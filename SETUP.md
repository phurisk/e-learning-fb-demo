# E-Learning Full-Stack Demo - Setup Guide

## สิ่งที่ได้ทำ

✅ **รวม Frontend และ Backend** เข้าด้วยกันในโปรเจคเดียว
✅ **แปลง Backend เป็น TypeScript** จาก JavaScript
✅ **สร้าง Monorepo Structure** ที่จัดการได้ง่าย
✅ **ตั้งค่า Shared Types และ Utilities**
✅ **สร้าง API Client สำหรับ Frontend**
✅ **ตั้งค่า CORS และ Middleware**
✅ **สร้าง Documentation ครบถ้วน**

## โครงสร้างโปรเจค

```
e-learning-fb-demo/
├── frontend/          # Next.js Frontend (Port 3000)
├── backend/           # Next.js Backend API (Port 3001)  
├── shared/            # Shared types และ utilities
├── docs/              # Documentation
├── package.json       # Root package.json สำหรับ monorepo
├── install.sh         # Installation script
└── README.md          # Project overview
```

## การติดตั้งและรัน

### 1. ติดตั้งอัตโนมัติ

```bash
cd e-learning-fb-demo
./install.sh
```

### 2. ตั้งค่า Database

```bash
# แก้ไข DATABASE_URL ใน backend/.env
nano backend/.env

# รัน migrations
npm run db:migrate

# Seed ข้อมูลเริ่มต้น
npm run db:seed
```

### 3. รัน Development

```bash
# รัน frontend และ backend พร้อมกัน
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Prisma Studio: `npm run db:studio`

## Features ที่ได้

### Frontend (TypeScript)
- ✅ Next.js 15 App Router
- ✅ Tailwind CSS + shadcn/ui
- ✅ React Hook Form + Zod
- ✅ API Client integration
- ✅ Authentication setup
- ✅ Responsive design

### Backend (TypeScript)
- ✅ Next.js API Routes
- ✅ Prisma ORM
- ✅ NextAuth.js
- ✅ CORS configuration
- ✅ Middleware setup
- ✅ File upload support

### Shared
- ✅ TypeScript types
- ✅ API client utilities
- ✅ Constants และ validation
- ✅ Error handling

## การพัฒนาต่อ

### เพิ่ม Features
1. **Authentication Pages** - Login/Register forms
2. **Course Management** - CRUD operations
3. **User Dashboard** - Profile และ enrolled courses
4. **Payment Integration** - Stripe/PayPal
5. **File Upload** - Cloudinary integration

### Database
- Schema พร้อมใช้งาน (Users, Courses, Orders, etc.)
- Migrations และ seed data
- Prisma Studio สำหรับจัดการข้อมูล

### Deployment
- Vercel (แนะนำ)
- Railway
- DigitalOcean
- VPS with Docker

## Scripts ที่สำคัญ

```bash
# Development
npm run dev                 # รัน frontend + backend
npm run dev:frontend       # รัน frontend เท่านั้น
npm run dev:backend        # รัน backend เท่านั้น

# Build
npm run build              # Build ทั้งหมด
npm run build:frontend     # Build frontend
npm run build:backend      # Build backend

# Database
npm run db:migrate         # Run migrations
npm run db:seed           # Seed data
npm run db:studio         # Open Prisma Studio
npm run db:reset          # Reset database

# Utilities
npm run lint              # Lint code
npm run type-check        # TypeScript check
npm run install:all       # Install all dependencies
```

## ข้อดีของโครงสร้างนี้

1. **Monorepo** - จัดการโปรเจคได้ง่าย
2. **TypeScript** - Type safety ทั้ง frontend และ backend
3. **Shared Code** - ลดการเขียนโค้ดซ้ำ
4. **Modern Stack** - ใช้เทคโนโลยีล่าสุด
5. **Scalable** - ขยายได้ง่าย
6. **Documentation** - มี docs ครบถ้วน

## Next Steps

1. ตั้งค่า database connection
2. รัน `npm run dev` เพื่อทดสอบ
3. เริ่มพัฒนา features ตามต้องการ
4. Deploy เมื่อพร้อม

สำหรับรายละเอียดเพิ่มเติม ดูได้ที่:
- `docs/DEVELOPMENT.md` - Development guide
- `docs/DEPLOYMENT.md` - Deployment guide
- `README.md` - Project overview