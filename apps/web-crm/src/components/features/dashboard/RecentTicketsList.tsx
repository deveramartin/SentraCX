"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TicketType } from "./types";

interface RecentTicketsListProps {
  tickets: TicketType[];
}

export function RecentTicketsList({ tickets }: RecentTicketsListProps) {
  return (
    <Card className="lg:col-span-3 bg-card border-border rounded-xl flex flex-col shadow-none">
      <CardHeader className="flex flex-row justify-between items-center pb-6 p-lg">
        <div className="space-y-xs">
          <CardTitle className="text-title-lg font-bold text-foreground">Recent Tickets</CardTitle>
          <p className="text-body-sm text-muted-foreground">You have {tickets.length} active tickets</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-label-md font-medium text-muted-foreground hover:text-foreground flex items-center gap-xs group transition-colors cursor-pointer"
        >
          View all
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 divide-y divide-border p-lg pt-0">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="py-md first:pt-0 last:pb-0 flex items-center justify-between hover:bg-muted/50 px-sm transition-colors rounded-lg"
          >
            <div className="space-y-xs overflow-hidden max-w-[70%]">
              <div className="flex items-center gap-sm">
                <Badge
                  variant="secondary"
                  className="text-label-sm font-bold text-foreground bg-muted px-sm py-0.5 rounded-sm shadow-none"
                >
                  {ticket.id}
                </Badge>
                <span className="text-label-md font-semibold text-foreground truncate">
                  {ticket.customer}
                </span>
              </div>
              <p className="text-body-sm text-muted-foreground font-medium truncate">{ticket.issue}</p>
            </div>
            <div className="text-right space-y-xs shrink-0">
              <Badge
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none border-none ${
                  ticket.priority === "High"
                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                    : ticket.priority === "Medium"
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                    : "bg-zinc-100 text-zinc-800 hover:bg-zinc-100"
                }`}
              >
                {ticket.priority}
              </Badge>
              <p className="text-[11px] text-muted-foreground font-mono">{ticket.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
