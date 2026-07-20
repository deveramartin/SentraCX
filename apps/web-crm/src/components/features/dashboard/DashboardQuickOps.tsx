"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { TicketType } from "./types";

interface DashboardQuickOpsProps {
  onCreateTicket: (newTicket: TicketType) => void;
  onShowToast: (msg: string) => void;
}

interface QuickTicketFormValues {
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
}

export function DashboardQuickOps({ onCreateTicket, onShowToast }: DashboardQuickOpsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const form = useForm<QuickTicketFormValues>({
    defaultValues: {
      customer: "",
      issue: "",
      priority: "Medium",
    },
  });

  const onSubmit = (values: QuickTicketFormValues) => {
    if (!values.customer.trim() || !values.issue.trim()) {
      onShowToast("Please fill in all fields.");
      return;
    }

    const newTicket: TicketType = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      customer: values.customer.trim(),
      issue: values.issue.trim(),
      priority: values.priority,
      time: "Just now",
    };

    onCreateTicket(newTicket);
    form.reset();
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
        <Dialog open={isCreateOpen} onOpenChange={(val) => { if (!val) form.reset(); setIsCreateOpen(val); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[100vw] sm:max-w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg sm:rounded-xl">
            <DialogHeader className="space-y-1.5 text-left">
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Create Support Ticket</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Submit a support query. It will immediately populate on the active system log.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Olivia Vance" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Issue *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Database connectivity failed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap sm:flex-nowrap gap-2">
                          {(["High", "Medium", "Low"] as const).map((p) => (
                            <Button
                              type="button"
                              key={p}
                              variant={field.value === p ? "default" : "outline"}
                              className="flex-1 min-w-[80px]"
                              onClick={() => field.onChange(p)}
                            >
                              {p}
                            </Button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Submit Ticket
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

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
