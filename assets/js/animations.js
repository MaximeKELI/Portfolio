// Fonction pour gérer les animations au défilement
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.section-animate');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(element => observer.observe(element));
}

// Animation des barres de compétences
function animateSkills() {
    const skills = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    skills.forEach(skill => observer.observe(skill));
}

// Animation du texte de titre
function initTypeWriter() {
    const titles = document.querySelectorAll('.typing-effect');
    titles.forEach(title => {
        title.style.width = '0';
        setTimeout(() => {
            title.style.animation = 'typing 3.5s steps(40, end) forwards, blink 0.75s step-end infinite';
        }, 500);
    });
}

// Animation des cartes de projet
function initProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.classList.add('card-hover');
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Animation du menu de navigation
function initNavAnimation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const line = item.querySelector('.nav-line');
            if (line) {
                line.style.width = '100%';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const line = item.querySelector('.nav-line');
            if (line) {
                line.style.width = '0';
            }
        });
    });
}

// Animation des images
function initImageAnimations() {
    const images = document.querySelectorAll('.portfolio-image');
    images.forEach(image => {
        const container = document.createElement('div');
        container.className = 'image-zoom';
        image.parentNode.insertBefore(container, image);
        container.appendChild(image);
    });
}

// Animation des boutons
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.classList.add('button-animate');
    });
}

// Animation de chargement de page
function pageLoadAnimation() {
    document.body.style.opacity = '0';
    document.body.classList.add('fade-in');
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

// Initialisation de toutes les animations
function initAllAnimations() {
    pageLoadAnimation();
    handleScrollAnimations();
    animateSkills();
    initTypeWriter();
    initProjectCards();
    initNavAnimation();
    initImageAnimations();
    initButtonAnimations();
}

// Lancer les animations au chargement de la page
document.addEventListener('DOMContentLoaded', initAllAnimations);

// Réinitialiser les animations lors du changement de page ou de section
window.addEventListener('popstate', () => {
    setTimeout(initAllAnimations, 100);
});

// Optimisation des performances
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
        handleScrollAnimations();
    });
}); 