"use client";

import React, { useState } from "react";
import { useCustomerMarketingHistory } from "@/hooks/useCustomerMarketingHistory";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MarketingInteraction } from "@/types/customer";
import { MarketingInteractionDetailDialog } from "./MarketingInteractionDetailDialog";

interface CustomerMarketingHistoryTabProps {
  customerId: string;
}

export function CustomerMarketingHistoryTab({ customerId }: CustomerMarketingHistoryTabProps) {
  const [page, setPage] = useState(1);
  const [selectedInteraction, setSelectedInteraction] = useState<MarketingInteraction | null>(null);

  const { interactions, totalPages, isLoading, error } = useCustomerMarketingHistory({
    customerId,
    page,
    pageSize: 10,
  });

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

  if (interactions.length === 0) {
    return (
      <div className="py-xl text-center text-on-surface-variant">
        <p className="text-body-sm font-medium">No marketing history found for this customer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-md">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-outline-variant text-label-sm font-bold">
            <TableHead>Title</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Sent At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-outline-variant">
          {interactions.map((item) => (
            <TableRow
              key={item.id}
              onClick={() => setSelectedInteraction(item)}
              className="hover:bg-surface-container-low cursor-pointer transition-colors"
            >
              <TableCell className="font-semibold text-primary">{item.title}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {item.channel}
                </Badge>
              </TableCell>
              <TableCell className="text-body-sm text-on-surface-variant">
                {item.interactionType}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {new Date(item.sentAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-xs">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <MarketingInteractionDetailDialog
        interaction={selectedInteraction}
        open={selectedInteraction !== null}
        onOpenChange={(open) => { if (!open) setSelectedInteraction(null); }}
      />
    </div>
  );
}
