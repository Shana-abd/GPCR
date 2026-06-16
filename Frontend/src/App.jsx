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
    <div style={{ padding: "40px" }}>
      <Navbar />

      <h1>GPCR Database</h1>


      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search receptor, synonym, or ChEMBL ID..."
      />


      <hr />
      {results.length > 0 && (
      <p>
        Found {results.length} receptor(s)
      </p>
    )}

      {query.length >= 2 && results.length === 0 && (
      <p>No receptors found.</p>
    )}
      {results.map((r) => (
        <div
          key={r.gpcr_id}
          style={{
            border: "1px solid #ddd",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "8px"
          }}
        >
          <h3>
            <Link to={`/gpcr/${r.gpcr_id}`}>
              {r.t_name}
            </Link>
          </h3>

          <p>
            <b>Entry Name:</b> {r.entry_name}
          </p>

          <p>
            <b>GPCR ID:</b> {r.gpcr_id}
          </p>
        </div>
      ))}

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
        <Route path="/gpcr/:gpcr_id/bioactivity" element={<GpcrBioactivity />} />

      </Routes>

    </BrowserRouter>
  );
}