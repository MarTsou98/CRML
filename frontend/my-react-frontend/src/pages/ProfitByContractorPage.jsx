// src/pages/ProfitByContractorPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfitList from '../components/ProfitList';

const ProfitByContractorPage = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/stats/profit-by-contractor')
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load profit by contractor'));
  }, []);

  return error ? <p>{error}</p> : <ProfitList title="Profit by Contractor" data={data} />;
};

export default ProfitByContractorPage;
