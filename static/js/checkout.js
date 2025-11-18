// checkout.js
document.addEventListener('DOMContentLoaded', () => {
    const CURRENCY_SYMBOL = window.cart.getCurrencySymbol();
    const TAX_RATE = window.cart.getTaxRate();
    const SHIPPING_COST = 15.00;

    const summaryItemsContainer = document.getElementById('checkout-summary-items');
    const summarySubtotalElement = document.getElementById('summary-subtotal');
    const summaryTaxElement = document.getElementById('summary-tax');
    const summaryShippingElement = document.getElementById('summary-shipping');
    const summaryTotalElement = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');

    const renderSummary = () => {
        const cartItems = window.cart.getItems();
        const subtotal = window.cart.getSubtotal();
        
        // Limpiar contenedor
        summaryItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
            summaryItemsContainer.innerHTML = `
                <p class="text-palees-text-medium">
                    Tu carrito está vacío. 
                    <a href="/coleccion" class="text-palees-blue hover:underline">Ir a la tienda</a>
                </p>
            `;
            if (checkoutForm) checkoutForm.querySelector('button[type="submit"]').disabled = true;
            summarySubtotalElement.textContent = CURRENCY_SYMBOL + '0.00';
            summaryTaxElement.textContent = CURRENCY_SYMBOL + '0.00';
            summaryShippingElement.textContent = CURRENCY_SYMBOL + '0.00';
            summaryTotalElement.textContent = CURRENCY_SYMBOL + '0.00';
            return;
        }

        // Renderizar items
        cartItems.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
            itemEl.innerHTML = `
                <p class="text-palees-text-dark">
                    ${item.name} <span class="text-palees-text-light">x${item.quantity}</span>
                </p>
                <span class="font-semibold text-palees-blue">
                    ${CURRENCY_SYMBOL}${(item.price * item.quantity).toFixed(2)}
                </span>
            `;
            summaryItemsContainer.appendChild(itemEl);
        });

        // Calcular totales
        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax + SHIPPING_COST;

        summarySubtotalElement.textContent = CURRENCY_SYMBOL + subtotal.toFixed(2);
        summaryTaxElement.textContent = CURRENCY_SYMBOL + tax.toFixed(2);
        summaryShippingElement.textContent = CURRENCY_SYMBOL + SHIPPING_COST.toFixed(2);
        summaryTotalElement.textContent = CURRENCY_SYMBOL + total.toFixed(2);

        if (checkoutForm) checkoutForm.querySelector('button[type="submit"]').disabled = false;
    };

    renderSummary();

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cartItems = window.cart.getItems();
            if (cartItems.length === 0) {
                alert('Tu carrito está vacío.');
                return;
            }

            const subtotal = window.cart.getSubtotal();
            const tax = subtotal * TAX_RATE;
            const total = subtotal + tax + SHIPPING_COST;
            const orderId = 'PALEES-' + Math.floor(Math.random() * 1000000);

            localStorage.setItem('lastOrderId', orderId);
            localStorage.setItem('lastOrderTotal', total.toFixed(2));

            window.cart.clearCart();
            window.location.href = `/gracias?order=${orderId}`;
        });
    }
});
