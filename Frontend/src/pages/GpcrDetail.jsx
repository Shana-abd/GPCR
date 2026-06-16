import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";


export default function GpcrDetail() {

    const { gpcr_id } = useParams();

    const [gpcr, setGpcr] = useState(null);
    const [drugs, setDrugs] = useState([]);
    const [bioactivity, setBioactivity] = useState([]);
    const [expression, setExpression] = useState([]);
    useEffect(() => {

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}`)
            .then(res => res.json())
            .then(data => setGpcr(data));

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/drugs`)
            .then(res => res.json())
            .then(data => setDrugs(data));
        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/bioactivity`)
            .then((res) => res.json())
            .then((data) => setBioactivity(data));
        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/expression`)
        .then((res) => res.json())
        .then((data) => setExpression(data));
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
            <h2>Explore This Receptor</h2>

            <div className="gpcr-links">

                <Link to={`/gpcr/${gpcr_id}/expression`}>
                    <div className="card">
                        <h3>Expression Data</h3>
                        <p>View tissue expression profiles</p>
                    </div>
                </Link>

                <Link to={`/gpcr/${gpcr_id}/drugs`}>
                    <div className="card">
                        <h3>Drug Interactions</h3>
                        <p>View associated drugs</p>
                    </div>
                </Link>

                <Link to={`/gpcr/${gpcr_id}/bioactivity`}>
                    <div className="card">
                        <h3>Bioactivity Records</h3>
                        <p>View experimental activity data</p>
                    </div>
                </Link>

            </div>

            <h3>Data Sources</h3>

            <ul>
                <li>ChEMBL</li>
                <li>Human Protein Atlas (HPA)</li>
                <li>GTEx</li>
            </ul>

        </div>
    );
}