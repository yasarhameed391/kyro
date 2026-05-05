const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');

app.use('/api/payments', require('./routes/payment.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

app.get('/', (req, res) => {
  res.json({ message: 'Generated backend API' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
