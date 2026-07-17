import { auth } from "@/auth";
import {
  Ticket,
  Clock,
  TrendingDown,
  UserCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default async function Home() {
  const session = await auth();

  const metrics = [
    { name: "Active Tickets", value: "14", change: "+12%", trend: "up", icon: Ticket },
    { name: "Avg Response Time", value: "12m", change: "-2m", trend: "down", icon: Clock },
    { name: "Churn Risk Score", value: "2.4%", change: "Low Churn", trend: "down", icon: TrendingDown },
    { name: "CLV Average", value: "$4,250", change: "+8.4%", trend: "up", icon: UserCheck },
  ];

  const recentTickets = [
    { id: "TCK-1024", customer: "Olivia Vance", issue: "API Integration Error", priority: "High", time: "10 mins ago" },
    { id: "TCK-1023", customer: "Jackson Reed", issue: "Billing Query & Refund", priority: "Medium", time: "45 mins ago" },
    { id: "TCK-1022", customer: "Amara Okoro", issue: "Account Lockout", priority: "High", time: "1 hour ago" },
    { id: "TCK-1021", customer: "Liam Anderson", issue: "Feature Request: Export PDF", priority: "Low", time: "3 hours ago" },
  ];

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Welcome Banner */}
      <div className="space-y-sm">
        <h1 className="text-display-sm font-bold tracking-tight text-primary">
          Welcome back, {session?.user?.name ?? "Administrator"}
        </h1>
        <p className="text-body-md text-on-surface-variant max-w-2xl">
          Here is the current operational overview for SentraCX. Real-time updates are enabled.
        </p>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.name} 
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between transition-all hover:border-primary duration-300"
            >
              <div className="flex justify-between items-start">
                <span className="text-label-md text-on-surface-variant font-medium">{metric.name}</span>
                <div className="p-2 bg-surface-container rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="mt-lg">
                <span className="text-display-sm font-bold text-primary">{metric.value}</span>
                <div className="flex items-center gap-xs mt-sm text-body-sm">
                  {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-primary" />}
                  {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-secondary" />}
                  {metric.trend === "stable" && <AlertCircle className="w-4 h-4 text-on-surface-variant" />}
                  <span className={metric.trend === "up" ? "text-primary font-medium" : "text-on-surface-variant"}>
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary section: Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Tickets Panel */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
          <div className="flex justify-between items-center mb-lg">
            <h3 className="text-title-lg font-bold text-primary">Recent Tickets</h3>
            <button className="text-label-md font-medium text-on-surface-variant hover:text-primary flex items-center gap-xs group transition-colors cursor-pointer">
              View all 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="flex-1 divide-y divide-outline-variant">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="py-md first:pt-0 last:pb-0 flex items-center justify-between hover:bg-surface-container-low px-sm transition-colors rounded-lg">
                <div className="space-y-xs">
                  <div className="flex items-center gap-sm">
                    <span className="text-label-sm font-bold text-primary bg-surface-container px-sm py-0.5 rounded-sm">
                      {ticket.id}
                    </span>
                    <span className="text-label-md font-semibold text-primary">{ticket.customer}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant font-medium">{ticket.issue}</p>
                </div>
                <div className="text-right space-y-xs">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    ticket.priority === "High" 
                      ? "bg-red-100 text-red-800" 
                      : ticket.priority === "Medium"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-zinc-100 text-zinc-800"
                  }`}>
                    {ticket.priority}
                  </span>
                  <p className="text-[11px] text-on-surface-variant font-mono">{ticket.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
          <div className="space-y-lg">
            <h3 className="text-title-lg font-bold text-primary">Quick Operations</h3>
            <p className="text-body-sm text-on-surface-variant">
              Perform administrative actions quickly using the design system's action definitions.
            </p>
            <div className="space-y-sm">
              {/* Primary action */}
              <button className="w-full flex items-center justify-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer">
                <Plus className="w-4 h-4" />
                Create New Ticket
              </button>
              
              {/* Secondary action */}
              <button className="w-full flex items-center justify-center gap-sm px-md py-sm border border-outline-variant text-primary hover:bg-surface-container transition-colors font-medium rounded-lg text-label-md cursor-pointer">
                Launch Campaign
              </button>

              {/* Ghost action */}
              <button className="w-full flex items-center justify-center gap-sm px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-medium rounded-lg text-label-md cursor-pointer">
                Configure SSO Gateway
              </button>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-lg mt-lg flex items-center gap-sm text-[11px] text-on-surface-variant font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Live: Client Gateway SSO Active
          </div>
        </div>
      </div>
    </div>
  );
}
