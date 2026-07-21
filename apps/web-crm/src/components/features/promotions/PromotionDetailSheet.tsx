"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePromotion } from "@/hooks/usePromotion";
import { crmClient } from "@/lib/api/crm-client";
import { PromotionTypeBadge } from "./PromotionTypeBadge";
import { PromotionStatusBadge } from "./PromotionStatusBadge";

interface PromotionDetailSheetProps {
  promotionId: string | null;
  onClose: () => void;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export function PromotionDetailSheet({ promotionId, onClose, onRefresh, onShowToast }: PromotionDetailSheetProps) {
  const { data: promotion, isLoading } = usePromotion(promotionId);

  if (!promotionId) return null;

  const handleCancel = async () => {
    try {
      await crmClient.promotions.cancel(promotionId);
      onShowToast("Promotion has been cancelled.");
      onRefresh();
      onClose();
    } catch {
      onShowToast("Failed to cancel promotion.");
    }
  };

  return (
    <Dialog open={!!promotionId} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[80vw] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg sm:rounded-xl">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-xl font-bold">{promotion?.title ?? "Promotion Details"}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Type: {promotion?.promotionType}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">Loading details...</div>
        ) : promotion ? (
          <div className="space-y-4 py-2 text-sm">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <span className="text-muted-foreground font-medium">Status</span>
              <PromotionStatusBadge status={promotion.status} />
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Promotion Type</span>
              <PromotionTypeBadge type={promotion.promotionType} />
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium block">Description</span>
              <p className="bg-muted/30 p-2.5 rounded text-xs text-foreground whitespace-pre-wrap">
                {promotion.description}
              </p>
            </div>

            {promotion.discountValue != null && (
              <div className="flex justify-between text-xs py-1 border-t border-border">
                <span className="text-muted-foreground font-medium">Discount Value</span>
                <span className="font-semibold text-foreground">{promotion.discountValue}</span>
              </div>
            )}

            {promotion.voucherCode && (
              <div className="flex justify-between text-xs py-1 border-t border-border">
                <span className="text-muted-foreground font-medium">Voucher Code</span>
                <span className="font-mono font-semibold text-foreground">{promotion.voucherCode}</span>
              </div>
            )}

            {promotion.startDate && (
              <div className="flex justify-between text-xs py-1 border-t border-border">
                <span className="text-muted-foreground font-medium">Start Date</span>
                <span>{new Date(promotion.startDate).toLocaleString()}</span>
              </div>
            )}

            {promotion.endDate && (
              <div className="flex justify-between text-xs py-1 border-t border-border">
                <span className="text-muted-foreground font-medium">End Date</span>
                <span>{new Date(promotion.endDate).toLocaleString()}</span>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-2 border-t border-border">
              {promotion.status === "Active" && (
                <Button variant="destructive" onClick={handleCancel}>
                  Cancel Promotion
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-destructive">Promotion not found.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
