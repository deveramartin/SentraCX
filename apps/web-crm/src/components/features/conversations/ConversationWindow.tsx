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
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat window Header */}
      <div className="p-md border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-md">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
              {activeChat.customerName.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-label-md font-bold text-foreground">
              {activeChat.customerName}
            </h3>
            <p className="text-label-sm text-success flex items-center gap-xs font-medium">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
              Active Support Channel
            </p>
          </div>
        </div>
        <Badge className="bg-muted text-foreground hover:bg-muted border-none shadow-none text-label-sm font-bold py-1 px-3">
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
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-muted border border-border text-foreground rounded-tl-none"
                }`}
              >
                <p className="text-body-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                <span
                  className={`text-label-sm block text-right font-mono ${
                    isAgent ? "text-primary-foreground/75" : "text-muted-foreground"
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
        className="p-md border-t border-border bg-card flex gap-md"
      >
        <Input
          placeholder="Type message here..."
          value={typedMessage}
          onChange={(e) => onTypedMessageChange(e.target.value)}
          className="flex-1 bg-muted/50 border-border text-body-sm"
        />
        <Button type="submit" size="icon">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
