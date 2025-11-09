// Professional Landing Page JavaScript
class ProfessionalLanding {
    constructor() {
        this.init();
    }

    init() {
        this.setupPlatformCards();
        this.setupAnimations();
        this.setupMouseEffects();
        this.setupLoadingAnimation();
    }

    setupPlatformCards() {
        const platformCards = document.querySelectorAll('.platform-card');

        platformCards.forEach((card, index) => {
            // Add delay for staggered animation
            card.style.animationDelay = `${index * 0.2}s`;

            card.addEventListener('mouseenter', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e, card));
            card.addEventListener('click', (e) => this.handleCardClick(e, card));
        });
    }

    handleCardHover(e, card) {
        // Add magnetic effect
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const angleX = (y - centerY) / 10;
        const angleY = (centerX - x) / 10;

        card.style.transform = `translateY(-15px) scale(1.05) rotateX(${angleX}deg) rotateY(${angleY}deg)`;

        // Add glow effect
        card.style.boxShadow = `
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 0 30px rgba(255, 255, 255, 0.3),
            0 0 0 1px rgba(255, 255, 255, 0.3)
        `;
    }

    handleCardLeave(e, card) {
        card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        card.style.boxShadow = `
            0 15px 35px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.2)
        `;
    }

    handleCardClick(e, card) {
        e.preventDefault();

        // Ripple effect
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
        `;

        card.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);

        // Navigate after click animation
        setTimeout(() => {
            window.location.href = card.href;
        }, 300);
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animated elements
        document.querySelectorAll('.platform-card, .hero-title').forEach(el => {
            observer.observe(el);
        });

        // Add CSS for animate-in class
        const style = document.createElement('style');
        style.textContent = `
            .platform-card.animate-in {
                animation: cardEntrance 0.8s ease-out forwards;
            }
            
            @keyframes cardEntrance {
                from {
                    opacity: 0;
                    transform: translateY(40px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupMouseEffects() {
        // Mouse move parallax effect
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const x = (clientX / window.innerWidth - 0.5) * 20;
            const y = (clientY / window.innerHeight - 0.5) * 20;

            document.querySelector('.hero-background').style.transform =
                `translateX(${x}px) translateY(${y}px)`;
        });
    }

    setupLoadingAnimation() {
        // Remove loading animation after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loading = document.querySelector('.loading-animation');
                if (loading) {
                    loading.classList.add('fade-out');
                    setTimeout(() => loading.remove(), 500);
                }
            }, 1000);
        });
    }

    // Utility method for analytics
    trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalLanding();
});

// Add loading animation to HTML
const loadingHTML = `
    <div class="loading-animation">
        <div class="logo-circle">
            <i class="fas fa-palette logo-icon"></i>
        </div>
    </div>
`;

document.body.insertAdjacentHTML('afterbegin', loadingHTML);