export type TicketStatus = "Unclaimed" | "Claimed" | "Ongoing" | "Completed" | "Canceled";

export interface TicketListItem {
  id: string;
  title: string;
  status: TicketStatus;
  customerName: string;
  createdAt: string;
  assignedToName?: string | null;
}

export interface Ticket extends TicketListItem {
  description: string;
  imageUrl?: string | null;
  customerId: string;
  assignedToId?: string | null;
  updatedAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface PaginatedTicketResponse {
  items: TicketListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
