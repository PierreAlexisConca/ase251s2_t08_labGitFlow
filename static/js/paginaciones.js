// =========================
// Variables globales
// =========================
let currentPage = 1;
let colorActivo = null;
let tallaActiva = null;
let ordenActual = 'mas-vendido'; // Nuevo: orden por defecto

const pageButtons = document.querySelectorAll('.flex.justify-center a');
const tabs = document.querySelectorAll('.tab-content');
const colorButtons = document.querySelectorAll('[data-filter-color]');
const tallaButtons = document.querySelectorAll('.filtro-talla button');
const botonLimpiarSidebar = document.getElementById('btn-limpiar-sidebar');
const btnLimpiar = document.getElementById('limpiar-filtros-btn');
const selectOrden = document.getElementById('sort');

// =========================
// Mostrar/Ocultar botón "Dejar de Filtrar"
// =========================
function actualizarBotonLimpiarSidebar() {
    if (!botonLimpiarSidebar) return;
    
    if (colorActivo || tallaActiva) {
        botonLimpiarSidebar.classList.remove('hidden');
    } else {
        botonLimpiarSidebar.classList.add('hidden');
    }
}

// =========================
// Función de mostrar página
// =========================
function showPage(pageNumber) {
    if (colorActivo || tallaActiva) {
        return;
    }

    tabs.forEach(tab => tab.classList.toggle('hidden', tab.dataset.tab !== pageNumber.toString()));

    pageButtons.forEach(btn => {
        const btnNum = parseInt(btn.textContent.trim());
        if (!isNaN(btnNum)) {
            btn.classList.toggle('bg-palees-blue', btnNum === pageNumber);
            btn.classList.toggle('text-white', btnNum === pageNumber);
            btn.classList.toggle('shadow-md', btnNum === pageNumber);
            btn.classList.toggle('text-palees-text-dark', btnNum !== pageNumber);
        }
    });

    currentPage = pageNumber;
}

// =========================
// NUEVO: Función para ordenar productos
// =========================
function ordenarProductos() {
    const todosLosProductos = Array.from(document.querySelectorAll('.producto'));
    
    // Ordenar según la opción seleccionada
    todosLosProductos.sort((a, b) => {
        // Extraer precio del texto (ejemplo: "S/. 59.90" -> 59.90)
        const precioA = parseFloat(a.querySelector('.text-xl.font-bold').textContent.replace('S/.', '').trim());
        const precioB = parseFloat(b.querySelector('.text-xl.font-bold').textContent.replace('S/.', '').trim());
        
        switch(ordenActual) {
            case 'precio-menor':
                return precioA - precioB;
            case 'precio-mayor':
                return precioB - precioA;
            case 'mas-vendido':
            default:
                // Mantener orden original (por ID de producto)
                return 0;
        }
    });
    
    // Reorganizar productos en el DOM
    todosLosProductos.forEach(producto => {
        const padre = producto.parentElement;
        padre.appendChild(producto);
    });
}

// =========================
// Función de filtrar productos
// =========================
function filtrarProductos() {
    const todosLosProductos = document.querySelectorAll('.producto');
    let productosVisibles = 0;

    if (!colorActivo && !tallaActiva) {
        tabs.forEach(tab => {
            const tabNumber = parseInt(tab.dataset.tab);
            tab.classList.toggle('hidden', tabNumber !== currentPage);
        });

        todosLosProductos.forEach(product => {
            product.style.display = "block";
        });

        const paginacion = document.querySelector('.flex.justify-center');
        if (paginacion) {
            paginacion.style.display = 'flex';
        }

        actualizarBotonLimpiarSidebar();
        actualizarContador();
        
        // Aplicar ordenamiento también sin filtros
        ordenarProductos();
        return;
    }

    tabs.forEach(tab => tab.classList.remove('hidden'));

    todosLosProductos.forEach(product => {
        const productSizes = product.dataset.size?.split(",").map(s => s.trim().toUpperCase()) || [];
        const productColors = product.dataset.color?.split(",").map(c => c.trim().toLowerCase()) || [];

        const tallaCoincide = !tallaActiva || productSizes.includes(tallaActiva.toUpperCase());
        const colorCoincide = !colorActivo || productColors.includes(colorActivo.toLowerCase());

        if (tallaCoincide && colorCoincide) {
            product.style.display = "block";
            productosVisibles++;
        } else {
            product.style.display = "none";
        }
    });

    const paginacion = document.querySelector('.flex.justify-center');
    if (paginacion) {
        paginacion.style.display = 'none';
    }

    actualizarBotonLimpiarSidebar();
    actualizarContador(productosVisibles);
    mostrarMensajeSinResultados(productosVisibles);
    
    // Aplicar ordenamiento después de filtrar
    ordenarProductos();
}

// =========================
// Actualizar contador de productos
// =========================
function actualizarContador(productosVisibles = null) {
    const textoMostrar = document.querySelector('.text-palees-text-medium.text-sm');
    
    if (!textoMostrar) return;

    if (colorActivo || tallaActiva) {
        if (productosVisibles === null) {
            productosVisibles = Array.from(document.querySelectorAll('.producto'))
                .filter(p => window.getComputedStyle(p).display !== 'none').length;
        }

        if (productosVisibles === 0) {
            textoMostrar.textContent = 'No se encontraron productos';
        } else {
            const plural = productosVisibles !== 1 ? 's' : '';
            textoMostrar.textContent = `Mostrando ${productosVisibles} producto${plural} filtrado${plural}`;
        }
    } else {
        textoMostrar.textContent = 'Mostrando 1–9 de 28 productos';
    }
}

// =========================
// Mostrar mensaje cuando no hay productos
// =========================
function mostrarMensajeSinResultados(productosVisibles) {
    const hayFiltrosActivos = colorActivo || tallaActiva;
    const mensajeId = 'mensaje-sin-resultados-global';
    let mensajeExistente = document.getElementById(mensajeId);
    
    if (productosVisibles === 0 && hayFiltrosActivos) {
        if (!mensajeExistente) {
            const primeraPagina = tabs[0];
            
            if (primeraPagina) {
                const mensajeDiv = document.createElement('div');
                mensajeDiv.id = mensajeId;
                mensajeDiv.className = 'col-span-full flex flex-col items-center justify-center py-16 px-6';
                
                const contenedorCentral = document.createElement('div');
                contenedorCentral.className = 'text-center max-w-md';
                
                const iconoDiv = document.createElement('div');
                iconoDiv.className = 'mb-6';
                const icono = document.createElement('i');
                icono.className = 'fas fa-box-open text-6xl text-palees-text-medium opacity-50';
                iconoDiv.appendChild(icono);
                
                const titulo = document.createElement('h3');
                titulo.className = 'text-2xl font-bold text-palees-blue mb-3';
                titulo.textContent = '¡Producto Agotado!';
                
                const parrafo = document.createElement('p');
                parrafo.className = 'text-palees-text-medium mb-6';
                parrafo.textContent = 'Lo sentimos, no tenemos productos disponibles con los filtros seleccionados.';
                
                const boton = document.createElement('button');
                boton.className = 'bg-palees-yellow text-palees-blue px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-all duration-300 shadow-md active:scale-95';
                boton.onclick = limpiarFiltros;
                
                const iconoBoton = document.createElement('i');
                iconoBoton.className = 'fas fa-times-circle mr-2';
                boton.appendChild(iconoBoton);
                
                const textoBoton = document.createTextNode('Limpiar Filtros');
                boton.appendChild(textoBoton);
                
                contenedorCentral.appendChild(iconoDiv);
                contenedorCentral.appendChild(titulo);
                contenedorCentral.appendChild(parrafo);
                contenedorCentral.appendChild(boton);
                
                mensajeDiv.appendChild(contenedorCentral);
                primeraPagina.appendChild(mensajeDiv);
            }
        }
    } else {
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
    }
}

// =========================
// Event listeners para paginación
// =========================
pageButtons.forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        
        if (colorActivo || tallaActiva) {
            return;
        }

        const btnNum = parseInt(btn.textContent.trim());

        if (!isNaN(btnNum)) {
            showPage(btnNum);
        } else if (btn.textContent.includes('«')) {
            if (currentPage > 1) showPage(currentPage - 1);
        } else if (btn.textContent.includes('»')) {
            if (currentPage < tabs.length) showPage(currentPage + 1);
        }
    });
});

// =========================
// Event listeners para filtros de color
// =========================
colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const colorSeleccionado = btn.getAttribute('data-filter-color');
        
        if (colorActivo === colorSeleccionado) {
            colorActivo = null;
            btn.classList.remove('ring-4', 'ring-palees-yellow', 'ring-offset-2');
        } else {
            colorButtons.forEach(b => b.classList.remove('ring-4', 'ring-palees-yellow', 'ring-offset-2'));
            colorActivo = colorSeleccionado;
            btn.classList.add('ring-4', 'ring-palees-yellow', 'ring-offset-2');
        }

        filtrarProductos();
    });
});

// =========================
// Event listeners para filtros de talla
// =========================
tallaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const tallaSeleccionada = btn.textContent.trim();
        
        if (tallaActiva === tallaSeleccionada) {
            tallaActiva = null;
            btn.classList.remove('bg-palees-yellow');
            btn.classList.add('bg-white');
        } else {
            tallaButtons.forEach(b => {
                b.classList.remove('bg-palees-yellow', 'bg-palees-blue', 'text-white');
                b.classList.add('bg-white');
            });
            tallaActiva = tallaSeleccionada;
            btn.classList.add('bg-palees-yellow');
            btn.classList.remove('bg-white');
        }

        filtrarProductos();
    });
});

// =========================
// NUEVO: Event listener para ordenamiento
// =========================
if (selectOrden) {
    selectOrden.addEventListener('change', (e) => {
        const valorSeleccionado = e.target.value;
        
        // Mapear el texto visible a un valor interno
        switch(valorSeleccionado) {
            case 'Precio: Menor a Mayor':
                ordenActual = 'precio-menor';
                break;
            case 'Precio: Mayor a Menor':
                ordenActual = 'precio-mayor';
                break;
            case 'Más Vendido':
            case 'Novedades':
            default:
                ordenActual = 'mas-vendido';
                break;
        }
        
        // Aplicar ordenamiento inmediatamente
        filtrarProductos();
    });
}

// =========================
// Event listener para botón "Dejar de Filtrar"
// =========================
if (btnLimpiar) {
    btnLimpiar.addEventListener('click', limpiarFiltros);
}

// =========================
// Función para limpiar todos los filtros
// =========================
function limpiarFiltros() {
    colorActivo = null;
    tallaActiva = null;

    colorButtons.forEach(b => b.classList.remove('ring-4', 'ring-palees-yellow', 'ring-offset-2'));

    tallaButtons.forEach(b => {
        b.classList.remove('bg-palees-blue', 'text-white', 'bg-palees-yellow');
        b.classList.add('bg-white');
    });

    const todosLosProductos = document.querySelectorAll('.producto');
    todosLosProductos.forEach(product => {
        product.style.display = "block";
    });

    tabs.forEach((tab, index) => {
        const tabNumber = index + 1;
        tab.classList.toggle('hidden', tabNumber !== currentPage);
    });

    const paginacion = document.querySelector('.flex.justify-center');
    if (paginacion) {
        paginacion.style.display = 'flex';
    }

    actualizarBotonLimpiarSidebar();
    actualizarContador();
    
    const mensaje = document.getElementById('mensaje-sin-resultados-global');
    if (mensaje) {
        mensaje.remove();
    }
}

// Hacer la función global para poder usarla desde el HTML si es necesario
window.limpiarFiltros = limpiarFiltros;

// =========================
// Inicializar al cargar la página
// =========================
showPage(1);