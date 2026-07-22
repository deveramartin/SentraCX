"use client";

import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { TicketListItem } from "@/types/ticket";

export function useTickets(
  page = 1,
  pageSize = 20,
  status?: string,
  assignedToId?: string
) {
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await crmClient.tickets.list(page, pageSize, status, assignedToId);
      setTickets(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, status, assignedToId]);

  useEffect(() => {
    let isMounted = true;
    crmClient.tickets
      .list(page, pageSize, status, assignedToId)
      .then((data) => {
        if (isMounted) {
          setTickets(data.items);
          setTotalCount(data.totalCount);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load tickets.");
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [page, pageSize, status, assignedToId]);

  return {
    tickets,
    totalCount,
    isLoading,
    error,
    refetch: fetchTickets,
    setTickets,
  };
}
