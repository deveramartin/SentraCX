"use client";

import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { crmClient } from "@/lib/api/crm-client";
import { toast } from "sonner";

interface CustomerNotesEditorProps {
  customerId: string;
  initialNotes?: string | null;
  onUpdated: (newNotes: string) => void;
}

export function CustomerNotesEditor({
  customerId,
  initialNotes,
  onUpdated,
}: CustomerNotesEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(initialNotes || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await crmClient.customers.updateNotes(customerId, { notes });
      toast.success("Customer notes updated successfully.");
      onUpdated(notes);
      setIsEditing(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update notes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-xs">
        <div className="flex items-center justify-between">
          <label className="text-label-sm font-semibold text-primary">Internal Notes</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs gap-xs text-muted-foreground hover:text-primary"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
        </div>
        <div className="p-md bg-surface-container-low rounded-lg border border-outline-variant text-body-sm text-on-surface">
          {initialNotes ? (
            <p className="whitespace-pre-wrap">{initialNotes}</p>
          ) : (
            <p className="italic text-muted-foreground">No notes recorded for this customer.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-xs">
      <label className="text-label-sm font-semibold text-primary block">Edit Notes</label>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Enter internal notes about this customer..."
        className="bg-surface-container-lowest border-outline-variant text-body-sm"
      />
      <div className="flex justify-end gap-xs pt-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNotes(initialNotes || "");
            setIsEditing(false);
          }}
          disabled={isSaving}
          className="h-8 text-xs gap-xs"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 text-xs gap-xs bg-primary text-on-primary hover:bg-neutral-800"
        >
          <Check className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
