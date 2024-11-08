class Cart {
  cartItems;
  #localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    const cartData = localStorage.getItem(this.#localStorageKey);
    
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
    } else {
      this.cartItems = []; 
    }
  }

  saveToStorage() {
    localStorage.setItem(this.#localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, quantity) {
    let matchingItem;
    
      this.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
        if (matchingItem) {
          matchingItem.quantity += quantity;
  
        } else {
          this.cartItems.push({
            productId,
            quantity,
            deliveryOptionId: '1'
          });
    }
    this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = [];
  
    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem)
      }
    });
  
    this.cartItems = newCart;
    
    this.saveToStorage();
  }

  resetCart() {
    try {
      this.cartItems = [];
      localStorage.removeItem(this.#localStorageKey);
      return true;
    } catch (error) {
      console.error('Failed to reset cart:', error);
      return false;
    }
  }

 updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if(!matchingItem) {
      return;
    }
  
    matchingItem.deliveryOptionId = deliveryOptionId;
  
    this.saveToStorage();
  }

  calculateCartQuanity() {
    let cartQuantity = 0;
  
    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
  }

  updateQuantity(productId, newQuantity) {
    let matchingItem;
  
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.quantity = newQuantity;
  
    this.saveToStorage();
  }
}


export const cart = new Cart('cart-oop');





