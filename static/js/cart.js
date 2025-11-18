// cart.js
document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Elementos del DOM
    const cartButtons = document.querySelectorAll('#cart-button, #cart-button-mobile');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartCounts = document.querySelectorAll('#cart-count, #cart-count-mobile');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const checkoutButton = document.getElementById('checkout-button');

    // Constantes
    const CURRENCY_SYMBOL = 'S/. ';
    const TAX_RATE = 0.18;

    // Guardar carrito en localStorage
    const saveCart = () => localStorage.setItem('cart', JSON.stringify(cart));

    // Contador del carrito
    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounts.forEach(el => el.textContent = totalItems);
    };

    // Calcular subtotal
    const calculateSubtotal = () =>
        cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Renderizar items en modal
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-modal-empty">Tu carrito está vacío.</p>';
            cartSubtotal.textContent = CURRENCY_SYMBOL + '0.00';
            if (checkoutButton) checkoutButton.disabled = true;
            return;
        }

        if (checkoutButton) checkoutButton.disabled = false;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item', 'flex', 'items-center', 'justify-between', 'border-b', 'py-2');
            itemElement.innerHTML = `
                <div class="flex items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
                    <div>
                        <p class="font-semibold">${item.name}</p>
                        <p class="text-sm text-gray-600">${CURRENCY_SYMBOL}${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="quantity-btn decrease-quantity-btn" data-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-quantity-btn" data-id="${item.id}">+</button>
                    <button class="cart-item-remove-btn" data-id="${item.id}">&times;</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartSubtotal.textContent = CURRENCY_SYMBOL + calculateSubtotal().toFixed(2);

        // Listeners dinámicos
        document.querySelectorAll('.decrease-quantity-btn').forEach(btn => {
            btn.addEventListener('click', e => updateQuantity(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.increase-quantity-btn').forEach(btn => {
            btn.addEventListener('click', e => updateQuantity(e.target.dataset.id, 1));
        });
        document.querySelectorAll('.cart-item-remove-btn').forEach(btn => {
            btn.addEventListener('click', e => removeFromCart(e.target.dataset.id));
        });
    };

    // Actualizar cantidad
    const updateQuantity = (productId, change) => {
        const item = cart.find(i => i.id == productId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    };

    // Añadir producto
    const addToCart = (product) => {
        const existing = cart.find(item => item.id == product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCartItems();
    };

    // Eliminar producto
    const removeFromCart = (productId) => {
        cart = cart.filter(item => item.id != productId);
        saveCart();
        updateCartCount();
        renderCartItems();
    };

    // Botones de añadir al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', e => {
            const product = {
                id: e.currentTarget.dataset.id,
                name: e.currentTarget.dataset.name,
                price: Number(e.currentTarget.dataset.price),
                image: e.currentTarget.dataset.image
            };
            addToCart(product);
        });
    });

    // Ir a checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                saveCart();
                window.location.href = '/checkout';
            } else {
                alert('Tu carrito está vacío.');
            }
        });
    }

    // Exponer info global del carrito
    window.cart = {
        getItems: () => cart,
        getSubtotal: calculateSubtotal,
        getCurrencySymbol: () => CURRENCY_SYMBOL,
        getTaxRate: () => TAX_RATE,
        addToCart,
        clearCart: () => { cart = []; saveCart(); updateCartCount(); renderCartItems(); }
    };

    // Inicializar
    updateCartCount();
    renderCartItems();

    // 👉 Fusión: forzar actualización del contador desde localStorage (compatibilidad contacto.html)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('#cart-count, #cart-count-mobile')
        .forEach(el => el.textContent = totalItems);

    // Sidebar categorías (opcional)
    const filterToggle = document.getElementById('filter-toggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
            document.getElementById('sidebar-overlay').classList.toggle('hidden');
        });
    }

    // Función abrir/cerrar carrito con overlay
    const cartOverlay = document.getElementById('cart-modal-overlay');
    const openCart = () => {
        if (!cartModal || !cartOverlay) return;
        cartOverlay.classList.remove('hidden', 'opacity-0');
        cartModal.classList.remove('translate-x-full');
        document.body.classList.add('overflow-hidden');
    };

    const closeCart = () => {
        if (!cartModal || !cartOverlay) return;
        cartModal.classList.add('translate-x-full');
        cartOverlay.classList.add('opacity-0');
        setTimeout(() => cartOverlay.classList.add('hidden'), 300);
        document.body.classList.remove('overflow-hidden');
    };

    window.toggleCartModal = () => {
        if (cartModal.classList.contains('translate-x-full')) {
            openCart();
        } else {
            closeCart();
        }
    };

    // Botones del carrito: abrir modal
    cartButtons.forEach(btn => btn.addEventListener('click', () => {
        cartModal.classList.add('open');
    }));

    // Botón cerrar modal
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            cartModal.classList.remove('open');
        });
    }

    // Click en overlay para cerrar
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.remove('open');
            }
        });
    }
});

// Funciones globales adicionales
window.toggleCart = () => {
    document.getElementById('cart-overlay').classList.toggle('hidden');
    document.getElementById('cart-panel').classList.toggle('translate-x-full');
};

window.checkout = () => {
    if (window.cart.getItems().length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    window.location.href = '/checkout';
};
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent.trim();
            const productPriceElement = productCard.querySelector('.price-new') || productCard.querySelector('.price-old');
            const productPrice = parseFloat(productPriceElement.textContent.replace('S/', '').trim());
            const productImage = productCard.querySelector('img').src;
            const productId = productCard.dataset.id || Date.now();

            const productData = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };

            console.log('🛍️ Producto añadido:', productData);

            // Llamamos al método del carrito expuesto en window
            if (window.cart && typeof window.cart.addToCart === 'function') {
                window.cart.addToCart(productData);
            } else {
                console.error('❌ El carrito no está disponible o no fue cargado antes de card.js');
            }

            // Efecto visual
            button.style.backgroundColor = '#FFD966';
            button.textContent = 'Añadido!';
            setTimeout(() => {
                button.style.backgroundColor = '';
                button.textContent = 'Añadir al carrito';
            }, 1500);
        });
    });
});
