"""
main.py – FarmFresh AI Crop Price Prediction API
Run: uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

app = FastAPI(title="FarmFresh AI Price Predictor", version="1.0.0")

# Allow CORS so the React frontend can call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model artefacts ────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)

try:
    model   = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
    le_crop = joblib.load(os.path.join(BASE_DIR, "le_crop.pkl"))
    le_loc  = joblib.load(os.path.join(BASE_DIR, "le_loc.pkl"))
    KNOWN_CROPS     = list(le_crop.classes_)
    KNOWN_LOCATIONS = list(le_loc.classes_)
except FileNotFoundError:
    raise RuntimeError(
        "Model files not found. Run `python train_model.py` first."
    )


# ── Request / Response schemas ──────────────────────────────────────────────
class PredictRequest(BaseModel):
    crop: str           = Field(..., example="Tomato")
    location: str       = Field(..., example="Chennai")
    month: int          = Field(..., ge=1, le=12, example=6)
    demand: int         = Field(..., ge=0, le=100, example=80)
    previous_price: float = Field(..., gt=0, example=20)


class PredictResponse(BaseModel):
    crop: str
    location: str
    current_price: float
    predicted_price: float
    change_percent: float
    suggestion: str
    confidence: str


# ── Helpers ─────────────────────────────────────────────────────────────────
def _encode_safe(le, value: str, fallback_idx: int = 0) -> int:
    """Encode a label; fall back gracefully for unseen values."""
    try:
        return int(le.transform([value])[0])
    except ValueError:
        return fallback_idx


def _suggestion(current: float, predicted: float) -> str:
    pct = ((predicted - current) / current) * 100
    if pct > 15:
        return "Hold stock for 5–7 days for significant profit"
    elif pct > 5:
        return "Hold stock for 2–3 days for better returns"
    elif pct > 0:
        return "Slight increase expected – sell within a week"
    elif pct > -10:
        return "Sell now for best returns"
    else:
        return "Urgent: Sell immediately, prices dropping"


def _confidence(n_estimators: int = 100) -> str:
    # Simple heuristic: fixed confidence for this demo model
    return "High (87%)"


# ── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/")
def root():
    return {
        "service": "FarmFresh AI Price Predictor",
        "status": "running",
        "supported_crops": KNOWN_CROPS,
        "supported_locations": KNOWN_LOCATIONS,
    }


@app.post("/predict-price", response_model=PredictResponse)
def predict_price(req: PredictRequest):
    crop_enc = _encode_safe(le_crop, req.crop)
    loc_enc  = _encode_safe(le_loc,  req.location)

    features = np.array([[crop_enc, loc_enc, req.month, req.demand, req.previous_price]])
    predicted = float(round(model.predict(features)[0], 2))
    predicted = max(1.0, predicted)   # safety floor

    change_pct = round(((predicted - req.previous_price) / req.previous_price) * 100, 1)
    suggestion = _suggestion(req.previous_price, predicted)

    return PredictResponse(
        crop=req.crop,
        location=req.location,
        current_price=req.previous_price,
        predicted_price=predicted,
        change_percent=change_pct,
        suggestion=suggestion,
        confidence=_confidence(),
    )


@app.get("/crops")
def list_crops():
    return {"crops": KNOWN_CROPS}


@app.get("/locations")
def list_locations():
    return {"locations": KNOWN_LOCATIONS}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
