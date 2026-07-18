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
      <DialogContent className="max-w-lg w-[95vw] sm:w-full">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <DialogTitle className="text-lg font-bold">
              {interaction.title}
            </DialogTitle>
            <Badge variant="outline" className="text-xs uppercase">
              {interaction.channel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-1 pb-3 border-b border-border">
            <span>Type: <strong className="text-foreground font-semibold">{interaction.interactionType}</strong></span>
            <span>Sent At: <strong className="text-foreground font-semibold">{new Date(interaction.sentAt).toLocaleString()}</strong></span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description / Payload</h4>
            <p className="text-sm text-foreground p-3 bg-muted/30 rounded-lg border border-border whitespace-pre-wrap">
              {interaction.description || "No description payload logged."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
