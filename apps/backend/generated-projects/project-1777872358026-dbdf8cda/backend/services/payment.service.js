const stripe = require('stripe')('mock-stripe-key');

class PaymentService {
  async createPayment(amount, currency = 'usd') {
    console.log(`Creating payment: ${amount} ${currency}`);
    return {
      id: 'mock_payment_' + Date.now(),
      amount,
      currency,
      status: 'succeeded'
    };
  }

  async refundPayment(paymentId) {
    console.log(`Refunding payment: ${paymentId}`);
    return {
      id: paymentId,
      status: 'refunded'
    };
  }
}

module.exports = new PaymentService();
