const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const app = express();
app.use(cors());



const PORT = 5000;

// Middleware
app.use(express.json());

// Mongo connection
mongoose.connect('mongodb://localhost:27017/kitchen_crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/authRoutes'); 
app.use('/api', authRoutes);

const ordersRoutes = require('./routes/orderRoutes');
app.use('/api', ordersRoutes);

const customerRoutes = require('./routes/customerRoutes'); // adjust path as needed

app.use('/api', customerRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
