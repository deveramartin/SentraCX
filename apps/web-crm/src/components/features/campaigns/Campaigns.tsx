"use client";

import React, { useState } from "react";
import { CampaignMetricsCards } from "./CampaignMetricsCards";
import { CampaignTable } from "./CampaignTable";
import { CampaignLaunchSheet } from "./CampaignLaunchSheet";
import type { Campaign } from "./types";

export function Campaigns() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "CMP-001", name: "Summer Retention Program", status: "Active", budget: 15000, spent: 12400, conversion: 8.7, clicks: 12500 },
    { id: "CMP-002", name: "SSO Gateway Launch Email", status: "Active", budget: 5000, spent: 4800, conversion: 14.2, clicks: 8300 },
    { id: "CMP-003", name: "Q3 Churn-Risk Prevention", status: "Scheduled", budget: 20000, spent: 0, conversion: 0, clicks: 0 },
    { id: "CMP-004", name: "Winter Referral Drive", status: "Completed", budget: 12000, spent: 12000, conversion: 10.5, clicks: 14200 },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLaunchCampaign = (newCamp: Campaign) => {
    setCampaigns([newCamp, ...campaigns]);
    showToast(`Campaign ${newCamp.name} registered successfully!`);
  };

  const handleStartCampaign = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          showToast(`Campaign ${c.name} has been activated!`);
          return { ...c, status: "Active" as const };
        }
        return c;
      })
    );
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCount = campaigns.filter((c) => c.status === "Active").length;
  const avgConversion =
    campaigns
      .filter((c) => c.status === "Completed" || c.status === "Active")
      .reduce((sum, c, _, arr) => sum + c.conversion / (arr.length || 1), 0);

  const nextIdNum = Math.max(...campaigns.map((c) => parseInt(c.id.split("-")[1]))) + 1;

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-display-sm font-bold tracking-tight text-primary">Marketing Campaigns</h1>
          <p className="text-body-md text-on-surface-variant">
            Create email marketing outreaches, track clicks, and audit conversion metrics.
          </p>
        </div>
        <CampaignLaunchSheet onLaunchCampaign={handleLaunchCampaign} nextIdNum={nextIdNum} />
      </div>

      <CampaignMetricsCards
        activeCount={activeCount}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        avgConversion={avgConversion}
      />

      <CampaignTable
        campaigns={campaigns}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onStartCampaign={handleStartCampaign}
      />
    </div>
  );
}
