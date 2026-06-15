from fastapi import FastAPI
from sqlalchemy import text
from database import SessionLocal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="GPCR Database API",
    version="1.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "GPCR Database API running"}


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
def search_gpcr(q: str):

    db = SessionLocal()

    result = db.execute(
        text("""
            SELECT
                g.gpcr_id,
                g.entry_name,
                g.t_name
            FROM gpcr g
            LEFT JOIN gpcr_xrefs x
                ON g.gpcr_id = x.gpcr_id

            WHERE
                g.entry_name ILIKE :query
                OR g.t_name ILIKE :query
                OR g.alt_names ILIKE :query
                OR x.chembl_target_id ILIKE :query
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

            x.uniprot_id,
            x.ensembl_gene_id,

            s.seq_length,
            s.mol_wt,
            s.isoelectric_point,

            st.tm_count,
            st.has_dry,
            st.has_npxxy,
            st.tm_count,

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
            se.side_effect_id,
            se.term,

            dse.final_weight,
            dse.confidence,
            dse.n_sources

        FROM drug_side_effect dse

        JOIN side_effect se
            ON dse.side_effect_id = se.side_effect_id

        WHERE dse.mol_id = :mol_id

        ORDER BY dse.final_weight DESC

        LIMIT 50
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

