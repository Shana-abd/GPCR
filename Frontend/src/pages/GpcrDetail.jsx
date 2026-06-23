import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrDetail() {

    const { gpcr_id } = useParams();

    const [gpcr, setGpcr] = useState(null);

    useEffect(() => {

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}`)
            .then(res => res.json())
            .then(data => setGpcr(data));

    }, [gpcr_id]);

    if (!gpcr) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>{gpcr.t_name}</h1>

            {gpcr.entry_name && (
                <p><b>Entry Name:</b> {gpcr.entry_name}</p>
            )}

            {gpcr.receptor_class && (
                <p><b>Class:</b> {gpcr.receptor_class}</p>
            )}

            {gpcr.receptor_family && (
                <p><b>Family:</b> {gpcr.receptor_family}</p>
            )}

            {gpcr.uniprot_id && (
                <p><b>UniProt:</b> {gpcr.uniprot_id}</p>
            )}

            {gpcr.ensembl_gene_id && (
                <p><b>Ensembl:</b> {gpcr.ensembl_gene_id}</p>
            )}

            {gpcr.seq_length != null && (
                <p><b>Sequence Length:</b> {gpcr.seq_length}</p>
            )}

            <h2
                style={{
                    marginTop: "50px",
                    marginBottom: "30px",
                    textAlign: "center"
                }}
            >
                Explore This Receptor
            </h2>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    marginTop: "20px",
                    flexWrap: "wrap"
                }}
            >

                <Link
                    to={`/gpcr/${gpcr_id}/expression`}
                    style={{
                        textDecoration: "none",
                        color: "inherit"
                    }}
                >
                    <div
                        style={{
                            border: "1px solid #2E3A35",
                            borderRadius: "12px",
                            padding: "20px",
                            width: "220px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <h3>Expression Data</h3>
                        <p>View tissue expression profiles</p>
                    </div>
                </Link>

                <Link
                    to={`/gpcr/${gpcr_id}/structure`}
                    style={{
                        textDecoration: "none",
                        color: "inherit"
                    }}
                >
                    <div
                        style={{
                            border: "1px solid #2E3A35",
                            borderRadius: "12px",
                            padding: "20px",
                            width: "220px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <h3>Sequence & Structure</h3>
                        <p>View sequence and structural information</p>
                    </div>
                </Link>

                <Link
                    to={`/gpcr/${gpcr_id}/drugs`}
                    style={{
                        textDecoration: "none",
                        color: "inherit"
                    }}
                >
                    <div
                        style={{
                            border: "1px solid #2E3A35",
                            borderRadius: "12px",
                            padding: "20px",
                            width: "220px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer"
                        }}
                    >
                        <h3>Drug Interactions</h3>
                        <p>View associated drugs</p>
                    </div>
                </Link>

            </div>

        </div>
    );
}