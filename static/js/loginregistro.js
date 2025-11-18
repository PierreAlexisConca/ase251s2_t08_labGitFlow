// ✅ Cambiar entre formularios de login y registro
function switchForm(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    if (form === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');

        loginTab.classList.add('text-palees-yellow');
        loginTab.classList.remove('text-palees-blue');
        registerTab.classList.add('text-palees-blue');
        registerTab.classList.remove('text-palees-yellow');

    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');

        registerTab.classList.add('text-palees-yellow');
        registerTab.classList.remove('text-palees-blue');
        loginTab.classList.add('text-palees-blue');
        loginTab.classList.remove('text-palees-yellow');
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Mantener el contador del carrito en la navegación
    const count = localStorage.getItem('cartCount') || 0;
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = count;
});
