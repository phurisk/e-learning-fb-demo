import { useState, useEffect } from 'react';

interface Order {
  id: string;
  orderType: 'COURSE' | 'EBOOK';
  status: string;
  total: number;
  courseId?: string;
  ebookId?: string;
  payment?: {
    status: string;
    amount: number;
  };
  [key: string]: any;
}

interface OrderStats {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  courseRevenue: number;
  ebookRevenue: number;
  coursesSold: number;
  ebooksSold: number;
  uniqueCoursesCount: number;
  uniqueEbooksCount: number;
}

interface DashboardStats {
  stats: {
    revenue: {
      total: number;
      course: number;
      ebook: number;
    };
    orders: {
      total: number;
      completed: number;
      pending: number;
    };
    courses: {
      sold: number;
      unique: number;
    };
    ebooks: {
      sold: number;
      unique: number;
    };
    users: {
      new: number;
      total: number;
    };
    enrollments: {
      total: number;
      active: number;
    };
  };
}

const calculateOrderStats = (orders: Order[]): OrderStats => {
  if (!orders || orders.length === 0) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      completedOrders: 0,
      pendingOrders: 0,
      courseRevenue: 0,
      ebookRevenue: 0,
      coursesSold: 0,
      ebooksSold: 0,
      uniqueCoursesCount: 0,
      uniqueEbooksCount: 0,
    };
  }

  const completedCourseOrders = orders.filter(order => 
    order.orderType === 'COURSE' && order.status === 'COMPLETED'
  );
  
  const completedEbookOrders = orders.filter(order => 
    order.orderType === 'EBOOK' && order.payment?.status === 'COMPLETED'
  );
  
  const paidOrders = [
    ...completedCourseOrders,
    ...completedEbookOrders
  ];
  
  const pendingCourseOrders = orders.filter(order => 
    order.orderType === 'COURSE' && order.status === 'PENDING'
  );
  
  const pendingEbookOrders = orders.filter(order => 
    order.orderType === 'EBOOK' && order.payment?.status !== 'COMPLETED'
  );
  
  const courseRevenue = completedCourseOrders.reduce((sum, order) => sum + order.total, 0);
  const ebookRevenue = completedEbookOrders.reduce((sum, order) => sum + (order.payment?.amount || 0), 0);
  const totalRevenue = courseRevenue + ebookRevenue;
  
  const uniqueCourses = new Set(completedCourseOrders.map(order => order.courseId).filter(Boolean));
  const uniqueEbooks = new Set(completedEbookOrders.map(order => order.ebookId).filter(Boolean));

  return {
    totalRevenue,
    totalOrders: orders.length,
    completedOrders: paidOrders.length,
    pendingOrders: pendingCourseOrders.length + pendingEbookOrders.length,
    courseRevenue,
    ebookRevenue,
    coursesSold: completedCourseOrders.length,
    ebooksSold: completedEbookOrders.length,
    uniqueCoursesCount: uniqueCourses.size,
    uniqueEbooksCount: uniqueEbooks.size,
  };
};

export function useDashboardStats(period: number = 30) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      const orders = Array.isArray(data.data) ? data.data : [];
      const orderStats = calculateOrderStats(orders);
      
      const formattedStats: DashboardStats = {
        stats: {
          revenue: {
            total: orderStats.totalRevenue,
            course: orderStats.courseRevenue,
            ebook: orderStats.ebookRevenue,
          },
          orders: {
            total: orderStats.totalOrders,
            completed: orderStats.completedOrders,
            pending: orderStats.pendingOrders,
          },
          courses: {
            sold: orderStats.coursesSold,
            unique: orderStats.uniqueCoursesCount,
          },
          ebooks: {
            sold: orderStats.ebooksSold,
            unique: orderStats.uniqueEbooksCount,
          },
          users: {
            new: 0,
            total: 0,
          },
          enrollments: {
            total: orderStats.coursesSold,
            active: orderStats.coursesSold,
          }
        }
      };
      
      setStats(formattedStats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  };
}

export function useCourseSales(period: number = 30) {
  const [courseSales, setCourseSales] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourseSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      const courseOrders = data.data.filter((order: Order) => 
        order.orderType === 'COURSE' && order.status === 'COMPLETED'
      );
      
      const totalRevenue = courseOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
      const totalOrders = courseOrders.length;
      const uniqueCourses = new Set(courseOrders.map((order: Order) => order.courseId).filter(Boolean));
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      const formattedData = {
        summary: {
          totalRevenue,
          totalOrders,
          totalCourses: uniqueCourses.size,
          averageOrderValue,
        },
        orders: courseOrders,
      };
      
      setCourseSales(formattedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseSales();
  }, [period]);

  return {
    courseSales,
    loading,
    error,
    refetch: fetchCourseSales
  };
}

export function useEbookSales(period: number = 30) {
  const [ebookSales, setEbookSales] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEbookSales = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      const ebookOrders = data.data.filter((order: Order) => 
        order.orderType === 'EBOOK' && order.payment?.status === 'COMPLETED'
      );
      
      const totalRevenue = ebookOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
      const totalOrders = ebookOrders.length;
      const uniqueEbooks = new Set(ebookOrders.map((order: Order) => order.ebookId).filter(Boolean));
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      const formattedData = {
        summary: {
          totalRevenue,
          totalOrders,
          totalEbooks: uniqueEbooks.size,
          averageOrderValue,
        },
        orders: ebookOrders,
      };
      
      setEbookSales(formattedData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbookSales();
  }, [period]);

  return {
    ebookSales,
    loading,
    error,
    refetch: fetchEbookSales
  };
}

export function useRevenueAnalytics(period: number = 12) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/dashboard/revenue-analytics?period=${period}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch revenue analytics');
      }
      
      setAnalytics(data.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  };
}
