import React from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerType } from "@/types/customer";

interface CustomerTypeBadgeProps {
  customerType: CustomerType;
}

export function CustomerTypeBadge({ customerType }: CustomerTypeBadgeProps) {
  const label = customerType === "InstitutionalBuyer" ? "Institutional Buyer" : "Regular";
  const style =
    customerType === "InstitutionalBuyer"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300"
      : "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300";

  return (
    <Badge
      className={`text-[11px] font-medium px-2 py-0.5 rounded-md shadow-none border-none ${style}`}
    >
      {label}
    </Badge>
  );
}
