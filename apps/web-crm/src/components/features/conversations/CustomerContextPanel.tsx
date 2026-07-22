"use client";

import React from "react";
import { User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/ticket";

interface CustomerContextPanelProps {
  ticket: Ticket | null;
  onUseTemplate: (text: string) => void;
}

export function CustomerContextPanel({ ticket, onUseTemplate }: CustomerContextPanelProps) {
  const smartReply =
    "I checked the API access token scopes for your account. The keys have been re-verified. Please try generating a new token from the dashboard.";

  if (!ticket) {
    return (
      <div className="hidden lg:flex w-72 border-l border-border flex-col h-full bg-card p-lg items-center justify-center text-muted-foreground text-body-sm shrink-0">
        No context available
      </div>
    );
  }

  return (
    <div className="hidden lg:flex w-72 border-l border-border flex-col h-full bg-card p-lg space-y-lg overflow-y-auto shrink-0">
      <h3 className="text-label-md font-bold text-foreground flex items-center gap-sm">
        <User className="w-4 h-4" />
        Customer Context
      </h3>

      {/* Client Identity */}
      <div className="space-y-sm bg-muted/50 border border-border rounded-xl p-md">
        <p className="text-label-sm text-muted-foreground font-mono">CLIENT IDENTITY</p>
        <div className="space-y-xs">
          <h4 className="text-body-sm font-bold text-foreground">{ticket.customerName}</h4>
          <p className="text-label-sm text-muted-foreground font-mono truncate">{ticket.customerId}</p>
        </div>
      </div>

      {/* Financial Metrics Placeholder */}
      <div className="space-y-sm bg-muted/50 border border-border rounded-xl p-md">
        <p className="text-label-sm text-muted-foreground font-mono">FINANCIAL METRICS</p>
        <div className="flex justify-between items-baseline">
          <span className="text-body-sm text-muted-foreground">LTV (CLV)</span>
          {/* TODO: Wire CLV and churn risk from the AI Analytics service once the ai-analytics → web-crm integration sprint is planned. */}
          <span className="text-label-md font-bold text-foreground">—</span>
        </div>
      </div>

      {/* AI Predictive Insights Placeholder */}
      <div className="space-y-sm bg-muted/50 border border-border rounded-xl p-md">
        <p className="text-label-sm text-muted-foreground font-mono">AI PREDICTIVE INSIGHTS</p>
        <div className="flex justify-between items-center">
          <span className="text-body-sm text-muted-foreground">Churn Risk</span>
          <Badge variant="outline" className="text-label-sm font-bold">
            —
          </Badge>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-muted-foreground/30 w-0" />
        </div>
      </div>

      {/* AI Suggested Smart Reply */}
      <div className="space-y-sm border border-border rounded-xl p-md bg-muted text-foreground">
        <div className="flex items-center gap-xs text-label-sm text-foreground font-mono">
          <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
          AI SUGGESTED SMART REPLY
        </div>
        <p className="text-body-sm italic leading-relaxed text-muted-foreground">
          &quot;{smartReply}&quot;
        </p>
        <Button
          variant="default"
          size="sm"
          className="w-full bg-primary text-primary-foreground font-bold text-label-sm mt-xs shadow-xs"
          onClick={() => onUseTemplate(smartReply)}
        >
          Use Template
        </Button>
      </div>
    </div>
  );
}
