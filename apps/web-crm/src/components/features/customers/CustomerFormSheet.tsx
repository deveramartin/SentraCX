"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crmClient } from "@/lib/api/crm-client";
import { createCustomerSchema } from "@/lib/validators/customer-validators";
import { CustomerType } from "@/types/customer";
import { toast } from "sonner";

interface CustomerFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CustomerFormSheet({
  open,
  onOpenChange,
  onSuccess,
}: CustomerFormSheetProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customerType, setCustomerType] = useState<CustomerType>("Regular");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setCustomerType("Regular");
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validation = createCustomerSchema.safeParse({
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || undefined,
      customerType,
    });

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Validation failed.";
      setFormError(firstError);
      return;
    }

    setIsSubmitting(true);
    try {
      await crmClient.customers.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        customerType,
      });

      toast.success(`Customer "${firstName} ${lastName}" created successfully!`);
      resetForm();
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create customer profile.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(val) => { if (!val) resetForm(); onOpenChange(val); }}>
      <SheetContent className="bg-surface border-outline-variant w-[400px] sm:w-[540px]">
        <SheetHeader className="pb-lg">
          <SheetTitle className="text-headline-md font-bold text-primary">Add Customer Profile</SheetTitle>
          <SheetDescription className="text-body-sm text-on-surface-variant">
            Create a new customer profile in the CRM database.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-lg mt-lg">
          {formError && (
            <div className="p-sm text-xs text-red-600 bg-red-50 border border-red-200 rounded-md">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-xs">
              <label className="text-label-sm font-semibold text-primary block">First Name *</label>
              <Input
                placeholder="e.g. Olivia"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
                className="bg-surface-container-lowest border-outline-variant"
              />
            </div>
            <div className="space-y-xs">
              <label className="text-label-sm font-semibold text-primary block">Last Name *</label>
              <Input
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
                className="bg-surface-container-lowest border-outline-variant"
              />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Email Address *</label>
            <Input
              type="email"
              placeholder="e.g. olivia@vance-media.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className="bg-surface-container-lowest border-outline-variant"
            />
          </div>

          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Phone Number</label>
            <Input
              type="tel"
              placeholder="e.g. +1 555-0192"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
              className="bg-surface-container-lowest border-outline-variant"
            />
          </div>

          <div className="space-y-xs">
            <label className="text-label-sm font-semibold text-primary block">Customer Type *</label>
            <Select
              value={customerType}
              onValueChange={(val) => setCustomerType(val as CustomerType)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="bg-surface-container-lowest border-outline-variant">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="InstitutionalBuyer">Institutional Buyer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-xl flex gap-md">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-on-primary hover:bg-neutral-800"
            >
              {isSubmitting ? "Saving..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
