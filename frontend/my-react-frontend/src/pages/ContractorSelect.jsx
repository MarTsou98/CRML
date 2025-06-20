import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractorSelect = ({ value, onChange }) => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/contractors/all');
        setContractors(res.data);
      } catch (err) {
        setError('Failed to load contractors.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractors();
  }, []);

  if (loading) return <p>Loading contractors...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <label htmlFor="contractor">Εργολάβος:</label>
      <select
        id="contractor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- Επιλέξτε εργολάβο --</option>
        {contractors.map((contractor) => (
          <option key={contractor._id} value={contractor._id}>
            {contractor.firstName} {contractor.lastName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ContractorSelect;
