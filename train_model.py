#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour entraîner et sauvegarder le modèle de classification
"""

import pickle
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# Exemple de données factices : à remplacer par tes réclamations et étiquettes
X_train = [
    "Le colis est arrivé endommagé",
    "Très satisfait du service",
    "Produit en retard",
    "Merci pour votre aide",
]
y_train = ["dommage", "satisfait", "retard", "satisfait"]

# Crée un pipeline vectorisation + modèle
model = make_pipeline(CountVectorizer(), MultinomialNB())
model.fit(X_train, y_train)

# Crée le dossier exports si nécessaire
import os
os.makedirs("exports", exist_ok=True)

# Sauvegarde le modèle
with open("exports/model_latest.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Modèle sauvegardé dans exports/model_latest.pkl")
