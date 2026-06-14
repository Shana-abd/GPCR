import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function GpcrDetail() {

    const { gpcr_id } = useParams();

    const [gpcr, setGpcr] = useState(null);
    const [drugs, setDrugs] = useState([]);

    useEffect(() => {

        fetch(`http://127.0.0.1:8000/gpcr/${gpcr_id}`)
            .then(res => res.json())
            .then(data => setGpcr(data));

        fetch(`http://127.0.0.1:8000/gpcr/${gpcr_id}/drugs`)
            .then(res => res.json())
            .then(data => setDrugs(data));

    }, [gpcr_id]);

    if (!gpcr) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: "40px" }}>
            <Navbar />

            <h1>{gpcr.t_name}</h1>

            <p><b>Entry Name:</b> {gpcr.entry_name}</p>

            <p><b>Class:</b> {gpcr.receptor_class}</p>

            <p><b>Family:</b> {gpcr.receptor_family}</p>

            <p><b>UniProt:</b> {gpcr.uniprot_id}</p>

            <p><b>Ensembl:</b> {gpcr.ensembl_gene_id}</p>

            <p><b>Sequence Length:</b> {gpcr.seq_length}</p>

           
            <h2>GPCR Information</h2>

            <h2>Expression</h2>

            <p>
                <b>Highest Whole Body Expression:</b>{" "}
                {gpcr.wholebody_max_tissue || "N/A"}
            </p>

            <p>
                <b>Whole Body TPM:</b>{" "}
                {gpcr.wholebody_max_tpm ?? "N/A"}
            </p>

            <p>
                <b>Highest Brain Expression:</b>{" "}
                {gpcr.brain_max_region || "N/A"}
            </p>

            <p>
                <b>Brain TPM:</b>{" "}
                {gpcr.brain_max_tpm ?? "N/A"}
            </p>

            <p>
                <b>Brain Specificity Score:</b>{" "}
                {gpcr.brain_specificity_score ?? "N/A"}
            </p>


            <h2>Targeting Drugs</h2>

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

            <h3>Data Sources</h3>

            <ul>
                <li>ChEMBL</li>
                <li>Human Protein Atlas (HPA)</li>
                <li>GTEx</li>
            </ul>

        </div>
    );
}