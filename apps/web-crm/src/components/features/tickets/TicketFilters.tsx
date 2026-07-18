"use client";

import React from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TicketFiltersProps {
  searchQuery: string;
  priorityFilter: string;
  statusFilter: string;
  isFiltered: boolean;
  onSearchChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
}

export function TicketFilters({
  searchQuery,
  priorityFilter,
  statusFilter,
  isFiltered,
  onSearchChange,
  onPriorityChange,
  onStatusChange,
  onReset,
}: TicketFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-md pb-md">
      <div className="flex flex-wrap items-center gap-sm flex-1">
        <div className="flex items-center bg-transparent rounded-lg px-md w-full md:w-64 border border-input focus-within:border-ring transition-all">
          <Search className="text-muted-foreground w-4 h-4 mr-sm shrink-0" />
          <Input
            className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0"
            placeholder="Filter tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-dashed">
              <SlidersHorizontal />
              Status
              {statusFilter !== "All" && (
                <Badge variant="secondary" className="ml-1 px-1 bg-muted font-bold text-label-sm rounded-sm text-foreground">{statusFilter}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border w-40" align="start">
            <DropdownMenuLabel className="text-label-sm text-muted-foreground">Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {["All", "Open", "In Progress", "Resolved"].map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(status)}
                className="cursor-pointer text-label-sm font-medium"
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="border-dashed">
              <SlidersHorizontal />
              Priority
              {priorityFilter !== "All" && (
                <Badge variant="secondary" className="ml-1 px-1 bg-muted font-bold text-label-sm rounded-sm text-foreground">{priorityFilter}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-popover border-border w-40" align="start">
            <DropdownMenuLabel className="text-label-sm text-muted-foreground">Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {["All", "High", "Medium", "Low"].map((prio) => (
              <DropdownMenuItem
                key={prio}
                onClick={() => onPriorityChange(prio)}
                className="cursor-pointer text-label-sm font-medium"
              >
                {prio}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
