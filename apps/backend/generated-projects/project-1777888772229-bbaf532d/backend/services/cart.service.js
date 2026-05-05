class CartService {
  constructor() {
    this.cart = [];
  }

  addItem(productId, quantity = 1) {
    const item = this.cart.find(i => i.productId === productId);
    if (item) {
      item.quantity += quantity;
    } else {
      this.cart.push({ productId, quantity });
    }
    return this.cart;
  }

  removeItem(productId) {
    this.cart = this.cart.filter(i => i.productId !== productId);
    return this.cart;
  }

  getCart() {
    return this.cart;
  }

  clearCart() {
    this.cart = [];
    return this.cart;
  }
}

module.exports = new CartService();
