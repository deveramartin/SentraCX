import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { CampaignListItem } from "@/types/campaign";

export function useCampaigns(status?: string) {
  const [data, setData] = useState<CampaignListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCampaigns = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await crmClient.campaigns.list(status);
      setData(res ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load campaigns"));
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { data, isLoading, error, refetch: fetchCampaigns };
}
