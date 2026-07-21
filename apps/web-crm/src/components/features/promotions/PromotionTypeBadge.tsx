import React from "react";
import { Badge } from "@/components/ui/badge";
import { PromotionType } from "@/types/promotion";

interface PromotionTypeBadgeProps {
  type: PromotionType;
}

export function PromotionTypeBadge({ type }: PromotionTypeBadgeProps) {
  return (
    <Badge variant="outline" className="text-xs py-0.5 px-2 font-normal">
      {type}
    </Badge>
  );
}
