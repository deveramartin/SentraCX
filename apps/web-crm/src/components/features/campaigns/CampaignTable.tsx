import { Search, Play, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Campaign } from "./types";

interface CampaignTableProps {
  campaigns: Campaign[];
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onStartCampaign: (campaignId: string) => void;
}

export function CampaignTable({
  campaigns,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onStartCampaign,
}: CampaignTableProps) {
  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="bg-card border-border rounded-xl flex flex-col shadow-none">
      <CardHeader className="pb-6 p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md border-b border-border">
        <CardTitle className="text-title-lg font-bold text-foreground">Campaign Audit Log</CardTitle>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-md w-full md:w-auto">
          <div className="flex items-center bg-muted/50 rounded-full px-md py-1 border border-border focus-within:border-primary transition-all w-full sm:w-64">
            <Search className="text-muted-foreground w-4 h-4 mr-sm shrink-0" />
            <Input
              className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-xs border border-border rounded-lg p-0.5 bg-muted">
            {["All", "Active", "Scheduled", "Completed"].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "secondary" : "ghost"}
                onClick={() => onStatusFilterChange(status)}
                className={`h-7 px-2.5 sm:px-3 text-label-sm font-semibold flex-1 sm:flex-none ${
                  statusFilter === status ? "shadow-sm font-bold" : "text-muted-foreground"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-lg pt-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border text-label-sm font-bold text-muted-foreground">
              <th className="py-md pr-md">Campaign ID</th>
              <th className="py-md px-md">Campaign Name</th>
              <th className="py-md px-md">Status</th>
              <th className="py-md px-md">Budget ($)</th>
              <th className="py-md px-md">Spent ($)</th>
              <th className="py-md px-md">Conversion Rate</th>
              <th className="py-md pl-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-lg text-center text-muted-foreground">
                  No campaigns found matching filter settings.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="py-md pr-md font-mono text-label-sm font-semibold text-foreground">{c.id}</td>
                  <td className="py-md px-md font-semibold text-foreground">{c.name}</td>
                  <td className="py-md px-md">
                    <Badge
                      variant={
                        c.status === "Active"
                          ? "success"
                          : c.status === "Scheduled"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-label-sm font-bold"
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-md px-md font-medium text-foreground">${c.budget.toLocaleString()}</td>
                  <td className="py-md px-md text-muted-foreground">${c.spent.toLocaleString()}</td>
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <span className="w-10 text-label-sm font-semibold">{c.conversion}%</span>
                      <div className="flex-1 w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${c.conversion * 5}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-md pl-md text-right">
                    {c.status === "Scheduled" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => onStartCampaign(c.id)}
                      >
                        <Play />
                        Launch Now
                      </Button>
                    ) : (
                      <span className="text-label-sm text-muted-foreground italic font-sans flex items-center justify-end gap-xs py-1">
                        <Award className="w-3 h-3" />
                        Logged
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
