"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SupportTicket } from "./types";

interface TicketCreateSheetProps {
  onCreateTicket: (ticket: SupportTicket) => void;
  nextId: number;
}

export function TicketCreateSheet({ onCreateTicket, nextId }: TicketCreateSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newIssue) return;

    const ticket: SupportTicket = {
      id: `TCK-${nextId}`,
      customer: newCustomer,
      issue: newIssue,
      priority: newPriority,
      status: "Open",
      time: "Just now",
    };

    onCreateTicket(ticket);
    setNewCustomer("");
    setNewIssue("");
    setNewPriority("Medium");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 self-start sm:self-center">
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
        <form onSubmit={handleSubmit} className="space-y-lg mt-lg">
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
            <Button type="submit" className="w-full">
              Create Task
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
