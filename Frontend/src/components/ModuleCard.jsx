import { Link } from "react-router-dom";

export default function ModuleCard({
  to,
  icon,
  title,
  description,
  color,
  disabled = false,
}) {

  const card = (

    <div className={`feature-card ${disabled ? "disabled" : ""}`}>

      <div className={`icon-box ${color}`}>
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      
    </div>

  );

  if (disabled) return card;

  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
    >
      {card}
    </Link>
  );
}