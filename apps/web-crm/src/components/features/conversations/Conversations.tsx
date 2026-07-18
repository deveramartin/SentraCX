"use client";

import React, { useState } from "react";
import { ConversationList } from "./ConversationList";
import { ConversationWindow } from "./ConversationWindow";
import { CustomerContextPanel } from "./CustomerContextPanel";
import type { Chat } from "./types";

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

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const messageText = typedMessage;
    setTypedMessage("");

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            lastMessage: messageText,
            time: "Just now",
            unread: false,
            messages: [...chat.messages, { sender: "agent" as const, text: messageText, time: timeStr }],
          };
        }
        return chat;
      })
    );

    setTimeout(() => {
      const clientReplies = [
        "Thanks for the update! I will check on my side.",
        "Perfect, that makes sense. Let me know when it's resolved.",
        "Understood. I will wait for your confirmation.",
        "Okay, thank you for checking this so quickly!",
      ];
      const randomReply = clientReplies[Math.floor(Math.random() * clientReplies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === activeChatId) {
            return {
              ...chat,
              lastMessage: randomReply,
              time: "Just now",
              messages: [...chat.messages, { sender: "customer" as const, text: randomReply, time: replyTime }],
            };
          }
          return chat;
        })
      );
    }, 1500);
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, unread: false } : c)));
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden bg-background">
      <ConversationList chats={chats} activeChatId={activeChatId} onSelectChat={handleSelectChat} />
      <ConversationWindow
        activeChat={activeChat}
        typedMessage={typedMessage}
        onTypedMessageChange={setTypedMessage}
        onSendMessage={handleSendMessage}
      />
      <CustomerContextPanel activeChat={activeChat} onUseTemplate={setTypedMessage} />
    </div>
  );
}
