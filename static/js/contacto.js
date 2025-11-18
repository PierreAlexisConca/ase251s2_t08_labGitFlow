// ============================
// Mantener contador del carrito
// ============================
document.addEventListener('DOMContentLoaded', () => {
    const count = localStorage.getItem('cartCount') || 0;
    const countEl = document.getElementById('cart-count');

    if (countEl) {
        countEl.textContent = count;
    }

    // ============================
    // Animación DOM del formulario de contacto
    // ============================
    const form = document.getElementById('contact-form');

    if (form) {
        // Estado inicial invisible
        form.style.opacity = "0";
        form.style.transform = "translateY(25px)";
        form.style.transition = "opacity 0.8s ease, transform 0.8s ease";

        // Entrada animada al cargar
        setTimeout(() => {
            form.style.opacity = "1";
            form.style.transform = "translateY(0)";
        }, 300);
    }
});

// ============================
// Lógica de Modal del Carrito
// ============================
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