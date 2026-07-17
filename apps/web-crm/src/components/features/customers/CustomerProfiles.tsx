"use client";

import React, { useState } from "react";
import { Users, Search, Plus, UserCheck, UserMinus, DollarSign, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Customer {
  id: string;
  name: string;
  email: string;
  clv: number;
  churnRisk: number; // 0 to 100
  status: "Active" | "Inactive";
}

export function CustomerProfiles() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "CUST-001", name: "Olivia Vance", email: "olivia@vance-media.io", clv: 8500, churnRisk: 12, status: "Active" },
    { id: "CUST-002", name: "Jackson Reed", email: "j.reed@techcorp.com", clv: 3200, churnRisk: 48, status: "Active" },
    { id: "CUST-003", name: "Amara Okoro", email: "amara@okoro-design.ng", clv: 12000, churnRisk: 8, status: "Active" },
    { id: "CUST-004", name: "Liam Anderson", email: "liam@anderson-consulting.uk", clv: 1500, churnRisk: 82, status: "Inactive" },
    { id: "CUST-005", name: "Sophia Martinez", email: "sophia.m@global-retail.es", clv: 6700, churnRisk: 25, status: "Active" },
  ]);

  // Form states
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCLV, setNewCLV] = useState(1000);
  const [newRisk, setNewRisk] = useState(20);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      showToast("Please fill in all required fields.");
      return;
    }

    const nextIdNum = Math.max(...customers.map(c => parseInt(c.id.split("-")[1]))) + 1;
    const newCust: Customer = {
      id: `CUST-${String(nextIdNum).padStart(3, "0")}`,
      name: newName,
      email: newEmail,
      clv: Number(newCLV) || 0,
      churnRisk: Number(newRisk) || 0,
      status: "Active",
    };

    setCustomers([newCust, ...customers]);
    setNewName("");
    setNewEmail("");
    setNewCLV(1000);
    setNewRisk(20);
    setIsAddOpen(false);
    showToast(`Customer ${newCust.name} added successfully!`);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCLV = customers.reduce((sum, c) => sum + c.clv, 0);
  const avgCLV = Math.round(totalCLV / customers.length);
  const highRiskCount = customers.filter(c => c.churnRisk >= 50).length;

  return (
    <div className="w-full min-h-full py-xl px-lg md:px-xl space-y-2xl">
      {/* Toast alert */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 md:right-10 bg-primary text-on-primary px-lg py-sm rounded-lg text-body-sm font-medium z-[100] shadow-md border border-outline-variant animate-in fade-in slide-in-from-bottom-5 duration-300">
          {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
        <div className="space-y-sm">
          <h1 className="text-display-sm font-bold tracking-tight text-primary">Customer Profiles</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage customer records, monitor lifetime values, and review churn risks.
          </p>
        </div>
        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-sm px-md py-sm bg-primary text-on-primary hover:bg-neutral-800 transition-colors font-medium rounded-lg text-label-md cursor-pointer self-start sm:self-center">
              <Plus className="w-4 h-4" />
              Add Customer
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-surface border-outline-variant w-[400px] sm:w-[540px]">
            <SheetHeader className="pb-lg">
              <SheetTitle className="text-headline-md font-bold text-primary">Add Customer Profile</SheetTitle>
              <SheetDescription className="text-body-sm text-on-surface-variant">
                Create a new transactional profile for the CRM records.
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={handleAddCustomer} className="space-y-lg mt-lg">
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Full Name *</label>
                <Input 
                  placeholder="e.g. Sophia Martinez" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Email Address *</label>
                <Input 
                  type="email"
                  placeholder="e.g. sophia@company.com" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Initial CLV ($)</label>
                <Input 
                  type="number"
                  placeholder="e.g. 5000" 
                  value={newCLV}
                  onChange={(e) => setNewCLV(Number(e.target.value))}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="space-y-xs">
                <label className="text-label-sm font-semibold text-primary block">Churn Risk Score (0 - 100)</label>
                <Input 
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 15" 
                  value={newRisk}
                  onChange={(e) => setNewRisk(Number(e.target.value))}
                  className="bg-surface-container-lowest border-outline-variant focus:border-primary text-body-sm"
                />
              </div>
              <div className="pt-xl">
                <Button type="submit" className="w-full bg-primary hover:bg-neutral-800 text-on-primary">
                  Create Profile
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Total Accounts</span>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">{customers.length}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Registered profiles</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">Average CLV</span>
            <DollarSign className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">${avgCLV.toLocaleString()}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Customer lifetime value</p>
          </CardContent>
        </Card>

        <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col justify-between shadow-none">
          <CardHeader className="flex flex-row justify-between items-start space-y-0 pb-2 p-lg">
            <span className="text-label-md text-on-surface-variant font-medium">High Risk Churns</span>
            <ShieldAlert className="w-5 h-5 text-primary animate-pulse" />
          </CardHeader>
          <CardContent className="p-lg pt-0">
            <span className="text-display-sm font-bold text-primary">{highRiskCount}</span>
            <p className="text-[11px] text-on-surface-variant mt-sm">Accounts with risk &gt; 50%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Customers List Panel */}
      <Card className="bg-surface-container-lowest border-outline-variant rounded-xl flex flex-col shadow-none">
        <CardHeader className="pb-6 p-lg flex flex-col md:flex-row md:items-center md:justify-between gap-md">
          <CardTitle className="text-title-lg font-bold text-primary">Customer Registry</CardTitle>
          <div className="flex items-center bg-surface-container-low rounded-full px-md py-1 border border-outline-variant focus-within:border-primary transition-all w-full max-w-sm">
            <Search className="text-on-surface-variant w-4 h-4 mr-sm shrink-0" />
            <Input 
              className="bg-transparent border-none shadow-none outline-none focus:outline-none focus-visible:ring-0 text-body-sm w-full h-8 px-0 py-0" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-lg pt-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead>
              <tr className="border-b border-outline-variant text-label-sm font-bold text-on-surface-variant">
                <th className="py-md pr-md">Customer ID</th>
                <th className="py-md px-md">Name</th>
                <th className="py-md px-md">Email</th>
                <th className="py-md px-md">LTV ($)</th>
                <th className="py-md px-md">Churn Risk</th>
                <th className="py-md pl-md text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-lg text-center text-on-surface-variant">
                    No customers found matching "{searchQuery}"
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="py-md pr-md font-mono text-xs font-semibold text-primary">{c.id}</td>
                    <td className="py-md px-md font-semibold text-primary">{c.name}</td>
                    <td className="py-md px-md text-on-surface-variant">{c.email}</td>
                    <td className="py-md px-md font-medium text-primary">${c.clv.toLocaleString()}</td>
                    <td className="py-md px-md">
                      <div className="flex items-center gap-sm">
                        <span className="w-12 text-xs font-medium">{c.churnRisk}%</span>
                        <div className="flex-1 w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              c.churnRisk >= 50 
                                ? "bg-red-500" 
                                : c.churnRisk >= 25 
                                ? "bg-amber-500" 
                                : "bg-emerald-500"
                            }`} 
                            style={{ width: `${c.churnRisk}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-md pl-md text-right">
                      <Badge className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-none border-none ${
                        c.status === "Active" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-zinc-100 text-zinc-800"
                      }`}>
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
