import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PromotionFormSheet } from "@/components/features/promotions/PromotionFormSheet";

jest.mock("@/lib/api/crm-client", () => ({
  crmClient: {
    promotions: {
      create: jest.fn(),
    },
  },
}));

describe("PromotionFormSheet", () => {
  it("renders trigger button and opens dialog", () => {
    render(<PromotionFormSheet onSuccess={jest.fn()} onShowToast={jest.fn()} />);

    const triggerBtn = screen.getByRole("button", { name: /new promotion/i });
    expect(triggerBtn).toBeInTheDocument();

    fireEvent.click(triggerBtn);

    expect(screen.getByText("Configure offer type, discount rules, and schedule.")).toBeInTheDocument();
  });
});
