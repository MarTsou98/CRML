import { useState, useEffect } from 'react';
import axios from 'axios';
import ContractorSelect from '../pages/ContractorSelect';
const GeneralDetailsOfOrder = ({
  invoiceType,
  Lock,
  createdAt,
  salesperson,
  customer,
  contractor,
  orderNotes,
  typeOfOrder,
  orderId,
  DateOfOrder,
  orderedFromCompany
}) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const allowedOrderTypes = ['Κανονική', 'Σύνθεση Ερμαρίων'];

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    invoiceType,
    Lock,
    orderNotes,
    typeOfOrder,
    orderedFromCompany,
    DateOfOrder: DateOfOrder
      ? new Date(DateOfOrder).toISOString().split('T')[0]
      : ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const safeInvoiceType = form.invoiceType === 'Apodiksi' ? 'Apodiksi' : 'Timologio';
      const safeOrderType = allowedOrderTypes.includes(form.typeOfOrder) ? form.typeOfOrder : 'Κανονική';

      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/general-info`, {
        invoiceType: safeInvoiceType,
        Lock: form.Lock,
        orderNotes: form.orderNotes,
        orderType: safeOrderType,
        DateOfOrder: form.DateOfOrder,
        orderedFromCompany: form.orderedFromCompany
      });

      setMessage('✅ Updated successfully');
      setIsEditing(false);

      // Keep form in sync
      setForm((prev) => ({
        ...prev,
        invoiceType: safeInvoiceType,
        typeOfOrder: safeOrderType
      }));
      window.location.reload(); // refresh order details
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setForm({
      invoiceType,
      Lock,
      orderNotes,
      typeOfOrder,
      orderedFromCompany,
      DateOfOrder: DateOfOrder ? new Date(DateOfOrder).toISOString().split('T')[0] : ''
    });
    setMessage(null);
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
            <input type="checkbox" name="Lock" checked={form.Lock} onChange={handleChange} disabled={loading} />
          ) : (
            <p>{Lock ? 'Yes' : 'No'}</p>
          )}

          <strong>Ημερομηνία Παραγγελίας:</strong>
          {isEditing ? (
            <input type="date" name="DateOfOrder" value={form.DateOfOrder} onChange={handleChange} disabled={loading} />
          ) : (
            <p>
              {DateOfOrder
                ? new Date(DateOfOrder).toLocaleDateString('el-GR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                : '----'}
            </p>
          )}

          <strong>Σημείωση Παραγγελίας:</strong>
          {isEditing ? (
            <textarea name="orderNotes" value={form.orderNotes} onChange={handleChange} rows={3} style={{ width: '100%' }} disabled={loading} />
          ) : (
            <p>{orderNotes}</p>
          )}

          <strong>Εταιρεία:</strong>
          {isEditing ? (
            <select name="orderedFromCompany" value={form.orderedFromCompany} onChange={handleChange} disabled={loading}>
              <option value="">-- Επιλέξτε Εταιρεία --</option>
              <option value="Lube">Lube</option>
              <option value="Decopan">Decopan</option>
              <option value="Sovet">Sovet</option>
              <option value="Doors">Doors</option>
              <option value="Appliances">Appliances</option>
              <option value="CounterTop">CounterTop</option>
            </select>
          ) : (
            <p>{orderedFromCompany}</p>
          )}
        </div>

        <div className="button-row">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} disabled={loading}>✏️ Επεξεργασία</button>
          ) : (
            <>
              <button onClick={handleSubmit} disabled={loading}>💾 Αποθήκευση</button>
              <button onClick={resetForm} disabled={loading}>Ακύρωση</button>
            </>
          )}
          {message && <p style={{ marginTop: '10px' }}>{message}</p>}
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
          <p><strong>Σημείωση από καρτέλα Πελάτη:</strong> {customer?.CustomerNotes}</p>
        </div>

      <div className="detail-box">
  <strong>Εργολάβος:</strong>
  {isEditing ? (
    <ContractorSelect
      value={form.contractorId || ""}
      onChange={(newId) =>
        setForm((prev) => ({ ...prev, contractorId: newId }))
      }
    />
  ) : (
    <>
      <p>{contractor?.EnterpriseName}</p>
      <p>
        <strong>Σημείωση από καρτέλα Εργολάβου:</strong>{" "}
        {contractor?.ContractorNotes}
      </p>
    </>
  )}
</div>
  <div className="button-row">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} disabled={loading}>✏️ Επεξεργασία</button>
          ) : (
            <>
              <button onClick={handleSubmit} disabled={loading}>💾 Αποθήκευση</button>
              <button onClick={resetForm} disabled={loading}>Ακύρωση</button>
            </>
          )}
          {message && <p style={{ marginTop: '10px' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default GeneralDetailsOfOrder;
