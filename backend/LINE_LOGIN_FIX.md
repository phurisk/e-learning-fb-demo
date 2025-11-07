# แก้ไขปัญหา LINE Login

## ปัญหาที่พบ

1. **ByteString Error**: ตัวอักษรไทยใน URL parameters ทำให้เกิด error
2. **Login ไม่ติด**: หลัง LINE callback กลับมา session ไม่ถูกเก็บ
3. **Loading ค้าง**: หน้าจอหมุนค้างหลัง login
4. **Refresh หาย**: พอ refresh page login หายไป

## การแก้ไข

### 1. LINE Callback API (`/api/auth/callback/line/route.js`)

**เพิ่ม JWT Token Generation**:
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, email: user.email, name: user.name, role: user.role },
  process.env.NEXTAUTH_SECRET,
  { expiresIn: '30d' }
);
```

**Set Cookies**:
- `auth_token`: HTTP-only cookie สำหรับ security
- `user_data`: Cookie ที่ JavaScript อ่านได้

**ส่ง Token ทาง Query Params**:
- `login_success=true`
- `user_id={userId}`
- `token={jwtToken}`
- `line_id={lineId}`

### 2. Auth Provider (`auth-provider.tsx`)

**เพิ่มการอ่าน Cookie**:
```typescript
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};
```

**ลำดับการตรวจสอบ Authentication**:
1. ตรวจสอบ URL params (login_success + token)
2. ตรวจสอบ cookies (user_data + auth_token)
3. ตรวจสอบ localStorage (token)
4. ตรวจสอบ server session

**Validate Token**:
```typescript
const { data: result } = await http.post(`/api/external/auth/validate`, { token })
if (result.valid && result.user) {
  setUser(result.user)
  localStorage.setItem('user', JSON.stringify(result.user))
  localStorage.setItem('token', token)
}
```

## ผลลัพธ์

✅ Login ด้วย LINE สำเร็จ  
✅ Session ถูกเก็บใน cookie และ localStorage  
✅ Refresh page แล้ว login ยังอยู่  
✅ ไม่มี ByteString error  
✅ Loading ไม่ค้าง  

## การทดสอบ

1. กด "เข้าสู่ระบบด้วย LINE"
2. Login ที่ LINE
3. Redirect กลับมา → ควรเห็นชื่อผู้ใช้ที่ navigation
4. Refresh page → ยังคง login อยู่
5. ปิดเบราว์เซอร์แล้วเปิดใหม่ → ยังคง login อยู่ (ถ้าไม่เกิน 30 วัน)

## หมายเหตุ

- Token มีอายุ 30 วัน
- Cookie ใช้ `sameSite: 'lax'` เพื่อความปลอดภัย
- Production ควรใช้ `secure: true` (HTTPS only)
- HTTP-only cookie ป้องกัน XSS attacks
