"use client";

import React, { useState } from "react";
import {
  Ticket as TicketIcon,
  Clock,
  TrendingDown,
  UserCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TicketType {
  id: string;
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  time: string;
}

const chartData = [
  { month: "January", tickets: 186, resolved: 80 },
  { month: "February", tickets: 305, resolved: 200 },
  { month: "March", tickets: 237, resolved: 120 },
  { month: "April", tickets: 73, resolved: 190 },
  { month: "May", tickets: 209, resolved: 130 },
  { month: "June", tickets: 214, resolved: 140 },
];

const chartConfig = {
  tickets: {
    label: "Tickets Created",
    color: "var(--color-chart-1)",
  },
  resolved: {
    label: "Resolved Tickets",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function Dashboard() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: "TCK-1024", customer: "Olivia Vance", issue: "API Integration Error", priority: "High", time: "10 mins ago" },
    { id: "TCK-1023", customer: "Jackson Reed", issue: "Billing Query & Refund", priority: "Medium", time: "45 mins ago" },
    { id: "TCK-1022", customer: "Amara Okoro", issue: "Account Lockout", priority: "High", time: "1 hour ago" },
    { id: "TCK-1021", customer: "Liam Anderson", issue: "Feature Request: Export PDF", priority: "Low", time: "3 hours ago" },
  ]);

  // Form State
  const [newCustomer, setNewCustomer] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  // Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newIssue) {
      showToast("Please fill in all fields.");
      return;
    }

    const nextIdNum = Math.max(...tickets.map(t => parseInt(t.id.split("-")[1]))) + 1;
    const newTicket: TicketType = {
      id: `TCK-${nextIdNum}`,
      customer: newCustomer,
      issue: newIssue,
      priority: newPriority,
      time: "Just now"
    };

    setTickets([newTicket, ...tickets]);
    setNewCustomer("");
    setNewIssue("");
    setNewPriority("Medium");
    setIsCreateOpen(false);
    showToast(`Ticket ${newTicket.id} created successfully!`);
  };

  const highPriorityCount = tickets.filter(t => t.priority === "High").length;
  const activeCount = tickets.length;

  const metrics = [
    { name: "Active Tickets", value: activeCount.toString(), change: `+${tickets.length - 4} new`, trend: "up", icon: TicketIcon },
    { name: "High Priority Tickets", value: highPriorityCount.toString(), change: "Needs attention", trend: highPriorityCount > 2 ? "up" : "stable", icon: Clock },
    { name: "Churn Risk Score", value: "2.4%", change: "Low Churn", trend: "down", icon: TrendingDown },
    { name: "CLV Average", value: "$4,250", change: "+8.4%", trend: "up", icon: UserCheck },
  ];

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Page Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md border-b border-border pb-lg">
        <div className="space-y-sm">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="outline" size="sm" className="h-9 flex items-center gap-xs text-xs font-semibold cursor-pointer">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Jan 01, 2026 - Jun 30, 2026
          </Button>
          <Button size="sm" className="h-9 bg-primary text-primary-foreground hover:bg-neutral-800 transition-colors font-medium rounded-lg text-xs cursor-pointer px-4" onClick={() => showToast("Downloading CSV reports...")}>
            Download Report
          </Button>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card 
              key={metric.name} 
              className="bg-card border-border rounded-xl flex flex-col justify-between transition-all hover:border-primary duration-300 shadow-none animate-in fade-in"
            >
              <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
                <span className="text-label-md text-muted-foreground font-medium">{metric.name}</span>
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
              </CardHeader>
              <CardContent className="p-lg pt-0 mt-lg">
                <span className="text-display-sm font-bold text-foreground">{metric.value}</span>
                <div className="flex items-center gap-xs mt-sm text-body-sm">
                  {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-emerald-600" />}
                  {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-rose-600" />}
                  {metric.trend === "stable" && <AlertCircle className="w-4 h-4 text-muted-foreground" />}
                  <span className={metric.trend === "up" ? "text-emerald-600 font-medium" : "text-muted-foreground"}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Main Grid: Chart + Recent Tickets list */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-lg">
        {/* Area Chart Section (col-span 4) */}
        <Card className="lg:col-span-4 bg-card border-border rounded-xl shadow-none">
          <CardHeader>
            <CardTitle className="text-title-lg font-bold text-foreground">Support Operations Trend</CardTitle>
            <p className="text-body-sm text-muted-foreground">
              Monthly summary of logged support tickets vs resolved tickets.
            </p>
          </CardHeader>
          <CardContent className="pb-4">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} className="stroke-border" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                  className="fill-muted-foreground text-xs"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="resolved"
                  type="natural"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.4}
                  stroke="var(--color-chart-2)"
                  stackId="a"
                />
                <Area
                  dataKey="tickets"
                  type="natural"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.4}
                  stroke="var(--color-chart-1)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Tickets Panel (col-span 3) */}
        <Card className="lg:col-span-3 bg-card border-border rounded-xl flex flex-col shadow-none">
          <CardHeader className="flex flex-row justify-between items-center pb-6 p-lg">
            <div className="space-y-xs">
              <CardTitle className="text-title-lg font-bold text-foreground">Recent Tickets</CardTitle>
              <p className="text-body-sm text-muted-foreground">You have {tickets.length} active tickets</p>
            </div>
            <Button variant="ghost" size="sm" className="text-label-md font-medium text-muted-foreground hover:text-foreground flex items-center gap-xs group transition-colors cursor-pointer">
              View all 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 divide-y divide-border p-lg pt-0">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-md first:pt-0 last:pb-0 flex items-center justify-between hover:bg-muted/50 px-sm transition-colors rounded-lg">
                <div className="space-y-xs overflow-hidden max-w-[70%]">
                  <div className="flex items-center gap-sm">
                    <Badge variant="secondary" className="text-label-sm font-bold text-foreground bg-muted px-sm py-0.5 rounded-sm shadow-none">
                      {ticket.id}
                    </Badge>
                    <span className="text-label-md font-semibold text-foreground truncate">{ticket.customer}</span>
                  </div>
                  <p className="text-body-sm text-muted-foreground font-medium truncate">{ticket.issue}</p>
                </div>
                <div className="text-right space-y-xs shrink-0">
                  <Badge className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none border-none ${
                    ticket.priority === "High" 
                      ? "bg-red-100 text-red-800 hover:bg-red-100" 
                      : ticket.priority === "Medium"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : "bg-zinc-100 text-zinc-800 hover:bg-zinc-100"
                  }`}>
                    {ticket.priority}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground font-mono">{ticket.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom section: Quick Actions */}
      <Card className="bg-card border-border rounded-xl flex flex-col md:flex-row justify-between items-center shadow-none p-lg gap-md border">
        <div className="space-y-xs">
          <CardTitle className="text-title-lg font-bold text-foreground">Quick Operations</CardTitle>
          <p className="text-body-sm text-muted-foreground">
            Perform administrative tasks, launch campaigns, or trigger security portal updates.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-sm">
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer py-2 px-4">
                <Plus className="w-4 h-4 mr-sm" />
                Create New Ticket
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-border w-[400px] sm:w-[540px]">
              <SheetHeader className="pb-lg">
                <SheetTitle className="text-headline-md font-bold text-foreground">Create Support Ticket</SheetTitle>
                <SheetDescription className="text-body-sm text-muted-foreground">
                  Submit a support query. It will immediately populate on the active system log.
                </SheetDescription>
              </SheetHeader>
              <form onSubmit={handleCreateTicket} className="space-y-lg mt-lg">
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">Customer Name</label>
                  <Input 
                    placeholder="e.g. Olivia Vance" 
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">Support Issue</label>
                  <Input 
                    placeholder="e.g. Database connectivity failed" 
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">Priority</label>
                  <div className="flex gap-sm">
                    {(["High", "Medium", "Low"] as const).map((p) => (
                      <Button
                        type="button"
                        key={p}
                        variant={newPriority === p ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setNewPriority(p)}
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="pt-xl">
                  <Button type="submit" className="w-full bg-primary hover:bg-neutral-800 text-primary-foreground">
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>

          <Button 
            variant="outline" 
            className="border border-border text-foreground hover:bg-muted transition-colors font-medium rounded-lg text-label-md cursor-pointer"
            onClick={() => showToast("Marketing Campaign launched successfully!")}
          >
            Launch Campaign
          </Button>

          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors font-medium rounded-lg text-label-md cursor-pointer"
            onClick={() => showToast("SSO Configuration settings fetched.")}
          >
            Configure SSO Gateway
          </Button>
        </div>
      </Card>
    </div>
  );
}
