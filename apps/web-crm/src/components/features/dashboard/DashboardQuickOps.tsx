"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
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
    if (!newCustomer.trim() || !newIssue.trim()) {
      onShowToast("Please fill in all required fields.");
      return;
    }

    const newTicket: TicketType = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      customer: newCustomer.trim(),
      issue: newIssue.trim(),
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
    <Card className="bg-card border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center shadow-none p-lg gap-md border">
      <div className="space-y-xs">
        <CardTitle className="text-title-lg font-bold text-foreground">Quick Operations</CardTitle>
        <p className="text-body-sm text-muted-foreground">
          Perform administrative tasks, launch campaigns, or trigger security portal updates.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-sm w-full md:w-auto">
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus />
              Create New Ticket
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-card border-border w-full max-w-full sm:max-w-md md:max-w-lg overflow-y-auto p-4 sm:p-6">
            <SheetHeader className="pb-md sm:pb-lg">
              <SheetTitle className="text-headline-md font-bold text-foreground">Create Support Ticket</SheetTitle>
              <SheetDescription className="text-body-sm text-muted-foreground">
                Submit a support query. It will immediately populate on the active system log.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleSubmit} className="space-y-md sm:space-y-lg mt-md sm:mt-lg">
              <div className="space-y-xs">
                <Label htmlFor="dash-ticket-customer" className="text-label-sm font-semibold text-foreground block">
                  Customer Name *
                </Label>
                <Input
                  id="dash-ticket-customer"
                  placeholder="e.g. Olivia Vance"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  required
                />
              </div>
              <div className="space-y-xs">
                <Label htmlFor="dash-ticket-issue" className="text-label-sm font-semibold text-foreground block">
                  Support Issue *
                </Label>
                <Input
                  id="dash-ticket-issue"
                  placeholder="e.g. Database connectivity failed"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  required
                />
              </div>
              <div className="space-y-xs">
                <Label className="text-label-sm font-semibold text-foreground block">Priority</Label>
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
                  onClick={() => setIsCreateOpen(false)}
                  className="w-full sm:flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full sm:flex-1">
                  Submit Ticket
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          onClick={() => onShowToast("Marketing Campaign launched successfully!")}
          className="w-full sm:w-auto"
        >
          Launch Campaign
        </Button>

        <Button
          variant="ghost"
          onClick={() => onShowToast("SSO Configuration settings fetched.")}
          className="w-full sm:w-auto"
        >
          Configure SSO Gateway
        </Button>
      </div>
    </Card>
  );
}
