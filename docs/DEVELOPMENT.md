# Development Guide

## โครงสร้างโปรเจค

```
e-learning-fb-demo/
├── frontend/              # Next.js Frontend (Port 3000)
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities และ API clients
│   └── hooks/           # Custom React hooks
├── backend/              # Next.js Backend API (Port 3001)
│   ├── src/app/api/     # API routes
│   ├── lib/             # Backend utilities
│   ├── prisma/          # Database schema และ migrations
│   └── public/          # Static files
├── shared/               # Shared types และ utilities
│   └── src/
│       ├── types/       # TypeScript types
│       ├── api/         # API client
│       └── utils/       # Shared utilities
└── docs/                # Documentation
```

## การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

```bash
# ใช้ script อัตโนมัติ
./install.sh

# หรือติดตั้งแยก
npm run install:all
```

### 2. ตั้งค่า Database

```bash
# สร้าง database migration
npm run db:migrate

# Seed ข้อมูลเริ่มต้น
npm run db:seed
```

### 3. รัน Development Server

```bash
# รัน frontend และ backend พร้อมกัน
npm run dev

# หรือรันแยก
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

## การพัฒนา

### Frontend Development

- ใช้ Next.js 15 App Router
- TypeScript สำหรับ type safety
- Tailwind CSS + shadcn/ui สำหรับ styling
- React Hook Form + Zod สำหรับ form validation

### Backend Development

- Next.js API Routes
- Prisma ORM สำหรับ database
- TypeScript
- NextAuth.js สำหรับ authentication

### Shared Code

- Types ที่ใช้ร่วมกันระหว่าง frontend และ backend
- API client utilities
- Constants และ validation rules

## API Routes

### Authentication
- `POST /api/auth/signin` - เข้าสู่ระบบ
- `POST /api/auth/signup` - สมัครสมาชิก
- `GET /api/auth/me` - ข้อมูลผู้ใช้ปัจจุบัน

### Courses
- `GET /api/courses` - รายการคอร์ส
- `GET /api/courses/[id]` - รายละเอียดคอร์ส
- `POST /api/courses/[id]/enroll` - ลงทะเบียนเรียน

### Cart
- `GET /api/cart` - ตะกร้าสินค้า
- `POST /api/cart/add` - เพิ่มสินค้า
- `DELETE /api/cart/remove/[id]` - ลบสินค้า

## Database Schema

ใช้ Prisma ORM กับ MySQL database:

- `User` - ข้อมูลผู้ใช้
- `Course` - คอร์สเรียน
- `Chapter` - บทเรียน
- `Content` - เนื้อหา
- `Enrollment` - การลงทะเบียนเรียน
- `Order` - คำสั่งซื้อ
- `Payment` - การชำระเงิน
- `Ebook` - หนังสือดิจิทัล
- `Review` - รีวิว
- `Cart` - ตะกร้าสินค้า

## Environment Variables

### Backend (.env)
```
DATABASE_URL="mysql://username:password@localhost:3306/e_learning_db"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key"
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"
```

## การ Deploy

### Production Build

```bash
# Build ทั้งหมด
npm run build

# Start production server
npm run start
```

### Docker (Optional)

```bash
# Build Docker image
docker build -t e-learning-app .

# Run container
docker run -p 3000:3000 -p 3001:3001 e-learning-app
```

## Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## Troubleshooting

### Database Issues
1. ตรวจสอบ DATABASE_URL ใน .env
2. รัน `npm run db:generate` เพื่อ generate Prisma client
3. รัน `npm run db:migrate` เพื่อ apply migrations

### Port Conflicts
- Frontend: เปลี่ยน port ใน `frontend/package.json`
- Backend: เปลี่ยน port ใน `backend/package.json`

### CORS Issues
- ตรวจสอบ CORS configuration ใน `backend/next.config.mjs`
- ตรวจสอบ API URL ใน frontend environment variables