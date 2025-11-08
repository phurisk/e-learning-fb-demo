import { useState, useEffect, useMemo, useCallback } from "react";
import { useMessage } from "./useAntdApp";

interface User {
  id: string;
  role: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  current: number;
  pageSize: number;
  total: number;
}

export const useUsers = () => {
  const message = useMessage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  
  const [filters, setFilters] = useState<Filters>({
    search: "",
    role: "all",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [pagination, setPagination] = useState<Pagination>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const stats = useMemo(() => {
    if (!users.length) return { total: 0, students: 0, instructors: 0, admins: 0 };

    return {
      total: users.length,
      students: users.filter(user => user.role === 'STUDENT').length,
      instructors: users.filter(user => user.role === 'INSTRUCTOR').length,
      admins: users.filter(user => user.role === 'ADMIN').length,
    };
  }, [users]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: (pagination?.current || 1).toString(),
        limit: (pagination?.pageSize || 10).toString(),
        search: filters.search || "",
        role: filters.role || "all",
        status: filters.status || "all",
        sortBy: filters.sortBy || "createdAt",
        sortOrder: filters.sortOrder || "desc",
      });

      const response = await fetch(`/api/admin/users?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users);
        setPagination(prev => ({
          ...prev,
          total: data.data.total,
          current: data.data.page,
        }));
      } else {
        try {
          message.error(`${data.error || "เกิดข้อผิดพลาดในการโหลดข้อมูล"}`);
        } catch (msgError) {
          console.error("Message display error:", msgError);
        }
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      try {
        message.error(`เกิดข้อผิดพลาด: ${(error as Error).message}`);
      } catch (msgError) {
        console.error("Message display error:", msgError);
      }
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize, message]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  }, []);

  const handleTableChange = useCallback((paginationConfig: any, _filters: any, sorter: any) => {
    setPagination(prev => ({
      ...prev,
      current: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));

    if (sorter && sorter.field) {
      setFilters(prev => ({
        ...prev,
        sortBy: sorter.field,
        sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
      }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      role: "all",
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setSearchInput("");
    setPagination(prev => ({
      ...prev,
      current: 1,
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange('search', searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (pagination && pagination.current && pagination.pageSize) {
      fetchUsers();
    }
  }, [fetchUsers, pagination]);

  return {
    users,
    loading,
    stats,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchUsers,
    handleFilterChange,
    handleTableChange,
    resetFilters,
  };
};
