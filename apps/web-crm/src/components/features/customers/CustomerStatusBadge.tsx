import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types/customer";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const getVariant = (): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case "Active":
        return "default";
      case "Inactive":
        return "secondary";
      case "Suspended":
        return "outline";
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
