export type TicketStatus = "Unclaimed" | "Claimed" | "Ongoing" | "Completed" | "Canceled";

export interface TicketListItem {
  id: string;
  title: string;
  status: TicketStatus | string;
  customerName: string;
  unreadMessageCount: number;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  status: TicketStatus | string;
  customerId: string;
  customerName: string;
  assignedToId?: string | null;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
}
