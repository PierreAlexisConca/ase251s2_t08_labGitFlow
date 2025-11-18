// Verificar compatibilidad con la API de voz
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    console.warn("Este navegador no soporta reconocimiento de voz.");
} else {
    const recognition = new window.SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true; // Permite capturar varias frases seguidas
    recognition.interimResults = true;

    const micButton = document.getElementById('voice-search-button');
    const micIndicator = document.getElementById('mic-status-indicator');

    let debounceTimer;

    micButton.addEventListener('click', () => {
        recognition.start();
        micIndicator.classList.remove('hidden');
    });

    recognition.onresult = (event) => {
        let transcript = '';
        // Tomamos todos los resultados intermedios para formar la frase completa
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
        }
        transcript = transcript.toLowerCase().trim();
        console.log("Dijiste:", transcript);

        // Reiniciamos el timer para esperar 1.5 segundos de pausa antes de ejecutar la búsqueda
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            micIndicator.classList.add('hidden');
            buscarProductos(transcript);
        }, 1500); // 1.5 segundos de espera
    };

    recognition.onerror = (event) => {
        console.error("Error de voz:", event.error);
        micIndicator.classList.add('hidden');
    };

    recognition.onend = () => {
        micIndicator.classList.add('hidden');
    };

    function buscarProductos(frase) {
        // Limpiamos acentos
        frase = frase.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

        // Consideramos múltiples productos separados por pausas o comas
        const nombres = frase.split(/,| y | o /).map(n => n.trim()).filter(n => n);

        // Seleccionamos cualquier tarjeta de producto
        const productos = document.querySelectorAll('#products-container > div, section > div > div');

        // Limpiamos todo antes de resaltar
        productos.forEach(p => p.classList.remove('hidden', 'ring-4', 'ring-blue-500', 'transition'));

        let encontrados = false;

        nombres.forEach(nombre => {
            productos.forEach(producto => {
                const tituloElem = producto.querySelector('h3');
                if (!tituloElem) return;

                const titulo = tituloElem.innerText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                if (titulo.includes(nombre)) {
                    producto.classList.remove('hidden');
                    producto.classList.add('ring-4', 'ring-blue-500', 'transition');
                    producto.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    encontrados = true;
                } else {
                    // Si no coincide con NINGUNO de los nombres mencionados, se oculta
                    if (!nombres.some(n => titulo.includes(n))) {
                        producto.classList.add('hidden');
                    }
                }
            });
        });

        if (!encontrados) {
            alert(`No se encontró ningún producto que coincida con: "${frase}"`);
        }
    }
}
