// ✅ Cambiar entre formularios de login y registro
function switchForm(form) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    // Aplicar animación DOM
    [loginForm, registerForm].forEach(f => {
        f.classList.add('form-animate');
        f.classList.remove('show');
    });

    if (form === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');

        setTimeout(() => loginForm.classList.add('show'), 10);

        loginTab.classList.add('text-palees-yellow');
        loginTab.classList.remove('text-palees-blue');
        registerTab.classList.add('text-palees-blue');
        registerTab.classList.remove('text-palees-yellow');

    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');

        setTimeout(() => registerForm.classList.add('show'), 10);

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

document.querySelectorAll('.mt-4 > div').forEach(msg => {
    msg.classList.add('msg-animate');
    setTimeout(() => msg.classList.add('show'), 10);
});
