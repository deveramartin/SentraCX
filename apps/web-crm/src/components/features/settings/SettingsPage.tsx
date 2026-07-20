"use client";

import React, { useState } from "react";
import { Save, Shield, Bell, Network } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface SettingsFormValues {
  systemName: string;
  slaHours: number;
  emailAlerts: boolean;
  weeklyReports: boolean;
  crmUrl: string;
  analyticsUrl: string;
}

export function SettingsPage() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const form = useForm<SettingsFormValues>({
    defaultValues: {
      systemName: "SentraCX Portal",
      slaHours: 24,
      emailAlerts: true,
      weeklyReports: false,
      crmUrl: "https://localhost:5001",
      analyticsUrl: "https://localhost:4005",
    },
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const onSubmit = (_values: SettingsFormValues) => {
    showToast("Configuration settings updated successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 md:px-6 space-y-8 flex flex-col justify-center min-h-[calc(100vh-6rem)]">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="space-y-1 text-left">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">System Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure general preferences, alert triggers, and backend microservice bindings.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-3">
              <TabsList className="bg-muted w-full sm:w-auto flex justify-start overflow-x-auto">
                <TabsTrigger value="general" className="font-semibold text-sm cursor-pointer">General</TabsTrigger>
                <TabsTrigger value="notifications" className="font-semibold text-sm cursor-pointer">Notifications</TabsTrigger>
                <TabsTrigger value="integration" className="font-semibold text-sm cursor-pointer">Integrations</TabsTrigger>
              </TabsList>
              
              <Button 
                type="submit"
                className="w-full sm:w-auto self-start sm:self-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            {/* General Content */}
            <TabsContent value="general">
              <Card className="bg-card border border-border rounded-xl shadow-none">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    General System Parameters
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Core configurations for the SentraCX tenant.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="systemName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portal Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slaHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SLA Response Limit (Hours)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Content */}
            <TabsContent value="notifications">
              <Card className="bg-card border border-border rounded-xl shadow-none">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notification Subscriptions
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Toggle dispatch settings for staff alerts and client events.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-6">
                  <FormField
                    control={form.control}
                    name="emailAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between py-2 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-bold text-foreground cursor-pointer">Priority Email Alerts</FormLabel>
                          <p className="text-xs sm:text-sm text-muted-foreground">Dispatched when churn risk predictions cross 60% limit.</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weeklyReports"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between py-2 border-t border-border pt-4 space-y-0">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-bold text-foreground cursor-pointer">Weekly AI Forecasts</FormLabel>
                          <p className="text-xs sm:text-sm text-muted-foreground">Receive weekly updates on customer lifetime predictions.</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integration Content */}
            <TabsContent value="integration">
              <Card className="bg-card border border-border rounded-xl shadow-none">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    Backend Endpoints Config
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Configure endpoints for REST API communications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="crmUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CRM Core URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="analyticsUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AI Analytics Microservice URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
