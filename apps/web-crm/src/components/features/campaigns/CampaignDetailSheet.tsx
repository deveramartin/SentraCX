"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCampaign } from "@/hooks/useCampaign";
import { crmClient } from "@/lib/api/crm-client";
import { CampaignChannelBadge } from "./CampaignChannelBadge";

interface CampaignDetailSheetProps {
  campaignId: string | null;
  onClose: () => void;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export function CampaignDetailSheet({ campaignId, onClose, onRefresh, onShowToast }: CampaignDetailSheetProps) {
  const { data: campaign, isLoading } = useCampaign(campaignId);

  if (!campaignId) return null;

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await crmClient.campaigns.updateStatus(campaignId, newStatus);
      onShowToast(`Campaign status changed to ${newStatus}.`);
      onRefresh();
      onClose();
    } catch {
      onShowToast("Failed to update campaign status.");
    }
  };

  return (
    <Dialog open={!!campaignId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[100vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold">{campaign?.title ?? "Campaign Details"}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Subject: {campaign?.subject}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading campaign details...</div>
        ) : campaign ? (
          <div className="space-y-4 py-2 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Status</span>
              <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                {campaign.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Target Channels</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {campaign.channels.map((ch) => (
                  <CampaignChannelBadge key={ch} channel={ch} />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Description</span>
              <p className="bg-muted/30 p-2.5 rounded text-xs text-foreground whitespace-pre-wrap">
                {campaign.description}
              </p>
            </div>

            {campaign.imageUrl && (
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium block">Banner Image</span>
                <img src={campaign.imageUrl} alt="Campaign banner" className="w-full h-36 object-cover rounded-md border" />
              </div>
            )}

            {campaign.schedule && (
              <div className="space-y-1 bg-muted/20 p-2.5 rounded border border-border text-xs">
                <span className="font-semibold block mb-1">Schedule Strategy ({campaign.schedule.scheduleType})</span>
                {campaign.schedule.recurrenceDays && campaign.schedule.recurrenceDays.length > 0 && (
                  <div>Days: {campaign.schedule.recurrenceDays.join(", ")}</div>
                )}
                {campaign.schedule.startDate && <div>Start: {new Date(campaign.schedule.startDate).toLocaleString()}</div>}
                {campaign.schedule.endDate && <div>End: {new Date(campaign.schedule.endDate).toLocaleString()}</div>}
              </div>
            )}

            {campaign.promotions && campaign.promotions.length > 0 && (
              <div className="space-y-1">
                <span className="text-muted-foreground font-medium block">Attached Promotions</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {campaign.promotions.map((p) => (
                    <Badge key={p.id} variant="outline" className="text-xs">
                      {p.title} ({p.promotionType})
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              {campaign.status === "Draft" && (
                <Button onClick={() => handleUpdateStatus("Active")}>
                  Activate Campaign
                </Button>
              )}
              {campaign.status === "Active" && (
                <Button variant="destructive" onClick={() => handleUpdateStatus("Ended")}>
                  End Campaign
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-destructive">Campaign not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
