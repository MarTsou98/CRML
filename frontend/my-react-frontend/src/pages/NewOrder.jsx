import React, { useState } from 'react';
import axios from 'axios';
import CustomerSelect from './CustomerSelect'; // adjust path if needed
const NewOrder = () => {
  const [form, setForm] = useState({
    invoiceType: 'Timologio',
    customer_id: '',
    salesperson_id: '',
    contractor_id: '',
    moneyDetails: {
      timi_Timokatalogou: '',
      timi_Polisis: '',
      cash: '',
      bank: '',
      payments: [],
      damages: [{ amount: '', notes: '' }]
    }
  });

  const [message, setMessage] = useState('');

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
          damages: form.moneyDetails.damages.map((d) => ({
            amount: Number(d.amount),
            notes: d.notes
          }))
        }
      };

      const res = await axios.post('http://localhost:5000/api/orders/newOrder', payload);
      setMessage('Order successfully created!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to create order.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <label>Invoice Type:
          <input name="invoiceType" value={form.invoiceType} onChange={handleChange} />
        </label><br/>

        <CustomerSelect
  value={form.customer_id}
  onChange={(val) => setForm({ ...form, customer_id: val })}
/>

        <label>Salesperson ID:
          <input name="salesperson_id" value={form.salesperson_id} onChange={handleChange} />
        </label><br/>

        <label>Contractor ID:
          <input name="contractor_id" value={form.contractor_id} onChange={handleChange} />
        </label><br/>

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

        <h4>Damage:</h4>
        <label>Amount:
          <input name="damageAmount" type="number" value={form.moneyDetails.damages[0].amount} onChange={handleChange} />
        </label><br/>
        <label>Notes:
          <input name="damageNotes" value={form.moneyDetails.damages[0].notes} onChange={handleChange} />
        </label><br/>

        <button type="submit">Create Order</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default NewOrder;
