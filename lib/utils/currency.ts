// Currency conversion utilities
export const USD_TO_INR_RATE = 83.12 // Current exchange rate (should be fetched from API in production)

export const convertUSDToINR = (usdAmount: number): number => {
  return Math.round(usdAmount * USD_TO_INR_RATE * 100) / 100
}

export const convertINRToUSD = (inrAmount: number): number => {
  return Math.round((inrAmount / USD_TO_INR_RATE) * 100) / 100
}

export const formatCurrency = (amount: number, currency = "INR"): string => {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatIndianCurrency = (amount: number): string => {
  // Indian number formatting with lakhs and crores
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(2)} K`
  }
  return `₹${amount.toFixed(2)}`
}

// Get current exchange rate from API (for production use)
export const fetchCurrentExchangeRate = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
    const data = await response.json()
    return data.rates.INR || USD_TO_INR_RATE
  } catch (error) {
    console.error("Error fetching exchange rate:", error)
    return USD_TO_INR_RATE // Fallback to default rate
  }
}
