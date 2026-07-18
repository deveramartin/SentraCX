"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crmClient } from "@/lib/api/crm-client";
import { CustomerStatus } from "@/types/customer";
import { toast } from "sonner";

interface CustomerStatusControlProps {
  customerId: string;
  currentStatus: CustomerStatus;
  onUpdated: (newStatus: CustomerStatus) => void;
}

export function CustomerStatusControl({
  customerId,
  currentStatus,
  onUpdated,
}: CustomerStatusControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newStatus: CustomerStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    try {
      await crmClient.customers.updateStatus(customerId, { status: newStatus });
      toast.success(`Customer status updated to ${newStatus}.`);
      onUpdated(newStatus);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span className="text-label-sm font-semibold text-muted-foreground whitespace-nowrap">Status:</span>
      <Select
        value={currentStatus}
        onValueChange={(val) => handleChange(val as CustomerStatus)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-full sm:w-[130px] h-8 text-label-sm font-semibold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
