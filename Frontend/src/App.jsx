import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import DrugDetail from "./pages/DrugDetail";
import Stats from "./pages/Stats";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import GpcrBrowser from "./pages/GpcrBrowser";
import GpcrExpression from "./pages/GpcrExpression";
import GpcrDrugs from "./pages/GpcrDrugs";
import GpcrBioactivity from "./pages/GpcrBioactivity";
import GpcrDetail from "./pages/GpcrDetail";
import GpcrStructure from "./pages/GpcrStructure";
import DrugTargets from "./pages/DrugTargets";
import Prediction from "./pages/prediction";
import DrugBrowser from "./pages/DrugBrowser";

import ModuleCard from "./components/ModuleCard";

import {
  Home,
  Dna,
  Pill,
  BrainCircuit,
  ShieldAlert,
} from "lucide-react";

function SearchPage() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  

  // Search
  useEffect(() => {

    if (query.length < 2) {
      setResults([]);
      return;
    }

    fetch(`http://localhost:8000/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));

  }, [query]);

  useEffect(() => {

    fetch("http://localhost:8000/stats")
      .then(res => res.json())
      .then(setStats);

  }, []);

  return (
    <div
  style={{
    padding: "24px 40px 40px"
  }}
>

    <div className="topbar">

        <Link to="/" className="top-left">

          <span className="brand-logo">🧬</span>

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
        style={{
            textAlign:"center",
            marginTop:"40px"
        }}
    >

        <h1 className="home-title">

            GPCR Database

        </h1>

        <p
          style={{
            fontSize: "20px",
            color: "#9ca3af",
            maxWidth: "900px",
            margin: "0 auto 14px",
            lineHeight: "1.6"
          }}
        >

        </p>

        <p
          style={{
            fontSize: "16px",
            color: "#7b8190",
            maxWidth: "760px",
            margin: "0 auto 36px",
            lineHeight: "1.7"
          }}
        >   
          Integrated GPCR , Drug , Bioactivity and Side effect resource.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search receptors, drugs, genes, synonyms or ChEMBL IDs..."
          style={{
            width: "720px",
            maxWidth: "92%",
            padding: "18px 22px",
            fontSize: "17px",
            borderRadius: "14px",
            border: "1px solid #363b46",
            background: "#23262f",
            color: "#ffffff",
            outline: "none",
            transition: "0.25s",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)"
          }}
        />

        
        <div className="feature-section">

          <h2>What can you Explore?</h2>

          <div className="feature-grid">

            <ModuleCard
              to="/gpcrs"
              color="gpcr"
              icon={<Dna size={38} />}
              title="Browse GPCRs"
              description="Explore receptor families, structures, ligands and tissue expression."
            />

            <ModuleCard
              to="/drugs"
              color="drug"
              icon={<Pill size={38} />}
              title="Browse Ligands"
              description="Explore GPCR-targeting compounds, molecular properties and receptor interactions."
            />

            <ModuleCard
              to="/prediction"
              color="prediction"
              icon={<BrainCircuit size={38} />}
              title="pChEMBL Prediction"
              description="Predict ligand affinity using the integrated machine learning model."
            />

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <footer className="home-footer">

          <div className="footer-column">

           <h3>Database</h3>

            <p>
              <span className="stat-number">
                {stats?.n_gpcrs?.toLocaleString()}
              </span>{" "}
              GPCRs
            </p>

            <p>         
              <span className="stat-number">
                {stats?.n_drugs?.toLocaleString()}
              </span>{" "}
              Molecules
            </p>

            <p>
              <span className="stat-number">
                {stats?.n_interactions?.toLocaleString()}
              </span>{" "}
              Interactions
            </p>
            <p>
              <span className="stat-number">
                {stats?.n_side_effects?.toLocaleString()}
              </span>{" "}
              Fine-level Adverse Events
            </p>

            <p>
              <span className="stat-number">
                {stats?.n_mid_labels?.toLocaleString()}
              </span>{" "}
              Mid-level Categories
            </p>

            <p>
              <span className="stat-number">
                {stats?.n_coarse_labels?.toLocaleString()}
              </span>{" "}
              Coarse-level Categories
            </p>
          </div>

          <div className="footer-column">

            <h3>Data Sources</h3>

            <p>GPCRdb</p>

            <p>ChEMBL</p>

            <p>DrugBank</p>

            <p>GTEx</p>

            <p>Human Protein Atlas</p>

            <p>PubChem</p>

            <p>SIDER</p>

            <p>Offsides</p>

            <p>OpenFDA</p>

          </div>

          <div className="footer-column">

            <h3>Resources</h3>

            <Link to="/docs">
              Documentation
            </Link>

            <Link to="/about">
              About
            </Link>

            <Link to="/about">
              Contact
            </Link>

          </div>

        </footer>

      </div>

      {results.length > 0 && (
        <p style={{ marginBottom: "20px" }}>
          Found {results.length} result(s)
        </p>
      )}

      {query.length >= 2 && results.length === 0 && (
        <p>No results found.</p>
      )}

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        {results.map((r) => (

          <div
            key={`${r.result_type}-${r.id}`}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "12px",
              borderRadius: "8px",
              textAlign: "left"
            }}
          >

            {r.result_type === "gpcr" ? (

              <>
                <h3>
                  <Link to={`/gpcr/${r.id}`}>
                    🧬 {r.name}
                  </Link>
                </h3>

                <p>
                  <b>Type:</b> GPCR
                </p>

                <p>
                  <b>ID:</b> {r.id}
                </p>
              </>

            ) : (

              <>
                <h3>
                  <Link to={`/drug/${r.id}`}>
                    💊 {r.name}
                  </Link>
                </h3>

                <p>
                  <b>Type:</b> Drug
                </p>

                <p>
                  <b>ID:</b> {r.id}
                </p>
              </>

            )}

          </div>

        ))}
      </div>

    </div>
  );
}
export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<SearchPage />}
        />

        <Route
          path="/gpcr/:gpcr_id"
          element={<GpcrDetail />}
        />

        <Route
          path="/drug/:mol_id"
          element={<DrugDetail />}
        />

        <Route
          path="/stats"
          element={<Stats />}
        />
        <Route
          path="/drugs"
          element={<DrugBrowser />}
        />

        <Route
          path="/docs"
          element={<Documentation />}
        />
        <Route
          path="/gpcrs"
          element={<GpcrBrowser />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/gpcr/:gpcr_id/expression" element={<GpcrExpression />} />
        <Route path="/gpcr/:gpcr_id/drugs" element={<GpcrDrugs />} />
        <Route
          path="/gpcr/:gpcr_id/structure"
          element={<GpcrStructure />}
        />
        <Route path="/gpcr/:gpcr_id/bioactivity" element={<GpcrBioactivity />} />
        <Route
          path="/drug/:mol_id/targets"
          element={<DrugTargets />}
        />
        <Route
          path="/prediction"
          element={<Prediction />}
        />
        

      </Routes>

    </BrowserRouter>
  );
}

