import { useState } from 'react';
import axios from 'axios';

const FinancialDetailsOfOrder = ({ money, orderId }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isManager = user?.role === 'manager' && user.username === 'Tilemachos';

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(money);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
        moneyDetails: form
      });
      setMessage("✅ Updated successfully");
      setIsEditing(false);
          window.location.reload();  // <--- reload page to refresh data

    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update");
    }
  };

  const renderField = (label, key) => (
    <>
      <strong>{label}:</strong>
      {isEditing ? (
        <input
          type="number"
          name={key}
          value={form[key] ?? ''}
          onChange={handleChange}
        />
      ) : (
        <p>€{money?.[key]}</p>
      )}
    </>
  );

  return (
    <div className="details-section">
      <div className="details-column">
        <h3 className="section-title">Οικονομικές Πληροφορίες</h3>
        <div className="detail-box">
          {renderField('Proforma', 'timi_Timokatalogou')}
          {renderField('Τιμή Πώλησης', 'timi_Polisis')}
          {renderField('Μετρητά', 'cash')}
          {renderField('Τράπεζα', 'bank')}
          {renderField('Διαφορά', 'profit')}
          {renderField('ΦΠΑ', 'FPA')}
        </div>

        <div className="detail-box">
          {renderField('Υπόλοιπο Μετρητών Πελάτη', 'customer_remainingShare_Cash')}
          {renderField('Υπόλοιπο Τράπεζης Πελάτη', 'customer_remainingShare_Bank')}
          {renderField('Υπόλοιπο Μετρητών Εργολάβου', 'contractor_remainingShare_Cash')}
          {renderField('Υπόλοιπο Τράπεζης Εργολάβου', 'contractor_remainingShare_Bank')}
        </div>

        {isManager && (
          <div className="button-row">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            ) : (
              <>
                <button onClick={handleSubmit}>💾 Save</button>
                <button onClick={() => { setIsEditing(false); setForm(money); }}>Cancel</button>
              </>
            )}
            {message && <p style={{ marginTop: '10px' }}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDetailsOfOrder;
