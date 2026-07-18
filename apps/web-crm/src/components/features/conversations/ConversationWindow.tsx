"use client";

import React, { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Chat } from "./types";

interface ConversationWindowProps {
  activeChat: Chat;
  typedMessage: string;
  onTypedMessageChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

export function ConversationWindow({
  activeChat,
  typedMessage,
  onTypedMessageChange,
  onSendMessage,
}: ConversationWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat.messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-container-lowest">
      {/* Chat window Header */}
      <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface">
        <div className="flex items-center gap-md">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
              {activeChat.customerName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-label-md font-bold text-primary">
              {activeChat.customerName}
            </h3>
            <p className="text-[10px] text-emerald-600 flex items-center gap-xs font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Active Support Channel
            </p>
          </div>
        </div>
        <Badge className="bg-surface-container text-primary hover:bg-surface-container border-none shadow-none text-[11px] font-bold py-1 px-3">
          SSO Linked
        </Badge>
      </div>

      {/* Message Thread */}
      <div className="flex-1 p-lg overflow-y-auto space-y-md">
        {activeChat.messages.map((m, idx) => {
          const isAgent = m.sender === "agent";
          return (
            <div key={idx} className={`flex ${isAgent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[70%] p-md rounded-xl space-y-xs ${
                  isAgent
                    ? "bg-primary text-on-primary rounded-tr-none"
                    : "bg-surface-container border border-outline-variant text-primary rounded-tl-none"
                }`}
              >
                <p className="text-body-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <span
                  className={`text-[9px] block text-right font-mono ${
                    isAgent ? "text-on-primary/75" : "text-on-surface-variant"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input form */}
      <form
        onSubmit={onSendMessage}
        className="p-md border-t border-outline-variant bg-surface flex gap-md"
      >
        <Input
          placeholder="Type message here..."
          value={typedMessage}
          onChange={(e) => onTypedMessageChange(e.target.value)}
          className="flex-1 bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
        />
        <Button
          type="submit"
          size="icon"
          className="bg-primary hover:bg-neutral-800 text-on-primary cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
