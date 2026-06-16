import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";


export default function GpcrDetail() {

    const { gpcr_id } = useParams();

    const [gpcr, setGpcr] = useState(null);
    const [drugs, setDrugs] = useState([]);
    useEffect(() => {

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}`)
            .then(res => res.json())
            .then(data => setGpcr(data));

        fetch(`https://gpcr.onrender.com/gpcr/${gpcr_id}/drugs`)
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
            <h2>Explore This Receptor</h2>

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginTop: "20px"
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
                            border: "1px solid #444",
                            borderRadius: "12px",
                            padding: "20px",
                            width: "250px",
                            cursor: "pointer"
                        }}
                    >
      <h3>Expression Data</h3>
      <p>View tissue expression profiles</p>
    </div>
  </Link>

  <Link
    to={`/gpcr/${gpcr_id}/drugs`}
    style={{
      textDecoration: "none",
      color: "inherit"
    }}
  >
  <Link
    to={`/gpcr/${gpcr_id}/structure`}
    style={{
        textDecoration: "none",
        color: "inherit"
    }}
  >
    <div
        style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "20px",
        width: "250px",
        cursor: "pointer"
    }}
  >
    <h3>Sequence & Structure</h3>
    <p>View sequence and structural information</p>
  </div>
</Link>
    <div
      style={{
        border: "1px solid #444",
        borderRadius: "12px",
        padding: "20px",
        width: "250px",
        cursor: "pointer"
      }}
    >
      <h3>Drug Interactions</h3>
      <p>View associated drugs</p>
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