import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerType } from "@/types/customer";

interface CustomerTypeBadgeProps {
  customerType: CustomerType;
}

export function CustomerTypeBadge({ customerType }: CustomerTypeBadgeProps) {
  let label = "Regular";
  let variant: "default" | "secondary" | "outline" | "destructive" | "info" | "warning" | "success" | "notification" = "secondary";

  switch (customerType) {
    case "InstitutionalBuyer":
      label = "Institutional Buyer";
      variant = "info";
      break;
    case "VIP":
      label = "VIP";
      variant = "warning";
      break;
    case "Lead":
      label = "Lead";
      variant = "default";
      break;
    default:
      label = "Regular";
      variant = "secondary";
      break;
  }

  return (
    <Badge variant={variant} className="text-label-sm font-medium">
      {label}
    </Badge>
  );
}
