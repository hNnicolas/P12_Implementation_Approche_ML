from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
from pathlib import Path
import uvicorn

class ClaimRequest(BaseModel):
    user_claim: str

app = FastAPI(
    title="ML Claim Classifier API",
    description="API pour classer automatiquement les réclamations utilisateurs.",
    version="1.0.0",
)

# ---- middleware CORS ----
# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Chargement du modèle ----
model_path = Path("exports/model_latest.pkl")
try:
    with open(model_path, "rb") as f:
        model = pickle.load(f)
    print(f"✅ Modèle chargé depuis {model_path}")
except Exception as e:
    print(f"⚠️ Erreur lors du chargement du modèle : {e}")
    model = None

# ---- Route de prédiction ----
@app.post("/predict")
async def predict_claim(data: ClaimRequest):
    if model is None:
        return {"error": "Modèle non chargé"}

    text = data.user_claim
    try:
        prediction = model.predict([text])[0]
        return {"claim": text, "prediction": prediction}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
