const boton = document.getElementById('modoBtn');

// Aplicar modo guardado al cargar la página
if (localStorage.getItem('modo') === 'oscuro') {
    document.body.classList.add('modo-oscuro');
    boton.textContent = '☀️ Modo Claro';
}

// Al hacer clic
boton.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');

    if (document.body.classList.contains('modo-oscuro')) {
        boton.textContent = '☀️ Modo Claro';
        localStorage.setItem('modo', 'oscuro');
    } else {
        boton.textContent = '🌙 Modo Oscuro';
        localStorage.setItem('modo', 'claro');
    }
});
