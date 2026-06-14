import Navbar from "../components/Navbar";

export default function Documentation() {

    return (
        <div
            style={{ 
                padding: "40px",
                textAlign: "left"
            }}
        >

            <Navbar />

            <h1>Documentation</h1>

            <h2>Overview</h2>

            <p>
                The GPCR Database is an integrated resource
                containing GPCR receptor information,
                tissue expression data, drug-target
                interactions, bioactivity measurements,
                molecular descriptors, and side-effect
                information.
            </p>

            <h2>Data Sources</h2>

            <ul>
                <li>ChEMBL</li>
                <li>DrugBank</li>
                <li>PubChem</li>
                <li>Human Protein Atlas (HPA)</li>
                <li>GTEx</li>
                <li>SIDER</li>
                <li>OFFSIDES</li>
                <li>OpenFDA</li>
            </ul>

            <h2>Database Statistics</h2>

            <ul>
                <li>805 GPCRs</li>
                <li>330,562 Molecules</li>
                <li>592,361 Drug-GPCR Interactions</li>
                <li>12,758 Side Effects</li>
            </ul>
            <h2>Data Source Contributions</h2>

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

            <h3>SIDER, OFFSIDES, OpenFDA</h3>
            <ul>
                <li>Drug side effects</li>
                <li>Adverse event associations</li>
                <li>Safety information</li>
            </ul>
            <h2>Database Features</h2>

            <ul>
                <li>Search by receptor name</li>
                <li>Search by receptor synonym</li>
                <li>Search by ChEMBL target ID</li>
                <li>Browse GPCR expression profiles</li>
                <li>Explore drug-GPCR interactions</li>
                <li>View bioactivity measurements</li>
                <li>Investigate drug side effects</li>
            </ul>
            <h2>API Endpoints</h2>

            <ul>
                <li>/search?q=...</li>
                <li>/gpcr/{`{gpcr_id}`}</li>
                <li>/gpcr/{`{gpcr_id}`}/drugs</li>
                <li>/drug/{`{mol_id}`}</li>
                <li>/drug/{`{mol_id}`}/targets</li>
                <li>/drug/{`{mol_id}`}/sideeffects</li>
                <li>/stats</li>
            </ul>

            <h2>Data Processing Pipeline</h2>

            <h2>Database Schema</h2>

            <ul>
                <li>gpcr - receptor information</li>
                <li>gpcr_xrefs - external identifiers</li>
                <li>expression_summary - tissue expression data</li>
                <li>molecule - drug information</li>
                <li>mol_descriptors - molecular properties</li>
                <li>drug_gpcr_v2 - drug-target interactions</li>
                <li>side_effect - side effect annotations</li>
            </ul>

            <p>
                Data were collected from multiple public
                resources and standardized into a unified
                PostgreSQL database. Drug identifiers,
                eceptor identifiers, expression data,
                bioactivity measurements, and side-effect
                information were integrated through
                cross-reference mapping and quality-control
                procedures.
            </p>

            <h2>Search Capabilities</h2>

            <ul>
                <li>Search by receptor name</li>
                <li>Search by receptor synonyms</li>
                <li>Search by ChEMBL target ID</li>
                <li>Navigate from GPCR to drugs</li>
                <li>Navigate from drugs to GPCR targets</li>
            </ul>

            <h2>Citation</h2>

            <p>
                If you use this database in academic work,
                please cite the associated publication and
                the original data sources including ChEMBL,
                DrugBank, GTEx, Human Protein Atlas,
                SIDER, OFFSIDES and OpenFDA.
            </p>

        </div>
    );
}