// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/signin',
  REGISTER: '/api/auth/signup',
  LOGOUT: '/api/auth/signout',
  ME: '/api/auth/me',

  // Courses
  COURSES: '/api/courses',
  COURSE_BY_ID: (id: string) => `/api/courses/${id}`,
  COURSE_CHAPTERS: (id: string) => `/api/courses/${id}/chapters`,
  COURSE_ENROLL: (id: string) => `/api/courses/${id}/enroll`,
  MY_COURSES: '/api/my-courses',

  // Categories
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: (id: string) => `/api/categories/${id}`,

  // Orders
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id: string) => `/api/orders/${id}`,
  CREATE_ORDER: '/api/orders/create',

  // Cart
  CART: '/api/cart',
  ADD_TO_CART: '/api/cart/add',
  REMOVE_FROM_CART: '/api/cart/remove',
  CLEAR_CART: '/api/cart/clear',

  // Ebooks
  EBOOKS: '/api/ebooks',
  EBOOK_BY_ID: (id: string) => `/api/ebooks/${id}`,

  // Reviews
  REVIEWS: '/api/reviews',
  COURSE_REVIEWS: (id: string) => `/api/courses/${id}/reviews`,
  EBOOK_REVIEWS: (id: string) => `/api/ebooks/${id}/reviews`,

  // Exams
  EXAMS: '/api/exams',
  EXAM_BY_ID: (id: string) => `/api/exams/${id}`,
  EXAM_ATTEMPT: (id: string) => `/api/exams/${id}/attempt`,

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_COURSES: '/api/admin/courses',
  ADMIN_ORDERS: '/api/admin/orders',
  ADMIN_ANALYTICS: '/api/admin/analytics',

  // Upload
  UPLOAD_IMAGE: '/api/upload/image',
  UPLOAD_VIDEO: '/api/upload/video',
  UPLOAD_FILE: '/api/upload/file',
} as const;

// App Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  COURSES: '/courses',
  COURSE_DETAIL: (id: string) => `/courses/${id}`,
  MY_COURSES: '/my-courses',
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  EBOOKS: '/ebooks',
  EBOOK_DETAIL: (id: string) => `/ebooks/${id}`,
  
  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_COURSES: '/admin/courses',
  ADMIN_USERS: '/admin/users',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  CART: 'cart_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  PAGE_SIZE: 10,
  COURSE_ACCESS_DURATION: 60, // days
  COURSE_ACCESS_HOURS: 120, // hours
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  SUPPORTED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  SUPPORTED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบเพื่อใช้งานฟีเจอร์นี้',
  FORBIDDEN: 'คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  VALIDATION_ERROR: 'ข้อมูลที่กรอกไม่ถูกต้อง',
  SERVER_ERROR: 'เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง',
  FILE_TOO_LARGE: 'ไฟล์มีขนาดใหญ่เกินไป',
  INVALID_FILE_TYPE: 'ประเภทไฟล์ไม่ถูกต้อง',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'เข้าสู่ระบบสำเร็จ',
  REGISTER_SUCCESS: 'สมัครสมาชิกสำเร็จ',
  LOGOUT_SUCCESS: 'ออกจากระบบสำเร็จ',
  SAVE_SUCCESS: 'บันทึกข้อมูลสำเร็จ',
  DELETE_SUCCESS: 'ลบข้อมูลสำเร็จ',
  UPDATE_SUCCESS: 'อัปเดตข้อมูลสำเร็จ',
  UPLOAD_SUCCESS: 'อัปโหลดไฟล์สำเร็จ',
  ORDER_SUCCESS: 'สั่งซื้อสำเร็จ',
  PAYMENT_SUCCESS: 'ชำระเงินสำเร็จ',
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 5000,
} as const;