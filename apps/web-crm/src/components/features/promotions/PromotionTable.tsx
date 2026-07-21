"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PromotionListItem } from "@/types/promotion";
import { PromotionTypeBadge } from "./PromotionTypeBadge";
import { PromotionStatusBadge } from "./PromotionStatusBadge";
import { PromotionDetailSheet } from "./PromotionDetailSheet";

interface PromotionTableProps {
  promotions: PromotionListItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export function PromotionTable({ promotions, isLoading, onRefresh, onShowToast }: PromotionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  const filteredPromotions = promotions.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-card border-border rounded-xl flex flex-col shadow-none">
      <CardHeader className="pb-4 p-md sm:p-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md border-b border-border">
        <CardTitle className="text-title-lg font-bold text-foreground">Promotions Log</CardTitle>
        <div className="flex items-center bg-muted/50 rounded-full px-md py-1 border border-border focus-within:border-primary transition-all w-full sm:max-w-xs">
          <Search className="text-muted-foreground w-4 h-4 mr-sm shrink-0" />
          <Input
            type="text"
            placeholder="Search promotions..."
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-body-sm p-0 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center text-body-sm text-muted-foreground">Loading promotions...</div>
        ) : filteredPromotions.length === 0 ? (
          <div className="py-12 text-center text-body-sm text-muted-foreground">No promotions found in this view.</div>
        ) : (
          <table className="w-full text-left text-body-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground text-label-sm font-semibold">
                <th className="py-md px-lg">Title</th>
                <th className="py-md px-lg">Type</th>
                <th className="py-md px-lg">Status</th>
                <th className="py-md px-lg">Discount Value</th>
                <th className="py-md px-lg">End Date</th>
                <th className="py-md px-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPromotions.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-md px-lg font-medium text-foreground">{p.title}</td>
                  <td className="py-md px-lg"><PromotionTypeBadge type={p.promotionType} /></td>
                  <td className="py-md px-lg"><PromotionStatusBadge status={p.status} /></td>
                  <td className="py-md px-lg font-mono text-xs">{p.discountValue ?? "—"}</td>
                  <td className="py-md px-lg text-muted-foreground text-xs">
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-md px-lg text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPromotionId(p.id)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>

      <PromotionDetailSheet
        promotionId={selectedPromotionId}
        onClose={() => setSelectedPromotionId(null)}
        onRefresh={onRefresh}
        onShowToast={onShowToast}
      />
    </Card>
  );
}
