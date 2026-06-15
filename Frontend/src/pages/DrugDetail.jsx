import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function DrugDetail() {

    const { mol_id } = useParams();

    const [drug, setDrug] = useState(null);
    const [sideEffects, setSideEffects] = useState([]);
    const [targets, setTargets] = useState([]);

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

            <h2>Targets</h2>

            {targets.length === 0 ? (
                <p>No target data available.</p>
            ) : (
                targets.map((target) => (
                    <div
                        key={target.gpcr_id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            marginBottom: "8px"
                        }}
                    >
                        <Link to={`/gpcr/${target.gpcr_id}`}>
                            <b>{target.t_name}</b>
                        </Link>

                        <br />

                        {target.entry_name}

                        <br />

                        Median pChEMBL: {target.median_pchembl}
                    </div>
                ))
            )}




            <h2>Side Effects</h2>
            <p>
                Side effect evidence integrated from
                SIDER, OFFSIDES, OpenFDA,
                DrugBank and PubChem.
            </p>

            {sideEffects.length === 0 ? (
                <p>No side effect data available.</p>
            ) : (
                sideEffects.map((effect) => (
                    <div
                        key={effect.side_effect_id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            marginBottom: "8px"
                        }}
                    >
                        <b>{effect.term}</b>

                        <br />

                        Weight: {effect.final_weight}

                        <br />

                        Confidence: {effect.confidence}

                        <br />

                        Sources: {effect.n_sources}
                    </div>
                ))
            )}

        </div>
    );
}