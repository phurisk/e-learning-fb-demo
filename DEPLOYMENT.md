# การ Deploy โปรเจค E-Learning

## ⚠️ สิ่งสำคัญก่อน Deploy

### 1. ตั้งค่า Environment Variables

ใน production (Vercel, Railway, etc.) ต้องตั้งค่าตัวแปรเหล่านี้:

```bash
# API URLs - เปลี่ยนเป็น domain จริงของคุณ
API_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_API_URL="https://yourdomain.com"
NEXT_PUBLIC_ELEARNING_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_FRONTEND_URL="https://yourdomain.com"

# Database
DATABASE_URL="mysql://user:pass@host:3306/dbname"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"

# LINE Login
LINE_CLIENT_ID="your-line-client-id"
LINE_CLIENT_SECRET="your-line-client-secret"
NEXT_PUBLIC_LINE_CLIENT_ID="your-line-client-id"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"

# Payment APIs
SLIPOK_API_KEY="your-key"
EASYSLIP_API_KEY="your-key"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"
```

### 2. ปัญหาที่พบบ่อย

#### Banner ไม่แสดงใน Production

**สาเหตุ:**
- `API_BASE_URL` ไม่ได้ตั้งค่าใน production
- API ไม่สามารถเข้าถึงได้จาก server-side

**วิธีแก้:**
1. ตรวจสอบว่าตั้งค่า `API_BASE_URL` ใน production environment variables แล้ว
2. ตรวจสอบ logs ใน production:
   ```
   🎯 [Hero Banner] API_BASE_URL: NOT SET  ← ถ้าเห็นนี่แสดงว่ายังไม่ได้ตั้งค่า
   ```
3. ถ้า API_BASE_URL ไม่ได้ตั้งค่า ระบบจะใช้ fallback slides จาก `src/lib/dummy-data.ts`

#### ภาพไม่โหลดจาก Vercel Blob หรือ Cloudinary

**วิธีแก้:**
1. ตรวจสอบว่า domain ของ Vercel Blob และ Cloudinary อยู่ใน `next.config.mjs`:
   ```js
   images: {
     domains: ['res.cloudinary.com'],
     remotePatterns: [
       {
         protocol: 'https',
         hostname: '*.vercel-storage.com',
       },
     ],
   }
   ```

### 3. Debug ใน Production

เปิด browser console และดู logs:
- `🎯 [Hero Banner]` - แสดงสถานะการโหลด banner
- `🎨 [HeroBanner]` - แสดงจำนวน slides ที่โหลดได้

### 4. Deploy บน Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables
vercel env add API_BASE_URL
# ใส่ค่า: https://your-vercel-domain.vercel.app

# 5. Deploy production
vercel --prod
```

### 5. ตรวจสอบหลัง Deploy

1. เปิดเว็บไซต์
2. เปิด Browser DevTools (F12)
3. ดู Console tab
4. ควรเห็น: `✅ [Hero Banner] Loaded X slides`
5. ถ้าเห็น `⚠️ [Hero Banner] No API URL configured` แสดงว่ายังไม่ได้ตั้งค่า environment variables

## 📝 Checklist ก่อน Deploy

- [ ] ตั้งค่า `API_BASE_URL` เป็น production URL
- [ ] ตั้งค่า `DATABASE_URL` เป็น production database
- [ ] ตั้งค่า `NEXTAUTH_SECRET` เป็นค่าใหม่ (ไม่ใช้ค่าเดียวกับ dev)
- [ ] ตั้งค่า `NEXTAUTH_URL` เป็น production URL
- [ ] ตรวจสอบ Cloudinary และ Vercel Blob credentials
- [ ] ตรวจสอบ LINE Login callback URL
- [ ] Run `npm run build` ให้ผ่านก่อน deploy
- [ ] ตรวจสอบ logs หลัง deploy

## 🔍 Troubleshooting

### Banner แสดงแต่ภาพไม่โหลด

1. ตรวจสอบ Network tab ใน DevTools
2. ดูว่า request ไปที่ Vercel Blob หรือ Cloudinary fail หรือไม่
3. ตรวจสอบ CORS settings
4. ตรวจสอบว่า URL ถูกต้อง

### API ไม่ทำงาน

1. ตรวจสอบ `API_BASE_URL` ตั้งค่าถูกต้อง
2. ลอง curl API endpoint:
   ```bash
   curl https://yourdomain.com/api/posts?postType=ป้ายประกาศหลัก&limit=10
   ```
3. ตรวจสอบ database connection

## 📚 เอกสารเพิ่มเติม

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/deployment/deployment-guides)
