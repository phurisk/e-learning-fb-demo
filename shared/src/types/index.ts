// User Types
export interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    lineId?: string;
    role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
    createdAt: Date;
    updatedAt: Date;
}

// Course Types
export interface Course {
    id: string;
    title: string;
    description?: string;
    price: number;
    discountPrice?: number;
    sampleVideo?: string;
    duration?: number;
    accessDuration?: number;
    accessHours?: number;
    isFree: boolean;
    isRecommended: boolean;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'DELETED';
    instructorId: string;
    categoryId?: string;
    subject?: string;
    coverImageUrl?: string;
    coverPublicId?: string;
    isPhysical: boolean;
    weight?: number;
    dimensions?: string;
    createdAt: Date;
    updatedAt: Date;
    instructor?: User;
    category?: Category;
    chapters?: Chapter[];
    enrollments?: Enrollment[];
    reviews?: Review[];
}

// Chapter Types
export interface Chapter {
    id: string;
    title: string;
    order: number;
    courseId: string;
    createdAt: Date;
    contents?: Content[];
}

// Content Types
export interface Content {
    id: string;
    title: string;
    contentType: 'VIDEO' | 'PDF' | 'LINK' | 'QUIZ' | 'ASSIGNMENT';
    contentUrl: string;
    order: number;
    chapterId: string;
    createdAt: Date;
}

// Category Types
export interface Category {
    id: string;
    name: string;
    description?: string;
    courses?: Course[];
}

// Enrollment Types
export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    progress: number;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELED';
    enrolledAt: Date;
    user?: User;
    course?: Course;
}

// Review Types
export interface Review {
    id: string;
    userId: string;
    courseId?: string;
    ebookId?: string;
    rating: number;
    title?: string;
    comment?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    course?: Course;
    ebook?: Ebook;
}

// Order Types
export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    courseId?: string;
    ebookId?: string;
    orderType: 'COURSE' | 'EBOOK' | 'MIXED';
    status: 'PENDING' | 'PENDING_PAYMENT' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    couponDiscount: number;
    total: number;
    notes?: string;
    couponId?: string;
    couponCode?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: User;
    course?: Course;
    ebook?: Ebook;
    items?: OrderItem[];
    payment?: Payment;
    shipping?: Shipping;
}

// Payment Types
export interface Payment {
    id: string;
    orderId: string;
    method: 'BANK_TRANSFER' | 'CREDIT_CARD' | 'PROMPTPAY' | 'TRUE_MONEY' | 'FREE';
    status: 'PENDING' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'REJECTED' | 'FAILED' | 'REFUNDED';
    amount: number;
    paidAt?: Date;
    ref?: string;
    slipUrl?: string;
    uploadedAt?: Date;
    verifiedAt?: Date;
    verifiedBy?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Ebook Types
export interface Ebook {
    id: string;
    title: string;
    description?: string;
    author: string;
    isbn?: string;
    price: number;
    discountPrice?: number;
    coverImageUrl?: string;
    previewUrl?: string;
    fileUrl?: string;
    fileSize?: number;
    pageCount?: number;
    language: string;
    format: 'PDF' | 'EPUB' | 'MOBI';
    isPhysical: boolean;
    weight?: number;
    dimensions?: string;
    downloadLimit?: number;
    accessDuration?: number;
    isActive: boolean;
    isFeatured: boolean;
    publishedAt?: Date;
    publishedYear?: number;
    categoryId?: string;
    createdAt: Date;
    updatedAt: Date;
    category?: EbookCategory;
    reviews?: Review[];
}

// Ebook Category Types
export interface EbookCategory {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    ebooks?: Ebook[];
}

// Order Item Types
export interface OrderItem {
    id: string;
    orderId: string;
    itemType: 'COURSE' | 'EBOOK';
    itemId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
}

// Shipping Types
export interface Shipping {
    id: string;
    orderId: string;
    recipientName: string;
    recipientPhone: string;
    address: string;
    district: string;
    province: string;
    postalCode: string;
    country: string;
    shippingMethod: 'STANDARD' | 'EXPRESS' | 'KERRY' | 'THAILAND_POST' | 'JT_EXPRESS' | 'FLASH_EXPRESS' | 'NINJA_VAN' | 'DHL' | 'FEDEX';
    shippingFee: number;
    trackingNumber?: string;
    status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    estimatedDelivery?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Exam Types
export interface Exam {
    id: string;
    title: string;
    description?: string;
    courseId?: string;
    examType: 'PRETEST' | 'POSTTEST' | 'QUIZ' | 'MIDTERM' | 'FINAL' | 'PRACTICE';
    timeLimit?: number;
    totalMarks: number;
    passingMarks: number;
    attemptsAllowed: number;
    showResults: boolean;
    showAnswers: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    questions?: Question[];
}

// Question Types
export interface Question {
    id: string;
    examId: string;
    questionText: string;
    questionImage?: string;
    questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
    marks: number;
    explanation?: string;
    createdAt: Date;
    updatedAt: Date;
    options?: QuestionOption[];
}

// Question Option Types
export interface QuestionOption {
    id: string;
    questionId: string;
    optionText: string;
    isCorrect: boolean;
    order: number;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface CourseForm {
    title: string;
    description?: string;
    price: number;
    discountPrice?: number;
    categoryId?: string;
    subject?: string;
    duration?: number;
    accessDuration?: number;
    isFree: boolean;
    isRecommended: boolean;
    coverImage?: FileUpload;
}

// Custom file type that works in both browser and Node.js
export interface FileUpload {
    name: string;
    size: number;
    type: string;
    lastModified?: number;
}

// Additional form types
export interface EbookForm {
    title: string;
    description?: string;
    author: string;
    isbn?: string;
    price: number;
    discountPrice?: number;
    language: string;
    format: 'PDF' | 'EPUB' | 'MOBI';
    isPhysical: boolean;
    weight?: number;
    dimensions?: string;
    downloadLimit?: number;
    accessDuration?: number;
    categoryId?: string;
    coverImage?: FileUpload;
    ebookFile?: FileUpload;
}

export interface ReviewForm {
    rating: number;
    title?: string;
    comment?: string;
    courseId?: string;
    ebookId?: string;
}

// Cart Types
export interface CartItem {
    id: string;
    itemType: 'COURSE' | 'EBOOK';
    itemId: string;
    title?: string;
    quantity: number;
    unitPrice?: number;
}

export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    createdAt: Date;
    updatedAt: Date;
}