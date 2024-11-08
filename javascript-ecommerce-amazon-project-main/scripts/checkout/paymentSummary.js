// import {calculateCartQuanity, cart} from '../../data/cart.js';
import {cart} from '../../data/cart-oop.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';
import {addOrder} from '../../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0

 cart.cartItems.forEach((cartItem) => {
  const product = getProduct(cartItem.productId);
  productPriceCents += product.priceCents * cartItem.quantity;

  const deliveryOption =  getDeliveryOption(cartItem.deliveryOptionId);
  shippingPriceCents += deliveryOption.priceCents;

 });

 const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
 const taxCents = totalBeforeTaxCents * 0.1;
 const totalCents = totalBeforeTaxCents + taxCents;

 let cartQuantity = 0;

 cart.cartItems.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
 });

 // const cartQuantity = calculateCartQuanity();

 const paymentSummaryHTML = 
  `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(totalCents)}</div>
    </div>

    <button class="place-order-button button-primary
      js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try {
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart
          })
        });

        const order = await response.json();

        const orderTime = dayjs(order.orderTime);

        order.products = order.products.map(product => {
          const cartItem = cart.cartItems.find(item => item.productId === product.productId);

          if (cartItem) {
            const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

            let remainingDays = deliveryOption.deliveryDays;
            let deliveryDate = orderTime;

            while (remainingDays > 0) {
              deliveryDate = deliveryDate.add(1, 'day');
              // Skip weekends
              if (deliveryDate.day() !== 0 && deliveryDate.day() !== 6) {
                remainingDays--;
              }
            }

            return {
              ...product,
              estimatedDeliveryTime: deliveryDate.format()
            };

          }

          return product;

        });
 
        addOrder(order);

        if (cart.resetCart()) {
          window.location.href = 'orders.html'
        } else {
          console.error('Failed to reset cart');
        }

      } catch (error) {
        console.log('Unexpected error. Please try again later.')
      }
    });
}