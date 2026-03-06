/**
 * FarmFresh Cart Manager
 * Handles all cart operations with localStorage persistence.
 */

const CART_STORAGE_KEY = 'farmfresh-cart';

/**
 * Retrieve the current cart from localStorage.
 * @returns {Array} The array of cart items.
 */
export function getCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Save the cart array to localStorage.
 * @param {Array} cart - The cart array to persist.
 */
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Add a product to the cart. If it already exists, increment quantity.
 * @param {Object} product - The product to add (must have id, name, price, image).
 * @returns {Array} Updated cart.
 */
export function addToCart(product) {
    const cart = getCart();

    // Support both id (static) and _id (API)
    const pid = product._id || product.id;
    const existingIndex = cart.findIndex(item => item.id === pid);

    // Normalize field names
    const pName = product.name || product.title;
    const pPrice = product.price || product.basePrice;
    const pImage = (product.images && product.images[0]) || product.image;

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: pid,
            name: pName,
            price: pPrice,
            image: pImage,
            unit: product.unit || 'unit',
            quantity: 1
        });
    }

    saveCart(cart);
    return cart;
}

/**
 * Remove a product entirely from the cart.
 * @param {number} productId - The ID of the product to remove.
 * @returns {Array} Updated cart.
 */
export function removeFromCart(productId) {
    const cart = getCart().filter(item => item.id !== productId);
    saveCart(cart);
    return cart;
}

/**
 * Update the quantity of a product in the cart.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The new quantity (removes item if <= 0).
 * @returns {Array} Updated cart.
 */
export function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
    }
    saveCart(cart);
    return cart;
}

/**
 * Get the total number of items in the cart.
 * @returns {number} Total item count.
 */
export function getCartCount() {
    return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Get the total price of all items in the cart.
 * @returns {number} Total cart price.
 */
export function getCartTotal() {
    return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Clear the entire cart.
 * @returns {Array} Empty cart.
 */
export function clearCart() {
    saveCart([]);
    return [];
}
