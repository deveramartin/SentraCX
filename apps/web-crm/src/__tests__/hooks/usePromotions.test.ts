import { renderHook, waitFor } from "@testing-library/react";
import { usePromotions } from "@/hooks/usePromotions";
import { crmClient } from "@/lib/api/crm-client";

jest.mock("@/lib/api/crm-client", () => ({
  crmClient: {
    promotions: {
      list: jest.fn(),
    },
  },
}));

describe("usePromotions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads promotions on mount", async () => {
    const mockData = [
      { id: "1", title: "Promo 1", promotionType: "Discount", status: "Active", createdAt: "2026-01-01" },
    ];
    (crmClient.promotions.list as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePromotions("Active"));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockData);
    expect(crmClient.promotions.list).toHaveBeenCalledWith("Active");
  });
});
