import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrBrowser() {

    const [gpcrs, setGpcrs] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {

        fetch("https://gpcr.onrender.com/gpcrs")
            .then(res => res.json())
            .then(data => setGpcrs(data));

    }, []);

    return (
        <div style={{ padding: "40px" }}>

            <Navbar />

            <h1>Browse GPCRs</h1>
            <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter GPCRs..."
                style={{
                    padding: "8px",
                    width: "300px",
                    marginBottom: "20px"
                }}
            />
            <p>
                Showing {
                    gpcrs.filter((g) =>
                        g.t_name.toLowerCase().includes(filter.toLowerCase()) ||
                        g.entry_name.toLowerCase().includes(filter.toLowerCase())
                    ).length
                } of {gpcrs.length} GPCRs
            </p>
            <hr />

            {gpcrs
                .filter((g) =>
                    g.t_name.toLowerCase().includes(filter.toLowerCase()) ||
                    g.entry_name.toLowerCase().includes(filter.toLowerCase())
                )
                .map((g) => (

                <div
                    key={g.gpcr_id}
                    style={{
                        border: "1px solid #ddd",
                        padding: "12px",
                        marginBottom: "12px"
                    }}
                >

                    <h3>
                        <Link to={`/gpcr/${g.gpcr_id}`}>
                            {g.t_name}
                        </Link>
                    </h3>

                    <p>
                        <b>Entry Name:</b> {g.entry_name}
                    </p>

                    <p>
                        <b>Class:</b> {g.receptor_class}
                    </p>

                    <p>
                        <b>Family:</b> {g.receptor_family}
                    </p>

                    <p>
                        <b>Ligand Type:</b> {g.ligand_type}
                    </p>

                </div>

            ))}

        </div>
    );
}