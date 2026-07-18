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
    <div className="w-full md:w-80 border-r border-outline-variant flex flex-col h-full bg-surface">
      <div className="p-md border-b border-outline-variant flex items-center justify-between">
        <h2 className="text-title-lg font-bold text-primary flex items-center gap-sm">
          <MessageSquare className="w-5 h-5" />
          Conversations
        </h2>
        <Badge className="bg-primary text-on-primary border-none shadow-none">
          {chats.filter((c) => c.unread).length} Unread
        </Badge>
      </div>
      <div className="flex-1 overflow-y-auto divide-y divide-outline-variant">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-md flex gap-md cursor-pointer transition-colors ${
              chat.id === activeChatId
                ? "bg-surface-container-high"
                : "hover:bg-surface-container-low"
            }`}
          >
            <Avatar className="h-10 h-10 shrink-0">
              <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                {chat.customerName.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h4 className="text-body-sm font-bold text-primary truncate">
                  {chat.customerName}
                </h4>
                <span className="text-[10px] text-on-surface-variant font-mono">
                  {chat.time}
                </span>
              </div>
              <p
                className={`text-[11px] truncate ${
                  chat.unread ? "text-primary font-bold" : "text-on-surface-variant"
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
