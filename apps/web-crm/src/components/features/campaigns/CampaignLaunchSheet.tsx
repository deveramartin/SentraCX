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
    if (!newName) return;

    const newCamp: Campaign = {
      id: `CMP-${String(nextIdNum).padStart(3, "0")}`,
      name: newName,
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
        <Button className="flex items-center gap-2 self-start sm:self-center">
          <Plus className="w-4 h-4" />
          New Campaign
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-surface border-outline-variant w-[400px] sm:w-[540px]">
        <SheetHeader className="pb-lg">
          <SheetTitle className="text-headline-md font-bold text-primary">Launch Campaign</SheetTitle>
          <SheetDescription className="text-body-sm text-on-surface-variant">
            Configure parameters for your marketing dispatch.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-lg mt-lg">
          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Campaign Name</label>
            <Input
              placeholder="e.g. Q4 Black Friday Promo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
            />
          </div>
          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Allocated Budget ($)</label>
            <Input
              type="number"
              placeholder="e.g. 10000"
              value={newBudget}
              onChange={(e) => setNewBudget(Number(e.target.value))}
              className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
            />
          </div>
          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Launch Strategy</label>
            <div className="flex gap-sm">
              {(["Active", "Scheduled"] as const).map((s) => (
                <Button
                  type="button"
                  key={s}
                  variant={newStatus === s ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setNewStatus(s)}
                >
                  {s === "Active" ? "Dispatch Now" : "Schedule"}
                </Button>
              ))}
            </div>
          </div>
          <div className="pt-xl">
            <Button type="submit" className="w-full">
              Deploy Campaign
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
