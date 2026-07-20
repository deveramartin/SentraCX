"use client";

import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMetricCards } from "./DashboardMetricCards";
import { DashboardChart } from "./DashboardChart";
import { RecentTicketsList } from "./RecentTicketsList";
import { DashboardQuickOps } from "./DashboardQuickOps";
import type { TicketType } from "./types";

export function Dashboard() {
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: "TCK-1024", customer: "Olivia Vance", issue: "API Integration Error", priority: "High", time: "10 mins ago" },
    { id: "TCK-1023", customer: "Jackson Reed", issue: "Billing Query & Refund", priority: "Medium", time: "45 mins ago" },
    { id: "TCK-1022", customer: "Amara Okoro", issue: "Account Lockout", priority: "High", time: "1 hour ago" },
    { id: "TCK-1021", customer: "Liam Anderson", issue: "Feature Request: Export PDF", priority: "Low", time: "3 hours ago" },
  ]);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateTicket = (newTicket: TicketType) => {
    setTickets((prev) => [newTicket, ...prev]);
  };

  const highPriorityCount = tickets.filter((t) => t.priority === "High").length;
  const activeCount = tickets.length;
  const newTicketsDelta = Math.max(0, tickets.length - 4);

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md border-b border-border pb-lg">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-bold tracking-tight text-foreground">Dashboard</h1>
        </div>
        <div className="flex items-center gap-sm">
          <Button variant="outline" size="sm">
            <Clock />
            Jan 01, 2026 - Jun 30, 2026
          </Button>
          <Button
            size="sm"
            onClick={() => showToast("Downloading CSV reports...")}
          >
            Download Report
          </Button>
        </div>
      </div>

      <DashboardMetricCards
        activeCount={activeCount}
        highPriorityCount={highPriorityCount}
        newTicketsDelta={newTicketsDelta}
      />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-lg">
        <DashboardChart />
        <RecentTicketsList tickets={tickets} />
      </div>

      <DashboardQuickOps onCreateTicket={handleCreateTicket} onShowToast={showToast} />
    </div>
  );
}
