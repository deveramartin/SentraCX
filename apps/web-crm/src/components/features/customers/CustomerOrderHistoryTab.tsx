"use client";

import React, { useState } from "react";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderHistory } from "@/types/customer";
import { OrderDetailDialog } from "./OrderDetailDialog";

interface CustomerOrderHistoryTabProps {
  customerId: string;
}

export function CustomerOrderHistoryTab({ customerId }: CustomerOrderHistoryTabProps) {
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const { orders, isLoading, error } = useCustomerOrders(customerId);

  if (isLoading) {
    return (
      <div className="space-y-sm py-md">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-md text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-xl text-center text-on-surface-variant">
        <p className="text-body-sm font-medium">No orders found for this customer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-outline-variant text-label-sm font-bold">
            <TableHead>Order Number</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ordered At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-outline-variant">
          {orders.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => setSelectedOrder(item)}
              className="hover:bg-surface-container-low cursor-pointer transition-colors"
            >
              <TableCell className="font-semibold text-primary">{item.orderNumber}</TableCell>
              <TableCell className="font-medium text-primary">
                ${item.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {new Date(item.orderedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <OrderDetailDialog
        order={selectedOrder}
        open={selectedOrder !== null}
        onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}
      />
    </div>
  );
}
