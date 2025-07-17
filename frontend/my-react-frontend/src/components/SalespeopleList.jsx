// src/components/SalespeopleList.jsx
import React, { useEffect, useState } from 'react';
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
function SalespeopleList() {
  const [salespeople, setSalespeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/salespeople/all`)
      .then((res) => res.json())
      .then((data) => {
        setSalespeople(data);
      })
      .catch((err) => {
        console.error("Error fetching salespeople:", err);
        setError("Could not load salespeople");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Πωλητές</h2>
      <ul>
        {salespeople.map(person => (
          <li key={person._id}>
            {person.firstName} {person.lastName} ({person.orders.length} παραγγελίες)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalespeopleList;
