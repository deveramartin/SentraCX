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
      <Card className="bg-card border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-muted-foreground font-medium">Active Outreaches</span>
          <Megaphone className="w-5 h-5 text-foreground" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-foreground">{activeCount}</span>
          <p className="text-label-sm text-muted-foreground mt-sm">Live campaigns</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-muted-foreground font-medium">Total Budget</span>
          <DollarSign className="w-5 h-5 text-foreground" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-foreground">${totalBudget.toLocaleString()}</span>
          <p className="text-label-sm text-muted-foreground mt-sm">Approved funding</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-muted-foreground font-medium">Total Spent</span>
          <TrendingUp className="w-5 h-5 text-foreground" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-foreground">${totalSpent.toLocaleString()}</span>
          <p className="text-label-sm text-muted-foreground mt-sm">Funds utilized</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border rounded-xl flex flex-col justify-between shadow-none">
        <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
          <span className="text-label-md text-muted-foreground font-medium">Conversion Rate</span>
          <Percent className="w-5 h-5 text-foreground" />
        </CardHeader>
        <CardContent className="p-lg pt-0">
          <span className="text-display-sm font-bold text-foreground">{avgConversion.toFixed(1)}%</span>
          <p className="text-label-sm text-muted-foreground mt-sm">Average conversion</p>
        </CardContent>
      </Card>
    </div>
  );
}
