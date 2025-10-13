# export_model.py
import pickle
import json
from pathlib import Path
from datetime import datetime
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# -------------------------------
# 1️⃣ Entraînement (exemple simple)
# -------------------------------
X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# -------------------------------
# 2️⃣ Évaluation
# -------------------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

# -------------------------------
# 3️⃣ Export des fichiers
# -------------------------------
export_dir = Path("exports")
export_dir.mkdir(exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
model_filename = export_dir / f"model_{timestamp}.pkl"
metrics_filename = export_dir / f"metrics_{timestamp}.json"

# Sauvegarde du modèle
with open(model_filename, "wb") as f:
    pickle.dump(model, f)

# Sauvegarde des métriques
metrics = {
    "accuracy": round(accuracy, 4),
    "model_type": "RandomForestClassifier",
    "export_time": timestamp
}
with open(metrics_filename, "w") as f:
    json.dump(metrics, f, indent=4)

print(f"✅ Modèle exporté : {model_filename}")
print(f"✅ Métriques exportées : {metrics_filename}")
