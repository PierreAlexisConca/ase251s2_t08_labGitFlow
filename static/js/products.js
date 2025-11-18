// Módulo de productos y carrito: products.js
const products = [
    { id: 1, name: "Polo Básico Pima", color: "Amarillo Sol", originalPrice: 59.90, price: 44.92, discount: "25%", imgSrc: "/static/images/polo-amarillo.jpg" },
    { id: 2, name: "Polo Gráfico Urbano", color: "Diseño: Minimal", originalPrice: 79.00, price: 55.30, discount: "30%", imgSrc: "/static/images/polo-azul.jpg" },
    { id: 3, name: "Polo Piqué Textura", color: "Tejido de Lujo", originalPrice: 89.90, price: 53.94, discount: "40%", imgSrc: "/static/images/polo-negro.jpg" },
    { id: 4, name: "Polo Oversize", color: "Corte relajado", originalPrice: 65.50, price: 52.40, discount: "20%", imgSrc: "/static/images/polo-gris.jpg" },
    { id: 5, name: "Polo en Rojo Coral", color: "Coloración intensa", originalPrice: 59.90, price: 44.92, discount: "25%", imgSrc: "/static/images/polo-rojo.jpg" },
    { id: 6, name: "Polo Logo Discreto", color: "Blanco puro", originalPrice: 69.90, price: 45.44, discount: "35%", imgSrc: "/static/images/polo-blanco.jpg" },
    { id: 7, name: "Polo Cuello V Premium", color: "Verde Esmeralda", originalPrice: 75.00, price: 52.50, discount: "30%", imgSrc: "/static/images/polo-verde.jpg" },
    { id: 8, name: "Polo de Manga Larga", color: "Gris Oscuro", originalPrice: 99.90, price: 59.94, discount: "40%", imgSrc: "/static/images/polo-gris-oscuro.jpg" },
    { id: 9, name: "Polo Retro Stripes", color: "Estampado Rayas", originalPrice: 85.00, price: 63.75, discount: "25%", imgSrc: "/static/images/polo-rayas.jpg" },
    { id: 10, name: "Polo Sin Mangas Sport", color: "Azul Marino", originalPrice: 49.90, price: 34.93, discount: "30%", imgSrc: "/static/images/polo-sport.jpg" }
];

// --- ESTADO Y UTILIDADES ---
let cart = JSON.parse(localStorage.getItem('cart')) || []; 
const productsPerPage = 4;
let currentPage = 1;
// Función de formato de moneda (soles peruanos)
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
const getTotalPages = () => Math.ceil(products.length / productsPerPage);
const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));

// Elementos DOM
const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const cartCountEl = document.getElementById('cart-count');
const cartMessageBox = document.getElementById('cart-message-box');
const cartTotalElement = document.getElementById('cart-total');
const cartItemsContainer = document.getElementById('cart-items-list');

// --- FUNCIONES DEL CARRITO ---

/**
 * Muestra/Oculta el panel lateral del carrito y el overlay.
 * CORREGIDO: Usa clases CSS para la animación suave.
 */
window.toggleCart = () => {
    if (!cartPanel || !cartOverlay) return; 

    // Clase CSS del main.css que controla el transform: translateX(0)
    cartPanel.classList.toggle('cart-panel-open'); 

    // Control del Overlay (Fondo negro)
    if (cartPanel.classList.contains('cart-panel-open')) {
        cartOverlay.classList.remove('hidden');
        // Un pequeño retraso para asegurar que la transición de opacidad se aplique
        setTimeout(() => { 
            cartOverlay.classList.add('opacity-50');
        }, 10);
        document.body.style.overflow = 'hidden'; // Evita scroll en el fondo
    } else {
        cartOverlay.classList.remove('opacity-50');
        document.body.style.overflow = 'auto'; // Restaura scroll
        // Espera a que la transición de opacidad termine (0.3s) antes de ocultar
        setTimeout(() => {
            cartOverlay.classList.add('hidden');
        }, 300); 
    }
};

/**
 * Muestra un mensaje temporal dentro del panel del carrito.
 */
const showCartMessage = (message, type = 'success') => {
    cartMessageBox.textContent = message;
    cartMessageBox.classList.remove('hidden');
    if (type === 'success') {
        cartMessageBox.className = 'p-4 bg-palees-yellow text-palees-blue font-semibold text-center';
    } else if (type === 'error') {
        cartMessageBox.className = 'p-4 bg-palees-red text-white font-semibold text-center';
    }

    setTimeout(() => {
        cartMessageBox.classList.add('hidden');
    }, 3000);
};

/**
 * Agrega un producto al carrito o incrementa su cantidad.
 */
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return console.error('Producto no encontrado');

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            imgSrc: product.imgSrc,
            quantity: 1
        });
    }

    saveCart(); 
    renderCart();
    showCartMessage(`${product.name} añadido!`, 'success');
};

/**
 * Cambia la cantidad de un producto.
 */
window.changeQuantity = (productId, change) => {
    const itemIndex = cart.findIndex(item => item.id === Number(productId));
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        saveCart(); 
        renderCart();
    }
};

// Simula la finalización de la compra.
window.checkout = () => {
    if (cart.length === 0) {
        showCartMessage('No hay productos para comprar.', 'error');
        return;
    }
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    showCartMessage(`¡Compra exitosa! Total pagado: ${formatCurrency(total)}`, 'success');
    cart = []; 
    saveCart(); 
    renderCart();
    // Cierra el carrito después de mostrar el mensaje de éxito
    setTimeout(window.toggleCart, 4000); 
};


// --- RENDERIZADO DE PRODUCTOS ---

const renderProducts = (page) => {
    const container = document.getElementById('products-container');
    const totalPages = getTotalPages();
    
    if (!container) return; 

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = products.slice(startIndex, endIndex);
    
    if (productsToDisplay.length === 0) {
        container.innerHTML = `
        <div class="col-span-full text-center py-20 bg-white rounded-lg shadow-inner">
            <i class="fas fa-box-open text-6xl text-palees-text-medium mb-4"></i>
            <h3 class="text-2xl font-dosis font-bold text-palees-blue">¡Vaya! No hay ofertas disponibles en esta página.</h3>
        </div>`;
        return;
    }

    container.innerHTML = productsToDisplay.map(product => `
        <div class="bg-white rounded-xl overflow-hidden shadow-custom-light hover:shadow-custom-medium transition-shadow duration-300 relative group product-card" data-id="${product.id}">
            
            <div class="absolute top-3 left-3 bg-palees-red text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
                -${product.discount}
            </div>
            
            <div class="h-64 overflow-hidden">
                <img src="${product.imgSrc}" alt="${product.name}" class="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-500">
            </div>

            <div class="p-4 text-center">
                <h3 class="text-lg font-inter font-semibold text-palees-text-dark truncate mb-1">${product.name}</h3>
                <p class="text-sm text-palees-text-medium mb-3">${product.color}</p>

                <div class="flex justify-center items-end space-x-2 mb-4">
                    <span class="price-new text-2xl font-dosis font-bold text-palees-red">${formatCurrency(product.price)}</span>
                    <span class="price-old text-base text-gray-500 line-through">${formatCurrency(product.originalPrice)}</span>
                </div>

                <button 
                    onclick="window.addToCart(${product.id})" 
                    class="btn-add-to-cart w-full py-2 bg-palees-yellow text-palees-blue font-bold rounded-lg hover:bg-yellow-500 transition-colors transform active:scale-[0.98] shadow-sm">
                    Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
};


// --- FUNCIONES DE PAGINACIÓN ---

window.goToPage = (page) => {
    const totalPages = getTotalPages();
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderProducts(currentPage);
        window.renderPagination();
        document.getElementById('productos-ofertas').scrollIntoView({ behavior: 'smooth' });
    }
};

window.prevPage = () => { goToPage(currentPage - 1); };
window.nextPage = () => { goToPage(currentPage + 1); };

window.renderPagination = () => {
    const paginationContainer = document.getElementById('pagination-container');
    const totalPages = getTotalPages();

    if (!paginationContainer || totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHtml = `<button onclick="window.prevPage()" class="px-4 py-2 bg-white rounded-lg shadow-sm font-semibold text-palees-blue hover:bg-gray-100 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === 1 ? 'disabled' : ''}>Anterior</button>`;

    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button onclick="window.goToPage(${i})" class="px-4 py-2 rounded-lg font-bold transition-all ${i === currentPage ? 'bg-palees-blue text-white shadow-md' : 'bg-white text-palees-blue hover:bg-palees-yellow'}" >${i}</button>`;
    }

    paginationHtml += `<button onclick="window.nextPage()" class="px-4 py-2 bg-white rounded-lg shadow-sm font-semibold text-palees-blue hover:bg-gray-100 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente</button>`;

    paginationContainer.innerHTML = `<nav class="flex justify-center space-x-2 mt-6">${paginationHtml}</nav>`;
};


// --- RENDERIZADO DE CARRITO ---

window.renderCart = () => {
    let total = 0;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-palees-text-medium italic pt-4">El carrito está vacío.</p>';
        cartTotalElement.textContent = formatCurrency(0);
        cartCountEl.textContent = 0;
        return;
    }

    const cartHtml = cart.map(item => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        return `
            <div class="flex items-center justify-between py-3 border-b border-gray-200">
                <div class="flex items-center space-x-3">
                    <img src="${item.imgSrc}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border">
                    <div>
                        <p class="font-semibold text-palees-blue text-sm">${item.name}</p>
                        <p class="text-xs text-palees-text-medium">${formatCurrency(item.price)} c/u</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="window.changeQuantity(${item.id}, -1)" class="quantity-btn px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
                    <span class="font-semibold">${item.quantity}</span>
                    <button onclick="window.changeQuantity(${item.id}, 1)" class="quantity-btn px-2 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                </div>
                <div class="font-semibold text-palees-blue text-sm">
                    ${formatCurrency(itemSubtotal)}
                </div>
            </div>
        `;
    }).join('');

    cartItemsContainer.innerHTML = cartHtml;
    cartTotalElement.textContent = formatCurrency(total);
    cartCountEl.textContent = totalItems;
};


// --- INICIALIZACIÓN ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar la carga de productos y carrito
    renderProducts(currentPage);
    window.renderPagination();
    window.renderCart();
    
    // 2. Asociar el evento click al botón del carrito
    if (cartButton) {
        cartButton.addEventListener('click', window.toggleCart);
    }
});