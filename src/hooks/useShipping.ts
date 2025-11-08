"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useMessage } from "./useAntdApp";

interface Shipment {
  id: string;
  [key: string]: any;
}

interface Filters {
  search: string;
  status: string;
  shippingMethod: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  sortOrder: string;
}

interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export function useShipping() {
  const message = useMessage();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "ALL",
    shippingMethod: "",
    startDate: "",
    endDate: "",
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

  const fetchShipments = useCallback(async (customFilters?: Partial<Filters>, customPagination?: Partial<Pagination>) => {
    setLoading(true);
    try {
      const currentFilters = customFilters || filtersRef.current;
      const currentPagination = customPagination || paginationRef.current;

      const params = new URLSearchParams({
        page: (currentPagination.page || 1).toString(),
        pageSize: (currentPagination.pageSize || 10).toString(),
        search: currentFilters.search || "",
        status: currentFilters.status || "ALL",
        shippingMethod: currentFilters.shippingMethod || "",
        startDate: currentFilters.startDate || "",
        endDate: currentFilters.endDate || "",
        sortBy: currentFilters.sortBy || "createdAt",
        sortOrder: currentFilters.sortOrder || "desc",
      });

      const response = await fetch(`/api/admin/shipping?${params}`);
      const result = await response.json();

      if (result.success) {
        setShipments(result.data);
        setPagination(prev => ({
          ...prev,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
        }));
      } else {
        message.error(result.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลการจัดส่ง");
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  }, [message]);

  const fetchShipmentDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/admin/shipping/${id}`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        message.error(result.error || "เกิดข้อผิดพลาดในการโหลดรายละเอียด");
        return null;
      }
    } catch (error) {
      console.error("Error fetching shipment detail:", error);
      message.error("เกิดข้อผิดพลาดในการโหลดรายละเอียด");
      return null;
    } finally {
      setDetailLoading(false);
    }
  }, [message]);

  const updateShipment = useCallback(async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/admin/shipping/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        message.success("อัพเดทข้อมูลการจัดส่งสำเร็จ");
        fetchShipments();
        return true;
      } else {
        message.error(result.error || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
        return false;
      }
    } catch (error) {
      console.error("Error updating shipment:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      return false;
    }
  }, [message, fetchShipments]);

  const handleFilterChange = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleTableChange = useCallback((paginationConfig: any, _filters: any, sorter: any) => {
    setPagination(prev => ({
      ...prev,
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize,
    }));

    if (sorter && sorter.field) {
      const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
      setFilters(prev => ({
        ...prev,
        sortBy: sorter.field,
        sortOrder,
      }));
    }
  }, []);

  const resetFilters = useCallback(() => {
    const resetFiltersData: Filters = {
      search: "",
      status: "ALL",
      shippingMethod: "",
      startDate: "",
      endDate: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(resetFiltersData);
    setSearchInput("");
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleSearch = useCallback(() => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchInput]);

  useEffect(() => {
    fetchShipments();
  }, [filters, pagination.page, pagination.pageSize]);

  useEffect(() => {
    fetchShipments();
  }, []);

  return {
    shipments,
    setShipments,
    loading,
    detailLoading,
    filters,
    searchInput,
    setSearchInput,
    pagination,
    fetchShipments,
    fetchShipmentDetail,
    updateShipment,
    handleFilterChange,
    handleTableChange,
    handleSearch,
    resetFilters,
  };
}
