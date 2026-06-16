import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrExpression() {

    const { gpcr_id } = useParams();

    const [expression, setExpression] = useState([]);

    useEffect(() => {
        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/expression`)
            .then(res => res.json())
            .then(data => setExpression(data));
    }, [gpcr_id]);

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Expression Data</h1>

            <table>
                <thead>
                    <tr>
                        <th>Tissue</th>
                        <th>Median TPM</th>
                    </tr>
                </thead>

                <tbody>
                    {expression.map((row, idx) => (
                        <tr key={idx}>
                            <td>{row.tissue_name}</td>
                            <td>{Number(row.median_tpm).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}