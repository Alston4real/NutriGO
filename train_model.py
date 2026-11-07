"""
NutriGO recommendation model training starter.

This script expects a REAL, consented, labelled dataset at meal_feedback.csv.
Do not train or report model performance using fabricated demo labels.
Expected columns:
  protein_g, sodium_mg, calories_kcal, prep_minutes, vegetarian (0/1),
  suitable (0/1)   # outcome label defined by your study protocol

The model predicts suitability according to the label you collect; it does not
provide medical or clinical nutrition advice.
"""
from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

DATA = Path(__file__).with_name("meal_feedback.csv")
FEATURES = ["protein_g", "sodium_mg", "calories_kcal", "prep_minutes", "vegetarian"]
TARGET = "suitable"

if not DATA.exists():
    raise SystemExit(
        "No meal_feedback.csv found. Collect real, consented and labelled data "
        "before training; do not substitute invented labels."
    )

df = pd.read_csv(DATA).dropna(subset=FEATURES + [TARGET])
if df[TARGET].nunique() < 2:
    raise SystemExit("The target needs at least two classes.")
X, y = df[FEATURES], df[TARGET].astype(int)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
model = RandomForestClassifier(
    n_estimators=200, min_samples_leaf=2, class_weight="balanced", random_state=42
)
model.fit(X_train, y_train)
pred = model.predict(X_test)
print("Held-out evaluation (interpret cautiously; check sample size and class balance):")
print(classification_report(y_test, pred, zero_division=0))
print("Confusion matrix:")
print(confusion_matrix(y_test, pred))
joblib.dump({"model": model, "features": FEATURES}, Path(__file__).with_name("nutrigo_model.joblib"))
print("Saved nutrigo_model.joblib")
