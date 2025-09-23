// src/components/DateRangePicker.jsx
import React from "react";

function DateRangePicker({ start, end, setStart, setEnd }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label>
        Start Date:
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ margin: "0 1rem" }}
        />
      </label>

      <label>
        End Date:
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
        />
      </label>
    </div>
  );
}

export default DateRangePicker;
