export interface Message {
  sender: "agent" | "customer";
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  customerName: string;
  avatarUrl?: string;
  email: string;
  clv: number;
  risk: number;
  lastMessage: string;
  time: string;
  unread: boolean;
  messages: Message[];
}
