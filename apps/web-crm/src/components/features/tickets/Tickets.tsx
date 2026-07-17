"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  X, 
  MoreHorizontal, 
  Circle, 
  Clock, 
  CheckCircle2, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Checkbox Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
    showToast(`Ticket ${newTicket.id} created successfully!`);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
    setSelectedIds(selectedIds.filter(item => item !== id));
    showToast(`Ticket ${id} deleted.`);
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
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    showToast(`Ticket ${ticketId} status updated.`);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map(t => t.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriorityFilter("All");
    setStatusFilter("All");
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getStatusIcon = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open": return <Circle className="w-4 h-4 text-red-500 shrink-0" />;
      case "In Progress": return <Clock className="w-4 h-4 text-sky-500 shrink-0" />;
      case "Resolved": return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getPriorityIcon = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "High": return <ArrowUp className="w-4 h-4 text-red-600 shrink-0" />;
      case "Medium": return <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />;
      case "Low": return <ArrowDown className="w-4 h-4 text-zinc-500 shrink-0" />;
    }
  };

  const isFiltered = searchQuery !== "" || priorityFilter !== "All" || statusFilter !== "All";

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h2 className="text-headline-md font-bold tracking-tight text-foreground">Welcome back!</h2>
          <p className="text-body-md text-muted-foreground">
            Here's a list of your support tickets and tasks for this month.
          </p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-sm px-md py-sm bg-primary text-primary-foreground hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer self-start sm:self-center shadow-sm">
              <Plus className="w-4 h-4" />
              Create Task
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card border-border w-[400px] sm:w-[540px]">
            <SheetHeader className="pb-lg">
              <SheetTitle className="text-headline-md font-bold text-foreground">Create Support Ticket</SheetTitle>
              <SheetDescription className="text-body-sm text-muted-foreground">
                Log a new support query into the CRM task queue.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleCreateTicket} className="space-y-lg mt-lg">
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Customer Name</label>
                <Input 
                  placeholder="e.g. Jackson Reed" 
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Support Query</label>
                <Input 
                  placeholder="e.g. Account lockout during checkout" 
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Severity Priority</label>
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
                  Create Task
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Ticket Center Panel */}
      <Card className="bg-card border-border rounded-xl flex flex-col shadow-none border-none">
        <CardContent className="p-0 space-y-md">
          {/* Filters Dashboard */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md pb-md">
            <div className="flex flex-wrap items-center gap-sm flex-1">
              {/* Search Input */}
              <div className="flex items-center bg-transparent rounded-lg px-md w-full md:w-64 border border-input focus-within:border-ring transition-all">
                <Search className="text-muted-foreground w-4 h-4 mr-sm shrink-0" />
                <Input 
                  className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0" 
                  placeholder="Filter tasks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Status Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed flex items-center gap-xs text-xs font-semibold cursor-pointer">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Status
                    {statusFilter !== "All" && (
                      <Badge variant="secondary" className="ml-1 px-1 bg-muted font-bold text-[10px] rounded-sm text-foreground">{statusFilter}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border w-40" align="start">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {["All", "Open", "In Progress", "Resolved"].map((status) => (
                    <DropdownMenuItem 
                      key={status} 
                      onClick={() => setStatusFilter(status)}
                      className="cursor-pointer text-xs font-medium"
                    >
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Priority Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 border-dashed flex items-center gap-xs text-xs font-semibold cursor-pointer">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    Priority
                    {priorityFilter !== "All" && (
                      <Badge variant="secondary" className="ml-1 px-1 bg-muted font-bold text-[10px] rounded-sm text-foreground">{priorityFilter}</Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover border-border w-40" align="start">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">Filter by Priority</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border" />
                  {["All", "High", "Medium", "Low"].map((prio) => (
                    <DropdownMenuItem 
                      key={prio} 
                      onClick={() => setPriorityFilter(prio)}
                      className="cursor-pointer text-xs font-medium"
                    >
                      {prio}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset filter button */}
              {isFiltered && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="h-8 text-xs font-semibold flex items-center gap-xs cursor-pointer"
                >
                  Reset
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-label-sm font-semibold text-muted-foreground">
                  <th className="py-md pl-md pr-xs w-10">
                    <input 
                      type="checkbox"
                      checked={filteredTickets.length > 0 && selectedIds.length === filteredTickets.length}
                      onChange={handleToggleSelectAll}
                      className="w-4 h-4 accent-primary rounded border-input cursor-pointer"
                    />
                  </th>
                  <th className="py-md px-md w-28">Task</th>
                  <th className="py-md px-md">Title</th>
                  <th className="py-md px-md w-36">Status</th>
                  <th className="py-md px-md w-32">Priority</th>
                  <th className="py-md pr-md w-12 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-lg text-center text-muted-foreground italic bg-background/50">
                      No tasks found matching current filters.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => {
                    const isSelected = selectedIds.includes(t.id);
                    return (
                      <tr 
                        key={t.id} 
                        className={`transition-colors border-border ${
                          isSelected ? "bg-muted/40 hover:bg-muted/50" : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="py-md pl-md pr-xs">
                          <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(t.id)}
                            className="w-4 h-4 accent-primary rounded border-input cursor-pointer"
                          />
                        </td>
                        <td className="py-md px-md font-mono text-xs font-medium text-muted-foreground">{t.id}</td>
                        <td className="py-md px-md flex items-center gap-xs">
                          <Badge variant="outline" className="mr-sm font-semibold bg-muted/20 border-border text-[11px] py-0 px-2 rounded-md shrink-0 shadow-none text-foreground">
                            {t.customer}
                          </Badge>
                          <span className="font-semibold text-foreground truncate max-w-sm md:max-w-md">{t.issue}</span>
                        </td>
                        <td className="py-md px-md">
                          <div className="flex items-center gap-sm">
                            {getStatusIcon(t.status)}
                            <span className="text-xs font-semibold text-foreground">{t.status}</span>
                          </div>
                        </td>
                        <td className="py-md px-md">
                          <div className="flex items-center gap-sm">
                            {getPriorityIcon(t.priority)}
                            <span className="text-xs text-muted-foreground">{t.priority}</span>
                          </div>
                        </td>
                        <td className="py-md pr-md text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0 cursor-pointer">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-popover border-border w-40" align="end">
                              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">Row Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem 
                                className="cursor-pointer text-xs font-medium hover:bg-accent"
                                onClick={() => handleCycleStatus(t.id)}
                              >
                                Cycle Status
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-xs font-medium hover:bg-accent"
                                onClick={() => showToast(`Ticket ID ${t.id} copied to clipboard!`)}
                              >
                                Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-border" />
                              <DropdownMenuItem 
                                className="cursor-pointer text-xs font-medium hover:bg-destructive/10 text-destructive"
                                onClick={() => handleDeleteTicket(t.id)}
                              >
                                Delete Task
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-md pt-xs text-muted-foreground text-xs font-medium px-xs">
            {/* Rows selected summary */}
            <div>
              {selectedIds.length} of {filteredTickets.length} row(s) selected.
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-lg">
              <div className="flex items-center gap-xs">
                <span>Rows per page</span>
                <select className="bg-transparent border border-input rounded p-1 text-xs outline-none text-foreground font-semibold">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                </select>
              </div>

              <div>
                Page 1 of 1
              </div>

              <div className="flex items-center gap-xs">
                <Button variant="outline" size="icon" className="w-8 h-8 rounded p-0 text-muted-foreground" disabled>
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded p-0 text-muted-foreground" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded p-0 text-muted-foreground" disabled>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded p-0 text-muted-foreground" disabled>
                  <ChevronsRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
