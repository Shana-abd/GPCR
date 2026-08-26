import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function GpcrDrugs() {

    const { gpcr_id } = useParams();

    const [drugs, setDrugs] = useState([]);

    useEffect(() => {

        fetch(`http://localhost:8000/gpcr/${gpcr_id}/drugs`)
            .then(res => res.json())
            .then(data => setDrugs(data));

    }, [gpcr_id]);

    return (

        <div style={{ padding: "40px" }}>

            <Link
                to={`/gpcr/${gpcr_id}`}
                className="back-link"
            >
                ← Back to Receptor
            </Link>

            <h1 className="page-title">

                Targeting Drugs

            </h1>

            <p className="page-subtitle">

                Drugs reported to interact with this GPCR.

            </p>

            <div className="drug-list">

                {drugs.map((drug) => (

                    <div
                        key={drug.mol_id}
                        className="drug-card"
                    >

                        <div className="drug-header">

                            <div>

                                <Link
                                    to={`/drug/${drug.mol_id}`}
                                    className="drug-link"
                                >

                                    <h2 className="drug-title">

                                        {drug.mol_name || drug.mol_id}

                                    </h2>

                                </Link>

                            </div>

                            {drug.action_types && (

                                <span className="drug-badge">

                                    {drug.action_types}

                                </span>

                            )}

                        </div>

                        <div className="drug-info">

                            {drug.median_pchembl && (

                                <div className="drug-row">

                                    <span>

                                        Median pChEMBL

                                    </span>

                                    <span>

                                        {Number(drug.median_pchembl).toFixed(2)}

                                    </span>

                                </div>

                            )}

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
}