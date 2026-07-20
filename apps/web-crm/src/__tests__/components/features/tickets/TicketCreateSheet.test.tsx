import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TicketCreateSheet } from "@/components/features/tickets/TicketCreateSheet";

describe("TicketCreateSheet", () => {
  const onCreateTicket = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens modal and submits ticket form", async () => {
    render(
      <TicketCreateSheet
        onCreateTicket={onCreateTicket}
        nextId={102}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    expect(screen.getByText("Create Support Ticket")).toBeInTheDocument();
    expect(screen.getByLabelText("Customer Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Support Query *")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Customer Name *"), { target: { value: "Alex Smith" } });
    fireEvent.change(screen.getByLabelText("Support Query *"), { target: { value: "Login issue" } });

    fireEvent.click(screen.getByRole("button", { name: "High" }));

    const submitButtons = screen.getAllByRole("button", { name: /create task/i });
    fireEvent.click(submitButtons[submitButtons.length - 1]);

    await waitFor(() => {
      expect(onCreateTicket).toHaveBeenCalledWith({
        id: "TCK-102",
        customer: "Alex Smith",
        issue: "Login issue",
        priority: "High",
        status: "Open",
        time: "Just now",
      });
    });
  });
});
