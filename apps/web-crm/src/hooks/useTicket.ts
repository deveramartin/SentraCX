import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { Ticket } from "@/types/ticket";

export function useTicket(id: string | null) {
  const [data, setData] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTicket = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await crmClient.tickets.getById(id);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load ticket detail"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  return { data, isLoading, error, refetch: fetchTicket };
}
