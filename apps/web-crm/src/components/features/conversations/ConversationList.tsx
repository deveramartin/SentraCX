"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Chat } from "./types";

interface ConversationListProps {
  chats: Chat[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
}

export function ConversationList({ chats, activeChatId, onSelectChat }: ConversationListProps) {
  return (
    <div className="w-full md:w-80 border-r border-border flex flex-col h-full bg-card">
      <div className="p-md border-b border-border flex items-center justify-between">
        <h2 className="text-title-lg font-bold text-foreground flex items-center gap-sm">
          <MessageSquare className="w-5 h-5" />
          Conversations
        </h2>
        <Badge className="bg-primary text-primary-foreground border-none shadow-none">
          {chats.filter((c) => c.unread).length} Unread
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-md flex gap-md cursor-pointer transition-colors ${
              chat.id === activeChatId
                ? "bg-muted"
                : "hover:bg-muted/50"
            }`}
          >
            <Avatar className="h-10 h-10 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-xs">
                {chat.customerName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-body-sm font-bold text-foreground truncate">
                  {chat.customerName}
                </h4>
                <span className="text-label-sm text-muted-foreground font-mono">
                  {chat.time}
                </span>
              </div>
              <p
                className={`text-label-sm truncate ${
                  chat.unread ? "text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                {chat.lastMessage}
              </p>
            </div>
            {chat.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary self-center" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
