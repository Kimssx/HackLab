from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import RootModel, BaseModel
from typing import Dict
import uvicorn
import os
import joblib
import numpy as np
import json
import pathlib

# Initialize FastAPI app
app = FastAPI(title="Sentify Risk Score API")

# Enable CORS (so the React frontend can talk to this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load schema (list of expected features)
SCHEMA_PATH = pathlib.Path(__file__).parent / "models" / "churn_feature_schema.json"
with open(SCHEMA_PATH, "r") as f:
    FEATURE_ORDER = json.load(f)

# Load trained model
MODEL_PATH = pathlib.Path(__file__).parent / "models" / "churn_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded from {MODEL_PATH}")
except Exception as e:
    print(f"⚠ Failed to load model: {e}")
    model = None

# ✅ Input model using named field instead of root_
from pydantic import BaseModel, Field
from typing import Dict
import pandas as pd

class CustomerData(RootModel[dict]):
    def to_feature_row(self, default_val: float = 0):
        row_data = {col: self.root.get(col, default_val) for col in FEATURE_ORDER}
        return pd.DataFrame([row_data])
# Output model
class RiskScoreResponse(BaseModel):
    risk_score: int
    risk_level: str

# Prediction logic
def predict_risk_score(payload: CustomerData):
    try:
        row = payload.to_feature_row()
        print(f"✅ Input row: {row}")

        if model is not None:
            print("✅ Model invoked with input")
            prob = model.predict_proba(row)[0][1] * 100
            risk_score = int(round(prob))
        else:
            raise RuntimeError("⚠ Model not loaded")

        if risk_score >= 60:
            risk_level = "High"
        elif risk_score >= 40:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        return risk_score, risk_level

    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return 50, "Moderate"

# Prediction endpoint
@app.post("/predict", response_model=RiskScoreResponse)
async def calculate_risk_score(customer_data: CustomerData):
    risk_score, risk_level = predict_risk_score(customer_data)
    return {
        "risk_score": risk_score,
        "risk_level": risk_level}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

# Local dev runner
if __name__ == "_main_":
    uvicorn.run("app:app", host="0.0.0.0", port=8000,reload=True)