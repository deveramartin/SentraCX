"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { usePromotions } from "@/hooks/usePromotions";
import { PromotionFormSheet } from "./PromotionFormSheet";
import { PromotionTable } from "./PromotionTable";

export function Promotions() {
  const [activeTab, setActiveTab] = useState<string>("Active");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const { data: promotions, isLoading, refetch } = usePromotions(activeTab);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-bold tracking-tight text-foreground">Promotions & Offers</h1>
          <p className="text-body-md text-muted-foreground">
            Manage discount campaigns, vouchers, free shipping, buy-one-get-one, and cashbacks.
          </p>
        </div>
        <PromotionFormSheet onSuccess={refetch} onShowToast={showToast} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-md">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start border-b border-border bg-transparent p-0">
          <TabsTrigger value="Active" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            All / Active
          </TabsTrigger>
          <TabsTrigger value="Draft" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Drafted
          </TabsTrigger>
          <TabsTrigger value="Cancelled" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Cancelled
          </TabsTrigger>
          <TabsTrigger value="Accomplished" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Accomplished
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="p-0 m-0">
          <PromotionTable
            promotions={promotions}
            isLoading={isLoading}
            onRefresh={refetch}
            onShowToast={showToast}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
