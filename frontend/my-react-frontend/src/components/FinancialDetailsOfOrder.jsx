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
      [name]: value === '' ? '' : parseFloat(value) || 0
    }));
  };

  const handleSubmit = async () => {
    // FRONTEND VALIDATION
    /*   if (
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
    */

    try {
      // PATCH moneyDetails
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`, {
        moneyDetails: form
      });

      // PATCH original shares separately
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/edit-shares`, {
        contractor_Share_Cash: form.contractor_Share_Cash,
        contractor_Share_Bank: form.contractor_Share_Bank,
        customer_Share_Cash: form.customer_Share_Cash,
        customer_Share_Bank: form.customer_Share_Bank
      });

      setMessage('✅ Updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      //setMessage('❌ Failed to update: ' + err.response?.data?.error || err.message);
      window.location.reload();
    }
  };

  const renderField = (label, key, editable = true) => (
    <div style={{ marginBottom: '8px' }}>
      <strong>{label}:</strong>
      {isEditing && editable ? (
        <input
          type="number"
          step="0.01"
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
        {renderField('Proforma', 'timi_Timokatalogou') 
        }
          {renderField('Τιμή Πώλησης', 'timi_Polisis')}
          {renderField('Μετρητά', 'cash')}
          {renderField('Τράπεζα', 'bank')}
          {renderField('Διαφορά', 'profit', false)
          }
          {renderField('ΦΠΑ', 'FPA', false)}
        </div>

        <div className="detail-box">
          <h4>Αρχικά Μερίδια (συμφωνηθέντα)</h4>
          {renderField('Μετρητά Εργολάβου', 'contractor_Share_Cash')}
          {renderField('Τράπεζα Εργολάβου', 'contractor_Share_Bank')}
          {renderField('Μετρητά Πελάτη', 'customer_Share_Cash')}
          {renderField('Τράπεζα Πελάτη', 'customer_Share_Bank')}
        </div>

        <div className="detail-box">
          <h4>Υπολειπόμενα Μερίδια (Βάση πληρωμών)</h4>
          {renderField('Υπόλοιπο Μετρητών Εργολάβου', 'contractor_remainingShare_Cash', false)}
          {renderField('Υπόλοιπο Τράπεζης Εργολάβου', 'contractor_remainingShare_Bank', false)}
          {renderField('Υπόλοιπο Μετρητών Πελάτη', 'customer_remainingShare_Cash', false)}
          {renderField('Υπόλοιπο Τράπεζης Πελάτη', 'customer_remainingShare_Bank', false)}
         
          
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
