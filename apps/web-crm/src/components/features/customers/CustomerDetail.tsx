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
      <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-lg">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-md">
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="gap-xs text-xs">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Button>
        </Link>
        <div className="p-xl bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
          <p className="font-bold text-body-md">Customer Not Found</p>
          <p className="text-body-sm mt-xs">{error || "The requested customer profile could not be loaded."}</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-md">
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
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-xl">
      {/* Back Navigation */}
      <div>
        <Link href="/customers">
          <Button variant="ghost" size="sm" className="gap-xs text-xs font-semibold text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Header Card */}
      <div className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <Avatar className="w-14 h-14 border border-outline-variant">
            {customer.profileImage && <AvatarImage src={customer.profileImage} alt={customer.displayName} />}
            <AvatarFallback className="bg-primary text-on-primary font-bold text-title-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-xs">
            <h1 className="text-headline-md font-bold text-primary">{customer.displayName}</h1>
            <p className="text-body-sm text-on-surface-variant">{customer.email}</p>
          </div>
        </div>

        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-md border-t md:border-t-0 pt-md md:pt-0 border-outline-variant">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-md">
        <TabsList className="bg-surface-container-low border border-outline-variant p-1 rounded-lg">
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

        <TabsContent value="overview" className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl">
          <CustomerOverviewTab
            customer={customer}
            onCustomerUpdated={(updated) => setCustomer(updated)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        </TabsContent>

        <TabsContent value="marketing" className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl">
          <CustomerMarketingHistoryTab customerId={customer.id} />
        </TabsContent>

        <TabsContent value="orders" className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl">
          <CustomerOrderHistoryTab customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
