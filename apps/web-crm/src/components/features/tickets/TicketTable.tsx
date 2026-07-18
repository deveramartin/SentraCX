"use client";

import React from "react";
import {
  MoreHorizontal,
  Circle,
  Clock,
  CheckCircle2,
  ArrowUp,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TicketPagination } from "./TicketPagination";
import type { SupportTicket } from "./types";

interface TicketTableProps {
  tickets: SupportTicket[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onCycleStatus: (id: string) => void;
  onDeleteTicket: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export function TicketTable({
  tickets,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  onCycleStatus,
  onDeleteTicket,
  onShowToast,
}: TicketTableProps) {
  const getStatusIcon = (status: SupportTicket["status"]) => {
    switch (status) {
      case "Open":
        return <Circle className="w-4 h-4 text-red-500 shrink-0" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-sky-500 shrink-0" />;
      case "Resolved":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getPriorityIcon = (priority: SupportTicket["priority"]) => {
    switch (priority) {
      case "High":
        return <ArrowUp className="w-4 h-4 text-red-600 shrink-0" />;
      case "Medium":
        return <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" />;
      case "Low":
        return <ArrowDown className="w-4 h-4 text-zinc-500 shrink-0" />;
    }
  };

  return (
    <>
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <table className="w-full text-left border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-label-sm font-semibold text-muted-foreground">
              <th className="py-md pl-md pr-xs w-10">
                <input
                  type="checkbox"
                  checked={tickets.length > 0 && selectedIds.length === tickets.length}
                  onChange={onToggleSelectAll}
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
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-lg text-center text-muted-foreground italic bg-background/50">
                  No tasks found matching current filters.
                </td>
              </tr>
            ) : (
              tickets.map((t) => {
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
                        onChange={() => onToggleSelectRow(t.id)}
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
                            onClick={() => onCycleStatus(t.id)}
                          >
                            Cycle Status
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-xs font-medium hover:bg-accent"
                            onClick={() => onShowToast(`Ticket ID ${t.id} copied to clipboard!`)}
                          >
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem
                            className="cursor-pointer text-xs font-medium hover:bg-destructive/10 text-destructive"
                            onClick={() => onDeleteTicket(t.id)}
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

      <TicketPagination selectedCount={selectedIds.length} totalCount={tickets.length} />
    </>
  );
}
