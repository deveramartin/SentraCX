"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageSquare, XCircle, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTickets } from "@/hooks/useTickets";
import { crmClient } from "@/lib/api/crm-client";
import { TicketCreateSheet } from "./TicketCreateSheet";
import { TicketDetailSheet } from "./TicketDetailSheet";

interface TicketsCustomerViewProps {
  customerId?: string;
}

export function TicketsCustomerView({ customerId }: TicketsCustomerViewProps) {
  const [activeTab, setActiveTab] = useState<string>("Pending");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const apiStatus = activeTab === "Pending" ? "Unclaimed" : activeTab === "Ongoing" ? "Ongoing" : activeTab === "Completed" ? "Completed" : "Canceled";
  const { data, isLoading, refetch } = useTickets(1, 50, apiStatus, customerId);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCancelTicket = async (id: string) => {
    try {
      await crmClient.tickets.cancel(id);
      showToast("Ticket has been cancelled.");
      refetch();
    } catch {
      showToast("Failed to cancel ticket.");
    }
  };

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-primary-foreground px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-border animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-headline-md font-bold tracking-tight text-foreground">My Support Tickets</h1>
          <p className="text-body-md text-muted-foreground">
            Track status of your submitted inquiries, communicate with support staff, or open new tickets.
          </p>
        </div>
        <TicketCreateSheet customerId={customerId} onSuccess={refetch} onShowToast={showToast} />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-md">
        <TabsList className="w-full sm:w-auto overflow-x-auto justify-start border-b border-border bg-transparent p-0">
          <TabsTrigger value="Pending" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Pending
          </TabsTrigger>
          <TabsTrigger value="Ongoing" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="Completed" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Completed
          </TabsTrigger>
          <TabsTrigger value="Canceled" className="px-lg py-sm font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
            Cancel
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="p-0 m-0">
          <Card className="bg-card border-border rounded-xl flex flex-col shadow-none">
            <CardContent className="p-0 overflow-x-auto">
              {isLoading ? (
                <div className="py-12 text-center text-body-sm text-muted-foreground">Loading tickets...</div>
              ) : !data || data.items.length === 0 ? (
                <div className="py-12 text-center text-body-sm text-muted-foreground">No tickets in this section.</div>
              ) : (
                <table className="w-full text-left text-body-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground text-label-sm font-semibold">
                      <th className="py-md px-lg">Title</th>
                      <th className="py-md px-lg">Status</th>
                      <th className="py-md px-lg">Created At</th>
                      <th className="py-md px-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.items.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-md px-lg font-medium text-foreground">{t.title}</td>
                        <td className="py-md px-lg">
                          <Badge variant={t.status === "Completed" ? "secondary" : t.status === "Canceled" ? "destructive" : "outline"}>
                            {t.status}
                          </Badge>
                        </td>
                        <td className="py-md px-lg text-muted-foreground text-xs">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-md px-lg text-right flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTicketId(t.id)}>
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/conversations?ticketId=${t.id}`}>
                              <MessageSquare className="w-4 h-4 mr-1" /> Message
                            </Link>
                          </Button>
                          {t.status !== "Completed" && t.status !== "Canceled" && (
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleCancelTicket(t.id)}>
                              <XCircle className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TicketDetailSheet
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
        onRefresh={refetch}
        onShowToast={showToast}
      />
    </div>
  );
}
