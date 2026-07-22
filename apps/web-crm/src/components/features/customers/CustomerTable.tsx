import React from "react";
import Link from "next/link";
import { Trash2, Search } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { CustomerListItem } from "@/types/customer";
import { CustomerStatusBadge } from "./CustomerStatusBadge";
import { CustomerTypeBadge } from "./CustomerTypeBadge";

interface CustomerTableProps {
  customers: CustomerListItem[];
  isLoading: boolean;
  onDeleteClick: (customer: CustomerListItem) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function CustomerTable({
  customers,
  isLoading,
  onDeleteClick,
  searchQuery,
  onSearchChange,
}: CustomerTableProps) {
  return (
    <div className="w-full border rounded-md border-border overflow-hidden bg-card">
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/20">
        <Search className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-8 p-0 text-body-sm flex-1"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full overflow-x-auto">
        {isLoading ? (
          <div className="space-y-2 py-4 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-body-sm font-medium">No customers found.</p>
            <p className="text-label-sm text-muted-foreground mt-xs">
              Try searching with a different keyword or create a new customer record.
            </p>
          </div>
        ) : (
          <Table className="min-w-[700px] w-full text-left text-body-sm">
            <TableHeader>
          <TableRow className="border-b border-border">
            <TableHead className="w-[20%]">Customer Name</TableHead>
            <TableHead className="w-[20%]">Email</TableHead>
            <TableHead className="w-[15%]">Phone</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[10%]">Created At</TableHead>
            <TableHead className="w-[10%] text-right">Actions</TableHead>
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
              <TableCell className="text-muted-foreground text-body-sm">{c.email}</TableCell>
              <TableCell className="text-muted-foreground text-body-sm">{c.phoneNumber || "-"}</TableCell>
              <TableCell>
                <CustomerTypeBadge customerType={c.customerType} />
              </TableCell>
              <TableCell>
                <CustomerStatusBadge status={c.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-body-sm">
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
        )}
      </div>
    </div>
  );
}
