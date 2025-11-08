import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';

interface UserPayload {
  userId: string;
  email: string;
  name?: string;
  role?: string;
  lineId?: string;
  iat?: number;
  exp?: number;
}

interface TokenVerification {
  valid: boolean;
  data?: UserPayload;
  error?: string;
}

/**
 * Create JWT token for external frontend
 */
export const createExternalToken = (user: { id: string; email: string; name?: string; role?: string; lineId?: string }): string => {
  const payload: UserPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    lineId: user.lineId,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'e-learning-system',
    audience: 'external-frontend'
  });
};

/**
 * Verify and decode JWT token
 */
export const verifyExternalToken = (token: string): TokenVerification => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'e-learning-system',
      audience: 'external-frontend'
    }) as UserPayload;
    return { valid: true, data: decoded };
  } catch (error) {
    return { valid: false, error: (error as Error).message };
  }
};

/**
 * Refresh JWT token
 */
export const refreshExternalToken = (token: string): string | null => {
  const verification = verifyExternalToken(token);
  if (!verification.valid || !verification.data) {
    return null;
  }

  // สร้าง token ใหม่ด้วยข้อมูลเดิม (ลบ iat, exp ออก)
  const { iat, exp, ...userData } = verification.data;
  return jwt.sign(userData, JWT_SECRET, { 
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'e-learning-system',
    audience: 'external-frontend'
  });
};
