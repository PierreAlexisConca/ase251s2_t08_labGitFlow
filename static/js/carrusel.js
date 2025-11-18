// Módulo del carrusel carrusel.js
const carousel = {
    config: {
        autoplayInterval: 5000,
        transitionDuration: 500,
        enableAutoplay: true,
    },

    state: {
        currentIndex: 0,
        totalSlides: 0,
        isTransitioning: false,
        autoplayTimer: null,
    },

    data: [
        {
            id: 1,
            image: 'static/image/fondopalees.jpeg', 
            title: '¡SUPER DESCUENTOS!',
            subtitle: 'Hasta 70% de descuento en toda la tienda',
            cta: 'Ver coleccion',
        },
        {
            id: 2,
            image: 'static/image/RopasD.webp',
            title: 'OFERTAS DE TEMPORADA',
            subtitle: '2x1 en productos seleccionados',
            cta: 'Comprar Ahora',
        },
        {
            id: 3,
            image: 'static/image/Ropas.webp',
            title: 'ÚLTIMAS REBAJAS',
            subtitle: 'No te pierdas nuestras mejores ofertas',
            cta: 'Explorar',
        }
    ],

    init() {
        if (!document.getElementById('mainCarousel')) {
            return;
        }
        this.state.totalSlides = this.data.length;
        this.render();
        this.bindEvents();
        if (this.config.enableAutoplay) {
            this.startAutoplay();
        }
    },

    render() {
        const track = document.getElementById('carouselTrack');
        const indicators = document.getElementById('carouselIndicators');

        if (!track || !indicators) return;

        track.innerHTML = '';
        indicators.innerHTML = '';

        this.data.forEach((slide, index) => {
            const slideEl = this.createSlide(slide, index);
            track.appendChild(slideEl);
        });

        this.data.forEach((_, index) => {
            const dot = this.createIndicator(index);
            indicators.appendChild(dot);
        });

        this.updateVisualState();
    },

    createSlide(slideData, index) {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `
            <img src="${slideData.image}" 
                 alt="${slideData.title}" 
                 class="w-full h-full object-cover">
            <div class="carousel-content">
                <div class="carousel-text text-center text-white px-6">
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-dosis text-palees-yellow drop-shadow-lg">
                        ${slideData.title}
                    </h2>
                    <p class="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
                        ${slideData.subtitle}
                    </p>
                    <button class="inline-block bg-palees-yellow text-palees-blue px-8 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:-translate-y-1 active:scale-95">
                        ${slideData.cta}
                    </button>
                </div>
            </div>
        `;
        return slide;
    },

    createIndicator(index) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => this.goToSlide(index);
        return dot;
    },

    next() {
        if (this.state.isTransitioning) return;
        const nextIndex = (this.state.currentIndex + 1) % this.state.totalSlides;
        this.goToSlide(nextIndex);
    },

    prev() {
        if (this.state.isTransitioning) return;
        const prevIndex = (this.state.currentIndex - 1 + this.state.totalSlides) % this.state.totalSlides;
        this.goToSlide(prevIndex);
    },

    goToSlide(index) {
        if (this.state.isTransitioning || index === this.state.currentIndex) return;

        this.state.isTransitioning = true;
        this.state.currentIndex = index;

        const track = document.getElementById('carouselTrack');
        if (track) {
            track.style.transform = `translateX(-${index * 100}%)`;
        }

        this.updateVisualState();

        if (this.config.enableAutoplay) {
            this.resetAutoplay();
        }

        setTimeout(() => {
            this.state.isTransitioning = false;
        }, this.config.transitionDuration);
    },

    updateVisualState() {
        document.querySelectorAll('.carousel-slide').forEach((slide, index) => {
            slide.classList.toggle('active', index === this.state.currentIndex);
        });
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentIndex);
        });
    },

    startAutoplay() {
        this.state.autoplayTimer = setInterval(() => this.next(), this.config.autoplayInterval);
    },

    stopAutoplay() {
        if (this.state.autoplayTimer) {
            clearInterval(this.state.autoplayTimer);
            this.state.autoplayTimer = null;
        }
    },

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    },

    bindEvents() {
        const container = document.getElementById('mainCarousel');
        if (!container) return;
        container.addEventListener('mouseenter', () => this.stopAutoplay());
        container.addEventListener('mouseleave', () => this.startAutoplay());
    }
};

document.addEventListener('DOMContentLoaded', () => {
    carousel.init();
});