import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";

export default function Stats() {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/stats")
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    if (!stats) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Database Statistics</h1>
            <h2>Database Coverage</h2>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>GPCRs</h3>
                <p>{stats.n_gpcrs.toLocaleString()}</p>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>Molecules</h3>
                <p>{stats.n_drugs.toLocaleString()}</p>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>Drug-GPCR Interactions</h3>
                <p>{stats.n_interactions.toLocaleString()}</p>
            </div>  

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>Side Effects</h3>
                <p>{stats.n_side_effects.toLocaleString()}</p>
            </div>
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>GPCRs with Expression Data</h3>
                <p>
                    Coverage:
                    {" "}
                    {(
                        (stats.gpcr_with_expression / stats.n_gpcrs) * 100
                    ).toFixed(1)}
                    %
                </p>
                <p>{stats.gpcr_with_expression.toLocaleString()}</p>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    marginBottom: "10px"
                }}
            >
                <h3>GPCRs with Drug Associations</h3>
                <p>
                    Coverage:
                    {" "}
                    {(
                        (stats.gpcr_with_drugs / stats.n_gpcrs) * 100
                    ).toFixed(1)}
                    %
                </p>
                <p>{stats.gpcr_with_drugs.toLocaleString()}</p>
            </div>

         
            <h2>Receptor Class Distribution</h2>

            {stats.class_distribution.map((cls) => (
                <div
                    key={cls.receptor_class}
                    style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        marginBottom: "8px"
                    }}
                >
                    <b>{cls.receptor_class}</b>

                    <br />

                    Count: {cls.count}
                </div>
            ))}

        </div>
    );
}