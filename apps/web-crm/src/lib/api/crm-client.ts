import {
  Customer,
  CustomerListItem,
  CreateCustomerInput,
  UpdateCustomerStatusInput,
  UpdateCustomerTypeInput,
  UpdateCustomerNotesInput,
  MarketingInteraction,
  OrderHistory,
  PaginatedResponse,
} from "@/types/customer";
import { Message } from "@/types/message";
import { Ticket, TicketListItem } from "@/types/ticket";

const CRM_BASE = process.env.NEXT_PUBLIC_CRM_API_URL ?? "https://localhost:5005";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${CRM_BASE}${path}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Ignore JSON parse errors for non-JSON responses
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}

export const crmClient = {
  customers: {
    list: (page = 1, pageSize = 20) =>
      request<PaginatedResponse<CustomerListItem>>(
        `/api/v1/customers?page=${page}&pageSize=${pageSize}`
      ),
    getById: (id: string) =>
      request<Customer>(`/api/v1/customers/${id}`),
    create: (body: CreateCustomerInput) =>
      request<Customer>(`/api/v1/customers`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    delete: (id: string) =>
      request<void>(`/api/v1/customers/${id}`, {
        method: "DELETE",
      }),
    updateStatus: (id: string, body: UpdateCustomerStatusInput) =>
      request<void>(`/api/v1/customers/${id}/status`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    updateType: (id: string, body: UpdateCustomerTypeInput) =>
      request<void>(`/api/v1/customers/${id}/type`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    updateNotes: (id: string, body: UpdateCustomerNotesInput) =>
      request<void>(`/api/v1/customers/${id}/notes`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
  },
  orders: {
    listByCustomer: (customerId: string) =>
      request<OrderHistory[]>(`/api/v1/customers/${customerId}/orders`),
  },
  marketingInteractions: {
    listByCustomer: (customerId: string, page = 1, pageSize = 10) =>
      request<PaginatedResponse<MarketingInteraction>>(
        `/api/v1/customers/${customerId}/marketing-interactions?page=${page}&pageSize=${pageSize}`
      ),
  },
  tickets: {
    list: (page = 1, pageSize = 20, status?: string, assignedToId?: string) => {
      // TODO (auth): Pass the current user's ID as assignedToId once the session is
      //              wired. Until then, omit it — all Claimed/Ongoing tickets are returned.
      let url = `/api/v1/tickets?page=${page}&pageSize=${pageSize}`;
      if (status) url += `&status=${encodeURIComponent(status)}`;
      if (assignedToId) url += `&assignedToId=${encodeURIComponent(assignedToId)}`;
      return request<PaginatedResponse<TicketListItem>>(url);
    },
    getById: (id: string) =>
      request<Ticket>(`/api/v1/tickets/${id}`),
    claim: (id: string, staffUserId: string) =>
      request<void>(`/api/v1/tickets/${id}/claim?staffUserId=${encodeURIComponent(staffUserId)}`, {
        method: "PUT",
      }),
    unclaim: (id: string) =>
      request<void>(`/api/v1/tickets/${id}/unclaim`, { method: "PUT" }),
    updateStatus: (id: string, status: string) =>
      request<void>(`/api/v1/tickets/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
  },
  messages: {
    listByTicket: (ticketId: string) =>
      request<Message[]>(`/api/v1/tickets/${ticketId}/messages`),
    markRead: (ticketId: string, messageId: string) =>
      request<void>(`/api/v1/tickets/${ticketId}/messages/${messageId}/read`, {
        method: "PUT",
      }),
  },
};
