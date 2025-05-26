// src/components/SalespeopleList.jsx
import React, { useEffect, useState } from 'react';

function SalespeopleList() {
  const [salespeople, setSalespeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/salespeople/all")
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
      <h2>Salespeople</h2>
      <ul>
        {salespeople.map(person => (
          <li key={person._id}>
            {person.firstName} {person.lastName} ({person.orders.length} orders)
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalespeopleList;
