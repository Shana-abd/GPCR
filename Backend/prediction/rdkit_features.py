from rdkit import Chem
from rdkit.Chem import Descriptors
from rdkit.Chem import Crippen
from rdkit.Chem import Lipinski
from rdkit.Chem import rdMolDescriptors
from rdkit.Chem import QED
from rdkit.Chem import AllChem


FP_BITS = 1024


def compute_drug_features(smiles: str):
    """
    Compute all drug features required by the pChEMBL model.

    Parameters
    ----------
    smiles : str

    Returns
    -------
    dict
        Dictionary containing descriptors + fp_0 ... fp_1023
    """

    mol = Chem.MolFromSmiles(smiles)

    if mol is None:
        raise ValueError("Invalid SMILES string.")

    features = {}

    # ----------------------------
    # Molecular descriptors
    # ----------------------------

    features["molwt"] = Descriptors.MolWt(mol)
    features["logp"] = Crippen.MolLogP(mol)
    features["tpsa"] = rdMolDescriptors.CalcTPSA(mol)

    features["numhacceptors"] = Lipinski.NumHAcceptors(mol)
    features["numhdonors"] = Lipinski.NumHDonors(mol)

    features["numrotatablebonds"] = Lipinski.NumRotatableBonds(mol)

    features["heavyatomcount"] = mol.GetNumHeavyAtoms()

    features["fractioncsp3"] = rdMolDescriptors.CalcFractionCSP3(mol)

    features["numaromaticrings"] = rdMolDescriptors.CalcNumAromaticRings(mol)

    features["qed"] = QED.qed(mol)

    # ----------------------------
    # Drug-likeness
    # ----------------------------

    violations = 0

    if features["molwt"] > 500:
        violations += 1

    if features["logp"] > 5:
        violations += 1

    if features["numhacceptors"] > 10:
        violations += 1

    if features["numhdonors"] > 5:
        violations += 1

    features["lipinskiviolations"] = violations
    features["isdruglike"] = int(violations <= 1)

    # ----------------------------
    # Morgan Fingerprint
    # ----------------------------

    fp = AllChem.GetMorganFingerprintAsBitVect(
        mol,
        radius=2,
        nBits=FP_BITS
    )

    bits = list(fp)

    for i, bit in enumerate(bits):
        features[f"fp_{i}"] = int(bit)

    return features


if __name__ == "__main__":

    smiles = "CC(=O)OC1=CC=CC=C1C(=O)O"

    feats = compute_drug_features(smiles)

    print("Number of features:", len(feats))

    print()

    for k in list(feats.keys())[:15]:
        print(f"{k:25s} {feats[k]}")