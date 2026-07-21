import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerStatus } from "@/types/customer";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
}

export function CustomerStatusBadge({ status }: CustomerStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "Active":
        return "bg-badge-success text-badge-success-foreground border-transparent";
      case "Inactive":
        return "bg-muted text-muted-foreground border-transparent";
      case "Suspended":
        return "bg-badge-destructive text-badge-destructive-foreground border-transparent";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  return (
    <Badge className={`text-label-sm font-medium border-none shadow-none ${getStyle()}`}>
      {status}
    </Badge>
  );
}
