const express = require('express');
const router = express.Router();
const paymentService = require('../services/payment.service');

router.post('/create', async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const payment = await paymentService.createPayment(amount, currency);
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/refund', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const result = await paymentService.refundPayment(paymentId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
