"use client";

import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { MarketingInteraction } from "@/types/customer";

interface UseCustomerMarketingOptions {
  customerId: string;
  page?: number;
  pageSize?: number;
}

export function useCustomerMarketingHistory({
  customerId,
  page = 1,
  pageSize = 10,
}: UseCustomerMarketingOptions) {
  const [interactions, setInteractions] = useState<MarketingInteraction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInteractions = useCallback(async () => {
    if (!customerId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await crmClient.marketingInteractions.listByCustomer(customerId, page, pageSize);
      setInteractions(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load marketing history.");
    } finally {
      setIsLoading(false);
    }
  }, [customerId, page, pageSize]);

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  return {
    interactions,
    totalCount,
    totalPages,
    isLoading,
    error,
    refetch: fetchInteractions,
  };
}
