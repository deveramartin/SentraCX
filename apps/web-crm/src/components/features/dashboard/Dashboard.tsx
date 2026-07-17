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

interface TicketType {
  id: string;
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  time: string;
}

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
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Welcome Banner */}
      <div className="space-y-sm">
        <h1 className="text-display-sm font-bold tracking-tight text-primary">
          Operations Dashboard
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
            <Card 
              key={metric.name} 
              className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between transition-all hover:border-primary duration-300 shadow-none"
            >
              <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
                <span className="text-label-md text-on-surface-variant font-medium">{metric.name}</span>
                <div className="p-2 bg-surface-container rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent className="p-lg pt-0 mt-lg">
                <span className="text-display-sm font-bold text-primary">{metric.value}</span>
                <div className="flex items-center gap-xs mt-sm text-body-sm">
                  {metric.trend === "up" && <TrendingUp className="w-4 h-4 text-primary" />}
                  {metric.trend === "down" && <TrendingDown className="w-4 h-4 text-secondary" />}
                  {metric.trend === "stable" && <AlertCircle className="w-4 h-4 text-on-surface-variant" />}
                  <span className={metric.trend === "up" ? "text-primary font-medium" : "text-on-surface-variant"}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Secondary section: Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent Tickets Panel */}
        <Card className="lg:col-span-2 bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
          <CardHeader className="flex flex-row justify-between items-center pb-6 p-lg">
            <CardTitle className="text-title-lg font-bold text-primary">Recent Tickets</CardTitle>
            <Button variant="ghost" size="sm" className="text-label-md font-medium text-on-surface-variant hover:text-primary flex items-center gap-xs group transition-colors cursor-pointer">
              View all 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 divide-y divide-outline-variant p-lg pt-0">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="py-md first:pt-0 last:pb-0 flex items-center justify-between hover:bg-surface-container-low px-sm transition-colors rounded-lg">
                <div className="space-y-xs">
                  <div className="flex items-center gap-sm">
                    <Badge variant="secondary" className="text-label-sm font-bold text-primary bg-surface-container px-sm py-0.5 rounded-sm shadow-none">
                      {ticket.id}
                    </Badge>
                    <span className="text-label-md font-semibold text-primary">{ticket.customer}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant font-medium">{ticket.issue}</p>
                </div>
                <div className="text-right space-y-xs">
                  <Badge className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none border-none ${
                    ticket.priority === "High" 
                      ? "bg-red-100 text-red-800 hover:bg-red-100" 
                      : ticket.priority === "Medium"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : "bg-zinc-100 text-zinc-800 hover:bg-zinc-100"
                  }`}>
                    {ticket.priority}
                  </Badge>
                  <p className="text-[11px] text-on-surface-variant font-mono">{ticket.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Operations Panel */}
        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="pb-6 p-lg">
            <CardTitle className="text-title-lg font-bold text-primary">Quick Operations</CardTitle>
            <p className="text-body-sm text-on-surface-variant mt-sm">
              Perform administrative actions quickly using the design system's action definitions.
            </p>
          </CardHeader>
          <CardContent className="space-y-sm p-lg pt-0">
            {/* Primary action using Sheet for Form creation */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <SheetTrigger asChild>
                <Button className="w-full flex items-center justify-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer">
                  <Plus className="w-4 h-4" />
                  Create New Ticket
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-surface border-outline-variant w-[400px] sm:w-[540px]">
                <SheetHeader className="pb-lg">
                  <SheetTitle className="text-headline-md font-bold text-primary">Create Support Ticket</SheetTitle>
                  <SheetDescription className="text-body-sm text-on-surface-variant">
                    Submit a support query. It will immediately populate on the active system log.
                  </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleCreateTicket} className="space-y-lg mt-lg">
                  <div className="space-y-xs">
                    <label className="text-label-sm font-semibold text-primary block">Customer Name</label>
                    <Input 
                      placeholder="e.g. Olivia Vance" 
                      value={newCustomer}
                      onChange={(e) => setNewCustomer(e.target.value)}
                      className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-sm font-semibold text-primary block">Support Issue</label>
                    <Input 
                      placeholder="e.g. Database connectivity failed" 
                      value={newIssue}
                      onChange={(e) => setNewIssue(e.target.value)}
                      className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-label-sm font-semibold text-primary block">Priority</label>
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
                    <Button type="submit" className="w-full bg-primary hover:bg-neutral-800 text-on-primary">
                      Submit Ticket
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
            
            {/* Secondary action */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-sm px-md py-sm border border-outline-variant text-primary hover:bg-surface-container transition-colors font-medium rounded-lg text-label-md cursor-pointer"
              onClick={() => showToast("Marketing Campaign launched successfully!")}
            >
              Launch Campaign
            </Button>

            {/* Ghost action */}
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-center gap-sm px-md py-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors font-medium rounded-lg text-label-md cursor-pointer"
              onClick={() => showToast("SSO Configuration settings fetched.")}
            >
              Configure SSO Gateway
            </Button>
            
            <div className="border-t border-outline-variant pt-lg mt-lg flex items-center gap-sm text-[11px] text-on-surface-variant font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              System Live: Client Gateway SSO Active
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
