
// Función de formato de moneda (Soles peruanos)
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
}).format(amount);

// Datos de Pedido de EJEMPLO (Simulados)
const mockOrderData = {
    orderNumber: '123456789',
    estimatedDelivery: '2 de Octubre, 2025',
    trackingNumber: '123999999999',
    shippingAddress: 'Jr. Lima 123, Miraflores, Lima.',
    status: 'Enviado', // Cambia a 'Orden Recibida' o 'Entregado' para probar
    products: [
        { id: 3, name: "Polo Piqué Textura", price: 53.94, imgSrc: "/static/images/polo-negro.jpg", quantity: 1 },
        { id: 4, name: "Polo Oversize", price: 52.40, imgSrc: "/static/images/polo-gris.jpg", quantity: 1 },
        { id: 2, name: "Polo Gráfico Urbano", price: 55.30, imgSrc: "/static/images/polo-azul.jpg", quantity: 1 }
    ]
};

/**
 * Función que renderiza la información del pedido y sus productos.
 */
function renderOrderDetails(order) {
    // 1. Rellenar los detalles estáticos
    document.getElementById('order-number').textContent = order.orderNumber;
    document.getElementById('delivery-date').textContent = order.estimatedDelivery;
    document.getElementById('tracking-number').textContent = order.trackingNumber;
    document.getElementById('shipping-address').textContent = order.shippingAddress;

    // 2. Rellenar la barra de estado
    updateTrackingBar(order.status);

    // 3. Rellenar la lista de productos
    const container = document.getElementById('productos-del-pedido-container');
    if (!container) return;

    // Generamos el HTML usando TEMPLATE LITERALS (comillas invertidas `)
    const productsHtml = order.products.map(item => {
        const subtotal = item.price * item.quantity;
        return `
                    <div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div class="flex items-center space-x-3">
                            <img src="${item.imgSrc || '/static/images/placeholder.jpg'}" alt="${item.name}" class="w-14 h-14 object-cover rounded-lg border">
                            <div>
                                <p class="font-semibold text-palees-blue text-sm">${item.name}</p>
                                <p class="text-xs text-palees-text-medium">${formatCurrency(item.price)} c/u</p>
                            </div>
                        </div>
                        <span class="font-bold text-palees-blue">x ${item.quantity}</span>
                        <span class="font-bold text-palees-blue">${formatCurrency(subtotal)}</span>
                    </div>
                `;
    }).join('');

    container.innerHTML = productsHtml;
}


/**
 * Actualiza el estado visual de la barra de progreso.
 */
function updateTrackingBar(status) {
    const steps = {
        'Orden Recibida': ['status-received', 'status-inactive', 'status-inactive'],
        'Enviado': ['status-received', 'status-sent', 'status-inactive'],
        'Entregado': ['status-received', 'status-sent', 'status-delivered']
    };

    const [step1Class, step2Class, step3Class] = steps[status] || steps['Orden Recibida'];

    document.getElementById('step-received').className = `tracking-step ${step1Class}`;
    document.getElementById('step-sent').className = `tracking-step ${step2Class}`;
    document.getElementById('step-delivered').className = `tracking-step ${step3Class}`;
}


// Ejecución: Carga los detalles del pedido simulado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Solo ejecuta si el contenedor principal de rastreo existe
    if (document.getElementById('order-details-card')) {
        renderOrderDetails(mockOrderData);
    }
});
