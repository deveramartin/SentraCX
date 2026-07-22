import React from "react";
import { Badge } from "@/components/ui/badge";
import { CampaignStatus } from "@/types/campaign";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const getStyle = () => {
    switch (status) {
      case "Active":
        return "bg-badge-success text-badge-success-foreground border-transparent";
      case "Draft":
        return "bg-badge-warning text-badge-warning-foreground border-transparent";
      case "Ended":
        return "bg-muted text-muted-foreground border-transparent";
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
