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
import { CustomerType } from "@/types/customer";
import { toast } from "sonner";

interface CustomerTypeControlProps {
  customerId: string;
  currentType: CustomerType;
  onUpdated: (newType: CustomerType) => void;
}

export function CustomerTypeControl({
  customerId,
  currentType,
  onUpdated,
}: CustomerTypeControlProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (newType: CustomerType) => {
    if (newType === currentType) return;
    setIsUpdating(true);
    try {
      await crmClient.customers.updateType(customerId, { customerType: newType });
      toast.success(`Customer type updated to ${newType === "InstitutionalBuyer" ? "Institutional Buyer" : "Regular"}.`);
      onUpdated(newType);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update customer type.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-xs">
      <span className="text-xs font-medium text-muted-foreground">Type:</span>
      <Select
        value={currentType}
        onValueChange={(val) => handleChange(val as CustomerType)}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[160px] h-8 text-xs font-semibold bg-surface-container-lowest border-outline-variant">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Regular">Regular</SelectItem>
          <SelectItem value="InstitutionalBuyer">Institutional Buyer</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
