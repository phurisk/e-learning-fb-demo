import { useState, useEffect, useCallback } from 'react';

interface Coupon {
  id: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  type: string;
  status: string;
  applicable: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
  showTotal: (total: number, range: [number, number]) => string;
}

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    status: '',
    applicable: ''
  });

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => 
      `${range[0]}-${range[1]} จาก ${total} คูปอง`,
  });

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        search: filters.search || '',
        type: filters.type || '',
        status: filters.status || '',
        applicable: filters.applicable || ''
      });

      const response = await fetch(`/api/admin/coupons?${params}`);
      
      if (!response.ok) {
        throw new Error('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }

      const result = await response.json();
      
      if (result.success) {
        setCoupons(result.data.coupons);
        setPagination(prev => ({
          ...prev,
          current: result.data.pagination.current,
          total: result.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error('Fetch coupons error:', error);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value 
    }));
    setPagination(prev => ({ 
      ...prev, 
      current: 1 
    }));
  }, []);

  const handleTableChange = useCallback((newPagination: any, _: any, sorter: any) => {
    setPagination(prev => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      type: '',
      status: '',
      applicable: ''
    });
    setSearchInput('');
    setPagination(prev => ({ 
      ...prev, 
      current: 1 
    }));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange('search', searchInput);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return {
    coupons,
    loading,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchCoupons,
    handleFilterChange,
    handleTableChange,
    resetFilters,
  };
};
