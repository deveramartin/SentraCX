import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { PaginatedTicketResponse } from "@/types/ticket";

export function useTickets(page = 1, pageSize = 20, status?: string, customerId?: string) {
  const [data, setData] = useState<PaginatedTicketResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await crmClient.tickets.list(page, pageSize, status, customerId);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load tickets"));
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, status, customerId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { data, isLoading, error, refetch: fetchTickets };
}
