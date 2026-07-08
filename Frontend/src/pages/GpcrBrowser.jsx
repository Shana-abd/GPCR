import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dna, ArrowRight } from "lucide-react";


export default function GpcrBrowser() {

    const [gpcrs, setGpcrs] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {

        fetch("https://gpcr.onrender.com/gpcrs")
            .then(res => res.json())
            .then(data => setGpcrs(data));

    }, []);

    const filteredGpcrs = gpcrs.filter((g) =>
        g.t_name.toLowerCase().includes(filter.toLowerCase()) ||
        g.entry_name.toLowerCase().includes(filter.toLowerCase())
    );
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
                    textAlign: "center",
                    marginTop: "40px",
                    marginBottom: "36px"
                }}
            >

                <h1 className="page-title">
                    Browse GPCRs
                </h1>

                <p className="page-subtitle">
                    Explore receptor families, genes, ligands and tissue expression.
                </p>

                <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder="Search GPCR name, gene or family..."
                    className="search-input"
                />

            </div>
            <p
                style={{
                    marginBottom: "20px",
                    color: "#9ca3af",
                    fontSize: "16px"
                }}
            >
                Showing {filteredGpcrs.length} of {gpcrs.length} GPCRs
            </p>
            <div className="gpcr-grid">

                {filteredGpcrs.map((g) => (

                    <div
                        key={g.gpcr_id}
                        className="gpcr-card"
                    >

                        <Link
                            to={`/gpcr/${g.gpcr_id}`}
                            className="gpcr-link"
                        >

                            <div className="gpcr-card-top">

                                <div className="icon-box gpcr">

                                    <Dna size={28} />

                                </div>

                                <ArrowRight size={18} />

                            </div>

                            <h3>

                                {g.t_name}

                            </h3>

                            <p className="gpcr-entry">

                                {g.entry_name}

                            </p>

                            <span className="gpcr-badge">

                                {g.receptor_class}

                            </span>

                        </Link>

                    </div>

                ))}

            </div>
            

        </div>
    );
}