# E-Learning Full-Stack Demo

โปรเจค E-Learning ที่รวม Frontend และ Backend เข้าด้วยกัน

## โครงสร้างโปรเจค

```
e-learning-fb-demo/
├── frontend/          # Next.js Frontend (TypeScript)
├── backend/           # Next.js Backend API (TypeScript)
├── shared/            # Shared types และ utilities
└── docs/              # Documentation
```

## การติดตั้ง

```bash
# ติดตั้ง dependencies ทั้งหมด
npm run install:all

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed
```

## การรัน Development

```bash
# รัน frontend และ backend พร้อมกัน
npm run dev

# หรือรันแยก
npm run dev:frontend  # รันที่ port 3000
npm run dev:backend   # รันที่ port 3001
```

## การ Build และ Deploy

```bash
# Build ทั้งหมด
npm run build

# Start production
npm run start
```

## Database Management

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

## Features

### Frontend
- Next.js 15 with TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod validation
- Responsive design
- Dark/Light theme

### Backend
- Next.js API Routes with TypeScript
- Prisma ORM with MySQL
- NextAuth.js authentication
- File upload with Cloudinary
- Payment integration
- Email notifications

### Shared
- TypeScript types
- API client
- Utilities
- Constants