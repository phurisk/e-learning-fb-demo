"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMessage } from "./useAntdApp";

interface Course {
  id: string;
  [key: string]: any;
}

interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

interface Instructor {
  id: string;
  name: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  status: string;
  instructorId: string;
  categoryId: string;
  subject: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function useCourses() {
  const message = useMessage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [instLoading, setInstLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "ALL",
    instructorId: "",
    categoryId: "",
    subject: "",
    minPrice: "",
    maxPrice: "",
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

  const fetchCourses = useCallback(async (customFilters?: Partial<Filters>, customPagination?: Partial<Pagination>) => {
    setLoading(true);
    try {
      const currentFilters = customFilters || filtersRef.current;
      const currentPagination = customPagination || paginationRef.current;

      const params = new URLSearchParams({
        page: currentPagination.page?.toString() || "1",
        pageSize: currentPagination.pageSize?.toString() || "10",
        search: currentFilters.search || "",
        status: currentFilters.status || "ALL",
        instructorId: currentFilters.instructorId || "",
        categoryId: currentFilters.categoryId || "",
        subject: currentFilters.subject || "",
        sortBy: currentFilters.sortBy || "createdAt",
        sortOrder: currentFilters.sortOrder || "desc",
      });

      if (currentFilters.minPrice)
        params.append("minPrice", currentFilters.minPrice);
      if (currentFilters.maxPrice)
        params.append("maxPrice", currentFilters.maxPrice);

      const res = await fetch(`/api/admin/courses?${params}`);
      const data = await res.json();

      if (data.success) {
        setCourses(data.data || []);
        setPagination(data.pagination || {
          page: 1,
          pageSize: 10,
          totalCount: 0,
          totalPages: 0,
        });
        if (customFilters) {
          setFilters(currentFilters as Filters);
        }
      } else {
        message.error(data.error || "โหลดข้อมูลคอร์สไม่สำเร็จ");
      }
    } catch (e) {
      console.error("Fetch courses error:", e);
      message.error("โหลดข้อมูลคอร์สไม่สำเร็จ");
    }
    setLoading(false);
  }, [message]);

  const fetchCategories = useCallback(async () => {
    setCatLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.data || []);
    } catch (e) {
      message.error("โหลดข้อมูลหมวดหมู่ไม่สำเร็จ");
    }
    setCatLoading(false);
  }, [message]);

  const fetchInstructors = useCallback(async () => {
    setInstLoading(true);
    try {
      const res = await fetch("/api/admin/users?role=INSTRUCTOR");
      const data = await res.json();
      setInstructors(data.data?.users || []);
    } catch (e) {
      message.error("โหลดข้อมูลผู้สอนไม่สำเร็จ");
    }
    setInstLoading(false);
  }, [message]);

  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    const newFilters = { ...filtersRef.current, [key]: value };
    fetchCourses(newFilters, { page: 1 });
  }, [fetchCourses]);

  const handleTableChange = useCallback((paginationInfo: any, _filtersInfo: any, sorter: any) => {
    const newFilters = { ...filtersRef.current };
    const newPagination = {
      page: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };

    if (sorter.field) {
      newFilters.sortBy = sorter.field;
      newFilters.sortOrder = sorter.order === "ascend" ? "asc" : "desc";
    }

    fetchCourses(newFilters, newPagination);
  }, [fetchCourses]);

  const resetFilters = useCallback(() => {
    const resetFiltersData: Filters = {
      search: "",
      status: "ALL",
      instructorId: "",
      categoryId: "",
      subject: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setSearchInput("");
    setFilters(resetFiltersData);
    fetchCourses(resetFiltersData, { page: 1 });
  }, [fetchCourses]);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCategories();
      await fetchInstructors();
      await fetchCourses();
    };
    loadInitialData();
  }, [fetchCategories, fetchInstructors, fetchCourses]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newFilters = { ...filtersRef.current, search: searchInput };
      fetchCourses(newFilters, { page: 1 });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, fetchCourses]);

  const updateCourseInList = useCallback((courseId: string, updatedData: Partial<Course>) => {
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === courseId 
          ? { ...course, ...updatedData }
          : course
      )
    );
  }, []);

  const addCourseToList = useCallback((newCourse: Course) => {
    setCourses(prevCourses => [newCourse, ...prevCourses]);
    setPagination(prev => ({
      ...prev,
      totalCount: prev.totalCount + 1
    }));
  }, []);

  return {
    courses,
    loading,
    categories,
    catLoading,
    instructors,
    instLoading,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchCourses,
    handleFilterChange,
    handleTableChange,
    resetFilters,
    updateCourseInList,
    addCourseToList,
  };
}
