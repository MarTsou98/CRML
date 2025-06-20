import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerSelect from './CustomerSelect'; // adjust path if needed
import Backbutton from '../components/BackButton'; // adjust path if needed
import ContractorSelect from './ContractorSelect'; // adjust path if needed
import './css/NewOrder.css'; // adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewOrder = () => {
  const [form, setForm] = useState({
    invoiceType: '',
    customer_id: '',
    salesperson_id: '', // will auto-fill from storage
    contractor_id: '',
    orderedFromCompany: '', // <-- ADD THIS
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
      damages: [{ amount: '', notes: '' }]
    }
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Example: Fetch from localStorage
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Adjust based on your context or storage method
    const savedSalespersonId = user.salesperson_id || null; // Adjust based on your context or storage method
    if(user.role === 'manager') {
      setForm(prev => ({ ...prev, salesperson_id: null })); // Managers can select any salesperson
    }
    if (savedSalespersonId) {
      setForm(prev => ({ ...prev, salesperson_id: savedSalespersonId }));
    } 
    // Set default invoice type
    setForm(prev => ({ ...prev, invoiceType: 'Timologio' }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.moneyDetails) {
      setForm({
        ...form,
        moneyDetails: {
          ...form.moneyDetails,
          [name]: value
        }
      });
    } else if (name === 'damageAmount' || name === 'damageNotes') {
      setForm({
        ...form,
        moneyDetails: {
          ...form.moneyDetails,
          damages: [{
            ...form.moneyDetails.damages[0],
            [name === 'damageAmount' ? 'amount' : 'notes']: value
          }]
        }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

const [errors, setErrors] = useState({});
const validateForm = () => {
  const { timi_Timokatalogou, timi_Polisis ,cash} = form.moneyDetails;
  const newErrors = {};

  if (Number(timi_Timokatalogou) >= Number(timi_Polisis)) {
    newErrors.timi_Polisis = 'Η τιμή πώλησης πρέπει να είναι μεγαλύτερη από την τιμή τιμοκαταλόγου.';
  }
  if(Number(cash) == 0){
    newErrors.cash = 'Το ποσό μετρητών δεν μπορεί να είναι μηδέν.';
  }

  // Add more validation rules and set errors similarly

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    toast.error(
      Object.values(newErrors).join('\n'),
      { position: "top-right", autoClose:10000 }
    );
    return false;
  }

  return true;
};



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

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
        }
      };

      await axios.post('http://localhost:5000/api/orders/newOrder', payload);
      
      setMessage('Order successfully created!');
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

        <div className="new-order-form-group">
          <label htmlFor="invoiceType" className="new-order-label">Τύπος Παραστατικού</label>
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

        <div className="new-order-form-group">
          <CustomerSelect
            value={form.customer_id}
            onChange={(val) => setForm({ ...form, customer_id: val })}
          />
        </div>

        <div className="new-order-form-group">
          <ContractorSelect
            value={form.contractor_id}
            onChange={(val) => setForm({ ...form, contractor_id: val })}
          />
        </div>

        <div className="new-order-form-group">
          <label htmlFor="orderedFromCompany" className="new-order-label">Εταιρεία που παραγγέλθηκε</label>
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

        <h4 className="new-order-heading">Χρηματοοικονομικά Στοιχεία:</h4>

        {[
          ['Τιμή Τιμοκαταλόγου', 'timi_Timokatalogou'],
          ['Τιμή Πώλησης', 'timi_Polisis'],
          ['Μετρητά', 'cash'],
          ['Τράπεζα', 'bank'],
          ['Τράπεζα Εργολάβου', 'contractor_bank'],
          ['Τράπεζα Πελάτη', 'customer_bank'],
          ['Μετρητά Εργολάβου', 'contractor_cash'],
          ['Μετρητά Πελάτη', 'customer_cash'],
        ].map(([labelText, field]) => (
          <div className="new-order-form-group" key={field}>
            <label htmlFor={field} className="new-order-label">{labelText}</label>
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

        <div className="new-order-form-group">
          <label htmlFor="orderNotes" className="new-order-label">Σημειώσεις Παραγγελίας</label>
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

        <button type="submit" className="new-order-button">Δημιουργία Παραγγελίας</button>
      </form>

      {message && (
        <p className={`new-order-message${message.includes('Failed') ? ' error' : ''}`}>
          {message}
        </p>
      )}
    </div>
  </div>
);
};

export default NewOrder;
