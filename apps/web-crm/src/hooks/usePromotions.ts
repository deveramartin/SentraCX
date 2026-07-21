import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { PromotionListItem } from "@/types/promotion";

export function usePromotions(status?: string) {
  const [data, setData] = useState<PromotionListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPromotions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await crmClient.promotions.list(status);
      setData(res ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load promotions"));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return { data, isLoading, error, refetch: fetchPromotions };
}
