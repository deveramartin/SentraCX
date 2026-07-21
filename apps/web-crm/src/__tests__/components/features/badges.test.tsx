import React from "react";
import { render, screen } from "@testing-library/react";
import { CampaignChannelBadge } from "@/components/features/campaigns/CampaignChannelBadge";
import { CampaignStatusBadge } from "@/components/features/campaigns/CampaignStatusBadge";
import { PromotionTypeBadge } from "@/components/features/promotions/PromotionTypeBadge";
import { PromotionStatusBadge } from "@/components/features/promotions/PromotionStatusBadge";
import { TicketStatusBadge } from "@/components/features/tickets/TicketStatusBadge";

describe("Pastel Badge Components", () => {
  it("renders CampaignChannelBadge correctly for all channels", () => {
    const { rerender } = render(<CampaignChannelBadge channel="Email" />);
    expect(screen.getByText("Email")).toBeInTheDocument();

    rerender(<CampaignChannelBadge channel="InApp" />);
    expect(screen.getByText("InApp")).toBeInTheDocument();

    rerender(<CampaignChannelBadge channel="Facebook" />);
    expect(screen.getByText("Facebook")).toBeInTheDocument();

    rerender(<CampaignChannelBadge channel="Twitter" />);
    expect(screen.getByText("Twitter")).toBeInTheDocument();

    rerender(<CampaignChannelBadge channel="Instagram" />);
    expect(screen.getByText("Instagram")).toBeInTheDocument();
  });

  it("renders CampaignStatusBadge correctly", () => {
    const { rerender } = render(<CampaignStatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();

    rerender(<CampaignStatusBadge status="Draft" />);
    expect(screen.getByText("Draft")).toBeInTheDocument();

    rerender(<CampaignStatusBadge status="Ended" />);
    expect(screen.getByText("Ended")).toBeInTheDocument();
  });

  it("renders PromotionTypeBadge correctly", () => {
    const { rerender } = render(<PromotionTypeBadge type="Discount" />);
    expect(screen.getByText("Discount")).toBeInTheDocument();

    rerender(<PromotionTypeBadge type="Voucher" />);
    expect(screen.getByText("Voucher")).toBeInTheDocument();

    rerender(<PromotionTypeBadge type="FreeShipping" />);
    expect(screen.getByText("FreeShipping")).toBeInTheDocument();
  });

  it("renders PromotionStatusBadge correctly", () => {
    const { rerender } = render(<PromotionStatusBadge status="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();

    rerender(<PromotionStatusBadge status="Accomplished" />);
    expect(screen.getByText("Accomplished")).toBeInTheDocument();
  });

  it("renders TicketStatusBadge correctly", () => {
    const { rerender } = render(<TicketStatusBadge status="Unclaimed" />);
    expect(screen.getByText("Unclaimed")).toBeInTheDocument();

    rerender(<TicketStatusBadge status="Claimed" />);
    expect(screen.getByText("Claimed")).toBeInTheDocument();

    rerender(<TicketStatusBadge status="Completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});
