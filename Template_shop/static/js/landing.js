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
        this.setupMobileMenu();
        this.setupAuthLinks(); // اضافه شد
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

            // بستن منو با کلیک خارج از آن
            document.addEventListener('click', (e) => {
                if (mainNav.classList.contains('active') &&
                    !mainNav.contains(e.target) &&
                    !mobileMenuBtn.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // جلوگیری از بستن منو هنگام کلیک روی لینک‌ها
            mainNav.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupAuthLinks() {
        // مدیریت کلیک روی لینک‌های احراز هویت در منوی موبایل
        const authLinks = document.querySelectorAll('#mainNav .auth-link, #mainNav .nav-link[href*="login"], #mainNav .nav-link[href*="register"]');

        authLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log('Auth link clicked:', link.href);

                // بستن منوی موبایل پس از کلیک
                this.closeMobileMenu();

                // اگر لینک داخلی است، از پیش‌فرض جلوگیری نکن
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetSection = link.getAttribute('href').substring(1);
                    this.navigateToSection(targetSection);
                }
                // برای لینک‌های خارجی، اجازه دهید به صورت طبیعی کار کنند
            });
        });
    }

    openMobileMenu() {
        const mainNav = document.getElementById('mainNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mainNav && mobileMenuBtn) {
            mainNav.classList.add('active');
            mobileMenuBtn.classList.add('active');
            document.body.classList.add('menu-open');

            // اضافه کردن انیمیشن به لینک‌ها
            const navLinks = mainNav.querySelectorAll('.nav-link, .auth-link');
            navLinks.forEach((link, index) => {
                link.style.animationDelay = `${index * 0.1}s`;
                link.classList.add('slide-in');
            });
        }
    }

    closeMobileMenu() {
        const mainNav = document.getElementById('mainNav');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');

        if (mainNav && mobileMenuBtn) {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');

            // حذف انیمیشن از لینک‌ها
            const navLinks = mainNav.querySelectorAll('.nav-link, .auth-link');
            navLinks.forEach(link => {
                link.classList.remove('slide-in');
                link.style.animationDelay = '';
            });
        }
    }

    navigateToSection(sectionId) {
        console.log('Navigating to section:', sectionId);

        // اسکرول به بخش مورد نظر
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    setupPlatformCards() {
        const platformCards = document.querySelectorAll('.platform-card');

        platformCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;

            card.addEventListener('mouseenter', (e) => this.handleCardHover(e, card));
            card.addEventListener('mouseleave', (e) => this.handleCardLeave(e, card));
            card.addEventListener('click', (e) => this.handleCardClick(e, card));
        });
    }

    handleCardHover(e, card) {
        if (window.innerWidth > 768) { // فقط در دسکتاپ
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const angleX = (y - centerY) / 10;
            const angleY = (centerX - x) / 10;

            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            card.style.boxShadow = `
                0 25px 50px rgba(0, 0, 0, 0.15),
                0 0 30px rgba(255, 255, 255, 0.3),
                0 0 0 1px rgba(255, 255, 255, 0.3)
            `;
        }
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

        // افکت ripple
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

        setTimeout(() => {
            ripple.remove();
        }, 600);

        // هدایت پس از انیمیشن
        setTimeout(() => {
            if (card.href) {
                window.location.href = card.href;
            }
        }, 300);
    }

    setupAnimations() {
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

        document.querySelectorAll('.platform-card, .hero-title').forEach(el => {
            observer.observe(el);
        });

        // اضافه کردن استایل‌های CSS برای انیمیشن‌ها
        this.addAnimationStyles();
    }

    addAnimationStyles() {
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
            
            /* انیمیشن لینک‌های منوی موبایل */
            .nav-link.slide-in, .auth-link.slide-in {
                animation: slideInRight 0.3s ease-out forwards;
                opacity: 0;
                transform: translateX(20px);
            }
            
            @keyframes slideInRight {
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            /* استایل‌های منوی موبایل */
            .menu-open {
                overflow: hidden;
            }
            
            #mainNav.active {
                transform: translateX(0);
                opacity: 1;
                visibility: visible;
            }
            
            #mainNav {
                transition: all 0.3s ease-in-out;
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