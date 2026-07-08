import { Link } from "react-router-dom";

export default function QuantitativeTable({ ligands }) {

    if (!ligands || ligands.length === 0) return null;

    return (

        <div style={{ marginTop: "40px" }}>

            <h2>
                Quantitative Ligands ({ligands.length})
            </h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: "15px"
                }}
            >

                <thead>

                    <tr
                        style={{
                            background: "#f3f4f6"
                        }}
                    >

                        <th style={th}>Molecule</th>

                        <th style={th}>Similarity</th>

                        <th style={th}>Mean</th>

                        <th style={th}>Median</th>

                        <th style={th}>Max</th>

                        <th style={th}>Action</th>

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

                            <td style={td}>
                                {ligand.mean_pchembl.toFixed(2)}
                            </td>

                            <td style={td}>
                                {ligand.median_pchembl.toFixed(2)}
                            </td>

                            <td style={td}>
                                {ligand.max_pchembl.toFixed(2)}
                            </td>

                            <td style={td}>
                                {ligand.action_types || "-"}
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