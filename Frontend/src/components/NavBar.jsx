import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div style={{
            padding: "10px",
            marginBottom: "20px",
            borderBottom: "1px solid #ddd"
        }}>
            <Link to="/">Home</Link>
            {" | "}
            <Link to="/gpcrs">Browse GPCRs</Link>
            {" | "}
            <Link to="/gpcrs">pChEMBL Prediction</Link>
            {" | "}
            <Link to="/stats">Statistics</Link>
            {" | "}
            <Link to="/about">About</Link>
            {" | "}
            <Link to="/docs">Documentation</Link>
        </div>
    );
}