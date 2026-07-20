"use client";

import { useState, useEffect, useCallback } from "react";
import { crmClient } from "@/lib/api/crm-client";
import { Customer } from "@/types/customer";

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(id));
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await crmClient.customers.getById(id);
      setCustomer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customer profile.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    crmClient.customers.getById(id)
      .then((data) => {
        if (isMounted) {
          setCustomer(data);
          setError(null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load customer profile.");
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  return {
    customer,
    isLoading,
    error,
    refetch: fetchCustomer,
    setCustomer,
  };
}
