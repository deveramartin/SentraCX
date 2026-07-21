"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { crmClient } from "@/lib/api/crm-client";
import { CreatePromotionInput, PromotionType } from "@/types/promotion";

interface PromotionFormSheetProps {
  onSuccess: () => void;
  onShowToast: (msg: string) => void;
}

const TYPES: PromotionType[] = ["Discount", "Voucher", "FreeShipping", "BuyOneGetOne", "Cashback"];

export function PromotionFormSheet({ onSuccess, onShowToast }: PromotionFormSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreatePromotionInput>({
    defaultValues: {
      title: "",
      description: "",
      promotionType: "Discount",
      discountValue: undefined,
      voucherCode: "",
      startDate: "",
      endDate: "",
    },
  });

  const selectedType = form.watch("promotionType");

  const onSubmit = async (values: CreatePromotionInput, targetStatus: "Draft" | "Active") => {
    if (!values.title.trim() || !values.description.trim()) {
      onShowToast("Please fill in required title and description.");
      return;
    }
    if (selectedType === "Voucher" && !values.voucherCode?.trim()) {
      onShowToast("Voucher code is required for Voucher type.");
      return;
    }
    if ((selectedType === "Discount" || selectedType === "Cashback") && (values.discountValue == null || isNaN(Number(values.discountValue)))) {
      onShowToast("Discount value is required for Discount/Cashback.");
      return;
    }

    try {
      const payload: CreatePromotionInput = {
        ...values,
        discountValue: values.discountValue ? Number(values.discountValue) : undefined,
        status: targetStatus,
      };

      const created = await crmClient.promotions.create(payload);
      onShowToast(`Promotion ${created.title} saved as ${targetStatus}!`);
      form.reset();
      setIsOpen(false);
      onSuccess();
    } catch (err) {
      onShowToast(err instanceof Error ? err.message : "Failed to create promotion");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if (!val) form.reset(); setIsOpen(val); }}>
      <DialogTrigger asChild>
        <Button className="self-start sm:self-center">
          <Plus className="w-4 h-4 mr-2" />
          New Promotion
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[80vw] md:max-w-[700px] lg:max-w-[900px] max-h-[90vh] overflow-y-auto p-4 sm:p-6 rounded-lg sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <DialogTitle className="text-xl font-bold">Create Promotion</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Configure offer type, discount rules, and schedule.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4 py-2">
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel>Promotion Title *</FormLabel>
                <FormControl><Input placeholder="e.g. Summer Flash Sale 20%" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl><Textarea rows={2} placeholder="Promotion terms and details..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="promotionType" render={({ field }) => (
              <FormItem>
                <FormLabel>Promotion Type *</FormLabel>
                <select
                  className="w-full border border-input rounded-md px-3 py-2 text-sm bg-background"
                  value={field.value} onChange={field.onChange}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormItem>
            )} />

            {(selectedType === "Discount" || selectedType === "Cashback") && (
              <FormField control={form.control} name="discountValue" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value ($ / %) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number" step="0.01" placeholder="e.g. 20"
                      {...field} value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            {selectedType === "Voucher" && (
              <FormField control={form.control} name="voucherCode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Voucher Code *</FormLabel>
                  <FormControl><Input placeholder="e.g. SUMMER20" {...field} value={field.value ?? ""} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} value={field.value ?? ""} /></FormControl>
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} value={field.value ?? ""} /></FormControl>
                </FormItem>
              )} />
            </div>

            <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => form.handleSubmit((v) => onSubmit(v, "Draft"))()}>
                Save as Draft
              </Button>
              <Button type="button" onClick={() => form.handleSubmit((v) => onSubmit(v, "Active"))()}>
                Deploy Promotion
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
