import {
  Ticket as TicketIcon,
  Clock,
  TrendingDown,
  UserCheck,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricItem {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  icon: React.ElementType;
}

interface DashboardMetricCardsProps {
  activeCount: number;
  highPriorityCount: number;
  newTicketsDelta: number;
}

export function DashboardMetricCards({
  activeCount,
  highPriorityCount,
  newTicketsDelta,
}: DashboardMetricCardsProps) {
  const metrics: MetricItem[] = [
    {
      name: "Active Tickets",
      value: activeCount.toString(),
      change: `+${newTicketsDelta} new`,
      trend: "up",
      icon: TicketIcon,
    },
    {
      name: "High Priority Tickets",
      value: highPriorityCount.toString(),
      change: "Needs attention",
      trend: highPriorityCount > 2 ? "up" : "stable",
      icon: Clock,
    },
    {
      name: "Churn Risk Score",
      value: "2.4%",
      change: "Low Churn",
      trend: "down",
      icon: TrendingDown,
    },
    {
      name: "CLV Average",
      value: "$4,250",
      change: "+8.4%",
      trend: "up",
      icon: UserCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.name}
            className="bg-card border-border rounded-xl flex flex-col justify-between transition-all hover:border-primary duration-300 shadow-none animate-in fade-in"
          >
            <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
              <span className="text-label-md text-muted-foreground font-medium">
                {metric.name}
              </span>
              <div className="p-2 bg-muted rounded-lg">
                <Icon className="w-5 h-5 text-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-lg pt-0 mt-lg">
              <span className="text-display-sm font-bold text-foreground">
                {metric.value}
              </span>
              <div className="flex items-center gap-xs mt-sm text-body-sm">
                {metric.trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                )}
                {metric.trend === "down" && (
                  <TrendingDown className="w-4 h-4 text-rose-600" />
                )}
                {metric.trend === "stable" && (
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                )}
                <span
                  className={
                    metric.trend === "up"
                      ? "text-emerald-600 font-medium"
                      : "text-muted-foreground"
                  }
                >
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
