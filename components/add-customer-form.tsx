// Canvas created: React component with risk score integration will follow here.
// You can now edit and iterate on this code directly.
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addCustomer } from "@/lib/actions"
import { calculateRiskScore, checkApiHealth } from "@/lib/api"
import type { Customer } from "@/types/customer"

export function AddCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState(false)
  const [schema, setSchema] = useState<string[]>([])

  useEffect(() => {
    fetch("/models/churn_feature_schema.json")
      .then((res) => res.json())
      .then(setSchema)
      .catch((err) => {
        console.error("Failed to load feature schema:", err)
        setSchema([])
      })
  }, [])

  const generateCustomerId = () => {
    return Math.floor(1000 + Math.random() * 9000) + "-" + Array.from({ length: 4 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')
  }

  const [formData, setFormData] = useState<Partial<Customer>>({
    customerID: generateCustomerId(),
    name: "",
    surname: "",
    phone: "",
    gender: "0",
    SeniorCitizen: 0,
    Partner: 0,
    Dependents: 0,
    tenure: 0,
    PhoneService: 0,
    MultipleLines: 0,
    OnlineSecurity: 0,
    OnlineBackup: 0,
    DeviceProtection: 0,
    TechSupport: 0,
    StreamingTV: 0,
    StreamingMovies: 0,
    PaperlessBilling: 0,
    MonthlyCharges: 0,
    TotalCharges: 0,
    InternetService_Fiber_optic: false,
    InternetService_No: false,
    Contract_One_year: false,
    Contract_Two_year: false,
    PaymentMethod_Credit_card_automatic: false,
    PaymentMethod_Electronic_check: false,
    PaymentMethod_Mailed_check: false,
    Churn: 0,
    num_complaints: 0,
    churn_risk_score: 0,
    risk_level: "low",
    last_contacted: 0,
    complaints: "[]",
  })

  useEffect(() => {
    const checkApi = async () => {
      try {
        const isAvailable = await checkApiHealth()
        setApiAvailable(isAvailable)
      } catch {
        setApiAvailable(false)
      }
    }
    checkApi()
  }, [])

  useEffect(() => {
    const monthlyCharges = Number(formData.MonthlyCharges) || 0
    const tenure = Number(formData.tenure) || 0
    const totalCharges = monthlyCharges * tenure
    setFormData((prev) => ({ ...prev, TotalCharges: totalCharges }))
  }, [formData.MonthlyCharges, formData.tenure])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }))
  }

  const handleBooleanChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const buildApiPayload = (form: Partial<Customer>): Record<string, number> => {
    const row: Record<string, number> = {}
  
    schema.forEach((col) => {
      switch (col) {
        case "gender":
          row[col] = form.gender === "1" ? 1 : 0
          break
        case "SeniorCitizen":
        case "Partner":
        case "Dependents":
        case "tenure":
        case "PhoneService":
        case "MultipleLines":
        case "OnlineSecurity":
        case "OnlineBackup":
        case "DeviceProtection":
        case "TechSupport":
        case "StreamingTV":
        case "StreamingMovies":
        case "PaperlessBilling":
        case "MonthlyCharges":
        case "TotalCharges":
        case "Churn":
        case "num_complaints":
          row[col] = Number(form[col as keyof Customer]) || 0
          break
        case "InternetService_Fiber optic":
          row[col] = form.InternetService_Fiber_optic ? 1 : 0
          break
        case "InternetService_No":
          row[col] = form.InternetService_No ? 1 : 0
          break
        case "Contract_One year":
          row[col] = form.Contract_One_year ? 1 : 0
          break
        case "Contract_Two year":
          row[col] = form.Contract_Two_year ? 1 : 0
          break
        case "PaymentMethod_Credit card (automatic)":
          row[col] = form.PaymentMethod_Credit_card_automatic ? 1 : 0
          break
        case "PaymentMethod_Electronic check":
          row[col] = form.PaymentMethod_Electronic_check ? 1 : 0
          break
        case "PaymentMethod_Mailed check":
          row[col] = form.PaymentMethod_Mailed_check ? 1 : 0
          break
  
        // 👇 These need to be explicitly mapped if in your schema
        case "Poor Internet Speed":
        case "Poor Streaming Service Quality":
        case "Billing Issues":
        case "Payment Issues":
        case "Poor Customer Support":
        case "Poor Technical Support":
        case "Poor Phone Service Quality":
        case "Limited Device Protection":
        case "Online Security Issues":
        case "Contract Issues":
        case "Cancellation Issues":
        case "Limited Service Options":
        case "Customer Loyalty":
        case "High Monthly Charge":
          row[col] = Number((form as any)[col]) || 0
          break
  
        default:
          console.warn("Unmapped column in schema:", col)
          row[col] = 0
      }
    })
  
    return row
  }
  

  const resetForm = () => {
    setFormData({
      customerID: generateCustomerId(),
      name: "",
      surname: "",
      phone: "",
      gender: "0",
      SeniorCitizen: 0,
      Partner: 0,
      Dependents: 0,
      tenure: 0,
      PhoneService: 0,
      MultipleLines: 0,
      OnlineSecurity: 0,
      OnlineBackup: 0,
      DeviceProtection: 0,
      TechSupport: 0,
      StreamingTV: 0,
      StreamingMovies: 0,
      PaperlessBilling: 0,
      MonthlyCharges: 0,
      TotalCharges: 0,
      InternetService_Fiber_optic: false,
      InternetService_No: false,
      Contract_One_year: false,
      Contract_Two_year: false,
      PaymentMethod_Credit_card_automatic: false,
      PaymentMethod_Electronic_check: false,
      PaymentMethod_Mailed_check: false,
      Churn: 0,
      num_complaints: 0,
      churn_risk_score: 0,
      risk_level: "low",
      last_contacted: 0,
      complaints: "[]",
    })
    setFormError(null)
    setFormSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    setFormSuccess(false)

    try {
      let riskScore = Number(formData.churn_risk_score) || 0
      let riskLevel = "low"
      
      if (apiAvailable) {
        try {
          const apiPayload = buildApiPayload(formData)
          console.log("API Payload:", apiPayload)
          const result = await calculateRiskScore(apiPayload)
          riskScore = result.risk_score
          riskLevel = result.risk_level.toLowerCase()
        } catch (error) {
          console.error("Error calculating risk score:", error)
          if (riskScore >= 60) riskLevel = "high"
          else if (riskScore >= 40) riskLevel = "moderate"
        }
      } else {
        if (riskScore >= 60) riskLevel = "high"
        else if (riskScore >= 40) riskLevel = "moderate"
      }

      const customerData: Customer = {
        ...formData,
        customerID: formData.customerID || generateCustomerId(),
        churn_risk_score: riskScore,
        risk_level: riskLevel,
      } as Customer

      await addCustomer(customerData)
      setFormSuccess(true)
      setTimeout(() => {
        resetForm()
        onSuccess?.()
      }, 2000)
    } catch (error) {
      console.error("Error adding customer:", error)
      setFormError("Failed to add customer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl text-purple-700">Add New Customer</CardTitle>
      </CardHeader>
      <CardContent>
        {apiAvailable === false && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-600">Python API Unavailable</AlertTitle>
            <AlertDescription className="text-yellow-700">
              The risk score calculation API is not available. You can still add customers manually.
            </AlertDescription>
          </Alert>
        )}

        {formError && (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Error</AlertTitle>
            <AlertDescription className="text-red-700">{formError}</AlertDescription>
          </Alert>
        )}

        {formSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription className="text-green-700">Customer added successfully!</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="risk">Risk & Complaints</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerID">Customer ID</Label>
                  <Input
                    id="customerID"
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Female</SelectItem>
                      <SelectItem value="1">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenure">Tenure (months)</Label>
                  <Input
                    id="tenure"
                    name="tenure"
                    type="number"
                    min="0"
                    value={formData.tenure}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seniorCitizen"
                    checked={formData.SeniorCitizen === 1}
                    onCheckedChange={(checked) => handleCheckboxChange("SeniorCitizen", checked as boolean)}
                  />
                  <Label htmlFor="seniorCitizen">Senior Citizen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="partner"
                    checked={formData.Partner === 1}
                    onCheckedChange={(checked) => handleCheckboxChange("Partner", checked as boolean)}
                  />
                  <Label htmlFor="partner">Has Partner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dependents"
                    checked={formData.Dependents === 1}
                    onCheckedChange={(checked) => handleCheckboxChange("Dependents", checked as boolean)}
                  />
                  <Label htmlFor="dependents">Has Dependents</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Internet Service</h3>
                  <div className="space-y-2">
                    <Label>Internet Type</Label>
                    <Select
                      value={
                        formData.InternetService_Fiber_optic ? "fiber" : formData.InternetService_No ? "none" : "dsl"
                      }
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          InternetService_Fiber_optic: value === "fiber",
                          InternetService_No: value === "none",
                        }))
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select internet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dsl">DSL</SelectItem>
                        <SelectItem value="fiber">Fiber Optic</SelectItem>
                        <SelectItem value="none">No Internet Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlineSecurity"
                        checked={formData.OnlineSecurity === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("OnlineSecurity", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="onlineSecurity">Online Security</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlineBackup"
                        checked={formData.OnlineBackup === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("OnlineBackup", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="onlineBackup">Online Backup</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="deviceProtection"
                        checked={formData.DeviceProtection === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("DeviceProtection", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="deviceProtection">Device Protection</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="techSupport"
                        checked={formData.TechSupport === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("TechSupport", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="techSupport">Tech Support</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Phone & Entertainment</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="phoneService"
                        checked={formData.PhoneService === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("PhoneService", checked as boolean)}
                      />
                      <Label htmlFor="phoneService">Phone Service</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="multipleLines"
                        checked={formData.MultipleLines === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("MultipleLines", checked as boolean)}
                        disabled={formData.PhoneService === 0}
                      />
                      <Label htmlFor="multipleLines">Multiple Lines</Label>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="streamingTV"
                        checked={formData.StreamingTV === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("StreamingTV", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="streamingTV">Streaming TV</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="streamingMovies"
                        checked={formData.StreamingMovies === 1}
                        onCheckedChange={(checked) => handleCheckboxChange("StreamingMovies", checked as boolean)}
                        disabled={formData.InternetService_No}
                      />
                      <Label htmlFor="streamingMovies">Streaming Movies</Label>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyCharges">Monthly Charges ($)</Label>
                  <Input
                    id="monthlyCharges"
                    name="MonthlyCharges"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.MonthlyCharges}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalCharges">Total Charges ($)</Label>
                  <Input
                    id="totalCharges"
                    name="TotalCharges"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.TotalCharges}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contract Type</Label>
                  <Select
                    value={
                      formData.Contract_Two_year
                        ? "two_year"
                        : formData.Contract_One_year
                          ? "one_year"
                          : "month_to_month"
                    }
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        Contract_One_year: value === "one_year",
                        Contract_Two_year: value === "two_year",
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month_to_month">Month-to-Month</SelectItem>
                      <SelectItem value="one_year">One Year</SelectItem>
                      <SelectItem value="two_year">Two Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    value={
                      formData.PaymentMethod_Credit_card_automatic
                        ? "credit_card"
                        : formData.PaymentMethod_Electronic_check
                          ? "electronic_check"
                          : formData.PaymentMethod_Mailed_check
                            ? "mailed_check"
                            : "bank_transfer"
                    }
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        PaymentMethod_Credit_card_automatic: value === "credit_card",
                        PaymentMethod_Electronic_check: value === "electronic_check",
                        PaymentMethod_Mailed_check: value === "mailed_check",
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">Bank Transfer (Automatic)</SelectItem>
                      <SelectItem value="credit_card">Credit Card (Automatic)</SelectItem>
                      <SelectItem value="electronic_check">Electronic Check</SelectItem>
                      <SelectItem value="mailed_check">Mailed Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paperlessBilling"
                    checked={formData.PaperlessBilling === 1}
                    onCheckedChange={(checked) => handleCheckboxChange("PaperlessBilling", checked as boolean)}
                  />
                  <Label htmlFor="paperlessBilling">Paperless Billing</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="last_contacted">Last Contacted (days ago)</Label>
                  <Input
                    id="last_contacted"
                    name="last_contacted"
                    type="number"
                    min="0"
                    value={formData.last_contacted}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num_complaints">Number of Complaints</Label>
                  <Input
                    id="num_complaints"
                    name="num_complaints"
                    type="number"
                    min="0"
                    value={formData.num_complaints}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                {!apiAvailable && (
                  <div className="space-y-2">
                    <Label htmlFor="churn_risk_score">Churn Risk Score (%)</Label>
                    <Input
                      id="churn_risk_score"
                      name="churn_risk_score"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.churn_risk_score}
                      onChange={handleNumberChange}
                      required={!apiAvailable}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="complaints">Complaints (JSON array)</Label>
                  <Input
                    id="complaints"
                    name="complaints"
                    value={formData.complaints}
                    onChange={handleChange}
                    placeholder="[]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="churn"
                    checked={formData.Churn === 1}
                    onCheckedChange={(checked) => handleCheckboxChange("Churn", checked as boolean)}
                  />
                  <Label htmlFor="churn">Customer Has Churned</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Customer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
