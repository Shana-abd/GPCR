import { Pill, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DrugCard({ drug }) {

    const navigate = useNavigate();

    const truncate = (text, max = 55) => {

        if (!text) return "";

        if (text.length <= max) return text;

        const cut = text.slice(0, max);

        const lastHyphen = cut.lastIndexOf("-");

        return (lastHyphen > 0 ? cut.slice(0, lastHyphen) : cut) + "...";

    };

    return (

        <div
            className="drug-card"
            onClick={() => navigate(`/drug/${drug.mol_id}`)}
        >

            <div className="drug-card-top">

                <Pill size={22} />

                <ArrowRight size={18} />

            </div>

            <h3 title={drug.mol_name}>
                {truncate(drug.mol_name)}
            </h3>

            <p>
                {drug.mol_id}
            </p>

        </div>

    );

}