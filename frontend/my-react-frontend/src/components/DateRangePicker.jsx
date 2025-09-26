// src/components/DateRangePicker.jsx
import React from "react";

function DateRangePicker({ start, end, setStart, setEnd }) {
  const inputStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    backgroundColor: "#fff",
    color: "#333",
    margin: "0 0.5rem"
  };

  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label style={{ fontWeight: "bold", color: "#333" }}>Ημερομηνία έναρξης:</label>
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        style={inputStyle}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#999"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#ccc"}
      />

      <label style={{ fontWeight: "bold", color: "#333" }}>Ημερομηνία λήξης:</label>
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        style={inputStyle}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#999"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#ccc"}
      />
    </div>
  );
}

export default DateRangePicker;
