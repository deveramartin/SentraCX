"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TicketFilters } from "./TicketFilters";
import { TicketCreateSheet } from "./TicketCreateSheet";
import { TicketTable } from "./TicketTable";
import type { SupportTicket } from "./types";

export function Tickets() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: "TCK-1024", customer: "Olivia Vance", issue: "API Integration Error", priority: "High", status: "Open", time: "10 mins ago" },
    { id: "TCK-1023", customer: "Jackson Reed", issue: "Billing Query & Refund", priority: "Medium", status: "In Progress", time: "45 mins ago" },
    { id: "TCK-1022", customer: "Amara Okoro", issue: "Account Lockout", priority: "High", status: "Open", time: "1 hour ago" },
    { id: "TCK-1021", customer: "Liam Anderson", issue: "Feature Request: Export PDF", priority: "Low", status: "Resolved", time: "3 hours ago" },
    { id: "TCK-1020", customer: "Sophia Martinez", issue: "Email configuration latency", priority: "Medium", status: "Resolved", time: "1 day ago" },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateTicket = (newTicket: SupportTicket) => {
    setTickets([newTicket, ...tickets]);
    showToast(`Ticket ${newTicket.id} created successfully!`);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    showToast(`Ticket ${id} deleted.`);
  };

  const handleCycleStatus = (ticketId: string) => {
    const statusCycle: Record<SupportTicket["status"], SupportTicket["status"]> = {
      Open: "In Progress",
      "In Progress": "Resolved",
      Resolved: "Open",
    };

    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: statusCycle[t.status] } : t))
    );
    showToast(`Ticket ${ticketId} status updated.`);
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map((t) => t.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  const nextIdNum = Math.max(...tickets.map((t) => parseInt(t.id.split("-")[1]))) + 1;
  const isFiltered = searchQuery !== "" || priorityFilter !== "All" || statusFilter !== "All";

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h2 className="text-headline-md font-bold tracking-tight text-foreground">Welcome back!</h2>
          <p className="text-body-md text-muted-foreground">
            Here&apos;s a list of your support tickets and tasks for this month.
          </p>
        </div>
        <TicketCreateSheet onCreateTicket={handleCreateTicket} nextId={nextIdNum} />
      </div>

      <Card className="bg-card border-border rounded-xl flex flex-col shadow-none border-none">
        <CardContent className="p-0 space-y-md">
          <TicketFilters
            searchQuery={searchQuery}
            priorityFilter={priorityFilter}
            statusFilter={statusFilter}
            isFiltered={isFiltered}
            onSearchChange={setSearchQuery}
            onPriorityChange={setPriorityFilter}
            onStatusChange={setStatusFilter}
            onReset={handleResetFilters}
          />
          <TicketTable
            tickets={filteredTickets}
            selectedIds={selectedIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRow={handleToggleSelectRow}
            onCycleStatus={handleCycleStatus}
            onDeleteTicket={handleDeleteTicket}
            onShowToast={showToast}
          />
        </CardContent>
      </Card>
    </div>
  );
}
