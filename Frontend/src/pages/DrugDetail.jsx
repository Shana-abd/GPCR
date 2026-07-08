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

    useEffect(() => {

        fetch(`https://gpcr.onrender.com/drug/${mol_id}`)
            .then(res => res.json())
            .then(data => setDrug(data));

        fetch(`https://gpcr.onrender.com/drug/${mol_id}/sideeffects`)
            .then(res => res.json())
            .then(data => setSideEffects(data));

        fetch(`https://gpcr.onrender.com/drug/${mol_id}/targets`)
            .then(res => res.json())
            .then(data => setTargets(data));

        fetch(`https://gpcr.onrender.com/drug/${mol_id}/bioactivity`)
            .then((res) => res.json())
            .then((data) => setBioactivity(data));

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

    const hasSummary =
        drug.n_bioactivity_records ||
        drug.n_assays ||
        drug.max_pchembl ||
        drug.mean_pchembl ||
        drug.median_pchembl;

    const showAction = bioactivity.some(
        r => r.action_type
    );

    const showPhase = bioactivity.some(
        r => r.max_phase != null
    );

    const showPchembl = bioactivity.some(
        r => r.pchembl_value != null
    );
    console.log(sideEffects);

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
                    <div className="property-list">

                        {renderRow(
                            "Molecular Weight",
                            drug.mol_wt ? `${Number(drug.mol_wt).toFixed(2)} Da` : null
                        )}

                        {renderRow(
                            "LogP",
                            drug.logp ? Number(drug.logp).toFixed(2) : null
                        )}
                        {renderRow(
                            "TPSA",
                            drug.tpsa != null
                            ? `${Number(drug.tpsa).toFixed(1)} Å²`
                            : null
                        )}

                        {renderRow("HBA", drug.hba)}

                        {renderRow("HBD", drug.hbd)}

                        {renderRow("Rotatable Bonds", drug.rotatable_bonds)}

                        {renderRow("Heavy Atom Count", drug.heavy_atom_count)}

                        {renderRow(
                            "Fraction Csp3",
                            drug.frac_csp3 != null
                            ? Number(drug.frac_csp3).toFixed(3)
                            : null
                        )}

                        {renderRow("Aromatic Rings", drug.aromatic_rings)}

                        {renderRow(
                            "QED",
                            drug.qed ? Number(drug.qed).toFixed(3) : null
                        )}

                        {renderRow("Lipinski Violations", drug.lipinskiviolations)}

                        {renderRow(
                            "Drug-like",
                            drug.isdruglike == null
                            ? null
                            : (drug.isdruglike ? "Yes" : "No")
                        )}

                    </div>
                </>
            )}        
            
            {hasSummary && (
                 <>
                    <h2 className="subsection-title">

                        Database Summary

                    </h2>

                    <div className="property-list">

                        {renderRow("Bioactivity Records", drug.n_bioactivity_records)}

                        {renderRow("Assays", drug.n_assays)}

                        {renderRow("Maximum pChEMBL", drug.max_pchembl)}

                        {renderRow("Mean pChEMBL", drug.mean_pchembl)}

                        {renderRow("Median pChEMBL", drug.median_pchembl)} 
                    </div>
                </>
            )}

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
                📊 {showBioactivity ? "Hide" : "View"} Bioactivity Records ({bioactivity.length})
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

                    {bioactivity.map((record) => (

                        <tr 
                            key={record.bioactivity_id}
                            className="bioactivity-row"
                        >

                            <td className="bioactivity-cell">

                                <Link
                                    to={`/gpcr/${record.gpcr_id}`}
                                    className="bioactivity-gpcr"
                                >

                                    {record.t_name}

                                </Link>

                            </td>

                            <td className="bioactivity-cell">

                                <div className="activity-cell">

                                    {record.std_type}
                                    {" • "}

                                    {record.std_relation || ""}

                                    {" "}

                                    {record.std_value}

                                    {" nM"}

                            

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