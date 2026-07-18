"use client";

import React from "react";
import { User, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Chat } from "./types";

interface CustomerContextPanelProps {
  activeChat: Chat;
  onUseTemplate: (text: string) => void;
}

export function CustomerContextPanel({ activeChat, onUseTemplate }: CustomerContextPanelProps) {
  const smartReply =
    "I checked the API access token scopes for your account. The keys have been re-verified. Please try generating a new token from the dashboard.";

  return (
    <div className="hidden lg:flex w-72 border-l border-outline-variant flex-col h-full bg-surface p-lg space-y-lg overflow-y-auto">
      <h3 className="text-label-md font-bold text-primary flex items-center gap-sm">
        <User className="w-4 h-4" />
        Customer Context
      </h3>

      <div className="space-y-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
        <p className="text-[11px] text-on-surface-variant font-mono">CLIENT IDENTITY</p>
        <div className="space-y-xs">
          <h4 className="text-body-sm font-bold text-primary">{activeChat.customerName}</h4>
          <p className="text-xs text-on-surface-variant font-mono truncate">{activeChat.email}</p>
        </div>
      </div>

      <div className="space-y-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
        <p className="text-[11px] text-on-surface-variant font-mono">FINANCIAL METRICS</p>
        <div className="flex justify-between items-baseline">
          <span className="text-body-sm text-on-surface-variant">LTV (CLV)</span>
          <span className="text-label-md font-bold text-primary">${activeChat.clv.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-sm bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
        <p className="text-[11px] text-on-surface-variant font-mono">AI PREDICTIVE INSIGHTS</p>
        <div className="flex justify-between items-center">
          <span className="text-body-sm text-on-surface-variant">Churn Risk</span>
          <Badge
            className={`text-[10px] font-bold border-none shadow-none ${
              activeChat.risk >= 40
                ? "bg-red-100 text-red-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {activeChat.risk}% Risk
          </Badge>
        </div>
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              activeChat.risk >= 40 ? "bg-red-500" : "bg-emerald-500"
            }`}
            style={{ width: `${activeChat.risk}%` }}
          />
        </div>
      </div>

      <div className="space-y-sm border border-black/5 rounded-xl p-md bg-zinc-900 text-on-primary">
        <div className="flex items-center gap-xs text-[11px] text-on-primary-container font-mono">
          <Sparkles className="w-3.5 h-3.5 text-on-primary animate-pulse" />
          AI SUGGESTED SMART REPLY
        </div>
        <p className="text-xs italic leading-relaxed text-on-primary/95">
          "{smartReply}"
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="w-full text-xs font-bold mt-xs"
          onClick={() => onUseTemplate(smartReply)}
        >
          Use Template
        </Button>
      </div>
    </div>
  );
}
