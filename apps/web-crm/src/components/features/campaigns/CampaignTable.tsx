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
    <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
      <CardHeader className="pb-6 p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md border-b border-outline-variant">
        <CardTitle className="text-title-lg font-bold text-primary">Campaign Audit Log</CardTitle>
        <div className="flex items-center gap-md">
          <div className="flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant focus-within:border-primary transition-all w-full max-w-sm">
            <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
            <Input
              className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-xs border border-outline-variant rounded-lg p-0.5 bg-surface-container shrink-0">
            {["All", "Active", "Scheduled", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => onStatusFilterChange(status)}
                className={`px-sm py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === status
                    ? "bg-surface-container-lowest text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-lg pt-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant text-label-sm font-bold text-on-surface-variant">
              <th className="py-md pr-md">Campaign ID</th>
              <th className="py-md px-md">Campaign Name</th>
              <th className="py-md px-md">Status</th>
              <th className="py-md px-md">Budget ($)</th>
              <th className="py-md px-md">Spent ($)</th>
              <th className="py-md px-md">Conversion Rate</th>
              <th className="py-md pl-md text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-lg text-center text-on-surface-variant">
                  No campaigns found matching filter settings.
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-md pr-md font-mono text-xs font-semibold text-primary">{c.id}</td>
                  <td className="py-md px-md font-semibold text-primary">{c.name}</td>
                  <td className="py-md px-md">
                    <Badge
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-none shadow-none ${
                        c.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : c.status === "Scheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {c.status}
                    </Badge>
                  </td>
                  <td className="py-md px-md font-medium text-primary">${c.budget.toLocaleString()}</td>
                  <td className="py-md px-md text-on-surface-variant">${c.spent.toLocaleString()}</td>
                  <td className="py-md px-md">
                    <div className="flex items-center gap-sm">
                      <span className="w-10 text-xs font-semibold">{c.conversion}%</span>
                      <div className="flex-1 w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${c.conversion * 5}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-md pl-md text-right">
                    {c.status === "Scheduled" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs flex items-center gap-xs ml-auto cursor-pointer"
                        onClick={() => onStartCampaign(c.id)}
                      >
                        <Play className="w-3 h-3 text-on-surface-variant" />
                        Launch Now
                      </Button>
                    ) : (
                      <span className="text-xs text-on-surface-variant italic font-sans flex items-center justify-end gap-xs py-1">
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
