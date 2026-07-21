import React from "react";
import { Badge } from "@/components/ui/badge";
import { PromotionStatus } from "@/types/promotion";

interface PromotionStatusBadgeProps {
  status: PromotionStatus;
}

export function PromotionStatusBadge({ status }: PromotionStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "Active":
        return "default";
      case "Draft":
        return "outline";
      case "Accomplished":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Badge variant={getVariant()} className="text-xs font-medium">
      {status}
    </Badge>
  );
}
