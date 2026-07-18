"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
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
import type { TicketType } from "./types";

interface DashboardQuickOpsProps {
  onCreateTicket: (newTicket: TicketType) => void;
  onShowToast: (msg: string) => void;
}

export function DashboardQuickOps({ onCreateTicket, onShowToast }: DashboardQuickOpsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newIssue) {
      onShowToast("Please fill in all fields.");
      return;
    }

    const newTicket: TicketType = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      customer: newCustomer,
      issue: newIssue,
      priority: newPriority,
      time: "Just now",
    };

    onCreateTicket(newTicket);
    setNewCustomer("");
    setNewIssue("");
    setNewPriority("Medium");
    setIsCreateOpen(false);
    onShowToast(`Ticket ${newTicket.id} created successfully!`);
  };

  return (
    <Card className="bg-card border-border rounded-xl flex flex-col md:flex-row justify-between items-center shadow-none p-lg gap-md border">
      <div className="space-y-xs">
        <CardTitle className="text-title-lg font-bold text-foreground">Quick Operations</CardTitle>
        <p className="text-body-sm text-muted-foreground">
          Perform administrative tasks, launch campaigns, or trigger security portal updates.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-sm">
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              Create New Ticket
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card border-border w-[400px] sm:w-[540px]">
            <SheetHeader className="pb-lg">
              <SheetTitle className="text-headline-md font-bold text-foreground">Create Support Ticket</SheetTitle>
              <SheetDescription className="text-body-sm text-muted-foreground">
                Submit a support query. It will immediately populate on the active system log.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-lg mt-lg">
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Customer Name</label>
                <Input
                  placeholder="e.g. Olivia Vance"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Support Issue</label>
                <Input
                  placeholder="e.g. Database connectivity failed"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-foreground block">Priority</label>
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
                  Submit Ticket
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          onClick={() => onShowToast("Marketing Campaign launched successfully!")}
        >
          Launch Campaign
        </Button>

        <Button
          variant="ghost"
          onClick={() => onShowToast("SSO Configuration settings fetched.")}
        >
          Configure SSO Gateway
        </Button>
      </div>
    </Card>
  );
}
