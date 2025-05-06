"use client"

import { useState, useEffect } from "react"
import Papa from "papaparse"
import { TopBar } from "@/components/top-bar"
import { Dashboard } from "@/components/dashboard"
import { CustomerModal } from "@/components/customer-modal"
import { AddCustomerForm } from "@/components/add-customer-form"
import type { Customer } from "@/types/customer"
import { Button } from "@/components/ui/button"
import { PlusCircle, RefreshCw } from "lucide-react"

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const loadCustomers = () => {
    setIsLoading(true)

    // Add a cache-busting parameter to prevent browser caching
    const cacheBuster = `?cache=${Date.now()}`

    // Load and parse the CSV file
    Papa.parse(`/customers_database.csv${cacheBuster}`, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as Customer[]

        // Process the data
        const processedData = parsedData
          .filter((customer) => customer.name && customer.surname) // Filter out incomplete rows
          .map((customer) => {
            // Handle the space in column names by checking both possible formats
            const fiberOptic =
              customer["InternetService_Fiber optic"] === "True" || customer.InternetService_Fiber_optic === "True"
            const creditCard =
              customer["PaymentMethod_Credit card (automatic)"] === "True" ||
              customer.PaymentMethod_Credit_card_automatic === "True"

            return {
              ...customer,
              // Convert string values to appropriate types
              SeniorCitizen: Number(customer.SeniorCitizen),
              Partner: Number(customer.Partner),
              Dependents: Number(customer.Dependents),
              tenure: Number(customer.tenure),
              PhoneService: Number(customer.PhoneService),
              MultipleLines: Number(customer.MultipleLines),
              OnlineSecurity: Number(customer.OnlineSecurity),
              OnlineBackup: Number(customer.OnlineBackup),
              DeviceProtection: Number(customer.DeviceProtection),
              TechSupport: Number(customer.TechSupport),
              StreamingTV: Number(customer.StreamingTV),
              StreamingMovies: Number(customer.StreamingMovies),
              PaperlessBilling: Number(customer.PaperlessBilling),
              MonthlyCharges: Number(customer.MonthlyCharges),
              TotalCharges: Number(customer.TotalCharges),
              InternetService_Fiber_optic: fiberOptic,
              InternetService_No: customer.InternetService_No === "True",
              Contract_One_year: customer["Contract_One year"] === "True" || customer.Contract_One_year === "True",
              Contract_Two_year: customer["Contract_Two year"] === "True" || customer.Contract_Two_year === "True",
              PaymentMethod_Credit_card_automatic: creditCard,
              PaymentMethod_Electronic_check:
                customer["PaymentMethod_Electronic check"] === "True" ||
                customer.PaymentMethod_Electronic_check === "True",
              PaymentMethod_Mailed_check:
                customer["PaymentMethod_Mailed check"] === "True" || customer.PaymentMethod_Mailed_check === "True",
              Churn: Number(customer.Churn),
              num_complaints: Number(customer.num_complaints),
              churn_risk_score: Number(customer.churn_risk_score),
              last_contacted: Number(customer.last_contacted),
            }
          })

        // Sort by churn_risk_score (descending) and last_contacted (ascending)
        const sortedData = processedData.sort((a, b) => {
          if (b.churn_risk_score !== a.churn_risk_score) {
            return b.churn_risk_score - a.churn_risk_score
          }
          return a.last_contacted - b.last_contacted
        })

        setCustomers(sortedData)
        setFilteredCustomers(sortedData)
        setIsLoading(false)
      },
      error: (error) => {
        console.error("Error parsing CSV:", error)
        setIsLoading(false)
      },
    })
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(query) ||
          customer.surname?.toLowerCase().includes(query) ||
          customer.phone?.toLowerCase().includes(query) ||
          customer.customerID?.toLowerCase().includes(query),
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedCustomer(null)
  }

  const handleAddCustomerSuccess = () => {
    loadCustomers() // Reload customers after adding a new one
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar onSearch={handleSearch} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-700">Customer Dashboard</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => loadCustomers()}
              variant="outline"
              className="border-purple-300 text-purple-700"
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-600 hover:bg-purple-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              {showAddForm ? "Hide Form" : "Add Customer"}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8">
            <AddCustomerForm onSuccess={handleAddCustomerSuccess} />
          </div>
        )}

        <Dashboard customers={filteredCustomers} onRowClick={handleRowClick} />
      </main>
      {isModalOpen && selectedCustomer && <CustomerModal customer={selectedCustomer} onClose={closeModal} />}
    </div>
  )
}
