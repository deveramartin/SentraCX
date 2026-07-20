"use client";

import React, { useState } from "react";
import { Save, Shield, Bell, Network } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="space-y-sm">
        <h1 className="text-headline-md font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-body-md text-muted-foreground">
          Configure general preferences, alert triggers, and backend microservice bindings.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full space-y-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-md border-b border-border pb-2">
          <TabsList className="bg-muted w-full md:w-auto flex justify-start">
            <TabsTrigger value="general" className="font-semibold text-label-md cursor-pointer">General</TabsTrigger>
            <TabsTrigger value="notifications" className="font-semibold text-label-md cursor-pointer">Notifications</TabsTrigger>
            <TabsTrigger value="integration" className="font-semibold text-label-md cursor-pointer">Integrations</TabsTrigger>
          </TabsList>
          
          <Button 
            onClick={handleSave}
            className="self-start md:self-center"
          >
            <Save />
            Save Changes
          </Button>
        </div>

        {/* General Content */}
        <TabsContent value="general">
          <Card className="bg-card border-border rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-foreground flex items-center gap-sm">
                <Shield className="w-5 h-5" />
                General System Parameters
              </CardTitle>
              <CardDescription className="text-body-sm text-muted-foreground">
                Core configurations for the SentraCX tenant.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">Portal Name</label>
                  <Input 
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">SLA Response Limit (Hours)</label>
                  <Input 
                    type="number"
                    value={slaHours}
                    onChange={(e) => setSlaHours(Number(e.target.value))}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Content */}
        <TabsContent value="notifications">
          <Card className="bg-card border-border rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-foreground flex items-center gap-sm">
                <Bell className="w-5 h-5" />
                Notification Subscriptions
              </CardTitle>
              <CardDescription className="text-body-sm text-muted-foreground">
                Toggle dispatch settings for staff alerts and client events.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-lg">
              <div className="flex items-center justify-between py-xs">
                <div>
                  <h4 className="text-body-sm font-bold text-foreground">Priority Email Alerts</h4>
                  <p className="text-body-sm text-muted-foreground">Dispatched when churn risk predictions cross 60% limit.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors relative outline-none cursor-pointer ${
                    emailAlerts ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span className={`w-4 h-4 bg-background rounded-full absolute top-1 left-1 transition-transform ${
                    emailAlerts ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-xs border-t border-border pt-lg">
                <div>
                  <h4 className="text-body-sm font-bold text-foreground">Weekly AI Forecasts</h4>
                  <p className="text-body-sm text-muted-foreground">Receive weekly updates on customer lifetime predictions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyReports(!weeklyReports)}
                  className={`w-11 h-6 rounded-full transition-colors relative outline-none cursor-pointer ${
                    weeklyReports ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span className={`w-4 h-4 bg-background rounded-full absolute top-1 left-1 transition-transform ${
                    weeklyReports ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Content */}
        <TabsContent value="integration">
          <Card className="bg-card border-border rounded-xl shadow-none">
            <CardHeader className="p-lg">
              <CardTitle className="text-title-lg font-bold text-foreground flex items-center gap-sm">
                <Network className="w-5 h-5" />
                Backend Endpoints Config
              </CardTitle>
              <CardDescription className="text-body-sm text-muted-foreground">
                Configure endpoints for REST API communications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-lg pt-0 space-y-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">CRM Core URL</label>
                  <Input 
                    value={crmUrl}
                    onChange={(e) => setCrmUrl(e.target.value)}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-sm font-semibold text-foreground block">AI Analytics Microservice URL</label>
                  <Input 
                    value={analyticsUrl}
                    onChange={(e) => setAnalyticsUrl(e.target.value)}
                    className="bg-muted/50 border-border focus:border-primary text-body-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
