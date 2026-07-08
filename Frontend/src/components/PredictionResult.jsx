export default function PredictionResult({ prediction }) {

    if (!prediction) return null;

    const value = prediction.predicted_pchembl;

    let level = "";
    let color = "";

    if (value >= 8) {
        level = "High predicted activity";
        color = "#16a34a";
    }
    else if (value >= 6) {
        level = "Moderate predicted activity";
        color = "#ca8a04";
    }
    else {
        level = "Low predicted activity";
        color = "#dc2626";
    }

    return (

        <div
            style={{
                marginTop: "40px",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                textAlign: "center",
                background: "#fafafa"
            }}
        >

            <h2>Predicted pChEMBL</h2>

            <div
                style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    marginTop: "15px"
                }}
            >
                {value.toFixed(3)}
            </div>

            <div
                style={{
                    marginTop: "12px",
                    color: color,
                    fontWeight: "600"
                }}
            >
                {level}
            </div>

        </div>

    );

}