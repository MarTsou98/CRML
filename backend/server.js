const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');
const app = express();
require('dotenv').config();

//app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5000' }));
app.use(cors({  origin: '*' }));
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kitchen_crm';

// Middleware
app.use(express.json());

// Mongo connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const ordersRoutes = require('./routes/orderRoutes');
app.use('/api', ordersRoutes);

const customerRoutes = require('./routes/customerRoutes');
app.use('/api', customerRoutes);

const contractorRoutes = require('./routes/contractorRoutes');
app.use('/api', contractorRoutes);

const salespersonRoutes = require('./routes/salespersonRoutes');
app.use('/api', salespersonRoutes);

const statsRoutes = require('./routes/statsRoutes');
app.use('/api/stats', statsRoutes);

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs available at http://${HOST}:${PORT}/api-docs`);
});
