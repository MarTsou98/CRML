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
    const savedSalespersonId = user.salesperson_id || ''; // Adjust based on your context or storage method
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
    <div> <Backbutton />
      <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
       
        <h2>Create New Order</h2>
        <form onSubmit={handleSubmit}>

         <div className="nice-form-group">
    <label htmlFor="invoiceType">Invoice Type:</label>
 
    <div className="nice-form-group">
  <label htmlFor="invoiceType">Τύπος Παραστατικού</label>
  <select
    name="invoiceType"
    id="invoiceType"
    value={form.invoiceType}
    onChange={handleChange}
  >
    <option value="Timologio">Τιμολόγιο</option>
    <option value="Apodiksi">Απόδειξη</option>
  </select>
</div>

  </div>

  <div className="nice-form-group">
    <CustomerSelect
      value={form.customer_id}
      onChange={(val) => setForm({ ...form, customer_id: val })}
    />
  </div>

  <div className="nice-form-group">
    <ContractorSelect
      value={form.contractor_id}
      onChange={(val) => setForm({ ...form, contractor_id: val })}
    />
  </div>
  <h4>Money Details:</h4>

{[
  ['Τιμή Τιμοκαταλόγου', 'timi_Timokatalogou'],
  ['Τιμή Πώλησης', 'timi_Polisis'],
  ['Cash', 'cash'],
  ['Bank', 'bank'],
  ['Contractor Bank', 'contractor_bank'],
  ['Customer Bank', 'customer_bank'],
  ['Contractor Cash', 'contractor_cash'],
  ['Customer Cash', 'customer_cash'],
].map(([labelText, field]) => (
  <div className="nice-form-group" key={field}>
    <label htmlFor={field}>{labelText}</label>
    <input
      type="number"
      name={field}
      id={field}
      value={form.moneyDetails[field]}
      onChange={handleChange}
    />
    {errors[field] && (
      <span className="error-message">{errors[field]}</span>
    )}
  </div>
))}


<button type="submit">Create Order</button>
      </form>

      {message && <p>{message}</p>}
      
    </div>
    </div>
  );
};

export default NewOrder;
