// src/pages/ProfitBySalespersonPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitList from '../components/ProfitList';

const ProfitBySalespersonPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/profit-by-salesperson')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load profit by salesperson'));
  }, []);

  return error ? <p>{error}</p> : <ProfitList title="Profit by Salesperson" data={data} />;
};

export default ProfitBySalespersonPage;
