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
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-display-sm font-bold tracking-tight text-primary">Customer Profiles</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage customer records, contact profiles, and transactional details.
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </Button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Total Customers</span>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">{totalCount}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Registered CRM accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-md bg-red-50 border border-red-200 text-red-700 rounded-lg text-body-sm flex justify-between items-center">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Customers Table Card */}
      <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
        <CardHeader className="pb-6 p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md">
          <CardTitle className="text-title-lg font-bold text-primary">Customer Registry</CardTitle>
          <div className="flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant focus-within:border-primary transition-all w-full max-w-sm">
            <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
            <Input
              className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </CardHeader>

        <CardContent className="p-lg pt-0 overflow-x-auto">
          <CustomerTable
            customers={customers}
            isLoading={isLoading}
            onDeleteClick={(cust) => setDeleteTarget(cust)}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-lg border-t border-outline-variant mt-md">
              <span className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-xs">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
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
