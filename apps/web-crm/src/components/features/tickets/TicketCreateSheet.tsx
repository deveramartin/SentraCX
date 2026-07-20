"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
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
import type { SupportTicket } from "./types";

interface TicketCreateSheetProps {
  onCreateTicket: (ticket: SupportTicket) => void;
  nextId: number;
}

interface TicketFormValues {
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
}

export function TicketCreateSheet({ onCreateTicket, nextId }: TicketCreateSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TicketFormValues>({
    defaultValues: {
      customer: "",
      issue: "",
      priority: "Medium",
    },
  });

  const onSubmit = (values: TicketFormValues) => {
    if (!values.customer.trim() || !values.issue.trim()) return;

    const ticket: SupportTicket = {
      id: `TCK-${nextId}`,
      customer: values.customer.trim(),
      issue: values.issue.trim(),
      priority: values.priority,
      status: "Open",
      time: "Just now",
    };

    onCreateTicket(ticket);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) form.reset(); setIsOpen(val); }}>
      <DialogTrigger asChild>
        <Button className="self-start sm:self-center">
          <Plus />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[100vw] sm:max-w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Create Support Ticket</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Log a new support query into the CRM task queue.
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
                    <Input placeholder="e.g. Jackson Reed" {...field} />
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
                  <FormLabel>Support Query *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Account lockout during checkout" {...field} />
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
                  <FormLabel>Severity Priority</FormLabel>
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
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
