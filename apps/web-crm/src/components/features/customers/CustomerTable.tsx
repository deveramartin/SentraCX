"use client";

import React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerListItem } from "@/types/customer";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { CustomerTypeBadge } from "./CustomerTypeBadge";

interface CustomerTableProps {
  customers: CustomerListItem[];
  isLoading: boolean;
  onDeleteClick: (customer: CustomerListItem) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  onDeleteClick,
}: CustomerTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-sm py-md">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="py-2xl text-center text-on-surface-variant">
        <p className="text-body-md font-medium">No customers found.</p>
        <p className="text-body-sm text-muted-foreground mt-xs">
          Try searching with a different keyword or create a new customer record.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-outline-variant text-label-sm font-bold">
          <TableHead>Customer Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Customer Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="divide-y divide-outline-variant">
        {customers.map((c) => (
          <TableRow key={c.id} className="hover:bg-surface-container-low transition-colors">
            <TableCell className="font-semibold text-primary">
              <Link
                href={`/customers/${c.id}`}
                className="hover:underline hover:text-accent-foreground cursor-pointer"
              >
                {c.displayName}
              </Link>
            </TableCell>
            <TableCell className="text-on-surface-variant text-body-sm">{c.email}</TableCell>
            <TableCell>
              <CustomerTypeBadge customerType={c.customerType} />
            </TableCell>
            <TableCell>
              <CustomerStatusBadge status={c.status} />
            </TableCell>
            <TableCell className="text-xs text-muted-foreground font-mono">
              {new Date(c.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteClick(c)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                title="Delete customer"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
