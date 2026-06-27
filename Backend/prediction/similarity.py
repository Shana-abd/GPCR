import pandas as pd
from sqlalchemy import create_engine
from rdkit.DataStructs.cDataStructs import CreateFromBitString

from rdkit import Chem
from rdkit.Chem import rdFingerprintGenerator
from rdkit import DataStructs
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

FP_TABLE = (
    pd.read_parquet(
        BASE_DIR / "data" / "mol_fingerprint.parquet"
    )
    .set_index("mol_id")
)

print(f"Loaded {len(FP_TABLE):,} fingerprints.")

# ==========================================================
# DATABASE CONFIG
# ==========================================================

DB_USER = "gpcr_user"
DB_PASSWORD = "hpyD5zeVpW7AU0Hxs7M6VyDcFxzo5b9b"
DB_HOST = "dpg-d8nqi08k1i2s73dkgrgg-a.virginia-postgres.render.com"
DB_PORT = "5432"
DB_NAME = "gpcr"

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# ==========================================================
# MORGAN FINGERPRINT GENERATOR
# ==========================================================

FP_GENERATOR = rdFingerprintGenerator.GetMorganGenerator(
    radius=2,
    fpSize=1024
)

# ==========================================================
# CACHE
# ==========================================================

CACHE = {}


# ==========================================================
# LOAD ONE GPCR INTO CACHE
# ==========================================================

def load_gpcr(gpcr_id):

    print(f"Loading GPCR {gpcr_id}...")

    query = f"""
    SELECT

        d.gpcr_id,
        d.mol_id,

        d.mean_pchembl,
        d.median_pchembl,
        d.max_pchembl,

        d.action_types,

        m.mol_name,
        m.smiles

    FROM drug_gpcr_v2 d

    JOIN molecule m
        ON d.mol_id = m.mol_id

    WHERE d.gpcr_id = {int(gpcr_id)}
    """

    df = pd.read_sql(query, engine)



    df["rdkit_fp"] = df["mol_id"].map(FP_TABLE["rdkit_fp"])

    
   
    
    ligands = []

    skipped = 0

    for _, row in df.iterrows():

        bitstring = row["rdkit_fp"]

        if pd.isna(bitstring):
            skipped += 1
            continue

        fp = CreateFromBitString(str(bitstring))

        ligands.append({

            "mol_id": row["mol_id"],
            "mol_name": row["mol_name"],
            "smiles": row["smiles"],
            "fingerprint": fp,
            "mean_pchembl": row["mean_pchembl"],
            "median_pchembl": row["median_pchembl"],
            "max_pchembl": row["max_pchembl"],
            "action_types": row["action_types"]

        })

    
    print(f"Skipped {skipped} ligands with missing fingerprints.")

    return ligands


# ==========================================================
# FIND SIMILAR MOLECULES
# ==========================================================

def find_similar_molecules(
    smiles: str,
    gpcr_id: int,
    top_n: int = 10,
    min_similarity: float = 0.4
):
    """
    Find the most chemically similar known ligands for a GPCR.

    Parameters
    ----------
    smiles : str
        Query molecule.

    gpcr_id : int
        GPCR ID.

    top_n : int
        Number of molecules to return.

    min_similarity : float
        Ignore ligands below this similarity.

    Returns
    -------
    list[dict]
    """

    gpcr_id = int(gpcr_id)

# ------------------------------------------
# Lazy load GPCR
# ------------------------------------------

    if gpcr_id not in CACHE:

        CACHE[gpcr_id] = load_gpcr(gpcr_id)

    ligands = CACHE[gpcr_id]

    if len(ligands) == 0:

        raise ValueError(
            f"No ligands found for GPCR {gpcr_id}."
        )

    # ------------------------------------------
    # Build query fingerprint
    # ------------------------------------------

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:

        raise ValueError(
            "Invalid SMILES."
        )

    query_fp = FP_GENERATOR.GetFingerprint(mol)

    # ------------------------------------------
    # Cached ligands
    # ------------------------------------------
    if gpcr_id not in CACHE:
        CACHE[gpcr_id] = load_gpcr(gpcr_id)

    ligands = CACHE[gpcr_id]

    fps = [
        ligand["fingerprint"]
        for ligand in ligands
    ]

    # ------------------------------------------
    # Fast RDKit similarity
    # ------------------------------------------

    similarities = DataStructs.BulkTanimotoSimilarity(
        query_fp,
        fps
    )

    # ------------------------------------------
    # Combine with ligand information
    # ------------------------------------------

    quantitative = []
    known = []
    unannotated = []

    for ligand, sim in zip(ligands, similarities):

        if sim < min_similarity:
            continue

        entry = {

            "mol_id": ligand["mol_id"],
            "mol_name": ligand["mol_name"],
            "similarity": round(float(sim), 4),
            "mean_pchembl": None if pd.isna(ligand["mean_pchembl"]) else float(ligand["mean_pchembl"]),

            "median_pchembl": None if pd.isna(ligand["median_pchembl"]) else float(ligand["median_pchembl"]),

            "max_pchembl": None if pd.isna(ligand["max_pchembl"]) else float(ligand["max_pchembl"]),

            "action_types": None if pd.isna(ligand["action_types"]) else ligand["action_types"],

            "smiles": ligand["smiles"]

        }

        mean = ligand["mean_pchembl"]
        action = ligand["action_types"]

        has_pchembl = mean is not None and not pd.isna(mean)
        has_action = action is not None and not pd.isna(action)

        if has_pchembl:

            quantitative.append(entry)

        elif has_action:

            known.append(entry)

        else:

            unannotated.append(entry)
    # ------------------------------------------
    # Sort
    # ------------------------------------------
    print("Quantitative:", len(quantitative))
    print("Known:", len(known))
    print("Other:", len(unannotated))
    quantitative.sort(
        key=lambda x: (x["similarity"], x["mean_pchembl"]),
        reverse=True
    )

    known.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    unannotated.sort(
        key=lambda x: x["similarity"],
        reverse=True
    )

    return {

        "quantitative": quantitative[:top_n],

        "known": known[:top_n],

        "unannotated": unannotated[:top_n]

    }

# ==========================================================
# TEST
# ==========================================================

if __name__ == "__main__":

    print("=" * 60)
    print("SIMILARITY SEARCH TEST")
    print("=" * 60)

    # ------------------------------------------------------
    # USER INPUT
    # ------------------------------------------------------

    gpcr_id = int(input("GPCR ID : "))
    smiles = input("SMILES  : ").strip()

    print("\nSearching...\n")

    try:

        results = find_similar_molecules(
            smiles=smiles,
            gpcr_id=gpcr_id,
            top_n=10
        )

    except Exception as e:

        print("ERROR:", e)
        raise SystemExit

    # ------------------------------------------------------
    # RESULTS
    # ------------------------------------------------------

    if len(results) == 0:

        print("No similar ligands found.")
        raise SystemExit

    print(f"Top {len(results)} similar ligands\n")

    print(
        f"{'Rank':<5}"
        f"{'Mol ID':<20}"
        f"{'Similarity':<12}"
        f"{'Mean':<10}"
        f"{'Median':<10}"
        f"{'Max':<10}"
        f"{'Action'}"
    )

    print("-" * 95)

    for i, ligand in enumerate(results, start=1):

        mean = (
            f"{ligand['mean_pchembl']:.2f}"
            if ligand["mean_pchembl"] is not None
            else "-"
        )

        median = (
            f"{ligand['median_pchembl']:.2f}"
            if ligand["median_pchembl"] is not None
            else "-"
        )

        maximum = (
            f"{ligand['max_pchembl']:.2f}"
            if ligand["max_pchembl"] is not None
            else "-"
        )

        print(

            f"{i:<5}"
            f"{str(ligand['mol_id']):<20}"
            f"{ligand['similarity']:<12.4f}"
            f"{mean:<10}"
            f"{median:<10}"
            f"{maximum:<10}"
            f"{str(ligand['action_types'])}"

        )

    print("\nDone.")