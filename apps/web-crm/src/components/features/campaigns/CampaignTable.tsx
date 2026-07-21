"use client";

import React, { useState } from "react";
import { Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CampaignListItem } from "@/types/campaign";
import { CampaignChannelBadge } from "./CampaignChannelBadge";
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
    <Card className="bg-card border-border rounded-xl flex flex-col shadow-none">
      <CardHeader className="pb-4 p-md sm:p-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md border-b border-border">
        <CardTitle className="text-title-lg font-bold text-foreground">Campaign Audit Log</CardTitle>
        <div className="flex items-center bg-muted/50 rounded-full px-md py-1 border border-border focus-within:border-primary transition-all w-full sm:max-w-xs">
          <Search className="text-muted-foreground w-4 h-4 mr-sm shrink-0" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-body-sm p-0 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {isLoading ? (
          <div className="py-12 text-center text-body-sm text-muted-foreground">Loading campaigns...</div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="py-12 text-center text-body-sm text-muted-foreground">No campaigns found in this view.</div>
        ) : (
          <table className="w-full text-left text-body-sm border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground text-label-sm font-semibold">
                <th className="py-md px-lg">Title</th>
                <th className="py-md px-lg">Channels</th>
                <th className="py-md px-lg">Status</th>
                <th className="py-md px-lg">Created At</th>
                <th className="py-md px-lg text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-md px-lg font-medium text-foreground">{c.title}</td>
                  <td className="py-md px-lg">
                    <div className="flex flex-wrap gap-1">
                      {c.channels.map((ch) => (
                        <CampaignChannelBadge key={ch} channel={ch} />
                      ))}
                    </div>
                  </td>
                  <td className="py-md px-lg">
                    <Badge variant={c.status === "Active" ? "default" : c.status === "Draft" ? "outline" : "secondary"}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-md px-lg text-muted-foreground text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-md px-lg text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCampaignId(c.id)}>
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
