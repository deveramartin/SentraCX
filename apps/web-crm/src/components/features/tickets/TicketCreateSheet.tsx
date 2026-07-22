"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    if (!newCustomer.trim() || !newIssue.trim()) return;

    const ticket: SupportTicket = {
      id: `TCK-${nextId}`,
      customer: newCustomer.trim(),
      issue: newIssue.trim(),
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
        <Button className="w-full sm:w-auto">
          <Plus />
          Create Task
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-card border-border w-full max-w-full sm:max-w-md md:max-w-lg overflow-y-auto p-4 sm:p-6">
        <SheetHeader className="pb-md sm:pb-lg">
          <SheetTitle className="text-headline-md font-bold text-foreground">Create Support Ticket</SheetTitle>
          <SheetDescription className="text-body-sm text-muted-foreground">
            Log a new support query into the CRM task queue.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-md sm:space-y-lg mt-md sm:mt-lg">
          <div className="space-y-xs">
            <Label htmlFor="ticket-customer" className="text-label-sm font-semibold text-foreground block">
              Customer Name *
            </Label>
            <Input
              id="ticket-customer"
              placeholder="e.g. Jackson Reed"
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              className="bg-muted/50 border-border focus:border-primary text-body-sm"
              required
            />
          </div>
          <div className="space-y-xs">
            <Label htmlFor="ticket-issue" className="text-label-sm font-semibold text-foreground block">
              Support Query *
            </Label>
            <Input
              id="ticket-issue"
              placeholder="e.g. Account lockout during checkout"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="bg-muted/50 border-border focus:border-primary text-body-sm"
              required
            />
          </div>
          <div className="space-y-xs">
            <Label className="text-label-sm font-semibold text-foreground block">Severity Priority</Label>
            <div className="grid grid-cols-3 gap-xs sm:gap-sm">
              {(["High", "Medium", "Low"] as const).map((p) => (
                <Button
                  type="button"
                  key={p}
                  variant={newPriority === p ? "default" : "outline"}
                  className="w-full text-label-sm"
                  onClick={() => setNewPriority(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>
          <div className="pt-md sm:pt-xl flex flex-col-reverse sm:flex-row gap-xs sm:gap-sm">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
