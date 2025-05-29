import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerSelect from './CustomerSelect'; // adjust path if needed
import Backbutton from '../components/BackButton'; // adjust path if needed
import ContractorSelect from './ContractorSelect'; // adjust path if needed
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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    <div style={{ padding: '1rem' }}>
      <Backbutton />
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>

        {/* ✅ Dropdown for invoice type */}
        <label>Invoice Type:
          <select name="invoiceType" value={form.invoiceType} onChange={handleChange}>
            <option value="Timologio">Τιμολόγιο</option>
            <option value="Apodiksi">Απόδειξη</option>
          </select>
        </label><br/>

        <CustomerSelect
          value={form.customer_id}
          onChange={(val) => setForm({ ...form, customer_id: val })}
        />
        <ContractorSelect
        value={form.contractor_id}
        onChange={(val) => setForm({ ...form, contractor_id: val })}
          />
        

        <h4>Money Details:</h4>
        <label>Τιμή Τιμοκαταλόγου:
          <input name="timi_Timokatalogou" type="number" value={form.moneyDetails.timi_Timokatalogou} onChange={handleChange} />
        </label><br/>

        <label>Τιμή Πώλησης:
          <input name="timi_Polisis" type="number" value={form.moneyDetails.timi_Polisis} onChange={handleChange} />
        </label><br/>

        <label>Cash:
          <input name="cash" type="number" value={form.moneyDetails.cash} onChange={handleChange} />
        </label><br/>

        <label>Bank:
          <input name="bank" type="number" value={form.moneyDetails.bank} onChange={handleChange} />
        </label><br/>

        <label>Contractor Bank:
          <input name="contractor_bank" type="number" value={form.moneyDetails.contractor_bank} onChange={handleChange} />
        </label><br/>

        <label>Customer Bank:
          <input name="customer_bank" type="number" value={form.moneyDetails.customer_bank} onChange={handleChange} />
        </label><br/>

        <label>Contractor Cash:
          <input name="contractor_cash" type="number" value={form.moneyDetails.contractor_cash} onChange={handleChange} />
        </label><br/>

        <label>Customer Cash:
          <input name="customer_cash" type="number" value={form.moneyDetails.customer_cash} onChange={handleChange} />
        </label><br/>

        <button type="submit">Create Order</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default NewOrder;
