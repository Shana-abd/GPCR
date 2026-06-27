import pandas as pd
from sqlalchemy import create_engine

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
# LOAD CORE GPCR FEATURES
# ==========================================================

CORE_QUERY = """
SELECT
    s.gpcr_id,

    -- Sequence
    s.seq_length,
    s.mol_wt,
    s.isoelectric_point,
    s.aromaticity,
    s.instability_index,
    s.gravy,
    s.charge_ph7,

    -- Amino Acid Composition
    aa.pct_a,
    aa.pct_r,
    aa.pct_n,
    aa.pct_d,
    aa.pct_c,
    aa.pct_q,
    aa.pct_e,
    aa.pct_g,
    aa.pct_h,
    aa.pct_i,
    aa.pct_l,
    aa.pct_k,
    aa.pct_m,
    aa.pct_f,
    aa.pct_p,
    aa.pct_s,
    aa.pct_t,
    aa.pct_w,
    aa.pct_y,
    aa.pct_v,

    -- Structure
    st.tm_count,
    st.has_dry,
    st.has_npxxy,

    -- Expression Summary
    es.wholebody_median_tpm,
    es.wholebody_max_tpm,
    es.wholebody_specificity_score,
    es.brain_mean_tpm,
    es.brain_max_tpm,
    es.brain_specificity_score

FROM gpcr_sequence s

LEFT JOIN gpcr_aa_composition aa
ON s.gpcr_id = aa.gpcr_id

LEFT JOIN gpcr_structure st
ON s.gpcr_id = st.gpcr_id

LEFT JOIN expression_summary es
ON s.gpcr_id = es.gpcr_id

ORDER BY s.gpcr_id;
"""

core = pd.read_sql(CORE_QUERY, engine)

# Rename to match ML training

core.rename(columns={
    "seq_length": "t_seq_length",
    "mol_wt": "t_mol_wt"
}, inplace=True)

# Convert booleans to integers

core["has_dry"] = core["has_dry"].astype(int)
core["has_npxxy"] = core["has_npxxy"].astype(int)

# ==========================================================
# LOAD TISSUE EXPRESSION
# ==========================================================

EXPR_QUERY = """
SELECT
    g.gpcr_id,
    t.tissue_name,
    g.log_tpm

FROM expression_gtex g

JOIN tissue t
ON g.tissue_id = t.tissue_id;
"""

expr = pd.read_sql(EXPR_QUERY, engine)

# Create feature names

expr["feature"] = (
    "expr_" +
    expr["tissue_name"]
        .str.strip()
        .str.replace(" ", "_", regex=False)
        # Keep hyphens exactly as they are
        .str.replace("(", "", regex=False)
        .str.replace(")", "", regex=False)
        .str.replace("/", "_", regex=False)
)

# Pivot

expr = expr.pivot_table(
    index="gpcr_id",
    columns="feature",
    values="log_tpm",
    aggfunc="median"
)

expr.reset_index(inplace=True)
expr.columns.name = None

# ==========================================================
# MERGE
# ==========================================================

gpcr_features = core.merge(
    expr,
    on="gpcr_id",
    how="left"
)

print("Loaded GPCRs:", len(gpcr_features))

# ==========================================================
# CACHE
# ==========================================================

GPCR_CACHE = {}

for _, row in gpcr_features.iterrows():

    d = row.to_dict()

# The model never uses gpcr_id as a feature
    d.pop("gpcr_id", None)

    GPCR_CACHE[int(row.gpcr_id)] = d

print("Cached:", len(GPCR_CACHE), "GPCRs")

# ==========================================================
# API
# ==========================================================

def get_gpcr_features(gpcr_id):

    gpcr_id = int(gpcr_id)

    if gpcr_id not in GPCR_CACHE:
        raise ValueError(f"GPCR {gpcr_id} not found.")

    return GPCR_CACHE[gpcr_id]


# ==========================================================
# TEST
# ==========================================================

if __name__ == "__main__":

    first = list(GPCR_CACHE.keys())[0]

    feats = get_gpcr_features(first)

    print("\nGPCR:", first)
    print("Total Features:", len(feats))

    print("\nFirst 25 Features\n")

    for k in list(feats.keys())[:25]:
        print(f"{k:35s} {feats[k]}")

