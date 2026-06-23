import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function DrugDetail() {

    const { mol_id } = useParams();

    const [drug, setDrug] = useState(null);
    const [sideEffects, setSideEffects] = useState([]);
    const [targets, setTargets] = useState([]);
    const [bioactivity, setBioactivity] = useState([]);
    const [showSideEffects, setShowSideEffects] = useState(false);
    const [showBioactivity, setShowBioactivity] = useState(false);

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

    if (!drug) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "40px" }}>

            <Navbar />

            <h1>{drug.mol_name || drug.mol_id}</h1>
            <h2>Drug Information</h2>

            <p><b>ChEMBL ID:</b> {drug.mol_id}</p>

            <p><b>DrugBank ID:</b> {drug.drugbank_id}</p>

            <p><b>Approval:</b> {drug.approval_status}</p>

            <p><b>Molecular Weight:</b> {drug.mol_wt}</p>

            <p><b>LogP:</b> {drug.logp}</p>

            <p><b>TPSA:</b> {drug.tpsa}</p>

            <h2>Explore This Drug</h2>

            <Link
                to={`/drug/${mol_id}/targets`}
                style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                }}
            >
                <div
                    style={{
                        border: "1px solid #2E3A35",
                        borderRadius: "12px",
                        padding: "15px",
                        marginBottom: "30px",
                        fontWeight: "bold"
                    }}
                >
                    🧬 View Target GPCRs ({targets.length})
                </div>
            </Link>

            <h2>Bioactivity Records</h2>

            <div
                onClick={() => setShowBioactivity(!showBioactivity)}
                style={{
                    border: "1px solid #2E3A35",
                    borderRadius: "12px",
                    padding: "15px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontWeight: "bold"
                }}
            >
                📊 {showBioactivity ? "Hide" : "View"} Bioactivity Records ({bioactivity.length})
            </div>

            {showBioactivity && (

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse"
                }}
            >
                <thead>
                    <tr>
                        <th style={{ padding: "12px", textAlign: "left" }}>GPCR</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Action</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Type</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Value</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>Units</th>
                        <th style={{ padding: "12px", textAlign: "left" }}>pChEMBL</th>
                    </tr>
                </thead>

                <tbody>

                    {bioactivity.map((row) => (

                        <tr key={row.bioactivity_id}>

                            <td style={{ padding: "10px 12px" }}>
                                {row.t_name}
                            </td>

                            <td style={{ padding: "10px 12px" }}>
                                {row.action_type}
                            </td>

                            <td style={{ padding: "10px 12px" }}>
                                {row.std_type}
                            </td>

                            <td style={{ padding: "10px 12px" }}>
                                {row.std_value}
                            </td>

                            <td style={{ padding: "10px 12px" }}>
                                {row.std_units}
                            </td>

                            <td style={{ padding: "10px 12px" }}>
                                {row.pchembl_value}
                            </td>

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
                    fontWeight: "bold"
                }}
            >
                🩺 View Side Effects ({sideEffects.length})
            </div>

            {showSideEffects && (

                <div>

                    {sideEffects.map((effect, idx) => (
                        <div
                            key={idx}
                            style={{
                                border: "1px solid #ddd",
                                padding: "12px",
                                marginBottom: "10px",
                                borderRadius: "8px"
                            }}
                        >
                            <h4 style={{ marginBottom: "8px" }}>
                                {effect.term}
                            </h4>

                            <p style={{ color: "#666" }}>
                                {effect.coarse_label} → {effect.mid_label}
                            </p>

                            <p>
                                Confidence: {effect.confidence}
                            </p>
                            <p>
                                 <b>Weight:</b> {effect.final_weight}
                            </p>

                            <p>
                                <b>Sources:</b> {effect.n_sources}
                            </p>
                        </div>
                    ))}

            </div>

        )}
        </div>
    );
}