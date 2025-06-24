const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');
const app = express();


app.use(cors({ origin: "http://localhost:5173" }));


const PORT = 5000;

// Middleware
app.use(express.json());

// Mongo connection
mongoose.connect('mongodb://localhost:27017/kitchen_crm', {
  
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes
const authRoutes = require('./routes/authRoutes'); 
app.use('/api', authRoutes);

const ordersRoutes = require('./routes/orderRoutes');
app.use('/api', ordersRoutes);

const customerRoutes = require('./routes/customerRoutes'); // adjust path as needed

app.use('/api', customerRoutes);
const contractorRoutes = require('./routes/contractorRoutes');
app.use('/api', contractorRoutes);
const salespersonRoutes = require('./routes/salespersonRoutes');
app.use('/api', salespersonRoutes);
const statsRoutes = require('./routes/statsRoutes');
app.use('/api/stats', statsRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  console.log('Swagger docs available at http://localhost:5000/api-docs');
