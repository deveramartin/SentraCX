"use client";

import React, { useState } from "react";
import { Ticket as TicketIcon, Search, Plus, Filter, RefreshCw } from "lucide-react";
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

interface SupportTicket {
  id: string;
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  time: string;
}

export function Tickets() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  
  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "TCK-1024", customer: "Olivia Vance", issue: "API Integration Error", priority: "High", status: "Open", time: "10 mins ago" },
    { id: "TCK-1023", customer: "Jackson Reed", issue: "Billing Query & Refund", priority: "Medium", status: "In Progress", time: "45 mins ago" },
    { id: "TCK-1022", customer: "Amara Okoro", issue: "Account Lockout", priority: "High", status: "Open", time: "1 hour ago" },
    { id: "TCK-1021", customer: "Liam Anderson", issue: "Feature Request: Export PDF", priority: "Low", status: "Resolved", time: "3 hours ago" },
    { id: "TCK-1020", customer: "Sophia Martinez", issue: "Email configuration latency", priority: "Medium", status: "Resolved", time: "1 day ago" },
  ]);

  // Form State
  const [newCustomer, setNewCustomer] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

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
    const newTicket: SupportTicket = {
      id: `TCK-${nextIdNum}`,
      customer: newCustomer,
      issue: newIssue,
      priority: newPriority,
      status: "Open",
      time: "Just now"
    };

    setTickets([newTicket, ...tickets]);
    setNewCustomer("");
    setNewIssue("");
    setNewPriority("Medium");
    setIsCreateOpen(false);
    showToast(`Ticket ${newTicket.id} has been logged.`);
  };

  const handleCycleStatus = (ticketId: string) => {
    const statusCycle: Record<SupportTicket["status"], SupportTicket["status"]> = {
      "Open": "In Progress",
      "In Progress": "Resolved",
      "Resolved": "Open"
    };

    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        const nextStatus = statusCycle[t.status];
        showToast(`Ticket ${t.id} updated to ${nextStatus}`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-display-sm font-bold tracking-tight text-primary">Support Tickets</h1>
          <p className="text-body-md text-on-surface-variant">
            Orchestrate active queries, update ticket status, and review escalations.
          </p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer self-start sm:self-center">
              <Plus className="w-4 h-4" />
              File Ticket
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-surface border-outline-variant w-[400px] sm:w-[540px]">
            <SheetHeader className="pb-lg">
              <SheetTitle className="text-headline-md font-bold text-primary">File Support Ticket</SheetTitle>
              <SheetDescription className="text-body-sm text-on-surface-variant">
                Manually record a client issue inside the CRM registry.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateTicket} className="space-y-lg mt-lg">
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Customer Name</label>
                <Input 
                  placeholder="e.g. Jackson Reed" 
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Support Query Details</label>
                <Input 
                  placeholder="e.g. Account lockout during checkout" 
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Severity Priority</label>
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
                  Log Ticket
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Ticket Center Panel */}
      <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
        <CardHeader className="pb-6 p-lg flex flex-col xl:flex-row xl:items-center xl:justify-between gap-md border-b border-outline-variant">
          <CardTitle className="text-title-lg font-bold text-primary flex items-center gap-sm">
            <TicketIcon className="w-5 h-5" />
            Tickets Registry
          </CardTitle>

          {/* Filters Dashboard */}
          <div className="flex flex-wrap items-center gap-md">
            {/* Search Input */}
            <div className="flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant focus-within:border-primary transition-all w-full md:w-64">
              <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
              <Input 
                className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0" 
                placeholder="Search ID, customer, issue..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter buttons */}
            <div className="flex items-center gap-xs border border-outline-variant rounded-lg p-0.5 bg-surface-container">
              {["All", "Open", "In Progress", "Resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
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

            {/* Priority Filter buttons */}
            <div className="flex items-center gap-xs border border-outline-variant rounded-lg p-0.5 bg-surface-container">
              {["All", "High", "Medium", "Low"].map((prio) => (
                <button
                  key={prio}
                  onClick={() => setPriorityFilter(prio)}
                  className={`px-sm py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    priorityFilter === prio 
                      ? "bg-surface-container-lowest text-primary font-bold shadow-sm" 
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {prio}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        {/* Tickets Table */}
        <CardContent className="p-lg pt-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-bold text-on-surface-variant">
                <th className="py-md pr-md">Ticket ID</th>
                <th className="py-md px-md">Customer</th>
                <th className="py-md px-md">Support Issue</th>
                <th className="py-md px-md">Priority</th>
                <th className="py-md px-md">Status</th>
                <th className="py-md px-md">Logged Time</th>
                <th className="py-md pl-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-lg text-center text-on-surface-variant">
                    No tickets found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-md pr-md font-mono text-xs font-semibold text-primary">{t.id}</td>
                    <td className="py-md px-md font-semibold text-primary">{t.customer}</td>
                    <td className="py-md px-md text-on-surface-variant">{t.issue}</td>
                    <td className="py-md px-md">
                      <Badge className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-none shadow-none ${
                        t.priority === "High" 
                          ? "bg-red-100 text-red-800" 
                          : t.priority === "Medium"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-800"
                      }`}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="py-md px-md">
                      <Badge variant="outline" className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none ${
                        t.status === "Open" 
                          ? "border-red-300 text-red-700 bg-red-50/50" 
                          : t.status === "In Progress"
                          ? "border-sky-300 text-sky-700 bg-sky-50/50"
                          : "border-emerald-300 text-emerald-700 bg-emerald-50/50"
                      }`}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-md px-md text-on-surface-variant font-mono text-xs">{t.time}</td>
                    <td className="py-md pl-md text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs flex items-center gap-xs ml-auto cursor-pointer"
                        onClick={() => handleCycleStatus(t.id)}
                      >
                        <RefreshCw className="w-3 h-3 text-on-surface-variant group-hover:animate-spin" />
                        Cycle Status
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
