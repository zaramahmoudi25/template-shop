// ==================== SINGLE PAGE APPLICATION ====================

class SinglePageApp {
    constructor() {
        this.currentSection = 'home';
        this.sections = new Map();
        this.init();
    }


    init() {
        this.cacheSections();
        this.setupNavigation();
        this.setupScrollSpy();
        this.handleInitialLoad();
    }


    cacheSections() {
        document.querySelectorAll('.page-section').forEach(section => {
            this.sections.set(section.id, section);
        });
    }


    setupNavigation() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-section]');
            if (link) {
                e.preventDefault();
                const sectionId = link.dataset.section;
                this.navigateTo(sectionId);
            }
        });

        window.addEventListener('popstate', (e) => {
            const sectionId = window.location.hash.substring(1) || 'home';
            this.showSection(sectionId);
        });
    }

    setupScrollSpy() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNav(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-20% 0px -20% 0px'
        });

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }

    handleInitialLoad() {
        const hash = window.location.hash.substring(1);
        if (hash && this.sections.has(hash)) {
            this.showSection(hash);
        } else {
            this.showSection('home');
        }
    }

    /**
     * @param {string} sectionId - شناسه section
     */
    navigateTo(sectionId) {
        if (this.sections.has(sectionId)) {
            this.showSection(sectionId);
            history.pushState(null, '', `#${sectionId}`);

            const section = this.sections.get(sectionId);
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    /**
     * @param {string} sectionId - شناسه section
     */
    showSection(sectionId) {
        this.updateActiveNav(sectionId);

        this.currentSection = sectionId;

        this.sections.forEach((section, id) => {
            section.classList.toggle('active-section', id === sectionId);
        });
    }

    /**
     * @param {string} sectionId - شناسه section
     */
    updateActiveNav(sectionId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    }

    showLoading() {
        document.body.classList.add('loading');
    }


    hideLoading() {
        document.body.classList.remove('loading');
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    window.spa = new SinglePageApp();
});

export default SinglePageApp;