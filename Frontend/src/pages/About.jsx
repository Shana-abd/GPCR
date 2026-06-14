import Navbar from "../components/NavBar";

export default function About() {
    return (
        <div 
            style={{ 
                padding: "40px",
                textAlign: "left"
            }}
        >

            <Navbar />

            <h1>About GPCR Database</h1>

            <p>
                The GPCR Database is an integrated resource for exploring
                human G-protein-coupled receptors (GPCRs), their expression
                profiles, drug interactions, bioactivity measurements,
                and associated side effects.
            </p>

            <h2>Current Coverage</h2>

            <ul>
                <li>805 GPCRs</li>
                <li>330,562 molecules</li>
                <li>592,361 drug-GPCR interactions</li>
                <li>12,758 side effects</li>
            </ul>

            <h2>Data Sources and Contributions</h2>

            <h3>ChEMBL</h3>

            <ul>
                <li>GPCR receptor information</li>
                <li>Target identifiers</li>
                <li>Drug structures</li>
                <li>Molecular descriptors</li>
                <li>Bioactivity measurements</li>
                <li>Drug-target interactions</li>
            </ul>

            <h3>DrugBank</h3>

            <ul>
                <li>Drug identifiers</li>
                <li>Drug names and synonyms</li>
                <li>Approval status</li>
                <li>Drug annotations</li>
            </ul>

            <h3>PubChem</h3>

            <ul>
                <li>Compound identifiers</li>
                <li>Chemical annotations</li>
            </ul>

            <h3>Human Protein Atlas (HPA)</h3>

            <ul>
                <li>Tissue-specific expression profiles</li>
                <li>Whole-body expression summaries</li>
            </ul>

            <h3>GTEx</h3>

            <ul>
                <li>TPM expression measurements</li>
                <li>Brain-region expression data</li>
                <li>Expression specificity metrics</li>
            </ul>

            <h3>SIDER</h3>

            <ul>
                <li>Drug side effects</li>
            </ul>

            <h3>OFFSIDES</h3>

            <ul>
                <li>Pharmacovigilance-derived adverse event associations</li>
            </ul>

            <h3>OpenFDA</h3>

            <ul>
                <li>FDA adverse event reports</li>
            </ul>

        </div>
    );
}