import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Dna,
    Activity,
    Pill,
    ArrowRight
} from "lucide-react";

export default function GpcrDetail() {

    const { gpcr_id } = useParams();

    const [gpcr, setGpcr] = useState(null);

    useEffect(() => {

        fetch(`http://gpcr.onrender.com/gpcr/${gpcr_id}`)
            .then(res => res.json())
            .then(data => setGpcr(data));

    }, [gpcr_id]);

    function toTitleCase(text) {

        if (!text) return "-";

        return text
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    }

    if (!gpcr) {

        return <div>Loading...</div>;

    }
    console.log(gpcr);
    console.log("Sequence:", gpcr.t_sequence);

    const formattedSequence =
        gpcr.t_sequence
            ? gpcr.t_sequence.match(/.{1,195}/g).join("\n")
            : "";
        

    return (

        <div style={{ padding: "24px 40px 40px" }}>

            {/* ================= TOP BAR ================= */}

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

            {/* ================= HERO ================= */}

            <div
                style={{
                    textAlign: "center",
                    marginTop: "40px",
                    marginBottom: "40px"
                }}
            >

                <h1 className="page-title">

                    {toTitleCase(gpcr.t_name)}

                </h1>

                <span className="gpcr-badge">

                    {gpcr.receptor_class}

                </span>

            </div>

            {/* ================= OVERVIEW ================= */}

            <div className="overview-card">

                <h2>

                    Overview

                </h2>

                <div className="overview-table">

                    <div>Entry Name</div>
                    <div>{toTitleCase(gpcr.entry_name || "-")}</div>

                    <div>Family</div>
                    <div>{gpcr.receptor_family || "-"}</div>

                    <div>Ligand Type</div>
                    <div>{gpcr.ligand_type || "-"}</div>

                    <div>Alternative Names</div>
                    <div>{gpcr.alt_names || "-"}</div>

                    <div>UniProt</div>
                    <div>{gpcr.uniprot_id || "-"}</div>

                    <div>Ensembl</div>
                    <div>{gpcr.ensembl_gene_id || "-"}</div>

                    <div>Sequence Length</div>
                    <div>{gpcr.seq_length || "-"} aa</div>

                </div>

            </div>

            {/* ================= MODULES ================= */}

            <h2
                style={{
                    textAlign: "center",
                    marginTop: "60px",
                    marginBottom: "30px",
                    fontSize:"32px"
                }}
            >

                Explore This Receptor

            </h2>

            <div className="gpcr-modules">

                <Link
                    to={`/gpcr/${gpcr_id}/expression`}
                    className="module-link"
                >

                    <div className="module-card">

                        <div className="module-content">

                            <div className="icon-box gpcr">

                                <Activity size={28} />

                            </div>

                            <h3>

                                Expression Data

                            </h3>

                            <p>

                                Explore tissue expression profiles.

                            </p>
                        </div>

                        <ArrowRight
                            size={18}
                            className="module-arrow"
                        />

                    </div>

                </Link>

                <Link
                    to={`/gpcr/${gpcr_id}/drugs`}
                    className="module-link"
                >

                    <div className="module-card">
                        <div className="module-content">

                            <div className="icon-box gpcr">

                                <Pill size={28} />

                            </div>

                            <h3>

                                Drug Interactions

                            </h3>

                            <p>

                                Browse associated GPCR-targeting drugs.

                            </p>
                        </div>

                        <ArrowRight
                            size={18}
                            className="module-arrow"
                        />

                    </div>

                </Link>

            </div>
            <div className="sequence-section">

                <div className="sequence-header">

                    <h2 className="gpcr-page">

                        Protein Sequence

                    </h2>

                    <button
                        className="copy-btn"
                        onClick={() => navigator.clipboard.writeText(gpcr.t_sequence || "")}
                    >

                        📋 Copy Sequence

                    </button>

                </div>

                <pre className="sequence-box">

                    {formattedSequence}

                </pre>

            </div>
            <h2 className="gpcr-page">
                Sequence Properties
            </h2>

            <div className="property-list">

                <div>Sequence Length</div>
                <div>{gpcr.seq_length} aa</div>

               <div>Molecular Weight</div>
                <div>{(gpcr.mol_wt / 1000).toFixed(2)} kDa</div>

                <div>Isoelectric Point</div>
                <div>{gpcr.isoelectric_point?.toFixed(2)}</div>

                <div>Aromaticity</div>
                <div>{gpcr.aromaticity?.toFixed(3)}</div>

                <div>Instability Index</div>
                <div>{gpcr.instability_index?.toFixed(2)}</div>

                <div>GRAVY</div>
                <div>{gpcr.gravy?.toFixed(3)}</div>

                <div>Charge at pH 7</div>
                <div>{gpcr.charge_ph7?.toFixed(2)}</div>

            </div>
        </div>

    );

}