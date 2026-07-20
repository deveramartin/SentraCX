"use client";

import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { CustomerListItem } from "@/types/customer";

interface UseCustomersOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

export function useCustomers({ page = 1, pageSize = 20, search = "" }: UseCustomersOptions = {}) {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await crmClient.customers.list(page, pageSize);
      let items = data.items || [];

      if (search.trim()) {
        const query = search.toLowerCase().trim();
        items = items.filter(
          (c) =>
            c.displayName.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query)
        );
      }

      setCustomers(items);
      setTotalCount(data.totalCount || items.length);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    let isMounted = true;
    crmClient.customers.list(page, pageSize)
      .then((data) => {
        if (isMounted) {
          let items = data.items || [];
          if (search.trim()) {
            const query = search.toLowerCase().trim();
            items = items.filter(
              (c) =>
                c.displayName.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query)
            );
          }
          setCustomers(items);
          setTotalCount(data.totalCount || items.length);
          setTotalPages(data.totalPages || 1);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load customers.");
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search]);

  return {
    customers,
    totalCount,
    totalPages,
    isLoading,
    error,
    refetch: fetchCustomers,
  };
}
