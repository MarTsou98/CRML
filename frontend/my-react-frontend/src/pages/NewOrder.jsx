import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerSelect from './CustomerSelect';
import Backbutton from '../components/BackButton';
import ContractorSelect from './ContractorSelect';
import './css/NewOrder.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const NewOrder = () => {
  const navigate = useNavigate();

  const { customerId } = useParams();

  const [form, setForm] = useState({
    invoiceType: '',
    customer_id: '',
    salesperson_id: '',
    contractor_id: '',
    orderedFromCompany: '',
    orderNotes: '',
    moneyDetails: {
      timi_Timokatalogou: '',
      timi_Polisis: '',
      cash: '',
      bank: '',
      contractor_bank: '',
      customer_bank: '',
      contractor_cash: '',
      customer_cash: '',
      payments: [],
      //damages: [{ amount: '', notes: '' }],
    },
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')) ?? {};
    const savedSalespersonId = user?.salesperson_id ?? null;

    setForm((prev) => ({
      ...prev,
      salesperson_id: user.role === 'manager' ? null : savedSalespersonId,
      invoiceType: 'Timologio',
      customer_id: customerId || prev.customer_id,
    }));
  }, [customerId]);

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.moneyDetails) {
      setForm({
        ...form,
        moneyDetails: {
          ...form.moneyDetails,
          [name]: value,
        },
      });
    } else if (name === 'damageAmount' || name === 'damageNotes') {
      setForm({
        ...form,
        moneyDetails: {
          ...form.moneyDetails,
          damages: [
            {
              ...form.moneyDetails.damages[0],
              [name === 'damageAmount' ? 'amount' : 'notes']: value,
            },
          ],
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateForm = () => {
    const { timi_Timokatalogou, timi_Polisis, cash } = form.moneyDetails;
    const newErrors = {};

    if (Number(timi_Timokatalogou) >= Number(timi_Polisis)) {
      newErrors.timi_Polisis =
        'Η τιμή πώλησης πρέπει να είναι μεγαλύτερη από την τιμή τιμοκαταλόγου.';
    }
    if (Number(cash) === 0) {
      newErrors.cash = 'Το ποσό μετρητών δεν μπορεί να είναι μηδέν.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error(Object.values(newErrors).join('\n'), {
        position: 'top-right',
        autoClose: 10000,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        ...form,
        moneyDetails: {
          ...form.moneyDetails,
          timi_Timokatalogou: Number(form.moneyDetails.timi_Timokatalogou),
          timi_Polisis: Number(form.moneyDetails.timi_Polisis),
          cash: Number(form.moneyDetails.cash),
          bank: Number(form.moneyDetails.bank),
          contractor_Share_Bank: Number(form.moneyDetails.contractor_bank),
          customer_Share_Bank: Number(form.moneyDetails.customer_bank),
          contractor_Share_Cash: Number(form.moneyDetails.contractor_cash),
          customer_Share_Cash: Number(form.moneyDetails.customer_cash),
        },
      };

      await axios.post(`${BASE_URL}/api/orders/newOrder`, payload);
      setMessage('Order successfully created!');
     navigate('/Orders', { state: { successMessage: 'Order created successfully!' } });
    } catch (err) {
      console.error(err);
      setMessage('Failed to create order.');
    }
  };

  return (
    <div className="new-order-wrapper">
      <Backbutton />
      <div className="new-order-content">
        <h2 className="new-order-heading">Δημιουργία Παραγγελίας</h2>
        <form onSubmit={handleSubmit} className="new-order-form">
          {/* Invoice Type */}
          <div className="new-order-form-group">
            <label htmlFor="invoiceType" className="new-order-label">
              Τύπος Παραστατικού
            </label>
            <select
              name="invoiceType"
              id="invoiceType"
              value={form.invoiceType}
              onChange={handleChange}
              className="new-order-input"
            >
              <option value="Timologio">Τιμολόγιο</option>
              <option value="Apodiksi">Απόδειξη</option>
            </select>
          </div>

          {/* Customer Select */}
          <div className="new-order-form-group">
            <CustomerSelect
              value={form.customer_id}
              onChange={(val) => setForm({ ...form, customer_id: val })}
            />
          </div>

          {/* Contractor Select */}
          <div className="new-order-form-group">
            <ContractorSelect
              value={form.contractor_id}
              onChange={(val) => setForm({ ...form, contractor_id: val })}
            />
          </div>

          {/* Ordered From Company */}
          <div className="new-order-form-group">
            <label htmlFor="orderedFromCompany" className="new-order-label">
              Εταιρεία που παραγγέλθηκε
            </label>
            <select
              name="orderedFromCompany"
              value={form.orderedFromCompany}
              onChange={handleChange}
              required
              className="new-order-input"
            >
              <option value="">-- Επιλέξτε Εταιρεία --</option>
              <option value="Lube">Lube</option>
              <option value="Decopan">Decopan</option>
              <option value="Sovet">Sovet</option>
              <option value="Doors">Doors</option>
              <option value="Appliances">Appliances</option>
              <option value="CounterTop">CounterTop</option>
            </select>
          </div>

          {/* Financial Details */}
          <h4 className="new-order-heading">Χρηματοοικονομικά Στοιχεία:</h4>
          {[
            ['Proforma', 'timi_Timokatalogou'],
            ['Τιμή Πώλησης', 'timi_Polisis'],
            ['Μετρητά', 'cash'],
            ['Τράπεζα', 'bank'],
            ['Τράπεζα Εργολάβου', 'contractor_bank'],
            ['Τράπεζα Πελάτη', 'customer_bank'],
            ['Μετρητά Εργολάβου', 'contractor_cash'],
            ['Μετρητά Πελάτη', 'customer_cash'],
          ].map(([labelText, field]) => (
            <div className="new-order-form-group" key={field}>
              <label htmlFor={field} className="new-order-label">
                {labelText}
              </label>
              <input
                type="number"
                name={field}
                id={field}
                value={form.moneyDetails[field]}
                onChange={handleChange}
                className="new-order-input"
              />
              {errors[field] && (
                <span className="new-order-error-message">{errors[field]}</span>
              )}
            </div>
          ))}

          {/* Order Notes */}
          <div className="new-order-form-group">
            <label htmlFor="orderNotes" className="new-order-label">
              Σημειώσεις Παραγγελίας
            </label>
            <textarea
              id="orderNotes"
              name="orderNotes"
              value={form.orderNotes}
              onChange={handleChange}
              rows={4}
              className="new-order-input"
              placeholder="Εισάγετε σημειώσεις για την παραγγελία..."
            />
          </div>

          <button type="submit" className="new-order-button">
            Δημιουργία Παραγγελίας
          </button>
        </form>

        {message && (
          <p className={`new-order-message${message.includes('Failed') ? ' error' : ''}`}>
            {message}
          </p>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default NewOrder;
