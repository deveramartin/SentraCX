"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CampaignListItem } from "@/types/campaign";
import { CampaignChannelBadge } from "./CampaignChannelBadge";
import { CampaignStatusBadge } from "./CampaignStatusBadge";
import { CampaignDetailSheet } from "./CampaignDetailSheet";

interface CampaignTableProps {
  campaigns: CampaignListItem[];
  isLoading: boolean;
  onRefresh: () => void;
  onShowToast: (msg: string) => void;
}

export function CampaignTable({ campaigns, isLoading, onRefresh, onShowToast }: CampaignTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-none border-border flex flex-col">
      <CardHeader className="pb-md p-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <CardTitle className="text-title-lg font-bold text-foreground">Campaign Audit Log</CardTitle>
      </CardHeader>
      <CardContent className="py-md pt-0 overflow-x-auto">
        <div className="w-full border rounded-md border-border overflow-hidden bg-card">
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-8 p-0 text-body-sm flex-1"
              placeholder="Search campaigns by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="space-y-2 py-4 px-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="text-body-sm font-medium">No campaigns found.</p>
                <p className="text-label-sm text-muted-foreground mt-xs">
                  Try searching with a different keyword or launch a new campaign.
                </p>
              </div>
            ) : (
              <Table className="min-w-[700px] w-full text-left text-body-sm">
                <TableHeader>
                  <TableRow className="border-b border-border">
                    <TableHead className="w-[30%]">Title</TableHead>
                    <TableHead className="w-[25%]">Channels</TableHead>
                    <TableHead className="w-[15%]">Status</TableHead>
                    <TableHead className="w-[15%]">Created At</TableHead>
                    <TableHead className="w-[15%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {filteredCampaigns.map((c) => (
                    <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-semibold text-foreground">{c.title}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {c.channels.map((ch) => (
                            <CampaignChannelBadge key={ch} channel={ch} />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CampaignStatusBadge status={c.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-body-sm">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCampaignId(c.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </CardContent>

      <CampaignDetailSheet
        campaignId={selectedCampaignId}
        onClose={() => setSelectedCampaignId(null)}
        onRefresh={onRefresh}
        onShowToast={onShowToast}
      />
    </Card>
  );
}
