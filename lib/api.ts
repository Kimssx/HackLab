"use client"

// API functions for interacting with the Python backend

export async function calculateRiskScore(payload: Record<string, number>) {
  try {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features: payload }), // ✅ wrap with "root" key
    })

    if (!response.ok) {
      throw new Error(` API Error: ${response.status}`)
    }

    return await response.json() // { risk_score, risk_level }

  } catch (error) {
    console.error("Risk score fetch failed:", error)
    throw error
  }
}

export async function checkApiHealth() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 62000)

    const response = await fetch("http://localhost:8000/health", {
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok
  } catch (error) {
    console.error("API health check failed:", error)
    return false
  }
}