# E-Learning Platform

ระบบเรียนออนไลน์

## 🎯 ภาพรวม

โปรเจกต์นี้เป็น Full-Stack E-Learning Platform ที่พัฒนาด้วย Next.js 15 

## 📁 โครงสร้างโปรเจค

```
e-learning-fb-demo/
└── app/                    # 🚀 Main Application
    ├── src/
    │   ├── app/
    │   │   ├── (site)/        # 🌐 Frontend Pages
    │   │   │   ├── page.tsx           # หน้าแรก
    │   │   │   ├── courses/           # หน้าคอร์ส
    │   │   │   ├── profile/           # หน้าโปรไฟล์
    │   │   │   └── ...
    │   │   │
    │   │   ├── admin/         # 🔧 Admin Panel
    │   │   │   ├── dashboard/         # Dashboard
    │   │   │   ├── courses/           # จัดการคอร์ส
    │   │   │   ├── orders/            # จัดการคำสั่งซื้อ
    │   │   │   └── ...
    │   │   │
    │   │   ├── api/           # 🔌 API Routes
    │   │   │   ├── auth/              # Authentication
    │   │   │   ├── courses/           # Course APIs
    │   │   │   ├── orders/            # Order APIs
    │   │   │   └── ...
    │   │   │
    │   │   ├── layout.js              # Root Layout
    │   │   └── globals.css            # Global Styles
    │   │
    │   ├── components/        # 🎨 UI Components
    │   │   ├── ui/                    # Shadcn/ui
    │   │   ├── sections/              # Page Sections
    │   │   ├── admin/                 # Admin Components
    │   │   └── ...
    │   │
    │   ├── lib/               # 🛠️ Utilities
    │   ├── hooks/             # 🪝 React Hooks
    │   └── contexts/          # 📦 React Contexts
    │
    ├── prisma/                # 💾 Database
    │   ├── schema.prisma              # Database Schema
    │   └── seed.ts                    # Seed Data
    │
    ├── public/                # 📁 Static Files
    └── package.json           # Dependencies
```

## 🚀 การติดตั้ง

### 1. Clone Repository

```bash
git clone <repository-url>
cd e-learning-fb-demo
```

### 2. ติดตั้ง Dependencies

```bash
cd backend
npm install
```

### 3. ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ .env.example
cp .env.example .env

# แก้ไขค่าใน .env
nano .env
```

**ค่าที่สำคัญ:**
```env
# Database
DATABASE_URL="mysql://user:password@host:3306/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# LINE Login
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
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
cd backend
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

- [Project Structure](docs/PROJECT_STRUCTURE_EXPLAINED.md) - อธิบายโครงสร้างโปรเจกต์
- [How It Works](docs/HOW_IT_WORKS.md) - อธิบายการทำงาน
- [Migration Guide](docs/MIGRATION_GUIDE.md) - คู่มือการรวมโปรเจกต์
- [Development Notes](docs/MERGED_PROJECT_GUIDE.md) - บันทึกการพัฒนา

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under a proprietary license. See the [LICENSE](LICENSE) file for details.
