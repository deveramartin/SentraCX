export interface SupportTicket {
  id: string;
  customer: string;
  issue: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  time: string;
}
