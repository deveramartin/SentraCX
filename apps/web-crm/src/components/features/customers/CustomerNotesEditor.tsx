"use client";

import React, { useState } from "react";
import { Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Internal Notes</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </Button>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg border border-border text-sm text-foreground">
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
    <div className="space-y-2">
      <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Edit Notes</Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="Enter internal notes about this customer..."
        className="text-sm"
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setNotes(initialNotes || "");
            setIsEditing(false);
          }}
          disabled={isSaving}
          className="h-8 text-xs gap-1"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="h-8 text-xs gap-1"
        >
          <Check className="w-3.5 h-3.5" />
          {isSaving ? "Saving..." : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}
