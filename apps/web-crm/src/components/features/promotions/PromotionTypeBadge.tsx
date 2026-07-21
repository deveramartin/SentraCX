import React from "react";
import { Badge } from "@/components/ui/badge";
import { PromotionType } from "@/types/promotion";

interface PromotionTypeBadgeProps {
  type: PromotionType;
}

export function PromotionTypeBadge({ type }: PromotionTypeBadgeProps) {
  const getStyle = () => {
    switch (type) {
      case "Discount":
        return "bg-badge-success text-badge-success-foreground border-transparent";
      case "Voucher":
        return "bg-badge-purple text-badge-purple-foreground border-transparent";
      case "FreeShipping":
        return "bg-badge-teal text-badge-teal-foreground border-transparent";
      case "BuyOneGetOne":
        return "bg-badge-orange text-badge-orange-foreground border-transparent";
      case "Cashback":
        return "bg-badge-indigo text-badge-indigo-foreground border-transparent";
      default:
        return "bg-muted text-muted-foreground border-transparent";
    }
  };

  return (
    <Badge className={`text-xs py-0.5 px-2 font-medium border-none shadow-none ${getStyle()}`}>
      {type}
    </Badge>
  );
}
