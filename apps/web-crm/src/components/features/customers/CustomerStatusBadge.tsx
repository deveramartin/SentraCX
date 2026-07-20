import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types/customer";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const getVariant = (): "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info" => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className="text-label-sm font-semibold">
      {status}
    </Badge>
  );
}
