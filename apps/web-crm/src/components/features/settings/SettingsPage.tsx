"use client";

import React, { useState } from "react";
import { Settings, Save, Shield, Bell, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SettingsPage() {
  const [systemName, setSystemName] = useState("SentraCX Portal");
  const [slaHours, setSlaHours] = useState(24);
  
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const [crmUrl, setCrmUrl] = useState("https://localhost:5001");
  const [analyticsUrl, setAnalyticsUrl] = useState("https://localhost:4005");

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Configuration settings updated successfully!");
  };

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="space-y-sm">
        <h1 className="text-display-sm font-bold tracking-tight text-primary">System Settings</h1>
        <p className="text-body-md text-on-surface-variant">
          Configure general preferences, alert triggers, and backend microservice bindings.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Columns - Form Content */}
        <div className="lg:col-span-2 space-y-lg">
          {/* General Section */}
          <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-primary flex items-center gap-sm">
                <Shield className="w-5 h-5" />
                General System Parameters
              </CardTitle>
              <CardDescription className="text-body-sm text-on-surface-variant">
                Core configurations for the SentraCX tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-primary block">Portal Name</label>
                  <Input 
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-primary block">SLA Response Limit (Hours)</label>
                  <Input 
                    type="number"
                    value={slaHours}
                    onChange={(e) => setSlaHours(Number(e.target.value))}
                    className="bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-primary flex items-center gap-sm">
                <Bell className="w-5 h-5" />
                Notification Subscriptions
              </CardTitle>
              <CardDescription className="text-body-sm text-on-surface-variant">
                Toggle dispatch settings for staff alerts and client events.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-lg">
              <div className="flex items-center justify-between py-xs">
                <div>
                  <h4 className="text-body-sm font-bold text-primary">Priority Email Alerts</h4>
                  <p className="text-xs text-on-surface-variant">Dispatched when churn risk predictions cross 60% limit.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative outline-none cursor-pointer ${
                    emailAlerts ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
                    emailAlerts ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-xs border-t border-outline-variant">
                <div>
                  <h4 className="text-body-sm font-bold text-primary">Weekly AI Forecasts</h4>
                  <p className="text-xs text-on-surface-variant">Receive weekly updates on customer lifetime predictions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyReports(!weeklyReports)}
                  className={`w-11 h-6 rounded-full transition-colors relative outline-none cursor-pointer ${
                    weeklyReports ? "bg-primary" : "bg-surface-container-high"
                  }`}
                >
                  <span className={`w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform ${
                    weeklyReports ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure Integration */}
          <Card className="bg-surface-container-lowest border-outline-variant rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-primary flex items-center gap-sm">
                <Network className="w-5 h-5" />
                Backend Endpoints Config
              </CardTitle>
              <CardDescription className="text-body-sm text-on-surface-variant">
                Configure endpoints for REST API communications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-primary block">CRM Core URL</label>
                  <Input 
                    value={crmUrl}
                    onChange={(e) => setCrmUrl(e.target.value)}
                    className="bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-primary block">AI Analytics Microservice URL</label>
                  <Input 
                    value={analyticsUrl}
                    onChange={(e) => setAnalyticsUrl(e.target.value)}
                    className="bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions / Summary info */}
        <div className="space-y-lg">
          <Card className="bg-surface-container-lowest border-outline-variant rounded-xl p-lg flex flex-col justify-between shadow-none">
            <div>
              <h3 className="text-title-lg font-bold text-primary flex items-center gap-sm mb-md">
                <Settings className="w-5 h-5" />
                Actions
              </h3>
              <p className="text-body-sm text-on-surface-variant mb-lg">
                Update parameters globally across the CRM Client workspace.
              </p>
              <Button type="submit" className="w-full flex items-center justify-center gap-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer py-sm">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>
            </div>
            <div className="border-t border-outline-variant pt-lg mt-lg text-[11px] text-on-surface-variant font-mono">
              Last saved: Just now
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
