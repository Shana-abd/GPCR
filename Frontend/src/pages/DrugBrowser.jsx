import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "../components/DataTable";
import DrugCard from "../components/DrugCard";
export default function DrugBrowser() {

    const [drugs, setDrugs] = useState([]);

    const [search, setSearch] = useState("");


    useEffect(() => {

        const timeout = setTimeout(() => {

            fetch(
                
                `http://127.0.0.1:8000/drugs?search=${encodeURIComponent(search)}`
            )
                .then(res => res.json())
                .then(setDrugs);

        }, 300);

        return () => clearTimeout(timeout);

    }, [search]);

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
                
            >
                <div className="page-hero">

                    <h1>Drug Browser</h1>

                    <p>
                        Search and explore GPCR-targeting molecules.
                    </p>

                    <input

                        className="search-input"

                        value={search}

                        onChange={(e)=>setSearch(e.target.value)}

                        placeholder="Search by drug name, DrugBank ID or Molecule ID..."

                    />

                </div>

                {/* ADD IT HERE */}

                <div className="table-header">

                    <span>

                        Showing {drugs.length} results

                    </span>

                </div>

                <div className="drug-grid">

                    {drugs.map(drug => (

                        <DrugCard
                            key={drug.mol_id}
                            drug={drug}
                        />

                    ))}

                </div>
                

            </div>

        </div>

    );

}