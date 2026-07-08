import { Link } from "react-router-dom";

export default function SimilarMoleculesTable({ ligands }) {

    if (!ligands || ligands.length === 0) return null;

    return (

        <div style={{ marginTop: "40px" }}>

            <h2>Other Similar Molecules ({ligands.length})</h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px"
                }}
            >

                <thead>

                    <tr style={{ background: "#f3f4f6" }}>

                        <th style={th}>Molecule</th>

                        <th style={th}>Similarity</th>

                    </tr>

                </thead>

                <tbody>

                    {ligands.map((ligand,index) => (

                        <tr
                            key={ligand.mol_id}
                            style={{
                                background: index % 2 === 0 ? "#ffffff" : "#fafafa"
                            }}
                        >

                            <td style={td}>
                                <Link to={`/drug/${ligand.mol_id}`}>
                                    {ligand.mol_id}
                                </Link>
                            </td>

                            <td style={td}>
                                {ligand.similarity.toFixed(4)}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

const th = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "600"
};

const td = {
    padding: "12px",
    borderBottom: "1px solid #eee"
};