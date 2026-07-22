import React from "react";
import { Badge } from "@/components/ui/badge";
import { PromotionStatus } from "@/types/promotion";

interface PromotionStatusBadgeProps {
  status: PromotionStatus;
}

export function PromotionStatusBadge({ status }: PromotionStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "Active":
        return "bg-badge-success text-badge-success-foreground border-transparent";
      case "Draft":
        return "bg-badge-warning text-badge-warning-foreground border-transparent";
      case "Accomplished":
        return "bg-badge-info text-badge-info-foreground border-transparent";
      case "Cancelled":
        return "bg-badge-destructive text-badge-destructive-foreground border-transparent";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  return (
    <Badge className={`text-xs font-medium border-none shadow-none ${getStyle()}`}>
      {status}
    </Badge>
  );
}
