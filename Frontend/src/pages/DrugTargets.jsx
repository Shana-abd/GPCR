import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function DrugTargets() {

    const { mol_id } = useParams();

    const [targets, setTargets] = useState([]);

    useEffect(() => {

        fetch(`http://localhost:8000/drug/${mol_id}/targets`)
            .then(res => res.json())
            .then(data => setTargets(data));

    }, [mol_id]);

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>Target GPCRs</h1>

            {targets.map((target) => (
                <div
                    key={target.gpcr_id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "10px",
                        marginBottom: "10px",
                        borderRadius: "8px"
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
            ))}
        </div>
    );
}