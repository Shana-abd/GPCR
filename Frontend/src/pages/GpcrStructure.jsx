import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrStructure() {

    const { gpcr_id } = useParams();

    const [data, setData] = useState(null);

    useEffect(() => {

        fetch(`http://localhost:8000/gpcr/${gpcr_id}/structure`)
            .then(res => res.json())
            .then(data => setData(data));

    }, [gpcr_id]);

    if (!data) {
        return (
            <div style={{ padding: "40px" }}>
                <Navbar />
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Sequence & Structural Features</h1>

            <h2>Sequence Properties</h2>

            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Sequence Length</td>
                        <td>{data.seq_length} aa</td>
                    </tr>

                    <tr>
                        <td>Molecular Weight</td>
                        <td>{Number(data.mol_wt).toFixed(2)} Da</td>
                    </tr>

                    <tr>
                        <td>Isoelectric Point</td>
                        <td>{Number(data.isoelectric_point).toFixed(2)}</td>
                    </tr>

                    <tr>
                        <td>Aromaticity</td>
                        <td>{Number(data.aromaticity).toFixed(3)}</td>
                    </tr>

                    <tr>
                        <td>Instability Index</td>
                        <td>{Number(data.instability_index).toFixed(2)}</td>
                    </tr>

                    <tr>
                        <td>GRAVY</td>
                        <td>{Number(data.gravy).toFixed(3)}</td>
                    </tr>

                    <tr>
                        <td>Charge at pH 7</td>
                        <td>{Number(data.charge_ph7).toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <br />

            <h2>Structural Features</h2>

            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Transmembrane Domains</td>
                        <td>{data.tm_count}</td>
                    </tr>

                    <tr>
                        <td>DRY Motif</td>
                        <td>{data.has_dry ? "Present" : "Absent"}</td>
                    </tr>

                    <tr>
                        <td>NPXXY Motif</td>
                        <td>{data.has_npxxy ? "Present" : "Absent"}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
}
