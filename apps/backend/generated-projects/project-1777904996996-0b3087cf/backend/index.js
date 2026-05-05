const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes.js');
app.use('/api/auth', authRoutes);

app.listen(3001, () => {
  console.log('Backend running on port 3001');
});
