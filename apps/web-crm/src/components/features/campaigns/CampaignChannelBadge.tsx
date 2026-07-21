import React from "react";
import { Mail, BellRing, Share2, Send, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CampaignChannel } from "@/types/campaign";

interface CampaignChannelBadgeProps {
  channel: CampaignChannel;
}

export function CampaignChannelBadge({ channel }: CampaignChannelBadgeProps) {
  const getStyle = () => {
    switch (channel) {
      case "Email":
        return {
          icon: <Mail className="w-3 h-3 mr-1 shrink-0" />,
          className: "bg-badge-info text-badge-info-foreground border-transparent font-medium",
        };
      case "InApp":
        return {
          icon: <BellRing className="w-3 h-3 mr-1 shrink-0" />,
          className: "bg-badge-warning text-badge-warning-foreground border-transparent font-medium",
        };
      case "Facebook":
        return {
          icon: <Share2 className="w-3 h-3 mr-1 shrink-0" />,
          className: "bg-badge-indigo text-badge-indigo-foreground border-transparent font-medium",
        };
      case "Twitter":
        return {
          icon: <Send className="w-3 h-3 mr-1 shrink-0" />,
          className: "bg-badge-teal text-badge-teal-foreground border-transparent font-medium",
        };
      case "Instagram":
        return {
          icon: <Camera className="w-3 h-3 mr-1 shrink-0" />,
          className: "bg-badge-purple text-badge-purple-foreground border-transparent font-medium",
        };
      default:
        return {
          icon: null,
          className: "bg-muted text-muted-foreground border-transparent font-medium",
        };
    }
  };

  const { icon, className } = getStyle();

  return (
    <Badge className={`text-xs py-0.5 px-2 flex items-center inline-flex border-none shadow-none ${className}`}>
      {icon}
      {channel}
    </Badge>
  );
}
