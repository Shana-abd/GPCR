import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrDrugs() {

    const { gpcr_id } = useParams();

    const [drugs, setDrugs] = useState([]);

    useEffect(() => {

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/drugs`)
            .then(res => res.json())
            .then(data => setDrugs(data));

    }, [gpcr_id]);

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Targeting Drugs</h1>

            {drugs.map((drug) => (
                <div
                    key={drug.mol_id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px"
                    }}
                >
                    <b>
                        <Link to={`/drug/${drug.mol_id}`}>
                            {drug.mol_name || drug.mol_id}
                        </Link>
                    </b>

                    <br />

                    Median pChEMBL: {drug.median_pchembl}

                    <br />

                    Action: {drug.action_types}
                </div>
            ))}
        </div>
    );
}