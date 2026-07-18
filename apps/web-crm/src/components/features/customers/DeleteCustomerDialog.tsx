"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { crmClient } from "@/lib/api/crm-client";
import { CustomerListItem } from "@/types/customer";
import { toast } from "sonner";

interface DeleteCustomerDialogProps {
  customer: CustomerListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
  onDeleted,
}: DeleteCustomerDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!customer) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await crmClient.customers.delete(customer.id);
      toast.success(`Customer "${customer.displayName}" has been deleted.`);
      onDeleted();
      onOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete customer.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-surface border-outline-variant">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-primary">Delete Customer Record</AlertDialogTitle>
          <AlertDialogDescription className="text-on-surface-variant">
            Are you sure you want to delete <strong className="text-primary">{customer.displayName}</strong>?
            This action will soft-delete the customer profile from the CRM database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete Customer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
