// src/components/Stats/ProfitList.jsx
import React from 'react';

const ProfitList = ({ title, data }) => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>{title}</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Όνομα</th>
            <th style={thStyle}>Αριθμός Παραγγελιών</th>
            <th style={thStyle}>Συνολικά Έσοδα</th>
            <th style={thStyle}>Συνολική Διαφορά</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.salespersonId || item.contractorId}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>{item.orderCount}</td>
              <td style={tdStyle}>${item.totalRevenue.toLocaleString()}</td>
              <td style={tdStyle}>${item.totalProfit.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  borderBottom: '2px solid #ccc',
  padding: '0.75rem',
  textAlign: 'left',
};

const tdStyle = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem',
};

export default ProfitList;
