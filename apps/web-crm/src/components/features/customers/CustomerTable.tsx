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
      <div className="space-y-2 py-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-sm font-medium">No customers found.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Try searching with a different keyword or create a new customer record.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border rounded-md border-border">
      <Table className="min-w-[600px] w-full text-left text-sm">
        <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-[30%]">Customer Name</TableHead>
            <TableHead className="w-[30%]">Email</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[12%]">Status</TableHead>
            <TableHead className="w-[13%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {customers.map((c) => (
            <TableRow key={c.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-semibold text-foreground">
                <Link
                  href={`/customers/${c.id}`}
                  className="hover:underline hover:text-primary transition-colors"
                >
                  {c.displayName}
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs sm:text-sm">{c.email}</TableCell>
              <TableCell>
                <CustomerTypeBadge customerType={c.customerType} />
              </TableCell>
              <TableCell>
                <CustomerStatusBadge status={c.status} />
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
    </div>
  );
}
