"use client";

import React, { useState } from "react";
import { Megaphone, Search, Plus, TrendingUp, DollarSign, Percent, Play, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Scheduled" | "Completed";
  budget: number;
  spent: number;
  conversion: number; // percentage
  clicks: number;
}

export function Campaigns() {
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: "CMP-001", name: "Summer Retention Program", status: "Active", budget: 15000, spent: 12400, conversion: 8.7, clicks: 12500 },
    { id: "CMP-002", name: "SSO Gateway Launch Email", status: "Active", budget: 5000, spent: 4800, conversion: 14.2, clicks: 8300 },
    { id: "CMP-003", name: "Q3 Churn-Risk Prevention", status: "Scheduled", budget: 20000, spent: 0, conversion: 0, clicks: 0 },
    { id: "CMP-004", name: "Winter Referral Drive", status: "Completed", budget: 12000, spent: 12000, conversion: 10.5, clicks: 14200 },
  ]);

  // Form State
  const [newName, setNewName] = useState("");
  const [newBudget, setNewBudget] = useState(5000);
  const [newStatus, setNewStatus] = useState<Campaign["status"]>("Scheduled");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) {
      showToast("Please enter a campaign name.");
      return;
    }

    const nextIdNum = Math.max(...campaigns.map(c => parseInt(c.id.split("-")[1]))) + 1;
    const newCamp: Campaign = {
      id: `CMP-${String(nextIdNum).padStart(3, "0")}`,
      name: newName,
      status: newStatus,
      budget: Number(newBudget) || 0,
      spent: 0,
      conversion: 0,
      clicks: 0
    };

    setCampaigns([newCamp, ...campaigns]);
    setNewName("");
    setNewBudget(5000);
    setNewStatus("Scheduled");
    setIsLaunchOpen(false);
    showToast(`Campaign ${newCamp.name} registered successfully!`);
  };

  const handleStartCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => {
      if (c.id === campaignId) {
        showToast(`Campaign ${c.name} has been activated!`);
        return { ...c, status: "Active" as const };
      }
      return c;
    }));
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const activeCount = campaigns.filter(c => c.status === "Active").length;
  const avgConversion = campaigns.filter(c => c.status === "Completed" || c.status === "Active")
                         .reduce((sum, c, _, arr) => sum + c.conversion / arr.length, 0);

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-display-sm font-bold tracking-tight text-primary">Marketing Campaigns</h1>
          <p className="text-body-md text-on-surface-variant">
            Create email marketing outreaches, track clicks, and audit conversion metrics.
          </p>
        </div>
        <Sheet open={isLaunchOpen} onOpenChange={setIsLaunchOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer self-start sm:self-center">
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
            <form onSubmit={handleLaunchCampaign} className="space-y-lg mt-lg">
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
                <Button type="submit" className="w-full bg-primary hover:bg-neutral-800 text-on-primary">
                  Deploy Campaign
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-md">
        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Active Outreaches</span>
            <Megaphone className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">{activeCount}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Live campaigns</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Total Budget</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">${totalBudget.toLocaleString()}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Approved funding</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Total Spent</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">${totalSpent.toLocaleString()}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Funds utilized</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Conversion Rate</span>
            <Percent className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">{avgConversion.toFixed(1)}%</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Average conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Campaigns List Panel */}
      <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
        <CardHeader className="pb-6 p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md border-b border-outline-variant">
          <CardTitle className="text-title-lg font-bold text-primary">Campaign Audit Log</CardTitle>
          <div className="flex items-center gap-md">
            <div className="flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant focus-within:border-primary transition-all w-full max-w-sm">
              <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
              <Input 
                className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0" 
                placeholder="Search campaigns..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-xs border border-outline-variant rounded-lg p-0.5 bg-surface-container shrink-0">
              {["All", "Active", "Scheduled", "Completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-sm py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    statusFilter === status 
                      ? "bg-surface-container-lowest text-primary font-bold shadow-sm" 
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-lg pt-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-bold text-on-surface-variant">
                <th className="py-md pr-md">Campaign ID</th>
                <th className="py-md px-md">Campaign Name</th>
                <th className="py-md px-md">Status</th>
                <th className="py-md px-md">Budget ($)</th>
                <th className="py-md px-md">Spent ($)</th>
                <th className="py-md px-md">Conversion Rate</th>
                <th className="py-md pl-md text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-lg text-center text-on-surface-variant">
                    No campaigns found matching filter settings.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-md pr-md font-mono text-xs font-semibold text-primary">{c.id}</td>
                    <td className="py-md px-md font-semibold text-primary">{c.name}</td>
                    <td className="py-md px-md">
                      <Badge className={`text-[11px] font-bold px-2 py-0.5 rounded-full border-none shadow-none ${
                        c.status === "Active" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : c.status === "Scheduled"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-zinc-100 text-zinc-800"
                      }`}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-md px-md font-medium text-primary">${c.budget.toLocaleString()}</td>
                    <td className="py-md px-md text-on-surface-variant">${c.spent.toLocaleString()}</td>
                    <td className="py-md px-md">
                      <div className="flex items-center gap-sm">
                        <span className="w-10 text-xs font-semibold">{c.conversion}%</span>
                        <div className="flex-1 w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${c.conversion * 5}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-md pl-md text-right">
                      {c.status === "Scheduled" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs flex items-center gap-xs ml-auto cursor-pointer"
                          onClick={() => handleStartCampaign(c.id)}
                        >
                          <Play className="w-3 h-3 text-on-surface-variant" />
                          Launch Now
                        </Button>
                      ) : (
                        <span className="text-xs text-on-surface-variant italic font-sans flex items-center justify-end gap-xs py-1">
                          <Award className="w-3 h-3" />
                          Logged
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
