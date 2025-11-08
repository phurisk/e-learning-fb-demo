"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { useMessage } from './useAntdApp';

interface Ebook {
  id: string;
  title: string;
  [key: string]: any;
}

interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  categoryId: string;
  status: string;
  format: string;
  featured: string;
  physical: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function useEbooks() {
  const message = useMessage();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    categoryId: "",
    status: "ALL",
    format: "",
    featured: "ALL",
    physical: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [searchInput, setSearchInput] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });

  const filtersRef = useRef(filters);
  const paginationRef = useRef(pagination);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const fetchEbooks = useCallback(async (customFilters?: Partial<Filters>, customPagination?: Partial<Pagination>) => {
    setLoading(true);
    try {
      const defaultFilters: Filters = {
        search: "",
        categoryId: "",
        status: "ALL",
        format: "",
        featured: "ALL",
        physical: "ALL",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const defaultPagination: Pagination = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
      
      const filtersToUse = customFilters || filtersRef.current || defaultFilters;
      const paginationToUse = customPagination || paginationRef.current || defaultPagination;

      const params = new URLSearchParams({
        page: paginationToUse.page?.toString() || '1',
        pageSize: paginationToUse.pageSize?.toString() || '10',
        search: filtersToUse.search || '',
        categoryId: filtersToUse.categoryId || '',
        status: filtersToUse.status || 'ALL',
        format: filtersToUse.format || '',
        featured: filtersToUse.featured || 'ALL',
        physical: filtersToUse.physical || 'ALL',
        sortBy: filtersToUse.sortBy || 'createdAt',
        sortOrder: filtersToUse.sortOrder || 'desc',
      });

      const response = await fetch(`/api/admin/ebooks?${params}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        message.error(`Failed to fetch ebooks: ${errorData.error || 'Unknown error'}`);
        setEbooks([]);
        return;
      }
      const data = await response.json();
      
      if (data.success) {
        setEbooks(data.data || []);
        setPagination(data.pagination);
        if (customFilters) {
          setFilters(customFilters as Filters);
        }
      } else {
        setEbooks(data || []);
        setPagination(prev => ({ ...prev, totalCount: data.length }));
        if (customFilters) {
          setFilters(customFilters as Filters);
        }
      }
    } catch (error) {
      console.error('Error fetching ebooks:', error);
      message.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  }, [message]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/ebook-categories');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error fetching categories:', errorData);
        message.error(`Failed to fetch categories: ${errorData.error || 'Unknown error'}`);
        setCategories([]);
        return;
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      message.error('เกิดข้อผิดพลาดในการโหลดหมวดหมู่');
      setCategories([]);
    }
  }, [message]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const currentFilters = filtersRef.current;
    const currentPagination = paginationRef.current;
    const newFilters = { ...currentFilters, [key]: value };
    const newPagination = { page: 1, pageSize: currentPagination.pageSize || 10 };
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchEbooks(newFilters, newPagination);
  }, [fetchEbooks]);

  const handleTableChange = useCallback((paginationInfo: any, _filtersInfo: any, sorter: any) => {
    const currentFilters = filtersRef.current;
    const newFilters = { ...currentFilters };
    const newPagination = {
      page: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };

    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    setFilters(newFilters);
    setPagination(prev => ({ ...prev, ...newPagination }));
    fetchEbooks(newFilters, newPagination);
  }, [fetchEbooks]);

  const resetFilters = useCallback(() => {
    const resetFiltersData: Filters = {
      search: "",
      categoryId: "",
      status: "ALL",
      format: "",
      featured: "ALL",
      physical: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    const resetPagination = { page: 1, pageSize: 10 };
    setSearchInput("");
    setFilters(resetFiltersData);
    setPagination(prev => ({ ...prev, ...resetPagination }));
    fetchEbooks(resetFiltersData, resetPagination);
  }, [fetchEbooks]);

  const submitEbook = async (values: any, editingEbook?: Ebook | null) => {
    try {
      const url = editingEbook ? `/api/admin/ebooks/${editingEbook.id}` : '/api/admin/ebooks';
      const method = editingEbook ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.data };
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return { success: false, error: errorData.error || 'Unknown error' };
      }
    } catch (error) {
      console.error('Error saving ebook:', error);
      return { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' };
    }
  };

  const deleteEbook = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ebooks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success !== false;
    } catch (error) {
      console.error('Error deleting ebook:', error);
      return false;
    }
  };

  const fetchEbookFile = useCallback(async (ebookId: string) => {
    try {
      const response = await fetch(`/api/admin/ebooks/${ebookId}`);
      const result = await response.json();
      
      if (response.ok && result.fileUrl) {
        const files = [{
          id: `${ebookId}_file`,
          fileName: result.title + '.' + (result.format || 'pdf').toLowerCase(),
          filePath: result.fileUrl,
          fileSize: result.fileSize || 0,
          uploadedAt: result.updatedAt,
        }];
        return files;
      }
      return [];
    } catch (error) {
      console.error("Error fetching ebook file:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดไฟล์");
      return [];
    }
  }, [message]);

  const uploadEbookFile = useCallback(async (ebookId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ebookId', ebookId);

      const response = await fetch("/api/admin/ebook-files", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        return { error: result.error || "อัปโหลดไฟล์ไม่สำเร็จ" };
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      return { error: "เกิดข้อผิดพลาดในการอัปโหลด" };
    }
  }, []);

  const deleteEbookFile = useCallback(async (ebookId: string) => {
    try {
      const response = await fetch(`/api/admin/ebook-files/${ebookId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Error deleting file:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCategories();
      const initialFilters: Filters = {
        search: "",
        categoryId: "",
        status: "ALL",
        format: "",
        featured: "ALL", 
        physical: "ALL",
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const initialPagination = { page: 1, pageSize: 10 };
      await fetchEbooks(initialFilters, initialPagination);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (!searchInput.trim()) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;
      const newFilters = { ...currentFilters, search: searchInput };
      const newPagination = { page: 1, pageSize: currentPagination.pageSize };
      fetchEbooks(newFilters, newPagination);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, fetchEbooks]);

  useEffect(() => {
    if (!searchInput.trim() && filtersRef.current.search) {
      const currentFilters = filtersRef.current;
      const currentPagination = paginationRef.current;
      const newFilters = { ...currentFilters, search: "" };
      setFilters(newFilters);
      fetchEbooks(newFilters, currentPagination);
    }
  }, [searchInput, fetchEbooks]);

  return {
    ebooks,
    setEbooks,
    categories,
    loading,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchEbooks,
    handleFilterChange,
    handleTableChange,
    resetFilters,
    submitEbook,
    deleteEbook,
    fetchEbookFile,
    uploadEbookFile,
    deleteEbookFile,
  };
}
