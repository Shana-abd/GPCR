import { useEffect, useMemo, useState } from "react";
import { useParams,Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrExpression() {

    const { gpcr_id } = useParams();

    const [expression, setExpression] = useState([]);

    useEffect(() => {
        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/expression`)
            .then(res => res.json())
            .then(data => setExpression(data));
    }, [gpcr_id]);
    const maxTPM = Math.max(
        ...expression.map(e => Number(e.median_tpm)),
        1
    );

    const groupedExpression = useMemo(() => {

        const groups = {};

        expression.forEach(row => {

            if (!groups[row.organ_name]) {

                groups[row.organ_name] = [];

            }

            groups[row.organ_name].push(row);

        });

        return groups;

    }, [expression]);

    const summary = {

        highest: expression[0],

        tissueCount: expression.length,

        organCount: Object.keys(groupedExpression).length

    };

    return (
        <div style={{ padding: "40px" }}>
            <Link
                to={`/gpcr/${gpcr_id}`}
                className="back-link"
            >
                ← Back to Receptor
            </Link>

            <h1 className="page-title">

                Expression & Tissue Landscape

            </h1>

            <p className="page-subtitle">

                Explore tissue-specific expression of this GPCR across human organs and tissues.

            </p>

            <div className="expression-summary">

                <div className="summary-card">

                    <h4>Highest Tissue</h4>

                    <h2>{summary.highest?.tissue_name}</h2>

                </div>

                <div className="summary-card">

                    <h4>Maximum TPM</h4>

                    <h2>{summary.highest?.median_tpm?.toFixed(2)}</h2>

                </div>

                <div className="summary-card">

                    <h4>Tissues</h4>

                    <h2>{summary.tissueCount}</h2>

                </div>

                <div className="summary-card">

                    <h4>Organs</h4>

                    <h2>{summary.organCount}</h2>

                </div>

            </div>

            <div className="organ-list">

                {Object.entries(groupedExpression).map(([organ, tissues]) => (

                    <div
                        key={organ}
                        className="organ-card"
                    >

                        <div className="organ-header">

                            <h2>

                                {organ}

                            </h2>

                            <span>

                                {tissues.length} tissues

                            </span>

                        </div>

                        {tissues.map((tissue) => (

                            <div
                                key={tissue.tissue_name}
                                className="tissue-row"
                            >

                                <div className="tissue-name">

                                    {tissue.tissue_name}

                                </div>

                                <div className="expression-bar">

                                    <div
                                        className="expression-fill"
                                        style={{
                                            width: `${Number(tissue.median_tpm) / maxTPM * 100}%`
                                        }}
                                    />

                                </div>

                                <div className="tpm-value">

                                    {Number(tissue.median_tpm).toFixed(2)}

                                </div>

                            </div>

                        ))}

                    </div>

                ))}

            </div>            
        </div>
    );
}