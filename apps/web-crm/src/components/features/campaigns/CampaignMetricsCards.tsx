import { Megaphone, DollarSign, TrendingUp, Percent } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface CampaignMetricsCardsProps {
  activeCount: number;
  totalBudget: number;
  totalSpent: number;
  avgConversion: number;
}

export function CampaignMetricsCards({
  activeCount,
  totalBudget,
  totalSpent,
  avgConversion,
}: CampaignMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-md">
      <Card className="bg-surface-container-lowest border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-on-surface-variant font-medium">Active Outreaches</span>
          <Megaphone className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-primary">{activeCount}</span>
          <p className="text-[11px] text-on-surface-variant mt-sm">Live campaigns</p>
        </CardContent>
      </Card>

      <Card className="bg-surface-container-lowest border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-on-surface-variant font-medium">Total Budget</span>
          <DollarSign className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-primary">${totalBudget.toLocaleString()}</span>
          <p className="text-[11px] text-on-surface-variant mt-sm">Approved funding</p>
        </CardContent>
      </Card>

      <Card className="bg-surface-container-lowest border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-on-surface-variant font-medium">Total Spent</span>
          <TrendingUp className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-primary">${totalSpent.toLocaleString()}</span>
          <p className="text-[11px] text-on-surface-variant mt-sm">Funds utilized</p>
        </CardContent>
      </Card>

      <Card className="bg-surface-container-lowest border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-on-surface-variant font-medium">Conversion Rate</span>
          <Percent className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-primary">{avgConversion.toFixed(1)}%</span>
          <p className="text-[11px] text-on-surface-variant mt-sm">Average conversion</p>
        </CardContent>
      </Card>
    </div>
  );
}
