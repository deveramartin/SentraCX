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
import { Label } from "@/components/ui/label";
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
      const firstError = validation.error.issues[0]?.message || "Validation failed.";
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
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto p-6">
        <SheetHeader className="pb-md">
          <SheetTitle className="text-headline-md font-bold">Add Customer Profile</SheetTitle>
          <SheetDescription className="text-body-sm text-muted-foreground">
            Create a new customer profile in the CRM database.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-md mt-xs">
          {formError && (
            <div className="p-sm text-body-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <Label htmlFor="firstName" className="text-label-sm font-semibold">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g. Olivia"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="lastName" className="text-label-sm font-semibold">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g. Vance"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-xs">
            <Label htmlFor="email" className="text-label-sm font-semibold">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. olivia@vance-media.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-xs">
            <Label htmlFor="phone" className="text-label-sm font-semibold">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g. +1 555-0192"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-xs">
            <Label htmlFor="type" className="text-label-sm font-semibold">Customer Type *</Label>
            <Select
              value={customerType}
              onValueChange={(val) => setCustomerType(val as CustomerType)}
              disabled={isSubmitting}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="InstitutionalBuyer">Institutional Buyer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-md flex flex-col sm:flex-row gap-sm">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full sm:flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1"
            >
              {isSubmitting ? "Saving..." : "Create Profile"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
