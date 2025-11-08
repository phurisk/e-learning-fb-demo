# E-Learning Platform - ฟิสิกส์พี่เต้ย

ระบบเรียนออนไลน์สำหรับเรียนฟิสิกส์อย่างเป็นระบบ

## 🎯 ภาพรวม

โปรเจกต์นี้เป็น Full-Stack E-Learning Platform ที่พัฒนาด้วย Next.js 15 (App Router) รวม Frontend, Backend API และ Admin Panel ไว้ในโปรเจกต์เดียว

## 📁 โครงสร้างโปรเจค

```
e-learning-fb-demo/
├── src/                    # � Saource Code
│   ├── app/                # 🚀 Next.js App Router
│   │   ├── (site)/         # 🌐 Frontend Pages (User-facing)
│   │   │   ├── page.tsx            # หน้าแรก
│   │   │   ├── courses/            # หน้าคอร์ส
│   │   │   ├── books/              # หน้า eBook
│   │   │   ├── profile/            # หน้าโปรไฟล์
│   │   │   ├── cart/               # ตะกร้าสินค้า
│   │   │   ├── checkout/           # ชำระเงิน
│   │   │   └── ...
│   │   │
│   │   ├── admin/          # 🔧 Admin Panel
│   │   │   ├── dashboard/          # Dashboard & Analytics
│   │   │   ├── courses/            # จัดการคอร์ส
│   │   │   ├── ebooks/             # จัดการ eBook
│   │   │   ├── orders/             # จัดการคำสั่งซื้อ
│   │   │   ├── users/              # จัดการผู้ใช้
│   │   │   ├── posts/              # จัดการโพสต์/ประกาศ
│   │   │   ├── coupons/            # จัดการคูปอง
│   │   │   └── ...
│   │   │
│   │   ├── api/            # 🔌 Backend API Routes
│   │   │   ├── auth/               # Authentication APIs
│   │   │   ├── courses/            # Course APIs
│   │   │   ├── ebooks/             # eBook APIs
│   │   │   ├── orders/             # Order APIs
│   │   │   ├── cart/               # Cart APIs
│   │   │   ├── payments/           # Payment APIs
│   │   │   ├── admin/              # Admin APIs
│   │   │   └── ...
│   │   │
│   │   ├── contexts/       # 📦 React Contexts
│   │   ├── layout.tsx      # Root Layout
│   │   ├── providers.tsx   # Global Providers
│   │   └── globals.css     # Global Styles
│   │
│   ├── components/         # 🎨 React Components
│   │   ├── ui/                     # Shadcn/ui Components
│   │   ├── sections/               # Page Sections (Hero, About, etc.)
│   │   ├── admin/                  # Admin Components
│   │   ├── login/                  # Login Components
│   │   ├── profile/                # Profile Components
│   │   └── ...
│   │
│   ├── lib/                # 🛠️ Utilities & Helpers
│   │   ├── server/                 # Server-side utilities
│   │   ├── prisma.ts               # Prisma Client
│   │   ├── auth.js                 # Auth utilities
│   │   ├── http.ts                 # HTTP client
│   │   └── ...
│   │
│   ├── hooks/              # 🪝 Custom React Hooks
│   │   ├── useCourses.ts
│   │   ├── useCart.ts
│   │   └── ...
│   │
│   └── styles/             # 🎨 Additional Styles
│
├── prisma/                 # 💾 Database
│   ├── schema.prisma               # Database Schema
│   └── seed.ts                     # Seed Data
│
├── public/                 # 📁 Static Files
│   ├── new-logo.png
│   └── ...
│
├── shared/                 # 🔗 Shared Code (if any)
│
├── .env                    # 🔐 Environment Variables (local)
├── .env.example            # 📝 Environment Variables Template
├── next.config.mjs         # ⚙️ Next.js Configuration
├── tailwind.config.js      # 🎨 Tailwind Configuration
├── tsconfig.json           # 📘 TypeScript Configuration
├── package.json            # 📦 Dependencies
├── README.md               # 📖 This file
└── DEPLOYMENT.md           # 🚀 Deployment Guide
```

## 🚀 การติดตั้ง

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-learning-fb-demo
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ .env.example
cp .env.example .env

# แก้ไขค่าใน .env ตามความต้องการ
```

**ค่าที่สำคัญ:**
```env
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# API Configuration (สำคัญ!)
API_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# LINE Login
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"
NEXT_PUBLIC_LINE_CLIENT_ID="your-line-client-id"

# File Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Admin
ADMIN_EMAIL="admin@example.com"
```

### 4. Setup Database

```bash
# Generate Prisma Client
npm run db:generate

# Run Migrations
npm run db:migrate

# Seed Database (Optional)
npm run db:seed
```

## 🎮 การรัน

### Development Mode

```bash
npm run dev
```

เปิดเบราว์เซอร์:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/dashboard
- **API**: http://localhost:3000/api/*

### Production Mode

```bash
# Build
npm run build

# Start
npm start
```

### ⚠️ หมายเหตุสำคัญ

- **React Version**: โปรเจกต์นี้ใช้ React 18 (ไม่ใช่ React 19) เพื่อความเสถียร
- **Node Version**: แนะนำ Node.js 18 หรือสูงกว่า
- **Database**: ต้องมี MySQL database ที่พร้อมใช้งาน

## 📊 Database Management

```bash
# Generate Prisma Client
npm run db:generate

# Create Migration
npm run db:migrate

# Seed Database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset Database (⚠️ ลบข้อมูลทั้งหมด)
npm run db:reset
```

## 🎨 Features

### Frontend (User-Facing)
- ✅ Next.js 15 App Router
- ✅ TypeScript
- ✅ Tailwind CSS + Shadcn/ui
- ✅ Responsive Design
- ✅ LINE Login Integration
- ✅ Shopping Cart
- ✅ Course Enrollment
- ✅ eBook Reader
- ✅ Progress Tracking
- ✅ Payment Integration

### Admin Panel
- ✅ Dashboard with Analytics
- ✅ Course Management
- ✅ Order Management
- ✅ User Management
- ✅ Content Management (Posts, eBooks)
- ✅ Coupon Management
- ✅ Ant Design UI
- ✅ Role-Based Access Control

### Backend API
- ✅ Next.js API Routes
- ✅ Prisma ORM (MySQL)
- ✅ NextAuth.js Authentication
- ✅ JWT Token
- ✅ File Upload (Cloudinary/R2)
- ✅ Payment Verification
- ✅ Email Notifications
- ✅ RESTful API

## 🔐 Authentication

### User Authentication
- LINE Login (OAuth 2.0)
- JWT Token
- Cookie-based Session
- LocalStorage Sync

### Admin Authentication
- Email/Password Login
- Role-Based Access (ADMIN role required)
- Session Management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Forms**: React Hook Form + Zod
- **State Management**: React Context
- **Icons**: Lucide React

### Backend
- **Framework**: Next.js 15 API Routes
- **Database**: MySQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Storage**: Cloudinary / Cloudflare R2
- **Email**: Nodemailer

### Admin
- **UI Library**: Ant Design
- **Charts**: Ant Design Charts
- **Drag & Drop**: dnd-kit

## 📝 Scripts

```bash
# Development
npm run dev              # รัน development server

# Build
npm run build            # Build สำหรับ production

# Production
npm start                # รัน production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
```

## 🌐 URLs

### Development
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/dashboard`
- API: `http://localhost:3000/api/*`

### Production
- แก้ไข `NEXTAUTH_URL` และ `NEXT_PUBLIC_FRONTEND_URL` ใน `.env`

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - คู่มือการ Deploy และแก้ปัญหา
- [.env.example](.env.example) - ตัวอย่าง Environment Variables

## 🚀 Deployment

ดูคู่มือการ deploy ที่ [DEPLOYMENT.md](DEPLOYMENT.md)

**สิ่งสำคัญก่อน Deploy:**
1. ตั้งค่า `API_BASE_URL` เป็น production URL
2. ตั้งค่า `DATABASE_URL` เป็น production database
3. เปลี่ยน `NEXTAUTH_SECRET` เป็นค่าใหม่
4. ตรวจสอบ Cloudinary และ Vercel Blob credentials
5. Run `npm run build` ให้ผ่านก่อน deploy

## 🐛 Troubleshooting

### Banner ไม่แสดงใน Production
- ตรวจสอบว่าตั้งค่า `API_BASE_URL` ใน production environment variables แล้ว
- ดู logs ใน browser console: `🎯 [Hero Banner]`
- ถ้าไม่ได้ตั้งค่า ระบบจะใช้ fallback slides

### Build Error
- ตรวจสอบว่าใช้ React 18 (ไม่ใช่ React 19)
- ลบ `node_modules` และ `.next` แล้ว install ใหม่
- ตรวจสอบ TypeScript errors: `npm run type-check`

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under a proprietary license. See the [LICENSE](LICENSE) file for details.
