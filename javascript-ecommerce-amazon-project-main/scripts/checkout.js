import {renderOrderSummary} from   './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import {loadCartFetch } from '../data/cart.js';
import {loadProducts, loadProductsFetch} from '../data/products.js';
import '../data/cart-oop.js';

async function loadPage() {
  try {
    await Promise.all([
      loadProductsFetch(),
      loadCartFetch()
    ])

  } catch(error) {
    console.log('Unexpected error. Please try again later.');
  }
  renderOrderSummary();
  renderPaymentSummary();
  renderCheckoutHeader();
}

loadPage();
