import { useNavigate } from "react-router-dom";

export default function DataTable({
    columns,
    data,
    getRowLink
}) {

    const navigate = useNavigate();

    return (

        <div className="table-container">

            <table className="data-table">

                <thead>

                    <tr>

                        {columns.map(col => (

                            <th key={col.key}>
                                {col.label}
                            </th>

                        ))}

                    </tr>

                </thead>

                <tbody>

                    {data.map((row, index) => (

                        <tr
                            key={index}
                            onClick={() => navigate(getRowLink(row))}
                        >

                            {columns.map((col, index) => (

                                <td key={col.key}>

                                    {index === 0 ? (

                                        <div className="primary-cell">

                                            <div className="primary-title">

                                                {row[col.key] ?? "-"}

                                            </div>

                                            <div className="primary-subtitle">

                                                {row.drugbank_id
                                                    ? `DrugBank: ${row.drugbank_id}`
                                                    :  `Molecule ID: ${row.mol_id}`}

                                            </div>

                                        </div>

                                    ) : (

                                        row[col.key] ?? "-"

                                    )}

                                </td>

                            ))}
                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}