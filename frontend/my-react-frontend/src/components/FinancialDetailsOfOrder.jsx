import { useState, useEffect } from 'react';
import axios from 'axios';

const FinancialDetailsOfOrder = ({ money, orderId }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(money || {});
  const [message, setMessage] = useState(null);

  // Keep form updated if money prop changes
  useEffect(() => {
    setForm(money || {});
  }, [money]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
  };

  const handleSubmit = async () => {
    // FRONTEND VALIDATION
    if (
      typeof form.timi_Timokatalogou === 'number' &&
      typeof form.timi_Polisis === 'number' &&
      form.timi_Timokatalogou >= form.timi_Polisis
    ) {
      setMessage('❌ Η τιμή Proforma πρέπει να είναι μικρότερη από την τιμή πώλησης');
      return;
    }

    if (typeof form.profit === 'number' && form.profit < 0) {
      setMessage('❌ Το κέρδος δεν μπορεί να είναι αρνητικό');
      return;
    }

    try {
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
        moneyDetails: form
      });
      setMessage('✅ Updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage(
        '❌ Failed to update! Βεβαιωθείτε ότι η τιμή Proforma είναι μικρότερη από την τιμή πώλησης'
      );
    }
  };

  const renderField = (label, key) => (
    <div style={{ marginBottom: '8px' }}>
      <strong>{label}:</strong>
      {isEditing ? (
        <input
          type="number"
          name={key}
          value={form[key] ?? ''}
          onChange={handleChange}
          style={{ marginLeft: '5px' }}
        />
      ) : (
        <span style={{ marginLeft: '5px' }}>
          €{typeof form[key] === 'number' ? form[key].toFixed(2) : form[key] ?? '0.00'}
        </span>
      )}
    </div>
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

        <div className="button-row" style={{ marginTop: '10px' }}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>✏️ Επεξεργασία</button>
          ) : (
            <>
              <button onClick={handleSubmit}>💾 Αποθήκευση</button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm(money || {});
                  setMessage(null);
                }}
              >
                Ακύρωση
              </button>
            </>
          )}
          {message && <p style={{ marginTop: '10px', color: message.startsWith('❌') ? 'red' : 'green' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default FinancialDetailsOfOrder;
