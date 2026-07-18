"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MarketingInteraction } from "@/types/customer";

interface MarketingInteractionDetailDialogProps {
  interaction: MarketingInteraction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarketingInteractionDetailDialog({
  interaction,
  open,
  onOpenChange,
}: MarketingInteractionDetailDialogProps) {
  if (!interaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-outline-variant max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-md pr-6">
            <DialogTitle className="text-title-lg font-bold text-primary">
              {interaction.title}
            </DialogTitle>
            <Badge variant="outline" className="text-xs uppercase">
              {interaction.channel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-md pt-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground pb-sm border-b border-outline-variant">
            <span>Type: <strong className="text-primary font-medium">{interaction.interactionType}</strong></span>
            <span>Sent At: <strong className="text-primary font-medium">{new Date(interaction.sentAt).toLocaleString()}</strong></span>
          </div>

          <div className="space-y-xs">
            <h4 className="text-label-sm font-semibold text-primary">Description / Payload</h4>
            <p className="text-body-sm text-on-surface p-md bg-surface-container-low rounded-lg border border-outline-variant whitespace-pre-wrap">
              {interaction.description || "No description payload logged."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
