import React from "react";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/types/ticket";

interface TicketStatusBadgeProps {
  status: TicketStatus | string;
}

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "Unclaimed":
      case "Pending":
        return "bg-badge-warning text-badge-warning-foreground border-transparent";
      case "Claimed":
      case "Ongoing":
        return "bg-badge-info text-badge-info-foreground border-transparent";
      case "Completed":
        return "bg-badge-success text-badge-success-foreground border-transparent";
      case "Canceled":
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
