import React from "react";
import { Mail, BellRing, Share2, Send, Camera } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CampaignChannel } from "@/types/campaign";

interface CampaignChannelBadgeProps {
  channel: CampaignChannel;
}

export function CampaignChannelBadge({ channel }: CampaignChannelBadgeProps) {
  const getIcon = () => {
    switch (channel) {
      case "Email":
        return <Mail className="w-3 h-3 mr-1" />;
      case "InApp":
        return <BellRing className="w-3 h-3 mr-1" />;
      case "Facebook":
        return <Share2 className="w-3 h-3 mr-1" />;
      case "Twitter":
        return <Send className="w-3 h-3 mr-1" />;
      case "Instagram":
        return <Camera className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Badge variant="outline" className="text-xs py-0.5 px-2 font-normal flex items-center inline-flex">
      {getIcon()}
      {channel}
    </Badge>
  );
}
