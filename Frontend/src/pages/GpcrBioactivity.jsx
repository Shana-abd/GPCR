import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrBioactivity() {

    const { gpcr_id } = useParams();

    const [bioactivity, setBioactivity] = useState([]);

    useEffect(() => {

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/bioactivity`)
            .then(res => res.json())
            .then(data => setBioactivity(data));

    }, [gpcr_id]);

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Experimental Bioactivity</h1>

            <table>
                <thead>
                    <tr>
                        <th>Drug</th>
                        <th>Action</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Units</th>
                        <th>pChEMBL</th>
                    </tr>
                </thead>

                <tbody>
                    {bioactivity.map((row) => (
                        <tr key={row.bioactivity_id}>
                            <td>{row.mol_name}</td>
                            <td>{row.action_type}</td>
                            <td>{row.std_type}</td>
                            <td>{row.std_value}</td>
                            <td>{row.std_units}</td>
                            <td>{row.pchembl_value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}