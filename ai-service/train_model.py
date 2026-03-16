"""
train_model.py
Generates synthetic crop price data and trains a Random Forest Regressor.
Run once: python train_model.py
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

# Reproducibility
np.random.seed(42)

CROPS = ["Tomato", "Onion", "Potato", "Rice", "Wheat", "Maize", "Carrot", "Spinach", "Brinjal", "Mango"]
LOCATIONS = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Hyderabad", "Pune", "Nashik", "Jaipur", "Lucknow"]

# Base prices per crop (₹/kg)
BASE_PRICES = {
    "Tomato": 20, "Onion": 18, "Potato": 15, "Rice": 50,
    "Wheat": 30, "Maize": 22, "Carrot": 35, "Spinach": 25,
    "Brinjal": 28, "Mango": 90,
}

# Seasonal multipliers per month (1=Jan ... 12=Dec)
SEASONAL = [1.0, 0.95, 0.85, 0.9, 1.1, 1.2, 1.3, 1.25, 1.15, 1.05, 1.0, 0.95]

records = []
for _ in range(10_000):
    crop = np.random.choice(CROPS)
    location = np.random.choice(LOCATIONS)
    month = np.random.randint(1, 13)
    demand = np.random.randint(30, 100)  # demand score 30-100
    prev_price = BASE_PRICES[crop] * np.random.uniform(0.7, 1.3)
    noise = np.random.normal(0, 2)
    seasonal_mult = SEASONAL[month - 1]
    demand_effect = (demand - 65) * 0.05     # +/- based on demand
    predicted_price = prev_price * seasonal_mult + demand_effect + noise
    predicted_price = max(5, round(predicted_price, 2))  # floor at ₹5
    records.append({
        "crop": crop, "location": location, "month": month,
        "demand": demand, "previous_price": round(prev_price, 2),
        "predicted_price": predicted_price,
    })

df = pd.DataFrame(records)

# Encode categoricals
le_crop = LabelEncoder()
le_loc  = LabelEncoder()
df["crop_enc"]     = le_crop.fit_transform(df["crop"])
df["location_enc"] = le_loc.fit_transform(df["location"])

X = df[["crop_enc", "location_enc", "month", "demand", "previous_price"]].values
y = df["predicted_price"].values

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

os.makedirs("ai-service", exist_ok=True)
joblib.dump(model,   "model.pkl")
joblib.dump(le_crop, "le_crop.pkl")
joblib.dump(le_loc,  "le_loc.pkl")

print("✅ Model trained and saved: model.pkl, le_crop.pkl, le_loc.pkl")
print(f"Training samples: {len(df)}")
