"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMessage } from "./useAntdApp";

interface PostCategory {
  id: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function usePostCategories() {
  const message = useMessage();
  const [postCategories, setPostCategories] = useState<PostCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "ALL",
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
  filtersRef.current = filters;

  const fetchPostCategories = useCallback(async (customFilters: Partial<Filters> | null = null, customPagination: Partial<Pagination> | null = null) => {
    setLoading(true);
    const currentFilters = customFilters || filtersRef.current;
    const currentPagination = customPagination || pagination;

    try {
      const params = new URLSearchParams({
        page: (currentPagination?.page || 1).toString(),
        pageSize: (currentPagination?.pageSize || 10).toString(),
        search: currentFilters?.search || "",
        status: currentFilters?.status || "ALL",
        sortBy: currentFilters?.sortBy || "createdAt",
        sortOrder: currentFilters?.sortOrder || "desc",
      });

      const res = await fetch(`/api/admin/post-types?${params}`);
      const data = await res.json();

      if (data.success) {
        setPostCategories(data.data || []);
        setPagination({
          page: data.pagination?.page || 1,
          pageSize: data.pagination?.pageSize || 10,
          totalCount: data.pagination?.totalCount || 0,
          totalPages: data.pagination?.totalPages || 0,
        });
        if (customFilters) {
          setFilters(currentFilters as Filters);
        }
      } else {
        message.error(data.error || "โหลดข้อมูลหมวดหมู่โพสต์ไม่สำเร็จ");
      }
    } catch (e) {
      console.error("Fetch post categories error:", e);
      message.error("โหลดข้อมูลหมวดหมู่โพสต์ไม่สำเร็จ");
    }
    setLoading(false);
  }, [pagination, message]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const newFilters = { ...filtersRef.current, [key]: value };
    fetchPostCategories(newFilters, { page: 1, pageSize: pagination.pageSize });
  }, [fetchPostCategories, pagination.pageSize]);

  const handleTableChange = useCallback((pag: any, _: any, sorter: any) => {
    let newSortBy = "createdAt";
    let newSortOrder = "desc";

    if (sorter && sorter.field) {
      newSortBy = sorter.field;
      newSortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    const newFilters = {
      ...filtersRef.current,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    };

    const newPagination = {
      page: pag.current,
      pageSize: pag.pageSize,
      totalCount: pagination.totalCount,
      totalPages: pagination.totalPages,
    };

    fetchPostCategories(newFilters, newPagination);
  }, [fetchPostCategories, pagination.totalCount, pagination.totalPages]);

  const resetFilters = useCallback(() => {
    const defaultFilters: Filters = {
      search: "",
      status: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setSearchInput("");
    fetchPostCategories(defaultFilters, { page: 1, pageSize: pagination.pageSize });
  }, [fetchPostCategories, pagination.pageSize]);

  useEffect(() => {
    fetchPostCategories();
  }, []);

  return {
    postCategories,
    setPostCategories,
    loading,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchPostCategories,
    handleFilterChange,
    handleTableChange,
    resetFilters,
  };
}
