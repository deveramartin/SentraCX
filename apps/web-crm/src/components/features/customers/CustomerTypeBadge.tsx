import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerType } from "@/types/customer";

interface CustomerTypeBadgeProps {
  customerType: CustomerType;
}

export function CustomerTypeBadge({ customerType }: CustomerTypeBadgeProps) {
  const label = customerType === "InstitutionalBuyer" ? "Institutional Buyer" : "Regular";
  const variant = customerType === "InstitutionalBuyer" ? "outline" : "secondary";

  return (
    <Badge variant={variant} className="text-label-sm font-medium">
      {label}
    </Badge>
  );
}
