"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { OrderHistory } from "@/types/customer";

interface OrderDetailDialogProps {
  order: OrderHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-outline-variant max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between gap-md pr-6">
            <DialogTitle className="text-title-lg font-bold text-primary">
              Order {order.orderNumber}
            </DialogTitle>
            <Badge variant="outline" className="text-xs uppercase">
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-md pt-xs">
          <div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg border border-outline-variant">
            <span className="text-body-sm text-on-surface-variant font-medium">Total Amount</span>
            <span className="text-title-lg font-bold text-primary">
              ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Ordered At: <strong className="text-primary font-medium">{new Date(order.orderedAt).toLocaleString()}</strong>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
