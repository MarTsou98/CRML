// components/BackButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        padding: '6px 12px',
        backgroundColor: '#eee',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '1rem'
      }}
    >
      ← Πίσω
    </button>
  );
};

export default BackButton;
