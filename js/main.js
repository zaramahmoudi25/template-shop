// ==================== STATE MANAGEMENT ====================
class AppState {
    constructor() {
        this.state = {
            user: null,
            cart: [],
            templates: [],
            filters: {
                category: 'all',
                sort: 'newest',
                search: '',
                priceRange: [0, 1000000]
            },
            pagination: {
                currentPage: 1,
                totalPages: 1,
                itemsPerPage: 12
            }
        };
        
        this.subscribers = [];
        this.init();
    }


    init() {
        // بارگذاری وضعیت از localStorage
        const savedState = localStorage.getItem('appState');
        if (savedState) {
            this.state = { ...this.state, ...JSON.parse(savedState) };
        }
    }

    /**
     * دریافت وضعیت فعلی
     * @returns {Object} وضعیت فعلی
     */
    getState() {
        return { ...this.state };
    }

    /**
     * به‌روزرسانی وضعیت
     * @param {Object} newState - وضعیت جدید
     */
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveState();
        this.notifySubscribers();
    }

    
    }

   
  
   
    saveState() {
        const stateToSave = {
            user: this.state.user,
            cart: this.state.cart,
            filters: this.state.filters
        };
        localStorage.setItem('appState', JSON.stringify(stateToSave));
    }

    // ==================== CART METHODS ====================

    /**
     * @param {Object} template - اطلاعات قالب
     */
    addToCart(template) {
        const existingItem = this.state.cart.find(item => item.id === template.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.state.cart.push({ ...template, quantity: 1 });
        }
        this.saveState();
        this.notifySubscribers();
        showToast('قالب به سبد خرید اضافه شد', 'success');
    }

    /**
     * @param {number} templateId - شناسه قالب
     */
    removeFromCart(templateId) {
        this.state.cart = this.state.cart.filter(item => item.id !== templateId);
        this.saveState();
        this.notifySubscribers();
        showToast('قالب از سبد خرید حذف شد', 'success');
    }

  
    clearCart() {
        this.state.cart = [];
        this.saveState();
        this.notifySubscribers();
    }

    // ==================== USER METHODS ====================

    /**
     * @param {Object} user - اطلاعات کاربر
     */
    setUser(user) {
        this.state.user = user;
        this.saveState();
        this.notifySubscribers();
    }

   
    logout() {
        this.state.user = null;
        this.state.cart = [];
        this.saveState();
        this.notifySubscribers();
        showToast('با موفقیت خارج شدید', 'success');
    }
}

// ==================== SEARCH FUNCTIONALITY ====================

class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-bar__input');
        this.searchResults = document.querySelector('.search-results');
        this.init();
    }

    init() {
        if (this.searchInput) {
            const debouncedSearch = debounce(this.performSearch.bind(this), 300);
            this.searchInput.addEventListener('input', debouncedSearch);
            this.searchInput.addEventListener('focus', this.showResults.bind(this));
            
            document.addEventListener('click', (e) => {
                if (!this.searchInput.contains(e.target) && !this.searchResults?.contains(e.target)) {
                    this.hideResults();
                }
            });
        }
    }

    /**
     * @param {Event} event - رویداد input
     */
    async performSearch(event) {
        const query = event.target.value.trim();
        
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        try {
            showLoading(this.searchResults);
            
            // شبیه‌سازی API call
            const results = await this.fetchSearchResults(query);
            this.displayResults(results);
        } catch (error) {
            console.error('Search error:', error);
            this.displayError('خطا در جستجو');
        } finally {
            hideLoading();
        }
    }

    /**
     * دریافت نتایج جستجو
     * @param {string} query - عبارت جستجو
     * @returns {Promise<Array>} نتایج جستجو
     */
    async fetchSearchResults(query) {
        // شبیه‌سازی تاخیر API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // داده‌های نمونه
        return [
            { id: 1, title: 'قالب فروشگاهی', category: 'shopify', price: 50000 },
            { id: 2, title: 'قالب شرکتی', category: 'company', price: 75000 },
            { id: 3, title: 'قالب شخصی', category: 'personal', price: 35000 }
        ].filter(item => 
            item.title.includes(query) || 
            item.category.includes(query)
        );
    }

    /**
     * @param {Array} results - نتایج جستجو
     */
    displayResults(results) {
        if (!this.searchResults) return;

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-results__empty">
                    <p>نتیجه‌ای یافت نشد</p>
                </div>
            `;
        } else {
            this.searchResults.innerHTML = results.map(result => `
                <a href="/pages/template-detail.html?id=${result.id}" class="search-result-item">
                    <div class="search-result-item__info">
                        <h4>${result.title}</h4>
                        <span class="badge badge--primary">${result.category}</span>
                    </div>
                    <div class="search-result-item__price">
                        ${result.price.toLocaleString('fa-IR')} تومان
                    </div>
                </a>
            `).join('');
        }
        
        this.showResults();
    }

    /**
     * نمایش خطا
     * @param {string} message - پیام خطا
     */
    displayError(message) {
        if (!this.searchResults) return;
        
        this.searchResults.innerHTML = `
            <div class="search-results__error">
                <p>${message}</p>
            </div>
        `;
        this.showResults();
    }

    
    showResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
        }
    }

    hideResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }
}

// ==================== TEMPLATE FILTERING ====================

class TemplateFilter {
    constructor(appState) {
        this.appState = appState;
        this.filterForm = document.querySelector('.filter-form');
        this.templateGrid = document.querySelector('.template-grid');
        this.init();
    }

   
    init() {
        if (this.filterForm) {
            this.filterForm.addEventListener('change', debounce(this.handleFilterChange.bind(this), 300));
            this.filterForm.addEventListener('input', debounce(this.handleFilterChange.bind(this), 300));
        }
    }

   
    handleFilterChange() {
        const formData = new FormData(this.filterForm);
        const filters = {
            category: formData.get('category') || 'all',
            sort: formData.get('sort') || 'newest',
            search: formData.get('search') || '',
            priceRange: [
                parseInt(formData.get('minPrice')) || 0,
                parseInt(formData.get('maxPrice')) || 1000000
            ]
        };

        this.appState.setState({ filters });
        this.applyFilters();
    }

    async applyFilters() {
        const { filters } = this.appState.getState();
        
        try {
            showLoading(this.templateGrid);
            const filteredTemplates = await this.fetchFilteredTemplates(filters);
            this.displayTemplates(filteredTemplates);
        } catch (error) {
            console.error('Filter error:', error);
            showToast('خطا در فیلتر کردن قالب‌ها', 'error');
        } finally {
            hideLoading();
        }
    }

    /**
     * @param {Object} filters - فیلترها
     * @returns {Promise<Array>} قالب‌های فیلتر شده
     */
    async fetchFilteredTemplates(filters) {
        // شبیه‌سازی API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // داده‌های نمونه
        let templates = [
            { id: 1, title: 'قالب فروشگاهی مدرن', category: 'shopify', price: 50000, rating: 4.5 },
            { id: 2, title: 'قالب شرکتی حرفه‌ای', category: 'company', price: 75000, rating: 4.8 },
            { id: 3, title: 'قالب شخصی خلاق', category: 'personal', price: 35000, rating: 4.2 }
        ];

        if (filters.category !== 'all') {
            templates = templates.filter(t => t.category === filters.category);
        }

        if (filters.search) {
            templates = templates.filter(t => 
                t.title.includes(filters.search) || 
                t.category.includes(filters.search)
            );
        }

        templates = templates.filter(t => 
            t.price >= filters.priceRange[0] && 
            t.price <= filters.priceRange[1]
        );

        switch (filters.sort) {
            case 'price-low':
                templates.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                templates.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                templates.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
            default:
                templates.sort((a, b) => b.id - a.id);
        }

        return templates;
    }

    /**
     * @param {Array} templates - لیست قالب‌ها
     */
    displayTemplates(templates) {
        if (!this.templateGrid) return;

        this.templateGrid.innerHTML = templates.map(template => `
            <div class="card card--interactive template-card" data-template-id="${template.id}">
                <div class="card__body">
                    <div class="template-card__image">
                        <img src="/assets/images/templates/template-${template.id}.webp" 
                             alt="${template.title}" 
                             loading="lazy">
                        <button class="template-card__quick-view" aria-label="مشاهده سریع">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <div class="template-card__content">
                        <h3 class="template-card__title">${template.title}</h3>
                        <div class="template-card__meta">
                            <span class="badge badge--primary">${template.category}</span>
                            <div class="template-card__rating">
                                <i class="fas fa-star"></i>
                                <span>${template.rating}</span>
                            </div>
                        </div>
                        <div class="template-card__footer">
                            <span class="template-card__price">${formatPrice(template.price)}</span>
                            <button class="btn btn--primary btn--sm add-to-cart" 
                                    data-template-id="${template.id}">
                                افزودن به سبد
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // افزودن event listeners
        this.addTemplateEventListeners();
    }

    /**
     * افزودن event listeners به قالب‌ها
     */
    addTemplateEventListeners() {
        // دکمه‌های افزودن به سبد خرید
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const templateId = button.dataset.templateId;
                // در اپلیکیشن واقعی، اطلاعات قالب از سرور دریافت می‌شود
                const template = {
                    id: parseInt(templateId),
                    title: button.closest('.template-card').querySelector('.template-card__title').textContent,
                    price: 50000 // این مقدار باید از داده‌های واقعی بیاید
                };
                this.appState.addToCart(template);
            });
        });

        document.querySelectorAll('.template-card__quick-view').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const templateId = button.closest('.template-card').dataset.templateId;
                this.showQuickView(parseInt(templateId));
            });
        });
    }

    /**
     * @param {number} templateId - شناسه قالب
     */
    showQuickView(templateId) {
        console.log('مشاهده سریع برای قالب:', templateId);
    }
}

// ==================== MAIN INITIALIZATION ====================
/**
 * کلاس اصلی اپلیکیشن
 */
class App {
    constructor() {
        this.state = new AppState();
        this.searchManager = new SearchManager();
        this.templateFilter = new TemplateFilter(this.state);
        this.init();
    }

   
    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.setupServiceWorker();
        
        this.updateUI();
        
        this.state.subscribe(this.updateUI.bind(this));
    }

   
    initializeComponents() {
        this.initMobileNavigation();
        
        this.initCart();
        
        this.initAuth();
        
        this.initLazyLoading();
    }

   
    initMobileNavigation() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.header__nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', () => {
                nav.classList.toggle('header__nav--open');
                mobileToggle.classList.toggle('mobile-menu-toggle--open');
                
                const isExpanded = nav.classList.contains('header__nav--open');
                mobileToggle.setAttribute('aria-expanded', isExpanded);
            });
        }
    }

    initCart() {
    }

    
    initAuth() {
        const user = this.state.getState().user;
        this.updateAuthUI(user);
    }

   
    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupEventListeners() {
        // دکمه بازگشت به بالا
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            window.addEventListener('scroll', throttle(() => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('back-to-top--visible');
                } else {
                    backToTop.classList.remove('back-to-top--visible');
                }
            }, 100));

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.refreshData();
            }
        });
    }

   
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * @param {Object} state - وضعیت فعلی
     */
    updateUI(state = this.state.getState()) {
        this.updateAuthUI(state.user);
        this.updateCartUI(state.cart);
        this.updateNavigation(state.user);
    }

    /**
     * @param {Object} user - اطلاعات کاربر
     */
    updateAuthUI(user) {
        const authButtons = document.querySelector('.auth-buttons');
        const userDropdown = document.querySelector('.user-dropdown');
        
        if (authButtons && userDropdown) {
            if (user) {
                authButtons.style.display = 'none';
                userDropdown.style.display = 'block';
                
                const userName = userDropdown.querySelector('.user-name');
                if (userName) {
                    userName.textContent = user.name || 'کاربر';
                }
            } else {
                authButtons.style.display = 'flex';
                userDropdown.style.display = 'none';
            }
        }
    }

    /**
     * @param {Array} cart - محتویات سبد خرید
     */
    updateCartUI(cart) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    /**
     * @param {Object} user - اطلاعات کاربر
     */
    updateNavigation(user) {
        const dashboardLink = document.querySelector('a[href*="dashboard"]');
        if (dashboardLink) {
            dashboardLink.style.display = user ? 'block' : 'none';
        }
    }

 
    refreshData() {
        this.templateFilter.applyFilters();
    }
}

// ==================== APP INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        showToast('خطای غیرمنتظره رخ داد', 'error');
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        showToast('خطا در انجام عملیات', 'error');
        event.preventDefault();
    });
});


export { AppState, SearchManager, TemplateFilter };