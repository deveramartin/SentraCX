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
import type { Campaign } from "./types";

interface CampaignLaunchSheetProps {
  onLaunchCampaign: (campaign: Campaign) => void;
  nextIdNum: number;
}

interface CampaignFormValues {
  name: string;
  budget: number;
  status: Campaign["status"];
}

export function CampaignLaunchSheet({ onLaunchCampaign, nextIdNum }: CampaignLaunchSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CampaignFormValues>({
    defaultValues: {
      name: "",
      budget: 5000,
      status: "Scheduled",
    },
  });

  const onSubmit = (values: CampaignFormValues) => {
    if (!values.name.trim()) return;

    const newCamp: Campaign = {
      id: `CMP-${String(nextIdNum).padStart(3, "0")}`,
      name: values.name.trim(),
      status: values.status,
      budget: Number(values.budget) || 0,
      spent: 0,
      conversion: 0,
      clicks: 0,
    };

    onLaunchCampaign(newCamp);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) form.reset(); setIsOpen(val); }}>
      <DialogTrigger asChild>
        <Button className="self-start sm:self-center">
          <Plus />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[100vw] sm:max-w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Launch Campaign</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure parameters for your marketing dispatch.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Q4 Black Friday Promo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allocated Budget ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 10000"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Launch Strategy</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap sm:flex-nowrap gap-2">
                      {(["Active", "Scheduled"] as const).map((s) => (
                        <Button
                          type="button"
                          key={s}
                          variant={field.value === s ? "default" : "outline"}
                          className="flex-1 min-w-[120px]"
                          onClick={() => field.onChange(s)}
                        >
                          {s === "Active" ? "Dispatch Now" : "Schedule"}
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
                Deploy Campaign
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
