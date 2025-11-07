# คู่มือการรวม Frontend และ Backend

## การเปลี่ยนแปลง

โปรเจกต์นี้ได้รวม frontend และ backend เข้าด้วยกันแล้ว โดยใช้ backend เป็นฐาน

### สิ่งที่เปลี่ยนแปลง:

1. **Port**: เปลี่ยนจาก 3001 เป็น 3000
2. **Components**: คัดลอก components ทั้งหมดจาก frontend มาที่ `app/src/components`
3. **Dependencies**: รวม dependencies จาก frontend เข้ากับ backend
4. **Configuration**: อัพเดท next.config.mjs, tailwind.config.js, และ tsconfig.json

## การติดตั้ง

```bash
cd backend
npm install
```

## การตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.example` เป็น `.env` และแก้ไขค่าต่างๆ:

```bash
cp .env.example .env
```

สิ่งสำคัญที่ต้องเปลี่ยน:
- `NEXTAUTH_URL=http://localhost:3000` (เปลี่ยนจาก 3001)
- `NEXT_PUBLIC_API_URL=http://localhost:3000`
- `NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000`

## การรัน

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## โครงสร้างโฟลเดอร์

```
app/
├── src/
│   ├── app/
│   │   ├── (site)/          # Frontend pages
│   │   ├── admin/           # Admin pages
│   │   └── api/             # API routes
│   ├── components/          # UI Components (รวม frontend)
│   ├── hooks/               # React hooks
│   └── lib/                 # Utilities
├── prisma/                  # Database schema
└── public/                  # Static files
```

## หมายเหตุ

- ไม่จำเป็นต้องรัน frontend แยกอีกต่อไป
- API routes ทั้งหมดอยู่ที่ `/api/*`
- Frontend pages อยู่ที่ root และ admin routes
