"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import type { Customer } from "@/types/customer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface CustomerModalProps {
  customer: Customer
  onClose: () => void
}

export function CustomerModal({ customer, onClose }: CustomerModalProps) {
  // Prepare data for the donut chart
  const data = [
    { name: "Risk", value: customer.churn_risk_score },
    { name: "Safe", value: 100 - customer.churn_risk_score },
  ]

  // Determine color based on risk score
  let riskColor = "#10B981" // green
  if (customer.churn_risk_score >= 60) {
    riskColor = "#EF4444" // red
  } else if (customer.churn_risk_score >= 40) {
    riskColor = "#F59E0B" // yellow
  }

  // Parse complaints if it's a string representation of an array
  let complaintsArray: string[] = []
  try {
    if (customer.complaints) {
      if (typeof customer.complaints === "string") {
        // Handle the specific format ['complaint1', 'complaint2', ...]
        if (customer.complaints.startsWith("[") && customer.complaints.endsWith("]")) {
          if (customer.complaints === "[]") {
            complaintsArray = []
          } else {
            // Extract the content between brackets and split by commas
            const content = customer.complaints.substring(1, customer.complaints.length - 1)

            // Handle the case where complaints are quoted with single quotes
            if (content.includes("'")) {
              // Split by commas followed by space and remove the quotes
              complaintsArray = content.split("', '").map((item) => item.replace(/^'|'$/g, ""))
            } else {
              // For other formats, try JSON parse with double quotes
              const jsonString = customer.complaints.replace(/'/g, '"')
              complaintsArray = JSON.parse(jsonString)
            }
          }
        } else {
          complaintsArray = [customer.complaints]
        }
      } else if (Array.isArray(customer.complaints)) {
        complaintsArray = customer.complaints
      }
    }
  } catch (e) {
    console.error("Error parsing complaints:", e)
    complaintsArray = [String(customer.complaints)]
  }

  // Format contract type
  const getContractType = () => {
    if (customer.Contract_Two_year || customer["Contract_Two year"]) return "Two Year"
    if (customer.Contract_One_year || customer["Contract_One year"]) return "One Year"
    return "Month-to-Month"
  }

  // Update the getInternetService function to handle both property formats
  const getInternetService = () => {
    if (customer.InternetService_Fiber_optic || customer["InternetService_Fiber optic"]) return "Fiber Optic"
    if (customer.InternetService_No) return "No Internet"
    return "DSL"
  }

  // Update the getPaymentMethod function to handle both property formats
  const getPaymentMethod = () => {
    if (customer.PaymentMethod_Credit_card_automatic || customer["PaymentMethod_Credit card (automatic)"])
      return "Credit Card (Automatic)"
    if (customer.PaymentMethod_Electronic_check || customer["PaymentMethod_Electronic check"]) return "Electronic Check"
    if (customer.PaymentMethod_Mailed_check || customer["PaymentMethod_Mailed check"]) return "Mailed Check"
    return "Bank Transfer (Automatic)"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto py-8">
      <div className="bg-white rounded-lg border border-purple-400 shadow-xl w-full max-w-5xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-700">
            Customer Details: {customer.name} {customer.surname}
          </h2>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Customer ID:</div>
                    <div>{customer.customerID}</div>
                    <div className="text-sm font-medium">Name:</div>
                    <div>{customer.name}</div>
                    <div className="text-sm font-medium">Surname:</div>
                    <div>{customer.surname}</div>
                    <div className="text-sm font-medium">Phone:</div>
                    <div>{customer.phone}</div>
                    <div className="text-sm font-medium">Gender:</div>
                    <div>{customer.gender === "1" ? "Male" : "Female"}</div>
                    <div className="text-sm font-medium">Senior Citizen:</div>
                    <div>{customer.SeniorCitizen === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Partner:</div>
                    <div>{customer.Partner === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Dependents:</div>
                    <div>{customer.Dependents === 1 ? "Yes" : "No"}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Tenure:</div>
                    <div>{customer.tenure} months</div>
                    <div className="text-sm font-medium">Contract:</div>
                    <div>{getContractType()}</div>
                    <div className="text-sm font-medium">Internet Service:</div>
                    <div>{getInternetService()}</div>
                    <div className="text-sm font-medium">Phone Service:</div>
                    <div>{customer.PhoneService === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Multiple Lines:</div>
                    <div>{customer.MultipleLines === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Paperless Billing:</div>
                    <div>{customer.PaperlessBilling === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Payment Method:</div>
                    <div>{getPaymentMethod()}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Churn Risk Analysis */}
              <Card className="h-full overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Churn Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center">
                  <div className="h-40 w-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={50}
                          paddingAngle={5}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                        >
                          <Cell key="cell-0" fill={riskColor} />
                          <Cell key="cell-1" fill="#E5E7EB" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-3xl font-bold" style={{ color: riskColor }}>
                      {customer.churn_risk_score}%
                    </div>
                    <div className="text-gray-500">{customer.risk_level} Risk</div>
                    <div className="mt-2 text-sm">Last contacted: {customer.last_contacted} days ago</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Internet Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Internet Type:</div>
                    <div>{getInternetService()}</div>
                    <div className="text-sm font-medium">Online Security:</div>
                    <div>{customer.OnlineSecurity === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Online Backup:</div>
                    <div>{customer.OnlineBackup === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Device Protection:</div>
                    <div>{customer.DeviceProtection === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Tech Support:</div>
                    <div>{customer.TechSupport === 1 ? "Yes" : "No"}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Entertainment Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Phone Service:</div>
                    <div>{customer.PhoneService === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Multiple Lines:</div>
                    <div>{customer.MultipleLines === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Streaming TV:</div>
                    <div>{customer.StreamingTV === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Streaming Movies:</div>
                    <div>{customer.StreamingMovies === 1 ? "Yes" : "No"}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Billing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Monthly Charges:</div>
                    <div>${customer.MonthlyCharges}</div>
                    <div className="text-sm font-medium">Total Charges:</div>
                    <div>${customer.TotalCharges}</div>
                    <div className="text-sm font-medium">Contract Type:</div>
                    <div>{getContractType()}</div>
                    <div className="text-sm font-medium">Paperless Billing:</div>
                    <div>{customer.PaperlessBilling === 1 ? "Yes" : "No"}</div>
                    <div className="text-sm font-medium">Payment Method:</div>
                    <div>{getPaymentMethod()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Account Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Customer Lifetime Value</div>
                      <div className="text-3xl font-bold text-purple-700">${customer.TotalCharges}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Monthly Revenue</div>
                      <div className="text-2xl font-bold text-purple-600">${customer.MonthlyCharges}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Customer Since</div>
                      <div className="text-lg">{customer.tenure} months</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Customer Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                {complaintsArray.length > 0 ? (
                  <div className="space-y-2">
                    {complaintsArray.map((complaint, index) => (
                      <div key={index} className="p-4 bg-red-50 border border-red-100 rounded-md flex items-start">
                        <div className="mr-3 mt-0.5 text-red-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-alert-circle"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-red-800 font-medium">Complaint {index + 1}</p>
                          <p className="text-red-700 mt-1">
                            {typeof complaint === "string"
                              ? complaint.replace(/^\[['"]|['"]?\]$|^['"]|['"]$/g, "") // Remove brackets and quotes
                              : complaint}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <div className="text-sm font-medium">Total Complaints:</div>
                      <div className="text-lg font-bold text-red-600">
                        {customer.num_complaints || complaintsArray.length}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">No complaints</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}