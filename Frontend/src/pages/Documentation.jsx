import { useParams, Link } from "react-router-dom";
import {
    LuDna,
    LuPill,
    LuChartColumn,
    LuMicroscope,
    LuTriangleAlert,
    LuDatabase,
    LuChartBar,
} from "react-icons/lu";


export default function Documentation() {

    return (
        <div
            style={{ 
                padding: "40px",
                textAlign: "left"
            }}
        >

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

            <div className="doc-container">



                <h1>Getting Started</h1>

                <p className="doc-lead">
                    Welcome! GPCRCore was designed to
                    be straightforward to explore, so if you enjoy discovering
                    things on your own, feel free to jump right in.
                </p>

                <p>
                    If you're short on time or simply want to know where
                    everything is, this guide provides a quick overview of
                    every module and the type of information available
                    throughout the platform.
                </p>

                {/* Quick Navigation */}

                <h2>Where would you like to start?</h2>

                <div className="doc-grid">

                    <div className="doc-card">
                        <h3>
                            <LuDna className="doc-icon" />
                            GPCRs
                        </h3>
                        <p>
                            Browse receptor information,
                            classification,
                            expression,
                            bioactivity and structures.
                        </p>
                    </div>

                    <div className="doc-card">
                        <h3>
                            <LuPill className="doc-icon" />
                            Drugs
                        </h3>
                        <p>
                            Explore molecular properties,
                            GPCR targets,
                            bioactivity
                            and reported adverse drug reactions.
                        </p>
                    </div>

                    <div className="doc-card">
                        <h3>
                            <LuChartColumn className="doc-icon" />
                            Prediction
                        </h3>
                        <p>
                            Predict pChEMBL values
                            for novel GPCR–ligand pairs.
                        </p>
                    </div>

                    <div className="doc-card">
                        <h3>
                            <LuMicroscope className="doc-icon" />
                            Expression
                        </h3>

                        <p>
                            Explore GPCR expression across
                            human tissues and cell types.
                        </p>
                    </div>

                    <div className="doc-card">
                        <h3>
                            <LuTriangleAlert className="doc-icon" />
                            Side Effects
                        </h3>
                        
                        <p>
                            Explore reported adverse drug reactions
                            organised into Fine, Mid and Coarse labels.
                        </p>
                    </div>

                    <div className="doc-card">
                        <h3>
                            <LuChartBar className="doc-icon" />
                            Statistics
                        </h3>
                        <p>
                            View database coverage,
                            record counts
                            and summary statistics.
                        </p>
                    </div>

                </div>

                {/* Modules */}

                <h2>Database Modules</h2>

                <div className="doc-grid">

                    <div className="module-cards">

                        <h3>GPCR Module</h3>

                        <h4>You'll find</h4>

                        <ul>

                            <li>Receptor information</li>

                            <li>Classification</li>

                            <li>Protein properties</li>

                            <li>Tissue expression</li>

                            <li>Associated drugs</li>

                            <li>Bioactivity records</li>

                            <li>Structural information</li>

                        </ul>

                    </div>

                    <div className="module-cards">

                        <h3>Drug Module</h3>

                        <h4>You'll find</h4>

                        <ul>

                            <li>Molecular properties</li>

                            <li>GPCR targets</li>

                            <li>Experimental bioactivity</li>

                            <li>Reported adverse drug reactions</li>

                        </ul>

                    </div>

                    <div className="module-cards">

                        <h3>Expression</h3>

                        <h4>Available Information</h4>

                        <ul>

                            <li>Whole-body expression</li>

                            <li>Tissue-specific expression</li>

                            <li>Cell-type expression</li>

                        </ul>

                    </div>

                    <div className="module-cards">

                        <h3>pChEMBL Prediction</h3>

                        <h4>Workflow</h4>

                        <ol>

                            <li>Enter a SMILES string.</li>

                            <li>Select a GPCR.</li>

                            <li>Generate prediction.</li>

                            <li>Review predicted pChEMBL and similar molecules.</li>

                        </ol>

                    </div>

                </div>

                {/* Interpretation */}

                <h2>Understanding the Results</h2>

                <table className="doc-table">

                    <thead>

                        <tr>

                            <th>Term</th>

                            <th>Meaning</th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>Higher pChEMBL</td>

                            <td>Stronger predicted ligand affinity.</td>

                        </tr>

                        <tr>

                            <td>Lower pChEMBL</td>

                            <td>Weaker predicted ligand affinity.</td>

                        </tr>

                        <tr>

                            <td>Fine Label</td>

                            <td>Specific reported adverse event.</td>

                        </tr>

                        <tr>

                            <td>Mid Label</td>

                            <td>Functionally related adverse-event category.</td>

                        </tr>

                        <tr>

                            <td>Coarse Label</td>

                            <td>Broad physiological or organ-system category.</td>

                        </tr>

                    </tbody>

                </table>

                {/* Data Sources */}

                <h2>Integrated Data Sources</h2>

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
                
                {/* Disclaimer */}

                <div className="disclaimer">

                    <h2>Disclaimer</h2>

                    <p>
                        Information presented in this platform has been
                        integrated from publicly available biomedical
                        resources. Computational predictions are intended
                        solely for research purposes and should not replace
                        experimental validation or clinical judgement.
                    </p>

                </div>

            </div>

        </div>
    );
}