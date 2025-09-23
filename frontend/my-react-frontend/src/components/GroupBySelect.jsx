// src/components/GroupBySelect.jsx
import React from "react";

function GroupBySelect({ groupBy, setGroupBy }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        Group By:
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="salesperson_id">Salesperson</option>
          <option value="contractor_id">Contractor</option>
          <option value="orderedFromCompany">Company</option>
        </select>
      </label>
    </div>
  );
}

export default GroupBySelect;
