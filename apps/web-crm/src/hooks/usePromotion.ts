import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { Promotion } from "@/types/promotion";

export function usePromotion(id: string | null) {
  const [data, setData] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromotion = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await crmClient.promotions.getById(id);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load promotion detail"));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPromotion();
  }, [fetchPromotion]);

  return { data, isLoading, error, refetch: fetchPromotion };
}
