// Création du conteneur de particules
function createParticlesContainer() {
    const container = document.createElement('div');
    container.className = 'particles';
    document.body.appendChild(container);
    return container;
}

// Création d'une particule
function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Position aléatoire
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top = Math.random() * 100 + 'vh';
    
    // Taille aléatoire
    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Couleur aléatoire
    const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    // Opacité aléatoire
    particle.style.opacity = Math.random() * 0.5 + 0.2;
    
    // Animation personnalisée
    particle.style.animation = `particleFloat ${Math.random() * 15 + 5}s infinite linear`;
    
    container.appendChild(particle);
    
    // Supprimer la particule après l'animation
    setTimeout(() => {
        particle.remove();
    }, 20000);
}

// Initialisation des particules
function initParticles() {
    const container = createParticlesContainer();
    
    // Création initiale des particules
    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }
    
    // Création continue de nouvelles particules
    setInterval(() => {
        if (container.children.length < 50) {
            createParticle(container);
        }
    }, 500);
}

// Effet de brillance au survol
function initShineEffect() {
    const elements = document.querySelectorAll('.service-card, .project-img, .blog-banner-box');
    
    elements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = element.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            element.style.background = `
                radial-gradient(
                    circle at ${x * 100}% ${y * 100}%,
                    rgba(255,255,255,0.2) 0%,
                    rgba(255,255,255,0) 50%
                )
            `;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.background = '';
        });
    });
}

// Effet de vague pour les boutons
function initWaveEffect() {
    const buttons = document.querySelectorAll('.button-animate');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const wave = document.createElement('div');
            wave.className = 'wave-effect';
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            wave.style.left = x + 'px';
            wave.style.top = y + 'px';
            
            button.appendChild(wave);
            
            setTimeout(() => {
                wave.remove();
            }, 1000);
        });
    });
}

// Effet de dégradé dynamique pour les titres
function initDynamicGradient() {
    const titles = document.querySelectorAll('.gradient-text');
    
    titles.forEach(title => {
        title.addEventListener('mousemove', (e) => {
            const { left, width } = title.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            
            title.style.backgroundPosition = `${x * 100}% 50%`;
        });
    });
}

// Initialisation de tous les effets
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initShineEffect();
    initWaveEffect();
    initDynamicGradient();
}); 