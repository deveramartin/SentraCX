"use client";

import React from "react";
import { Customer } from "@/types/customer";
import { CustomerNotesEditor } from "./CustomerNotesEditor";
import { useCustomerOrders } from "@/hooks/useCustomerOrders";
import { useCustomerMarketingHistory } from "@/hooks/useCustomerMarketingHistory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerOverviewTabProps {
  customer: Customer;
  onCustomerUpdated: (updated: Customer) => void;
  onSelectTab: (tab: string) => void;
}

export function CustomerOverviewTab({
  customer,
  onCustomerUpdated,
  onSelectTab,
}: CustomerOverviewTabProps) {
  const { orders } = useCustomerOrders(customer.id);
  const { interactions } = useCustomerMarketingHistory({ customerId: customer.id, page: 1, pageSize: 5 });

  const recentOrders = orders.slice(0, 5);
  const recentInteractions = interactions.slice(0, 5);

  return (
    <div className="space-y-xl">
      {/* Basic Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg bg-surface-container-low p-lg rounded-xl border border-outline-variant">
        <div className="space-y-xs">
          <span className="text-label-sm font-semibold text-muted-foreground block">Email</span>
          <p className="text-body-sm font-medium text-primary">{customer.email}</p>
        </div>
        <div className="space-y-xs">
          <span className="text-label-sm font-semibold text-muted-foreground block">Phone</span>
          <p className="text-body-sm font-medium text-primary">{customer.phoneNumber || "—"}</p>
        </div>
        <div className="space-y-xs">
          <span className="text-label-sm font-semibold text-muted-foreground block">Customer Type</span>
          <p className="text-body-sm font-medium text-primary">{customer.customerType}</p>
        </div>
        <div className="space-y-xs">
          <span className="text-label-sm font-semibold text-muted-foreground block">Account Created</span>
          <p className="text-body-sm font-medium text-primary">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Notes Section */}
      <CustomerNotesEditor
        customerId={customer.id}
        initialNotes={customer.notes}
        onUpdated={(newNotes) =>
          onCustomerUpdated({ ...customer, notes: newNotes })
        }
      />

      {/* Recent Orders Preview */}
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-label-md font-bold text-primary">Recent Orders</h3>
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectTab("orders")}
            className="text-xs p-0 h-auto font-semibold text-primary"
          >
            View all ({orders.length})
          </Button>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No recent orders recorded.</p>
        ) : (
          <div className="space-y-xs">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between p-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
              >
                <span className="font-semibold text-primary">{o.orderNumber}</span>
                <span className="font-medium">${o.totalAmount.toLocaleString()}</span>
                <Badge variant="outline" className="text-[10px]">
                  {o.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Marketing Preview */}
      <div className="space-y-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-label-md font-bold text-primary">Recent Marketing Interactions</h3>
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectTab("marketing")}
            className="text-xs p-0 h-auto font-semibold text-primary"
          >
            View all
          </Button>
        </div>
        {recentInteractions.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">No recent marketing interactions.</p>
        ) : (
          <div className="space-y-xs">
            {recentInteractions.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-sm bg-surface-container-lowest border border-outline-variant rounded-lg text-xs"
              >
                <span className="font-semibold text-primary">{m.title}</span>
                <Badge variant="outline" className="text-[10px]">
                  {m.channel}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
