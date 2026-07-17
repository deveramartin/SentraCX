"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, MessageSquare, ShieldAlert, Sparkles, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface Chat {
  id: string;
  customerName: string;
  avatarUrl?: string;
  email: string;
  clv: number;
  risk: number;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: {
    sender: "agent" | "customer";
    text: string;
    time: string;
  }[];
}

export function Conversations() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "chat-1",
      customerName: "Olivia Vance",
      email: "olivia@vance-media.io",
      clv: 8500,
      risk: 12,
      lastMessage: "Is there any progress on the API key issue?",
      time: "10m ago",
      unread: true,
      messages: [
        { sender: "customer", text: "Hi, I am getting a 401 response on the endpoint.", time: "10:15 AM" },
        { sender: "agent", text: "Hello Olivia, let me check the routing logs for your account.", time: "10:20 AM" },
        { sender: "customer", text: "Is there any progress on the API key issue?", time: "10:25 AM" },
      ],
    },
    {
      id: "chat-2",
      customerName: "Jackson Reed",
      email: "j.reed@techcorp.com",
      clv: 3200,
      risk: 48,
      lastMessage: "I need to request a refund for invoice #920.",
      time: "45m ago",
      unread: false,
      messages: [
        { sender: "customer", text: "Hello, I was double charged this month.", time: "9:30 AM" },
        { sender: "agent", text: "Apologies for that. Can you provide the invoice number?", time: "9:35 AM" },
        { sender: "customer", text: "I need to request a refund for invoice #920.", time: "9:45 AM" },
      ],
    },
    {
      id: "chat-3",
      customerName: "Amara Okoro",
      email: "amara@okoro-design.ng",
      clv: 12000,
      risk: 8,
      lastMessage: "Can we schedule a call to review features?",
      time: "2h ago",
      unread: false,
      messages: [
        { sender: "agent", text: "Glad to see your account is active, Amara!", time: "Yesterday" },
        { sender: "customer", text: "Thank you! Can we schedule a call to review features?", time: "Yesterday" },
      ],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState<string>("chat-1");
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const messageText = typedMessage;
    setTypedMessage("");

    // Append agent message
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: messageText,
          time: "Just now",
          unread: false,
          messages: [
            ...chat.messages,
            { sender: "agent" as const, text: messageText, time: timeStr },
          ],
        };
      }
      return chat;
    });

    setChats(updatedChats);

    // Simulate automated client response
    setTimeout(() => {
      const clientReplies = [
        "Thanks for the update! I will check on my side.",
        "Perfect, that makes sense. Let me know when it's resolved.",
        "Understood. I will wait for your confirmation.",
        "Okay, thank you for checking this so quickly!",
      ];
      const randomReply = clientReplies[Math.floor(Math.random() * clientReplies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              lastMessage: randomReply,
              time: "Just now",
              messages: [
                ...chat.messages,
                { sender: "customer" as const, text: randomReply, time: replyTime },
              ],
            };
          }
          return chat;
        })
      );
    }, 1500);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChats(
      chats.map((c) => (c.id === chatId ? { ...c, unread: false } : c))
    );
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-background">
      {/* Left Chat List Column */}
      <div className="w-full md:w-80 border-r border-outline-variant flex flex-col h-full bg-surface">
        <div className="p-md border-b border-outline-variant flex items-center justify-between">
          <h2 className="text-title-lg font-bold text-primary flex items-center gap-sm">
            <MessageSquare className="w-5 h-5" />
            Conversations
          </h2>
          <Badge className="bg-primary text-on-primary border-none shadow-none">{chats.filter(c => c.unread).length} Unread</Badge>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`p-md flex gap-md cursor-pointer transition-colors ${
                chat.id === activeChatId 
                  ? "bg-surface-container-high" 
                  : "hover:bg-surface-container-low"
              }`}
            >
              <Avatar className="h-10 h-10 shrink-0">
                <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                  {chat.customerName.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-body-sm font-bold text-primary truncate">{chat.customerName}</h4>
                  <span className="text-[10px] text-on-surface-variant font-mono">{chat.time}</span>
                </div>
                <p className={`text-[11px] truncate ${chat.unread ? "text-primary font-bold" : "text-on-surface-variant"}`}>
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

      {/* Middle Chat Window Column */}
      <div className="flex-1 flex flex-col h-full bg-surface-container-lowest">
        {/* Chat window Header */}
        <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface">
          <div className="flex items-center gap-md">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-on-primary font-bold text-xs">
                {activeChat.customerName.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-label-md font-bold text-primary">{activeChat.customerName}</h3>
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
                <div className={`max-w-[70%] p-md rounded-xl space-y-xs ${
                  isAgent 
                    ? "bg-primary text-on-primary rounded-tr-none" 
                    : "bg-surface-container border border-outline-variant text-primary rounded-tl-none"
                }`}>
                  <p className="text-body-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  <span className={`text-[9px] block text-right font-mono ${
                    isAgent ? "text-on-primary/75" : "text-on-surface-variant"
                  }`}>
                    {m.time}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat input form */}
        <form onSubmit={handleSendMessage} className="p-md border-t border-outline-variant bg-surface flex gap-md">
          <Input 
            placeholder="Type message here..." 
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            className="flex-1 bg-surface-container-low border-outline-variant focus:border-primary text-body-sm"
          />
          <Button type="submit" size="icon" className="bg-primary hover:bg-neutral-800 text-on-primary cursor-pointer">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

      {/* Right Contact Context Column */}
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
            <Badge className={`text-[10px] font-bold border-none shadow-none ${
              activeChat.risk >= 40 
                ? "bg-red-100 text-red-800" 
                : "bg-emerald-100 text-emerald-800"
            }`}>
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
            "I checked the API access token scopes for your account. The keys have been re-verified. Please try generating a new token from the dashboard."
          </p>
          <Button 
            className="w-full text-[10px] py-1 h-7 bg-white text-black hover:bg-neutral-200 mt-xs cursor-pointer font-bold"
            onClick={() => setTypedMessage("I checked the API access token scopes for your account. The keys have been re-verified. Please try generating a new token from the dashboard.")}
          >
            Use Template
          </Button>
        </div>
      </div>
    </div>
  );
}
