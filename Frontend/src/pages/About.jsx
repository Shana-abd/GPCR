import { useParams, Link } from "react-router-dom";

export default function About() {
    return(
    
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

            <div className="about-container">

            <h1>About the GPCR Drug Discovery Platform</h1>

            <p>
                The <b>GPCR Drug Discovery Platform</b> is a comprehensive web-based
                resource designed to facilitate the exploration of G protein-coupled
                receptors (GPCRs), one of the largest and most therapeutically important
                families of drug targets covering one by third of FDA approved drug targets.
                The platform integrates diverse biological,pharmacological and computational 
                datasets into a unified interface,enabling researchers to efficiently investigate GPCRs, 
                their ligands,bioactivity, tissue expression and associated adverse drug reactions.
                The database is also integrated with an ML- based pChembl predictor for a GPCR-ligand pair.
            </p>

            

            <h2>Why This Platform?</h2>

            <p>
                Information relevant to GPCR research is often distributed across multiple
                independent databases, requiring extensive manual integration before
                meaningful analyses can be performed. This platform addresses that
                challenge by combining receptor information, drug-target interactions,
                bioactivity measurements, tissue expression profiles and drug safety
                information into a single searchable resource. In addition, computational
                prediction tools are incorporated to assist researchers in prioritizing
                potential GPCR–ligand interactions.
            </p>

            

            <h2>Platform Features</h2>

            <div className="feature-card-grid">

                <div className="about-card">
                    <h3>🧬 GPCR Browser</h3>
                    <p>
                        Explore GPCR classes, families, receptor annotations,
                        protein characteristics and structural information.
                    </p>
                </div>

                <div className="about-card">
                    <h3>💊 Drug & Bioactivity</h3>
                    <p>
                        Browse GPCR-targeting drugs, experimentally determined
                        bioactivity values, ligand information, receptor interactions
                        and reported adverse drug reactions.
                    </p>
                </div>

                <div className="about-card">
                    <h3>🧠 Tissue Expression</h3>
                    <p>
                        Investigate GPCR expression across multiple human tissues
                        using integrated transcriptomic datasets.
                    </p>
                </div>

                <div className="about-card">
                    <h3>🩺 Adverse Drug Reactions</h3>

                    <p>
                        Explore reported adverse drug reactions organized into a
                        hierarchical ontology consisting of:
                    </p>

                    <ul>
                        <li>Fine Labels – Specific adverse events</li>
                        <li>Mid Labels – Functional categories</li>
                        <li>Coarse Labels – Organ-system categories</li>
                    </ul>

                </div>

                <div className="about-card">
                    <h3>📈 pChEMBL Prediction</h3>

                    <p>
                        Predict GPCR–ligand binding affinity using an integrated
                        machine learning model trained on experimentally validated
                        bioactivity data.
                    </p>

                </div>

                <div className="about-card">
                    <h3>🔍 Integrated Search</h3>

                        <p>
                        Search GPCRs, drugs and associated biological information
                        through a unified interface.
                        </p>

                </div>

            </div>

            

            <h2>Integrated Data Sources</h2>

            <p>
                The platform integrates curated information from several publicly
                available biomedical databases, including:
            </p>

            <div className="source-tags">

                <span>GPCRdb</span>

                <span>ChEMBL</span>

                <span>DrugBank</span>

                <span>PubChem</span>

                <span>GTEx</span>

                <span>Human Protein Atlas</span>

                <span>SIDER</span>

                <span>OpenFDA</span>

                <span>OFFSIDES</span>

            </div>

            

            <h2>Applications</h2>

            <p>
                The GPCR Drug Discovery Platform supports a broad range of research
                applications including GPCR pharmacology, drug discovery, target
                prioritization, computational biology, bioinformatics, systems
                pharmacology and machine learning-assisted drug development.
            </p>

           

            <h2>Technology Stack</h2>

            <ul>
                <li><b>Frontend:</b> React</li>
                <li><b>Backend:</b> FastAPI</li>
                <li><b>Database:</b> PostgreSQL</li>
                <li><b>Machine Learning:</b> XGBoost</li>
                <li><b>Cheminformatics:</b> RDKit</li>
                <li><b>Data Processing:</b> Python & Pandas</li>
            </ul>


            <h2>Disclaimer</h2>

            <p>
                The database integrates information obtained from publicly available
                biomedical resources. The pChEMBL prediction module provides
                machine learning-based estimates intended to support research and
                hypothesis generation. Predictions should not be considered a substitute
                for experimental validation or clinical decision making.
            </p>

            </div>
        </div>
    )}