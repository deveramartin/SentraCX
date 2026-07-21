export type PromotionType = "Discount" | "Voucher" | "FreeShipping" | "BuyOneGetOne" | "Cashback";
export type PromotionStatus = "Draft" | "Active" | "Cancelled" | "Accomplished";

export interface PromotionListItem {
  id: string;
  title: string;
  promotionType: PromotionType;
  status: PromotionStatus;
  discountValue?: number | null;
  endDate?: string | null;
  createdAt: string;
}

export interface Promotion extends PromotionListItem {
  description: string;
  voucherCode?: string | null;
  startDate?: string | null;
}

export interface CreatePromotionInput {
  title: string;
  description: string;
  promotionType: PromotionType;
  discountValue?: number;
  voucherCode?: string;
  startDate?: string;
  endDate?: string;
  status?: PromotionStatus;
}

export interface UpdatePromotionInput {
  title?: string;
  description?: string;
  promotionType?: PromotionType;
  discountValue?: number;
  voucherCode?: string;
  startDate?: string;
  endDate?: string;
  status?: PromotionStatus;
}
