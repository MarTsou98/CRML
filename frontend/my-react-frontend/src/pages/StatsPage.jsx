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
      <h1>Stats Dashboard</h1>

      <DateRangePicker start={start} end={end} setStart={setStart} setEnd={setEnd} />
      <GroupBySelect groupBy={groupBy} setGroupBy={setGroupBy} />

      <button onClick={handleFetch} style={{ marginBottom: "1rem" }}>
        Get Stats
      </button>

      {loading ? <p>Loading...</p> : <StatsTable data={data} groupBy={groupBy} />}
    </div>
  );
}

export default StatsPage;
