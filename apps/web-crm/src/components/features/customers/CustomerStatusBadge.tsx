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
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400";
      case "Inactive":
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300";
      case "Suspended":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  return (
    <Badge
      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none border-none ${getStyle()}`}
    >
      {status}
    </Badge>
  );
}
