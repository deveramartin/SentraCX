"use client";

import React, { useState } from "react";
import { Search, Plus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomerListItem } from "@/types/customer";
import { CustomerTable } from "./CustomerTable";
import { CustomerFormSheet } from "./CustomerFormSheet";
import { DeleteCustomerDialog } from "./DeleteCustomerDialog";

export function CustomerProfiles() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CustomerListItem | null>(null);

  const { customers, totalCount, totalPages, isLoading, error, refetch } = useCustomers({
    page,
    pageSize: 20,
    search: searchQuery,
  });

  return (
    <div className="w-full min-h-full p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner - Mobile-first layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Customer Profiles</h1>
          <p className="text-sm text-muted-foreground">
            Manage customer records, contact profiles, and transactional details.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border-border">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">{totalCount}</span>
            <p className="text-xs text-muted-foreground mt-1">Registered CRM accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Customers Table Card */}
      <Card className="shadow-none border-border flex flex-col">
        <CardHeader className="pb-4 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-bold">Customer Registry</CardTitle>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              className="pl-9 h-9 text-sm"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 pt-0 overflow-x-auto">
          <CustomerTable
            customers={customers}
            isLoading={isLoading}
            onDeleteClick={(cust) => setDeleteTarget(cust)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border mt-4">
              <span className="text-xs text-muted-foreground order-2 sm:order-1">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex-1 sm:flex-none"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex-1 sm:flex-none"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs and Sheets */}
      <CustomerFormSheet
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSuccess={() => refetch()}
      />

      <DeleteCustomerDialog
        customer={deleteTarget}
        open={deleteTarget !== null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onDeleted={() => refetch()}
      />
    </div>
  );
}
