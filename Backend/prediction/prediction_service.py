import pandas as pd

from prediction.predictor import predict_pchembl
from prediction.similarity import find_similar_molecules


# ==========================================================
# MAIN SERVICE
# ==========================================================

def predict_for_user(
    smiles: str,
    gpcr_id: int,
    top_n: int = 10
):

    predicted = predict_pchembl(
        smiles=smiles,
        gpcr_id=gpcr_id
    )

    similar = find_similar_molecules(
        smiles=smiles,
        gpcr_id=gpcr_id,
        top_n=top_n
    )

    return {

        "prediction": {

            "gpcr_id": gpcr_id,
            "query_smiles": smiles,
            "predicted_pchembl": round(float(predicted), 3)

        },

        "similar_molecules": similar

    }


# ==========================================================
# PRINT HELPER
# ==========================================================

def print_table(title, ligands):

    if len(ligands) == 0:
        return

    print("\n" + "=" * 70)
    print(title)
    print("=" * 70)

    # ------------------------------------------------------
    # Quantitative table
    # ------------------------------------------------------

    if title == "Quantitative Ligands":

        print(
            f"{'Rank':<5}"
            f"{'Mol ID':<20}"
            f"{'Similarity':<12}"
            f"{'Mean':<10}"
            f"{'Median':<10}"
            f"{'Max':<10}"
            f"{'Action'}"
        )

        print("-" * 100)

        for i, ligand in enumerate(ligands, start=1):

            mean = "-" if pd.isna(ligand["mean_pchembl"]) else f"{ligand['mean_pchembl']:.2f}"
            median = "-" if pd.isna(ligand["median_pchembl"]) else f"{ligand['median_pchembl']:.2f}"
            maximum = "-" if pd.isna(ligand["max_pchembl"]) else f"{ligand['max_pchembl']:.2f}"

            print(
                f"{i:<5}"
                f"{ligand['mol_id']:<20}"
                f"{ligand['similarity']:<12.4f}"
                f"{mean:<10}"
                f"{median:<10}"
                f"{maximum:<10}"
                f"{str(ligand['action_types']):<20}"
            )

    # ------------------------------------------------------
    # Known ligands
    # ------------------------------------------------------

    elif title == "Known Ligands":

        print(
            f"{'Rank':<5}"
            f"{'Mol ID':<20}"
            f"{'Similarity':<12}"
            f"{'Action'}"
        )

        print("-" * 70)

        for i, ligand in enumerate(ligands, start=1):

            print(
                f"{i:<5}"
                f"{ligand['mol_id']:<20}"
                f"{ligand['similarity']:<12.4f}"
                f"{str(ligand['action_types'])}"
            )

    # ------------------------------------------------------
    # Other molecules
    # ------------------------------------------------------

    else:

        print(
            f"{'Rank':<5}"
            f"{'Mol ID':<20}"
            f"{'Similarity'}"
        )

        print("-" * 45)

        for i, ligand in enumerate(ligands, start=1):

            print(
                f"{i:<5}"
                f"{ligand['mol_id']:<20}"
                f"{ligand['similarity']:<12.4f}"
            )


# ==========================================================
# TEST
# ==========================================================

if __name__ == "__main__":

    print("=" * 60)
    print("PREDICTION SERVICE")
    print("=" * 60)

    gpcr = int(input("GPCR ID : "))
    smiles = input("SMILES : ").strip()

    print("\nRunning prediction...\n")

    result = predict_for_user(
        smiles,
        gpcr,
        top_n=10
    )

    print("=" * 60)
    print("Predicted pChEMBL")
    print("=" * 60)

    print(result["prediction"]["predicted_pchembl"])

    # ------------------------------------------------------

    print_table(
        "Quantitative Ligands",
        result["similar_molecules"]["quantitative"]
    )

    print_table(
        "Known Ligands",
        result["similar_molecules"]["known"]
    )

    print_table(
        "Other Similar Molecules",
        result["similar_molecules"]["unannotated"]
    )

    print("\nDone.")