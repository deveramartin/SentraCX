import React from "react";
import { render, screen } from "@testing-library/react";
import { CustomerTypeBadge } from "@/components/features/customers/CustomerTypeBadge";

describe("CustomerTypeBadge", () => {
  it("renders 'Regular' label for Regular type", () => {
    render(<CustomerTypeBadge customerType="Regular" />);
    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("renders 'Institutional Buyer' label for InstitutionalBuyer type", () => {
    render(<CustomerTypeBadge customerType="InstitutionalBuyer" />);
    expect(screen.getByText("Institutional Buyer")).toBeInTheDocument();
  });

  it("does not show the raw enum value 'InstitutionalBuyer'", () => {
    render(<CustomerTypeBadge customerType="InstitutionalBuyer" />);
    expect(screen.queryByText("InstitutionalBuyer")).not.toBeInTheDocument();
  });

  it("renders 'VIP' label for VIP type", () => {
    render(<CustomerTypeBadge customerType="VIP" />);
    expect(screen.getByText("VIP")).toBeInTheDocument();
  });

  it("renders 'Lead' label for Lead type", () => {
    render(<CustomerTypeBadge customerType="Lead" />);
    expect(screen.getByText("Lead")).toBeInTheDocument();
  });

  it("renders a single root element", () => {
    const { container } = render(<CustomerTypeBadge customerType="Regular" />);
    expect(container.children).toHaveLength(1);
  });
});
