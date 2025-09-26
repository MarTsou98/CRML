// src/components/GroupBySelect.jsx
import React from "react";

function GroupBySelect({ groupBy, setGroupBy }) {
  return (
    <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label style={{ fontWeight: "bold", color: "#333" }}>Ομαδοποίηση κατά:</label>
      <select
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
          backgroundColor: "#fff",
          color: "#333"
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#999"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#ccc"}
      >
        <option value="salesperson_id">Πωλητές</option>
        <option value="contractor_id">Εργολάβοι</option>
        <option value="orderedFromCompany">Εταιρεία</option>
      </select>
    </div>
  );
}

export default GroupBySelect;
