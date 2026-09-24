import { useEffect, useState  } from "react";
import { useParams, Link } from "react-router-dom";

import PredictionResult from "../components/PredictionResult";
import QuantitativeTable from "../components/QuantitativeTable";
import KnownLigandsTable from "../components/KnownLigandsTable";
import SimilarMoleculesTable from "../components/SimilarMoleculesTable";
import { useRef } from "react";

export default function PchemblPrediction() {

    const [gpcrs, setGpcrs] = useState([]);
    const [potentialTargets, setPotentialTargets] = useState([]);
    const [showPotentialTargets, setShowPotentialTargets] = useState(false);
    const [loadingTargets, setLoadingTargets] = useState(false);
    const [filter, setFilter] = useState("");
    const [selectedGpcr, setSelectedGpcr] = useState(null);
    const [smiles, setSmiles] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const findPotentialTargets = async () => {
        if (!smiles.trim()) {
            alert("Please enter a SMILES first.");
            return;
        }

        setLoadingTargets(true);
        setShowPotentialTargets(false);

        try {
            const res = await fetch(
                "http://127.0.0.1:8000/potential-targets",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        smiles: smiles,
                        top_n: 20
                    })
                }
            );

            if (!res.ok) {
                throw new Error("Target screening failed");
            }

            const data = await res.json();

            setPotentialTargets(data.potential_targets || []);
            setShowPotentialTargets(true);

        } catch (error) {
            console.error(error);
            alert("Unable to predict potential GPCR targets.");
        } finally {
            setLoadingTargets(false);
        }
    };
    const resultRef = useRef(null);

    useEffect(() => {

        fetch("http://127.0.0.1:8000/gpcrs")
            .then((res) => res.json())
            .then((data) => setGpcrs(data));

    }, []);

    async function handlePredict() {

        if (!selectedGpcr) {
            setError("Please select a GPCR.");
            return;
        }

        if (!smiles.trim()) {
            setError("Please enter a SMILES string.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/predict",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({

                        gpcr_id: selectedGpcr.gpcr_id,
                        smiles: smiles

                    })
                }
            );

            if (!response.ok) {

                throw new Error("Prediction failed.");

            }

            const data = await response.json();
            console.log(data);

            setResult(data);
            setTimeout(() => {
                resultRef.current?.scrollIntoView({
                    behavior: "smooth"
                });
            }, 100);

        }

        catch (err) {

            setError(err.message);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div style={{ padding: "40px" }}>

            <div className="topbar">

                <Link
                    to="/"
                    className="top-left"
                >

                    <span className="brand-logo">
                        🧬
                    </span>

                    <span className="brand-name">
                        Home
                    </span>

                </Link>

                <div className="top-right">

                    <Link to="/about">
                        About
                    </Link>

                    <Link to="/docs">
                        Documentation
                    </Link>

                </div>

            </div>

            <div
                style={{
                    maxWidth: "900px",
                    margin: "0 auto"
                }}
            >

                <h1>GPCR pChEMBL Prediction</h1>

                <p
                    style={{
                        color: "#6b7280",
                        marginBottom: "30px"
                    }}
                >
                    Predict the pChEMBL activity score of a ligand against a
                    selected GPCR and retrieve similar known ligands.
                </p>

                <h3>Select GPCR</h3>

                <input
                    value={filter}
                    onChange={(e) => {

                        setFilter(e.target.value);
                        setSelectedGpcr(null);

                    }}
                    placeholder="Search receptor..."
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        resize: "vertical"
                    }}
                />

                {!selectedGpcr && filter.length > 1 && (

                    <div
                        style={{
                            border: "1px solid #dddddd44",
                            borderRadius: "8px",
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto",
                            color: "#9beecf"
                        }}
                    >

                        {gpcrs
                            .filter(g =>
                                g.t_name.toLowerCase().includes(filter.toLowerCase()) ||
                                g.entry_name.toLowerCase().includes(filter.toLowerCase())
                            )
                            .slice(0, 10)
                            .map(g => (

                                <div
                                    key={g.gpcr_id}
                                    onClick={() => {

                                        setSelectedGpcr(g);
                                        setFilter(g.t_name);

                                    }}
                                    style={{
                                        padding: "12px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee"
                                    }}
                                >

                                    <b>{g.t_name}</b>

                                    <br />

                                    <small>{g.entry_name}</small>

                                </div>

                            ))}

                    </div>

                )}

                {selectedGpcr && (

                    <div
                        style={{
                            marginTop: "20px",
                            padding: "16px",
                            border: "1px solid #dddddd59",
                            borderRadius: "8px"
                        }}
                    >

                        <b>Selected GPCR</b>

                        <p>{selectedGpcr.t_name}</p>

                        <small>{selectedGpcr.entry_name}</small>

                    </div>

                )}

                <div style={{ marginTop: "35px" }}>

                    <h3>SMILES</h3>

                    <textarea
                        value={smiles}
                        onChange={(e) => setSmiles(e.target.value)}
                        placeholder="Paste SMILES here..."
                        rows={5}
                        style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: "15px",
                            borderRadius: "8px",
                            border: "1px solid #ccc",
                            resize: "vertical"
                        }}
                    />

                </div>

                <button
                    onClick={handlePredict}
                    disabled={loading}
                    style={{
                        marginTop: "30px",
                        padding: "12px 30px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    
                
                    {loading ? "Predicting..." : "Predict"}
                </button>
                <button
                    onClick={findPotentialTargets}
                    disabled={loadingTargets || !smiles.trim()}
                    style={{
                        marginTop: "12px",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        border: "1px solid #3A4F49",
                        background: "#24332F",
                        color: "#E1ECE8",
                        cursor: loadingTargets ? "wait" : "pointer",
                        fontWeight: "600"
                    }}
                >
                    {loadingTargets
                        ? "Screening GPCRs..."
                        : "Find Potential GPCR Targets"}
                </button>
                {error && (

                    <p
                        style={{
                            color: "red",
                            marginTop: "20px"
                        }}
                    >
                        {error}
                    </p>

                )}
                <PredictionResult prediction={result?.prediction} />
                <QuantitativeTable
                    ligands={result?.similar_molecules?.quantitative}
                />
                <KnownLigandsTable
                    ligands={result?.similar_molecules?.known}
                />

                <SimilarMoleculesTable
                    ligands={result?.similar_molecules?.unannotated}
                />
                {showPotentialTargets && (
                    <div style={{ marginTop: "40px" }}>

                        <h2 className="subsection-title">
                            Potential GPCR Targets
                        </h2>

                        {potentialTargets.length === 0 ? (

                            <div
                                style={{
                                    padding: "20px",
                                    color: "#9FB3AD"
                                }}
                            >
                                No potential GPCR targets could be predicted.
                            </div>

                        ) : (

                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    background: "#17221F"
                                }}
                            >

                                <thead>

                                    <tr
                                        style={{
                                            background: "#20312C"
                                        }}
                                    >

                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                color: "#E8F2EF",
                                                borderBottom: "2px solid #30443E"
                                            }}
                                        >
                                            Rank
                                        </th>

                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                color: "#E8F2EF",
                                                borderBottom: "2px solid #30443E"
                                            }}
                                        >
                                            GPCR
                                        </th>

                                        <th
                                            style={{
                                                padding: "12px",
                                                textAlign: "left",
                                                color: "#E8F2EF",
                                                borderBottom: "2px solid #30443E"
                                            }}
                                        >
                                            Predicted pChEMBL
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {potentialTargets.map((target, index) => (

                                        <tr key={target.gpcr_id}>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "#9FB3AD",
                                                    borderBottom: "1px solid #30443E"
                                                }}
                                            >
                                                {index + 1}
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    borderBottom: "1px solid #30443E"
                                                }}
                                            >
                                                <Link
                                                    to={`/gpcr/${target.gpcr_id}`}
                                                    style={{
                                                        color: "#7FB8A8",
                                                        textDecoration: "none",
                                                        fontWeight: "500"
                                                    }}
                                                >
                                                    {target.t_name}
                                                </Link>
                                            </td>

                                            <td
                                                style={{
                                                    padding: "12px",
                                                    color: "#B8DCCF",
                                                    fontWeight: "600",
                                                    borderBottom: "1px solid #30443E"
                                                }}
                                            >
                                                {Number(
                                                    target.predicted_pchembl
                                                ).toFixed(2)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>
                )}

            </div>

        </div>

    );

}