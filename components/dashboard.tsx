"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Customer } from "@/types/customer"
import { Badge } from "@/components/ui/badge"

interface DashboardProps {
  customers: Customer[]
  onRowClick: (customer: Customer) => void
}

export function Dashboard({ customers, onRowClick }: DashboardProps) {
  return (
    <div className="bg-white rounded-lg border border-purple-300 shadow-sm overflow-hidden">
      <div className="relative max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-purple-300/30 border-b border-purple-300">
              <TableHead className="text-black font-medium py-3">Customer ID</TableHead>
              <TableHead className="text-black font-medium py-3">Name</TableHead>
              <TableHead className="text-black font-medium py-3">Surname</TableHead>
              <TableHead className="text-black font-medium py-3">Phone</TableHead>
              <TableHead className="text-black font-medium py-3">Tenure (mo)</TableHead>
              <TableHead className="text-black font-medium py-3">Monthly Charges</TableHead>
              <TableHead className="text-black font-medium py-3">Risk Score</TableHead>
              <TableHead className="text-black font-medium py-3">Risk Level</TableHead>
              <TableHead className="text-black font-medium py-3">Last Contacted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow
                key={customer.customerID || index}
                className={`cursor-pointer hover:bg-purple-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                onClick={() => onRowClick(customer)}
              >
                <TableCell>{customer.customerID}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.surname}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.tenure}</TableCell>
                <TableCell>${customer.MonthlyCharges}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{customer.churn_risk_score}%</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          customer.churn_risk_score >= 60
                            ? "bg-red-500"
                            : customer.churn_risk_score >= 40 && customer.churn_risk_score < 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${customer.churn_risk_score}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      customer.risk_level.toLowerCase() === "high"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : customer.risk_level.toLowerCase() === "moderate"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : "bg-green-100 text-green-800 hover:bg-green-100"
                    }`}
                  >
                    {customer.risk_level}
                  </Badge>
                </TableCell>
                <TableCell>{customer.last_contacted} d</TableCell>
              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
