//contacto.js
// Lógica dummy para el carrito (mantener el contador en la navegación)
document.addEventListener('DOMContentLoaded', () => {
    const count = localStorage.getItem('cartCount') || 0;
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        countEl.textContent = count;
    }
});

// Lógica de Modal del Carrito (requiere estilos en cart.css)
const cartButton = document.getElementById('cart-button');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartModal = document.getElementById('cart-modal');

if (cartButton && closeCartBtn && cartModal) {
    cartButton.addEventListener('click', () => {
        cartModal.classList.add('open');
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('open');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
        }
    });
}
