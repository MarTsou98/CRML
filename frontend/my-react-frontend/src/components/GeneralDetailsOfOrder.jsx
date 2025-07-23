import { useState, useEffect } from 'react';
import axios from 'axios';

const GeneralDetailsOfOrder = ({
  invoiceType,
  Lock,
  createdAt,
  salesperson,
  customer,
  contractor,
  orderNotes,
  typeOfOrder,
  orderId
}) => {
  const user = JSON.parse(localStorage.getItem('user'));
 // const isManager = user?.role === 'manager' && user.username === 'Tilemachos';

  const allowedOrderTypes = ['Κανονική', 'Σύνθεση Ερμαρίων'];

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    invoiceType,  // expects "Timologio" or "Apodiksi"
    Lock,
    orderNotes,
    typeOfOrder
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate invoiceType and orderType on submit
      const invoiceTypeEnum = form.invoiceType === 'Apodiksi' ? 'Apodiksi' : 'Timologio';
      const safeOrderType = allowedOrderTypes.includes(form.typeOfOrder) ? form.typeOfOrder : 'Κανονική';

      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/general-info`, {
        invoiceType: invoiceTypeEnum,
        Lock: form.Lock,
        orderNotes: form.orderNotes,
        orderType: safeOrderType,
      });

      setMessage("✅ Updated successfully");
      setIsEditing(false);

      // Update form state with sanitized values to keep in sync with backend
      setForm(prev => ({
        ...prev,
        invoiceType: invoiceTypeEnum,
        typeOfOrder: safeOrderType
      }));
  window.location.reload();  // Refresh to get updated data
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="details-section">
      <div className="details-column">
        <h3 className="section-title">Γενικές Πληροφορίες</h3>
        <div className="detail-box">
          <strong>Παραστατικό:</strong>
          {isEditing ? (
            <select name="invoiceType" value={form.invoiceType} onChange={handleChange} disabled={loading}>
              <option value="Timologio">Τιμολόγιο</option>
              <option value="Apodiksi">Απόδειξη</option>
            </select>
          ) : (
            <p>{invoiceType === 'Timologio' ? 'Τιμολόγιο' : 'Απόδειξη'}</p>
          )}

          <strong>Τύπος Παραγγελίας:</strong>
          {isEditing ? (
            <select name="typeOfOrder" value={form.typeOfOrder} onChange={handleChange} disabled={loading}>
              <option value="Κανονική">Κανονική</option>
              <option value="Σύνθεση Ερμαρίων">Σύνθεση Ερμαρίων</option>
            </select>
          ) : (
            <p>{typeOfOrder}</p>
          )}

          <strong>Locked:</strong>
          {isEditing ? (
            <input
              type="checkbox"
              name="Lock"
              checked={form.Lock}
              onChange={handleChange}
              disabled={loading}
            />
          ) : (
            <p>{Lock ? 'Yes' : 'No'}</p>
          )}

          <strong>Ημερομηνία:</strong>
          <p>{new Date(createdAt).toLocaleDateString()}</p>

          <strong>Σημείωση Παραγγελίας:</strong>
          {isEditing ? (
            <textarea
              name="orderNotes"
              value={form.orderNotes}
              onChange={handleChange}
              rows={3}
              style={{ width: '100%' }}
              disabled={loading}
            />
          ) : (
            <p>{orderNotes}</p>
          )}
        </div>

        <div className="detail-box">
          <strong>Πωλητής:</strong>
          <p>{salesperson?.firstName} {salesperson?.lastName}</p>
        </div>

        <div className="detail-box">
          <strong>Πελάτης:</strong>
          <p>{customer?.firstName} {customer?.lastName}</p>
          <p>{customer?.email}</p>
          <p>{customer?.phone}</p>
          <p>{customer?.address}</p>
          <p><strong>Σημείωση:</strong> {customer?.CustomerNotes}</p>
        </div>

        <div className="detail-box">
          <strong>Εργολάβος:</strong>
          <p>{contractor?.firstName} {contractor?.lastName}</p>
        </div>

        {/* {isManager && ( */}
          <div className="button-row">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} disabled={loading}>✏️ Επεξεργασία</button>
            ) : (
              <>
                <button onClick={handleSubmit} disabled={loading}>💾 Αποθήκευση</button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setForm({
                      invoiceType,
                      Lock,
                      orderNotes,
                      typeOfOrder
                    });
                    setMessage(null);
                  }}
                  disabled={loading}
                >
                  Ακύρωση
                </button>
              </>
            )}
            {message && <p style={{ marginTop: '10px' }}>{message}</p>}
          </div>
        {/* )} */}
      </div>
    </div>
  );
};

export default GeneralDetailsOfOrder;
