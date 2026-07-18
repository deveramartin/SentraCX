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
      <DialogContent className="max-w-md w-[95vw] sm:w-full">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <DialogTitle className="text-lg font-bold">
              Order {order.orderNumber}
            </DialogTitle>
            <Badge variant="outline" className="text-xs uppercase">
              {order.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <span className="text-sm text-muted-foreground font-medium">Total Amount</span>
            <span className="text-xl font-bold text-foreground">
              ${order.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="text-xs text-muted-foreground">
            Ordered At: <strong className="text-foreground font-semibold">{new Date(order.orderedAt).toLocaleString()}</strong>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
