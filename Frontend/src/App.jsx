import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import DrugDetail from "./pages/DrugDetail";
import Stats from "./pages/Stats";
import Navbar from "./components/NavBar";
import About from "./pages/About";
import Documentation from "./pages/Documentation";
import GpcrBrowser from "./pages/GpcrBrowser";
import GpcrExpression from "./pages/GpcrExpression";
import GpcrDrugs from "./pages/GpcrDrugs";
import GpcrBioactivity from "./pages/GpcrBioactivity";
import GpcrDetail from "./pages/GpcrDetail";
import GpcrStructure from "./pages/GpcrStructure";
import DrugTargets from "./pages/DrugTargets";

function SearchPage() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {

    if (query.length < 2) {
      setResults([]);
      return;
    }

    fetch(`https://gpcr.onrender.com/search?q=${query}`)
      .then(res => res.json())
      .then(data => setResults(data));

  }, [query]);

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center"
      }}
    >
      <Navbar />

      <div style={{ marginTop: "60px" }}>

        <h1>GPCR Database</h1>

        <p
          style={{
            fontSize: "18px",
            marginBottom: "30px",
            color: "#9ca3af"
          }}
        >
          Integrated GPCR, Drug, Expression, Bioactivity and Side Effect Resource
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search receptor, drug, synonym, or ChEMBL ID..."
          style={{
            width: "650px",
            maxWidth: "90%",
            padding: "14px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #444"
          }}
        />

        <div
          style={{
            marginTop: "25px",
            marginBottom: "40px",
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap"
          }}
        >
          <span>805 GPCRs</span>
          <span>330,562 Molecules</span>
          <span>592,361 Interactions</span>
          <span>9,465 Side Effects</span>
        </div>
        <div className="feature-section">

          <h2>What can you explore?</h2>

          <div className="feature-grid">

            <div className="feature-card">
              <h3>🧬 GPCRs</h3>
              <p>
                Browse receptor classes, families, ligands,
                structures and tissue expression profiles.
              </p>
            </div>

            <div className="feature-card">
              <h3>💊 Drugs</h3>
              <p>
                Explore GPCR-targeting molecules, bioactivity
                records and target interactions.
              </p>
            </div>

            <div className="feature-card">
              <h3>🩺 Side Effects</h3>
              <p>
                Investigate adverse events with fine, mid and
                coarse hierarchy classifications.
              </p>
            </div>

            <div className="feature-card">
              <h3>📊 Expression</h3>
              <p>
                View tissue-specific GPCR expression data
                across multiple organs and tissues.
              </p>
            </div>

          </div>

        </div>

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
        

      </Routes>

    </BrowserRouter>
  );
}