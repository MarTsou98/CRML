// src/pages/StatsPage.jsx
import React, { useState } from "react";
import { fetchStats } from "../api/stats";
import DateRangePicker from "../components/DateRangePicker";
import GroupBySelect from "../components/GroupBySelect";
import StatsTable from "../components/StatsTable";

function StatsPage() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [groupBy, setGroupBy] = useState("salesperson_id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!start || !end) {
      alert("Please select both start and end dates");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchStats(start, end, groupBy);
      setData(result);
    } catch (error) {
      console.error(error);
      alert("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ 
    fontSize: "2rem", 
    fontWeight: "700", 
    color: "#333", 
    margin: 0, 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.5px"
  }}>
    Στατιστικά
  </h1>

      <DateRangePicker start={start} end={end} setStart={setStart} setEnd={setEnd} />
      <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy} />
<button
  onClick={handleFetch}
  style={{
    padding: "10px 20px",
    backgroundColor: "#FF9800", // orange for a distinct action
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease-in-out",
    marginBottom: "1rem"
  }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#FB8C00"}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FF9800"}
>
  Στατιστικά
</button>


      {loading ? <p>Loading...</p> : <StatsTable data={data} groupBy={groupBy} start={start} end={end} />}
    </div>
  );
}

export default StatsPage;
