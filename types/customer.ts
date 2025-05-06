export interface Customer {
  customerID: string
  name: string
  surname: string
  phone: string
  gender: string
  SeniorCitizen: number
  Partner: number
  Dependents: number
  tenure: number
  PhoneService: number
  MultipleLines: number
  OnlineSecurity: number
  OnlineBackup: number
  DeviceProtection: number
  TechSupport: number
  StreamingTV: number
  StreamingMovies: number
  PaperlessBilling: number
  MonthlyCharges: number
  TotalCharges: number
  "InternetService_Fiber optic"?: boolean
  InternetService_Fiber_optic?: boolean
  InternetService_No: boolean
  "Contract_One year"?: boolean
  Contract_One_year?: boolean
  "Contract_Two year"?: boolean
  Contract_Two_year?: boolean
  "PaymentMethod_Credit card (automatic)"?: boolean
  PaymentMethod_Credit_card_automatic?: boolean
  "PaymentMethod_Electronic check"?: boolean
  PaymentMethod_Electronic_check?: boolean
  "PaymentMethod_Mailed check"?: boolean
  PaymentMethod_Mailed_check?: boolean
  Churn: number
  num_complaints: number
  churn_risk_score: number
  risk_level: string
  last_contacted: number
  complaints: string
}
