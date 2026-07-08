import { useEffect, useState  } from "react";
import { useParams, Link } from "react-router-dom";

import PredictionResult from "../components/PredictionResult";
import QuantitativeTable from "../components/QuantitativeTable";
import KnownLigandsTable from "../components/KnownLigandsTable";
import SimilarMoleculesTable from "../components/SimilarMoleculesTable";
import { useRef } from "react";

export default function PchemblPrediction() {

    const [gpcrs, setGpcrs] = useState([]);
    const [filter, setFilter] = useState("");
    const [selectedGpcr, setSelectedGpcr] = useState(null);
    const [smiles, setSmiles] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const resultRef = useRef(null);

    useEffect(() => {

        fetch("https://gpcr.onrender.com/gpcrs")
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
                "https://gpcr.onrender.com/predict",
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
                        border: "1px solid #ccc"
                    }}
                />

                {!selectedGpcr && filter.length > 1 && (

                    <div
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginTop: "10px",
                            maxHeight: "250px",
                            overflowY: "auto",
                            background: "white"
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
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            background: "#fafafa"
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

            </div>

        </div>

    );

}