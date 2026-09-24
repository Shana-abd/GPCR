import { useEffect, useState, useMemo  } from "react";
import { Link, useParams } from "react-router-dom";


export default function DrugDetail() {

    const { mol_id } = useParams();

    const [drug, setDrug] = useState(null);
    const [sideEffects, setSideEffects] = useState([]);
    const [targets, setTargets] = useState([]);
    const [bioactivity, setBioactivity] = useState([]);
    const [showSideEffects, setShowSideEffects] = useState(false);
    const [showBioactivity, setShowBioactivity] = useState(false);
    const [showTargets, setShowTargets] = useState(false);
    const [summary, setSummary] = useState(null);
    const copySmiles = async () => {
        if (!drug?.smiles) return;

        try {
            await navigator.clipboard.writeText(drug.smiles);
        } catch (err) {
            console.error("Failed to copy SMILES:", err);
        }
    };
    const [showFullName, setShowFullName] = useState(false);

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/drug/${mol_id}`)
            .then(res => res.json())
            .then(data => setDrug(data));

        fetch(`http://127.0.0.1:8000/drug/${mol_id}/summary`)
            .then(res => res.json())
            .then(data => setSummary(data));

        fetch(`http://127.0.0.1:8000/drug/${mol_id}/sideeffects`)
            .then(res => res.json())
            .then(data => setSideEffects(data));

        fetch(`http://127.0.0.1:8000/drug/${mol_id}/targets`)
            .then(res => res.json())
            .then(data => setTargets(data));

        fetch(`http://127.0.0.1:8000/drug/${mol_id}/bioactivity`)
            .then(res => res.json())
            .then(data => setBioactivity(data));

    }, [mol_id]);

    const groupedSideEffects = useMemo(() => {

        const grouped = {};

        sideEffects.forEach(effect => {

            if (!grouped[effect.coarse_label]) {

                grouped[effect.coarse_label] = {};

            }

            if (!grouped[effect.coarse_label][effect.mid_label]) {

                grouped[effect.coarse_label][effect.mid_label] = [];

            }

            grouped[effect.coarse_label][effect.mid_label].push(effect);

        });

        return grouped;

    }, [sideEffects]);

    if (!drug) {
        return <div>Loading...</div>;
    }
    const renderRow = (label, value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) return null;

        return (
            <>
                <div>{label}</div>
                <div>{value}</div>
            </>
        );

    };
    const hasOverview =
        drug.type ||
        drug.action_types ||
        drug.approval_status ||
        drug.drugbank_id ||
        drug.pubchem_cid;

    const hasProperties =
        drug.mol_wt != null ||
        drug.logp != null ||
        drug.tpsa != null ||
        drug.hba != null ||
        drug.hbd != null ||
        drug.rotatable_bonds != null ||
        drug.heavy_atom_count != null ||
        drug.frac_csp3 != null ||
        drug.aromatic_rings != null ||
        drug.qed != null ||
        drug.lipinskiviolations != null ||
        drug.isdruglike != null;

    const hasSummary = summary != null;

    const showAction = bioactivity.some(
        r => r.action_type
    );
    const showActivity = bioactivity.some(
        r => r.standard_type != null && String(r.standard_type).trim() !== ""
    );

    const showPhase = bioactivity.some(
        r => r.max_phase != null
    );
    const showLigLE = bioactivity.some(
        r => r.lig_le != null
    );

    const showLLE = bioactivity.some(
        r => r.lig_lle != null
    );

    const showSEI = bioactivity.some(
        r => r.lig_sei != null
    );

    const showBEI = bioactivity.some(
        r => r.lig_bei != null
    );

    const showPchembl = bioactivity.some(
        r => r.pchembl_value != null
    );
    console.log(sideEffects);
    const cleanRelation = (relation) => {
        if (!relation) return "";
        return String(relation).replace(/^['"]|['"]$/g, "");
    };
    const drugName = drug.mol_name || drug.mol_id;
    const maxNameLength = 60;

    const displayName =
        showFullName || drugName.length <= maxNameLength
            ? drugName
            : drugName.slice(0, maxNameLength) + "...";
    const filteredBioactivity = bioactivity.filter(
        (record) =>
            (record.std_value != null && record.std_value !== "") ||
            (record.pchembl_value != null && record.pchembl_value !== "")
    );

    return (
        <div style={{ padding: "40px" }}>

            <Link

                to="/drugs"

                className="back-link"

            >

                ← Back to Drug Browser

            </Link>

            <h1>

                {drug.mol_name
                    ? drug.mol_name
                    : drug.mol_id}

            </h1>

            {drug.mol_name && (

                <p className="page-subtitle">

                    {drug.mol_id}

                </p>

            )}
            {hasOverview && (
                 <>

                    <h2 className="subsection-title">

                        Drug Overview

                    </h2>

                    <div className="property-list">

                        {renderRow("Type", drug.type)}

                        {renderRow("Mechanism", drug.action_types)}

                        {renderRow("Approval Status", drug.approval_status)}

                        {renderRow("DrugBank ID", drug.drugbank_id)}

                        {renderRow("PubChem CID", drug.pubchem_cid)}
                

                    </div>
                </>

            )}    
            {hasProperties && (
                <>
                    <h2 className="subsection-title">
                        Physicochemical Properties
                    </h2>

                    <div className="properties-structure-layout">

                        <div className="property-list">
                            {renderRow(
                                "Molecular Weight",
                                drug.mol_wt
                                    ? `${Number(drug.mol_wt).toFixed(2)} Da`
                                    : null
                            )}

                            {renderRow(
                                "LogP",
                                drug.logp
                                    ? Number(drug.logp).toFixed(2)
                                    : null
                            )}

                            {renderRow(
                                "TPSA",
                                drug.tpsa != null
                                    ? `${Number(drug.tpsa).toFixed(1)} Å²`
                                    : null
                            )}

                            {renderRow("HBA", drug.hba)}

                            {renderRow("HBD", drug.hbd)}

                            {renderRow(
                                "Rotatable Bonds",
                                drug.rotatable_bonds
                            )}

                            {renderRow(
                                "Heavy Atom Count",
                                drug.heavy_atom_count
                            )}

                            {renderRow(
                                "Fraction Csp3",
                                drug.frac_csp3 != null
                                    ? Number(drug.frac_csp3).toFixed(3)
                                    : null
                            )}

                            {renderRow(
                                "Aromatic Rings",
                                drug.aromatic_rings
                            )}

                            {renderRow(
                                "QED",
                                drug.qed
                                    ? Number(drug.qed).toFixed(3)
                                    : null
                            )}

                            {renderRow(
                                "Lipinski Violations",
                                drug.lipinskiviolations
                            )}

                            {renderRow(
                                "Drug-like",
                                drug.isdruglike == null
                                    ? null
                                    : (drug.isdruglike ? "Yes" : "No")
                            )}
                        </div>

                        <div className="drug-structure-area">

                            {drug.smiles && (
                                <>
                                    <div className="structure-title">
                                    </div>

                                    <img
                                        src={`http://127.0.0.1:8000/drug/${mol_id}/structure`}
                                        alt="2D molecular structure"
                                        className="drug-structure-image"
                                    />
                                    <div className="smiles-section">

                                        <div className="smiles-title">
                                            SMILES
                                        </div>

                                        <div className="smiles-box">

                                            <span className="smiles-text">
                                                {drug.smiles}
                                            </span>

                                            <button
                                                type="button"
                                                className="copy-smiles-button"
                                                onClick={copySmiles}
                                                title="Copy SMILES"
                                            >
                                                Copy
                                            </button>

                                        </div>

                                    </div>
                                </>
                            )}

                        </div>

                    </div>
                </>
            )}
            <div className="summary-structure-layout">

                <div className="summary-column">
                   {summary && (
                        <>
                            <h2 className="subsection-title">
                                Database Summary
                            </h2>

                            <div className="property-list">
                                {renderRow(
                                    "Bioactivity Records",
                                    summary.n_bioactivity_records
                                )}

                                {renderRow(
                                    "Assays",
                                    summary.n_assays
                                )}

                                {renderRow(
                                    "Maximum pChEMBL",
                                    Number(summary.max_pchembl).toFixed(2)
                                )}

                                {renderRow(
                                    "Mean pChEMBL",
                                    Number(summary.mean_pchembl).toFixed(2)
                                )}

                                {renderRow(
                                    "Median pChEMBL",
                                    Number(summary.median_pchembl).toFixed(2)
                                )}
                            </div>
                        </>
                    )}
                </div>

            </div>
        
            <h2 className="subsection-title">

                Explore This Drug

            </h2>

            <div
                onClick={() => setShowTargets(!showTargets)}
                style={{
                    border: "1px solid #2E3A35",
                    borderRadius: "12px",
                    padding: "15px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold"
                }}
            >           
                🧬 {showTargets ? "Hide" : "View"} Target GPCRs ({targets.length})
            </div>
            {showTargets && (

                <div className="target-grid">

                    {targets.map((target) => (

                        <Link
                            key={target.gpcr_id}
                            to={`/gpcr/${target.gpcr_id}`}
                            className="target-card"
                        >

                            <h3>

                                {target.t_name}

                            </h3>

                            {target.entry_name && (

                                <p className="target-entry">

                                    {target.entry_name}

                                </p>

                            )}

                            {target.median_pchembl != null && (

                                <div className="target-pchembl">

                                    Median pChEMBL

                                    <span>

                                        {Number(target.median_pchembl).toFixed(2)}

                                    </span>

                                </div>

                            )}

                            <div className="target-arrow">

                                →

                            </div>

                        </Link>

                    ))}

                </div>

            )}
            

            <div
                onClick={() => setShowBioactivity(!showBioactivity)}
                style={{
                    border: "1px solid #2E3A35",
                    borderRadius: "12px",
                    padding: "15px",
                    cursor: "pointer",
                    marginBottom: "50px",
                    fontWeight: "bold"
                }}
            >
                📊 {showBioactivity ? "Hide" : "View"} Bioactivity Records ({filteredBioactivity.length})
            </div>

            {showBioactivity && (

            <table
                className="bioactivity-table"
            >
                <thead className="bioactivity-head">
                    <tr className="bioactivity-head-row">

                        <th className="bioactivity-heading">

                            GPCR

                        </th>

                        <th className="bioactivity-heading">

                            Activity

                        </th>

                        {showAction && (

                            <th className="bioactivity-heading">

                                Action

                            </th>

                        )}

                        {showPhase && (

                            <th className="bioactivity-heading">

                                Phase

                            </th>

                        )}

                        {showPchembl && (

                            <th className="bioactivity-heading">

                                pChEMBL

                            </th>

                        )}

                    </tr>

                </thead>


                <tbody className="bioactivity-body">

                    {bioactivity
                        .filter(
                            (record) =>
                                (record.std_value != null && record.std_value !== "") ||
                                (record.pchembl_value != null && record.pchembl_value !== "")
                        )
                    .map((record) => (

                        <tr 
                            key={record.bioactivity_id}
                            className="bioactivity-row"
                        >

                            <td className="bioactivity-cell">

                                <Link
                                    to={`/gpcr/${record.gpcr_id}`}
                                    className="bioactivity-gpcr"
                                >

                                    {record.gpcr_name}

                                </Link>

                            </td>

                            <td className="bioactivity-cell">

                                <div className="activity-cell">
                                    {record.standard_value != null && record.standard_value !== "" ? (
                                        <>
                                            {record.standard_type}
                                            {" "}
                                            {record.standard_relation?.replace(/['"]/g, "") || ""}
                                            {" "}
                                            {record.standard_value}
                                            {" nM"}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </div>

                            </td>

                            {showAction && (

                                <td className="bioactivity-cell">

                                    {record.action_type || ""}

                                </td>

                            )}

                           {showPhase && (

                                <td className="bioactivity-cell">

                                    {record.max_phase === 1 && "I"}
                                    {record.max_phase === 2 && "II"}
                                    {record.max_phase === 3 && "III"}
                                    {record.max_phase === 4 && "IV"}

                                </td>

                            )}

                            {showPchembl && (

                                <td className="pchembl-value">

                                    {record.pchembl_value != null &&
                                        Number(record.pchembl_value).toFixed(2)}

                                </td>
                            )}

                        </tr>

                    ))}

                </tbody>

            </table>

            )}

            <h2>Side Effects</h2>

            <div
                onClick={() => setShowSideEffects(!showSideEffects)}
                style={{
                    border: "1px solid #2E3A35",
                    borderRadius: "12px",
                    padding: "15px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    marginTop: "20px"
                }}
            >
                🩺 View Side Effects ({sideEffects.length})
            </div>

            {showSideEffects && (

                <div>

                    {Object.entries(groupedSideEffects).map(([coarse, mids]) => (

                        <div
                            key={coarse}
                            className="coarse-group"
                        >

                            <h3 className="coarse-title">

                                {coarse.replaceAll("_", " ")}

                            </h3>

                            {Object.entries(mids).map(([mid, effects]) => (

                                <div
                                    key={`${coarse}-${mid}`}
                                    className="mid-group"
                                >

                                    <h4 className="mid-title">

                                        {mid.replaceAll("_", " ")}

                                    </h4>

                                    <div className="effect-grid">

                                        {effects.map((effect, index) => (

                                            <div
                                                key={`${effect.side_effect_id}-${index}`}
                                                className="effect-card"
                                            >

                                                <div className="effect-name">

                                                    {effect.term.replaceAll("_", " ")}

                                                </div>

                                                <div
                                                    className={`confidence-pill ${effect.confidence
                                                        .toLowerCase()
                                                        .replace(" ", "-")}`}
                                                >

                                                    {effect.confidence}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            ))}

                        </div>

                    ))}

                </div>

            )}
        </div>
    )}