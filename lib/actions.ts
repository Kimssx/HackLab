"use server"

import fs from "fs/promises"
import path from "path"
import { revalidatePath } from "next/cache"
import type { Customer } from "@/types/customer"

const CSV_PATH = path.join(process.cwd(), "public", "customers_database.csv")

// Update the addCustomer function to handle the column names with spaces
export async function addCustomer(customer: Customer): Promise<void> {
  try {
    // Ensure all required fields are present
    if (!customer.name || !customer.surname || !customer.phone) {
      throw new Error("Missing required customer data")
    }

    // Read the existing CSV file
    let csvData = ""
    try {
      csvData = await fs.readFile(CSV_PATH, "utf-8")
    } catch (error) {
      // If file doesn't exist, create it with headers
      csvData =
        "customerID,name,surname,phone,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,PaperlessBilling,MonthlyCharges,TotalCharges,InternetService_Fiber optic,InternetService_No,Contract_One year,Contract_Two year,PaymentMethod_Credit card (automatic),PaymentMethod_Electronic check,PaymentMethod_Mailed check,Churn,num_complaints,churn_risk_score,risk_level,last_contacted,complaints"
    }

    // Create a new CSV row for the customer
    const newRow = [
      customer.customerID,
      customer.name,
      customer.surname,
      customer.phone,
      customer.gender,
      customer.SeniorCitizen,
      customer.Partner,
      customer.Dependents,
      customer.tenure,
      customer.PhoneService,
      customer.MultipleLines,
      customer.OnlineSecurity,
      customer.OnlineBackup,
      customer.DeviceProtection,
      customer.TechSupport,
      customer.StreamingTV,
      customer.StreamingMovies,
      customer.PaperlessBilling,
      customer.MonthlyCharges,
      customer.TotalCharges,
      customer.InternetService_Fiber_optic || customer["InternetService_Fiber optic"] || false,
      customer.InternetService_No,
      customer.Contract_One_year || customer["Contract_One year"] || false,
      customer.Contract_Two_year || customer["Contract_Two year"] || false,
      customer.PaymentMethod_Credit_card_automatic || customer["PaymentMethod_Credit card (automatic)"] || false,
      customer.PaymentMethod_Electronic_check || customer["PaymentMethod_Electronic check"] || false,
      customer.PaymentMethod_Mailed_check || customer["PaymentMethod_Mailed check"] || false,
      customer.Churn,
      customer.num_complaints,
      customer.churn_risk_score,
      customer.risk_level,
      customer.last_contacted,
      customer.complaints,
    ].join(",")

    // Append the new row to the CSV data
    const updatedCsvData = csvData + "\n" + newRow

    // Write the updated CSV data back to the file
    await fs.writeFile(CSV_PATH, updatedCsvData, "utf-8")

    // Revalidate the path to refresh the data
    revalidatePath("/")
  } catch (error) {
    console.error("Error adding customer to CSV:", error)
    throw new Error(`Failed to add customer: ${error instanceof Error ? error.message : String(error)}`)
  }
}
