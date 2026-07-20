export interface Campaign {
  id: string;
  name: string;
  status: "Active" | "Scheduled" | "Completed";
  budget: number;
  spent: number;
  conversion: number; // percentage
  clicks: number;
}
