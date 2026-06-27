import json
import numpy as np
import xgboost as xgb

from prediction.rdkit_features import compute_drug_features
from prediction.gpcr_features import get_gpcr_features
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
# ==========================================================
# PATHS
# ==========================================================

MODEL_PATH = BASE_DIR / "final_manual_tuned.json"
FEATURE_METADATA = BASE_DIR / "feature_metadata.json"

# ==========================================================
# LOAD MODEL
# ==========================================================

print("Loading XGBoost model...")

model = xgb.Booster()
model.load_model(str(MODEL_PATH))

print("Model loaded.")

# ==========================================================
# LOAD FEATURE METADATA
# ==========================================================

with open(FEATURE_METADATA, "r") as f:
    meta = json.load(f)

FEATURE_ORDER = meta["feature_order"]

print("Expected features:", len(FEATURE_ORDER))

# ==========================================================
# PREDICTION
# ==========================================================

def predict_pchembl(smiles: str, gpcr_id: int):

    # ----------------------------
    # Drug features
    # ----------------------------

    drug = compute_drug_features(smiles)

    # ----------------------------
    # GPCR features
    # ----------------------------

    gpcr = get_gpcr_features(gpcr_id)

    # ----------------------------
    # Merge features
    # ----------------------------

    features = {}

    features.update(drug)
    features.update(gpcr)

    # gpcr_id is NOT a model feature
    features.pop("gpcr_id", None)

    # ----------------------------
    # Check for missing features
    # ----------------------------

    missing = [f for f in FEATURE_ORDER if f not in features]

    if missing:

        raise ValueError(
            f"Missing {len(missing)} features.\n"
            f"First missing:\n{missing[:20]}"
        )

    # ----------------------------
    # Build feature vector
    # ----------------------------

    X = np.array(

        [features[f] for f in FEATURE_ORDER],

        dtype=np.float32

    ).reshape(1, -1)

    dmatrix = xgb.DMatrix(X)

    prediction = model.predict(dmatrix)[0]

    return float(prediction)

# ==========================================================
# TEST
# ==========================================================

if __name__ == "__main__":

    smiles = "CC(=O)OC1=CC=CC=C1C(=O)O"

    gpcr_id = 1

    pred = predict_pchembl(
        smiles,
        gpcr_id
    )

    print()

    print("Predicted pChEMBL =", pred)