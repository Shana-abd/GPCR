from fastapi import FastAPI
from sqlalchemy import text
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import Query

from prediction.prediction_service import predict_for_user
app = FastAPI(
    title="GPCR Database API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://gpcr.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class PredictionRequest(BaseModel):
    gpcr_id: int
    smiles: str

@app.get("/")
def home():
    return {"message": "GPCR Database API running"}
@app.post("/predict")
def predict(request: PredictionRequest):

    return predict_for_user(
        smiles=request.smiles,
        gpcr_id=request.gpcr_id,
        top_n=10
    )


@app.get("/gpcrs")
def get_gpcrs():

    db = SessionLocal()

    result = db.execute(
        text("""
            SELECT
                gpcr_id,
                entry_name,
                t_name,
                receptor_class,
                receptor_family,
                ligand_type
            FROM gpcr
            ORDER BY gpcr_id
            
        """),
    )

    rows = result.mappings().all()

    db.close()

    return rows
@app.get("/search")
def search(q: str):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            'gpcr' AS result_type,
            g.gpcr_id::text AS id,
            g.t_name AS name

        FROM gpcr g

        LEFT JOIN gpcr_xrefs x
            ON g.gpcr_id = x.gpcr_id

        WHERE
            g.entry_name ILIKE :query
            OR g.t_name ILIKE :query
            OR g.alt_names ILIKE :query
            OR x.chembl_target_id ILIKE :query

        UNION ALL

        SELECT
            'drug' AS result_type,
            m.mol_id AS id,
            m.mol_name AS name

        FROM molecule m

        WHERE
            m.mol_name ILIKE :query
            OR m.mol_id ILIKE :query

        LIMIT 50
        """),
        {"query": f"%{q}%"}
    )

    rows = result.mappings().all()

    db.close()

    return rows
@app.get("/gpcr/{gpcr_id}")
def get_gpcr(gpcr_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            g.gpcr_id,
            g.entry_name,
            g.t_name,
            g.receptor_class,
            g.receptor_family,
            g.ligand_type,
            g.alt_names,

            x.uniprot_id,
            x.ensembl_gene_id,

            s.seq_length,
            s.mol_wt,
            s.isoelectric_point,
            s.t_sequence,

            st.tm_count,
            st.has_dry,
            st.has_npxxy,
            s.aromaticity,
            s.instability_index,
            s.charge_ph7,
            s.gravy,
             

            es.wholebody_max_tpm,
            es.wholebody_max_tissue,
            es.brain_max_tpm,
            es.brain_max_region,
            es.brain_specificity_score

        FROM gpcr g

        LEFT JOIN gpcr_xrefs x
            ON g.gpcr_id = x.gpcr_id

        LEFT JOIN gpcr_sequence s
            ON g.gpcr_id = s.gpcr_id

        LEFT JOIN gpcr_structure st
            ON g.gpcr_id = st.gpcr_id
        
        LEFT JOIN expression_summary es
            ON g.gpcr_id = es.gpcr_id

        WHERE g.gpcr_id = :gpcr_id
        """),
        {"gpcr_id": gpcr_id}
    )

    row = result.mappings().first()

    db.close()

    return row

@app.get("/gpcr/{gpcr_id}/structure")
def get_gpcr_structure(gpcr_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            s.seq_length,
            s.mol_wt,
            s.isoelectric_point,
            s.aromaticity,
            s.instability_index,
            s.gravy,
            s.charge_ph7,

            st.tm_count,
            st.has_dry,
            st.has_npxxy

        FROM gpcr_sequence s

        LEFT JOIN gpcr_structure st
            ON s.gpcr_id = st.gpcr_id

        WHERE s.gpcr_id = :gpcr_id
        """),
        {"gpcr_id": gpcr_id}
    )

    row = result.mappings().first()

    db.close()

    return row
@app.get("/gpcr/{gpcr_id}/drugs")
def get_gpcr_drugs(gpcr_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            dg.mol_id,
            dg.max_pchembl,
            dg.mean_pchembl,
            dg.median_pchembl,
            dg.action_types,

            m.mol_name
        FROM drug_gpcr_v2 dg

        LEFT JOIN molecule m
            ON dg.mol_id = m.mol_id

        WHERE dg.gpcr_id = :gpcr_id

        ORDER BY dg.median_pchembl DESC NULLS LAST

        LIMIT 20
        """),
        {"gpcr_id": gpcr_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows

@app.get("/drug/{mol_id}")
def get_drug(mol_id: str):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            m.*,

            d.mol_wt,
            d.logp,
            d.tpsa,
            d.hba,
            d.hbd,
            d.rotatable_bonds,
            d.heavy_atom_count,
            d.frac_csp3,
            d.aromatic_rings

        FROM molecule m

        LEFT JOIN mol_descriptors d
            ON m.mol_id = d.mol_id

        WHERE m.mol_id = :mol_id
        """),
        {"mol_id": mol_id}
    )

    row = result.mappings().first()

    db.close()

    return row
@app.get("/drug/{mol_id}/sideeffects")
def get_drug_sideeffects(mol_id: str):

    db = SessionLocal()

    result = db.execute(
        text("""
            SELECT
             
                se.term,
                se.mid_label,
                se.coarse_label,
                dse.side_effect_id,
                dse.final_weight,
                dse.confidence,
                dse.n_sources,
            FROM drug_side_effect dse
            JOIN side_effect se
                ON dse.side_effect_id = se.side_effect_id
            WHERE dse.mol_id = :mol_id
            ORDER BY
                coarse_label,
                mid_label,
                fine_label

        
        """),
        {"mol_id": mol_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows
@app.get("/drug/{mol_id}/targets")
def get_drug_targets(mol_id: str):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            dg.gpcr_id,

            g.entry_name,
            g.t_name,

            dg.max_pchembl,
            dg.mean_pchembl,
            dg.median_pchembl

        FROM drug_gpcr_v2 dg

        JOIN gpcr g
            ON dg.gpcr_id = g.gpcr_id

        WHERE dg.mol_id = :mol_id

        ORDER BY dg.median_pchembl DESC NULLS LAST

        LIMIT 50
        """),
        {"mol_id": mol_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows

print("el")
@app.get("/drugs")
def get_drugs(
    search: str = Query(default=""),
    limit: int = Query(default=50),
    offset: int = Query(default=0)
):

    db = SessionLocal()

    pattern = f"%{search}%"

    result = db.execute(
        text("""
        SELECT
            m.mol_id,
            m.mol_name,
            m.drugbank_id,
            m.pubchem_cid,

            d.mol_wt,
            d.logp,
            d.tpsa

        FROM molecule m

        LEFT JOIN mol_descriptors d
            ON m.mol_id = d.mol_id

        WHERE
        (
            :search = ''
            OR m.mol_name ILIKE :pattern
            OR CAST(m.mol_id AS TEXT) ILIKE :pattern
            OR COALESCE(m.drugbank_id, '') ILIKE :pattern
        )

        ORDER BY
            m.mol_name

        LIMIT :limit
        OFFSET :offset
        """),
        {
            "search": search,
            "pattern": pattern,
            "limit": limit,
            "offset": offset
        }
    )

    rows = result.mappings().all()

    db.close()

    return rows
print("get_drugs")
@app.get("/drug/{mol_id}/bioactivity")
def get_drug_bioactivity(mol_id: str):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            b.bioactivity_id,

            b.action_type,

            b.std_type AS standard_type,

            b.std_relation AS standard_relation,

            b.std_value AS standard_value,

            b.std_units AS standard_units,

            b.pchembl_value,

            b.max_phase,

            g.gpcr_id,
            g.t_name AS gpcr_name

        FROM bioactivity b

        LEFT JOIN assay a
            ON b.assay_id = a.assay_id

        LEFT JOIN gpcr_xrefs x
            ON a.chembl_target_id = x.chembl_target_id

        LEFT JOIN gpcr g
            ON x.gpcr_id = g.gpcr_id

        WHERE b.mol_id = :mol_id

        ORDER BY b.pchembl_value DESC NULLS LAST

        LIMIT 100
        """),
        {"mol_id": mol_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows

@app.get("/gpcr/{gpcr_id}/bioactivity")
def get_gpcr_bioactivity(gpcr_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            b.bioactivity_id,
            b.action_type,
            b.std_type,
            b.std_value,
            b.std_units,
            b.pchembl_value,

            m.mol_id,
            m.mol_name

        FROM bioactivity b

        JOIN assay a
            ON b.assay_id = a.assay_id

        JOIN gpcr_xrefs x
            ON a.chembl_target_id = x.chembl_target_id

        JOIN molecule m
            ON b.mol_id = m.mol_id

        WHERE x.gpcr_id = :gpcr_id

        ORDER BY b.pchembl_value DESC NULLS LAST

        LIMIT 100
        """),
        {"gpcr_id": gpcr_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows
@app.get("/gpcr/{gpcr_id}/expression")
def get_expression(gpcr_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            o.organ_name,
            t.tissue_name,
            e.median_tpm

        FROM expression_gtex e

        JOIN tissue t
            ON e.tissue_id = t.tissue_id

        JOIN organ o
            ON t.organ_id = o.organ_id

        WHERE e.gpcr_id = :gpcr_id
          AND e.median_tpm > 0

        ORDER BY
            e.median_tpm DESC
        """),
        {"gpcr_id": gpcr_id}
    )

    rows = result.mappings().all()

    db.close()

    return rows
@app.get("/assay/{assay_id}")
def get_assay(assay_id: int):

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            assay_id,
            assay_type,
            organism,
            assay_tissue,
            description,
            chembl_target_id,
            target_name,
            target_org,
            target_type
        FROM assay
        WHERE assay_id = :assay_id
        """),
        {"assay_id": assay_id}
    )

    row = result.mappings().first()

    db.close()

    return row
@app.get("/stats")
def get_stats():

    db = SessionLocal()

    result = db.execute(
        text("""
        SELECT
            (SELECT COUNT(*) FROM gpcr) AS n_gpcrs,
            (SELECT COUNT(*) FROM molecule) AS n_drugs,
            (SELECT COUNT(*) FROM drug_gpcr_v2) AS n_interactions,
            (SELECT COUNT(*) FROM side_effect) AS n_side_effects,
            (SELECT COUNT(*) FROM expression_summary)
            AS gpcr_with_expression,

            (SELECT COUNT(DISTINCT gpcr_id)
            FROM drug_gpcr_v2)
            AS gpcr_with_drugs,
             
            (
            SELECT json_agg(t)
            FROM (
                SELECT
                    receptor_class,
                    COUNT(*) AS count
                FROM gpcr
                GROUP BY receptor_class
                ORDER BY COUNT(*) DESC
            ) t
        ) AS class_distribution
    """)
)
    
    row = result.mappings().first()

    db.close()

    return row
print("\n===== REGISTERED ROUTES =====")

for route in app.routes:
    print(route.path)

