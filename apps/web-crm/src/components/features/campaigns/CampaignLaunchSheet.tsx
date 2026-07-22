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
import type { Campaign } from "./types";

interface CampaignLaunchSheetProps {
  onLaunchCampaign: (campaign: Campaign) => void;
  nextIdNum: number;
}

export function CampaignLaunchSheet({ onLaunchCampaign, nextIdNum }: CampaignLaunchSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(5000);
  const [newStatus, setNewStatus] = useState<Campaign["status"]>("Scheduled");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCamp: Campaign = {
      id: `CMP-${String(nextIdNum).padStart(3, "0")}`,
      name: newName.trim(),
      status: newStatus,
      budget: Number(newBudget) || 0,
      spent: 0,
      conversion: 0,
      clicks: 0,
    };

    onLaunchCampaign(newCamp);
    setNewName("");
    setNewBudget(5000);
    setNewStatus("Scheduled");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus />
          New Campaign
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-card border-border w-full max-w-full sm:max-w-md md:max-w-lg overflow-y-auto p-4 sm:p-6">
        <SheetHeader className="pb-md sm:pb-lg">
          <SheetTitle className="text-headline-md font-bold text-foreground">Launch Campaign</SheetTitle>
          <SheetDescription className="text-body-sm text-muted-foreground">
            Configure parameters for your marketing dispatch.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-md sm:space-y-lg mt-md sm:mt-lg">
          <div className="space-y-xs">
            <Label htmlFor="campaign-name" className="text-label-sm font-semibold text-foreground block">
              Campaign Name *
            </Label>
            <Input
              id="campaign-name"
              placeholder="e.g. Q4 Black Friday Promo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-background border-border text-body-sm"
              required
            />
          </div>
          <div className="space-y-xs">
            <Label htmlFor="campaign-budget" className="text-label-sm font-semibold text-foreground block">
              Allocated Budget ($)
            </Label>
            <Input
              id="campaign-budget"
              type="number"
              min={0}
              placeholder="e.g. 10000"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
              className="bg-background border-border text-body-sm"
            />
          </div>
          <div className="space-y-xs">
            <Label className="text-label-sm font-semibold text-foreground block">Launch Strategy</Label>
            <div className="grid grid-cols-2 gap-xs sm:gap-sm">
              {(["Active", "Scheduled"] as const).map((s) => (
                <Button
                  type="button"
                  key={s}
                  variant={newStatus === s ? "default" : "outline"}
                  className="w-full text-label-sm"
                  onClick={() => setNewStatus(s)}
                >
                  {s === "Active" ? "Dispatch Now" : "Schedule"}
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
              Deploy Campaign
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
