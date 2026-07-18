"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCustomer } from "@/hooks/useCustomer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerStatusControl } from "./CustomerStatusControl";
import { CustomerTypeControl } from "./CustomerTypeControl";
import { CustomerOverviewTab } from "./CustomerOverviewTab";
import { CustomerMarketingHistoryTab } from "./CustomerMarketingHistoryTab";
import { CustomerOrderHistoryTab } from "./CustomerOrderHistoryTab";

interface CustomerDetailProps {
  customerId: string;
}

export function CustomerDetail({ customerId }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { customer, isLoading, error, refetch, setCustomer } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="w-full min-h-full p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="w-full min-h-full p-4 sm:p-6 md:p-8 space-y-4 max-w-7xl mx-auto">
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Button>
        </Link>
        <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-center">
          <p className="font-bold text-base">Customer Not Found</p>
          <p className="text-sm mt-1">{error || "The requested customer profile could not be loaded."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const initials = customer.displayName
    ? customer.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CU";

  return (
    <div className="w-full min-h-full p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back Navigation */}
      <div>
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Header Card - Mobile First */}
      <div className="p-4 sm:p-6 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 sm:w-14 sm:h-14 border border-border">
            {customer.profileImage && <AvatarImage src={customer.profileImage} alt={customer.displayName} />}
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 overflow-hidden">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">{customer.displayName}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{customer.email}</p>
          </div>
        </div>

        {/* Dynamic Controls - Stacked on mobile */}
        <div className="flex flex-wrap items-center gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
          <CustomerStatusControl
            customerId={customer.id}
            currentStatus={customer.status}
            onUpdated={(status) => setCustomer({ ...customer, status })}
          />
          <CustomerTypeControl
            customerId={customer.id}
            currentType={customer.customerType}
            onUpdated={(customerType) => setCustomer({ ...customer, customerType })}
          />
        </div>
      </div>

      {/* Three Tabs View */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-9 p-1">
            <TabsTrigger value="overview" className="text-xs font-semibold">
              Overview
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs font-semibold">
              Marketing History
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs font-semibold">
              Order History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-4 sm:p-6 bg-card border border-border rounded-xl">
          <CustomerOverviewTab
            customer={customer}
            onCustomerUpdated={(updated) => setCustomer(updated)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </TabsContent>

        <TabsContent value="marketing" className="p-4 sm:p-6 bg-card border border-border rounded-xl">
          <CustomerMarketingHistoryTab customerId={customer.id} />
        </TabsContent>

        <TabsContent value="orders" className="p-4 sm:p-6 bg-card border border-border rounded-xl">
          <CustomerOrderHistoryTab customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
