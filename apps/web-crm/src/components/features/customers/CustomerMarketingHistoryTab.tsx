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
      <div className="space-y-2 py-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
        {error}
      </div>
    );
  }

  if (interactions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-sm font-medium">No marketing history found for this customer.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-x-auto border rounded-md border-border">
        <Table className="min-w-[500px] w-full text-left text-sm">
          <TableHeader>
            <TableRow className="border-b border-border">
              <TableHead>Title</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sent At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border">
            {interactions.map((item) => (
              <TableRow
                key={item.id}
                onClick={() => setSelectedInteraction(item)}
                className="hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <TableCell className="font-semibold text-foreground">{item.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {item.channel}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs sm:text-sm">
                  {item.interactionType}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {new Date(item.sentAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground order-2 sm:order-1">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex-1 sm:flex-none"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex-1 sm:flex-none"
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
