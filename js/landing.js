// Professional Landing Page JavaScript
class ProfessionalLanding {
    constructor() {
        this.init();
    }

    init() {
        this.setupHeroInteractions();
        this.setupAnimations();
        this.setupMouseEffects();
        this.setupLoadingAnimation();
        this.setupMobileMenu();
    }

    setupHeroInteractions() {
        // Hero buttons click effects
        const heroButtons = document.querySelectorAll('.hero-primary-btn, .hero-secondary-btn');
        
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                `;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Feature items hover effect
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-3px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');

        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = mainNav.classList.contains('active');
                
                if (isOpen) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });

            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') && 
                    !mainNav.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            mainNav.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    openMobileMenu() {
        const mainNav = document.getElementById('mainNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mainNav && mobileMenuBtn) {
            mainNav.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    closeMobileMenu() {
        const mainNav = document.getElementById('mainNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (mainNav && mobileMenuBtn) {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }

    setupAnimations() {
        // Add animation to hero elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('hero-icon-section')) {
                        entry.target.style.animation = 'fadeInLeft 1s ease-out forwards';
                    }
                    if (entry.target.classList.contains('hero-text-section')) {
                        entry.target.style.animation = 'fadeInRight 1s ease-out forwards';
                    }
                }
            });
        }, {
            threshold: 0.1
        });

        const heroIcon = document.querySelector('.hero-icon-section');
        const heroText = document.querySelector('.hero-text-section');
        
        if (heroIcon) observer.observe(heroIcon);
        if (heroText) observer.observe(heroText);

        // Add animation styles
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes fadeInRight {
                from {
                    opacity: 0;
                    transform: translateX(50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .hero-icon-section {
                opacity: 0;
            }
            
            .hero-text-section {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }

    setupMouseEffects() {
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const x = (clientX / window.innerWidth - 0.5) * 20;
                const y = (clientY / window.innerHeight - 0.5) * 20;
                
                const heroBg = document.querySelector('.hero-background');
                if (heroBg) {
                    heroBg.style.transform = `translateX(${x}px) translateY(${y}px)`;
                }
            });
        }
    }

    setupLoadingAnimation() {
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
}

// اضافه کردن HTML loading animation
const loadingHTML = `
    <div class="loading-animation">
        <div class="logo-circle">
            <i class="fas fa-palette logo-icon"></i>
        </div>
    </div>
`;

document.body.insertAdjacentHTML('afterbegin', loadingHTML);

// راه‌اندازی وقتی DOM آماده شد
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalLanding();
});