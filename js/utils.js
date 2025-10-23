// ==================== UTILITY FUNCTIONS ====================

/**
 * Debounce function for performance optimization
 */
export const debounce = (func, wait, immediate = false) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

/**
 * Throttle function for rate limiting
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

/**
 * Format price with Persian locale
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR'
    }).format(price).replace('ریال', 'تومان');
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    return password.length >= 8;
};

/**
 * Sanitize HTML to prevent XSS
 */
export const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
 * Get CSRF token from cookies
 */
export const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

/**
 * Show loading spinner
 */
export const showLoading = (container = document.body) => {
    const spinner = document.createElement('div');
    spinner.className = 'loading-overlay';
    spinner.innerHTML = `
        <div class="loading-spinner"></div>
        <span class="sr-only">در حال بارگذاری...</span>
    `;
    container.appendChild(spinner);
    return spinner;
};

/**
 * Hide loading spinner
 */
export const hideLoading = (spinner) => {
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
};

/**
 * Show toast notification
 */
export const showToast = (message, type = 'success', duration = 5000) => {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <div class="toast__content">
            <span class="toast__icon">${icons[type]}</span>
            <span class="toast__message">${sanitizeHTML(message)}</span>
        </div>
        <button class="toast__close" aria-label="بستن اعلان">
            <span aria-hidden="true">×</span>
        </button>
    `;

    document.body.appendChild(toast);

    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                top: 1rem;
                left: 50%;
                transform: translateX(-50%) translateY(-100px);
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 0.75rem;
                z-index: 10000;
                transition: transform 0.3s ease;
                max-width: 400px;
                width: 90%;
            }
            .toast--success { border-right: 4px solid #10b981; }
            .toast--error { border-right: 4px solid #ef4444; }
            .toast--warning { border-right: 4px solid #f59e0b; }
            .toast--info { border-right: 4px solid #3b82f6; }
            .toast__content { display: flex; align-items: center; gap: 0.5rem; flex: 1; }
            .toast__icon { font-weight: bold; }
            .toast__close { background: none; border: none; font-size: 1.25rem; cursor: pointer; }
            .toast.show { transform: translateX(-50%) translateY(0); }
        `;
        document.head.appendChild(style);
    }

    // Animate in
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    const autoRemove = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);

    // Manual close
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });

    return toast;
};

/**
 * Handle API errors
 */
export const handleApiError = (error) => {
    console.error('API Error:', error);
    
    let message = 'خطایی در ارتباط با سرور رخ داد';
    
    if (error.response) {
        switch (error.response.status) {
            case 400:
                message = 'درخواست نامعتبر است';
                break;
            case 401:
                message = 'لطفاً وارد حساب کاربری خود شوید';
                break;
            case 403:
                message = 'شما دسترسی لازم را ندارید';
                break;
            case 404:
                message = 'منبع مورد نظر یافت نشد';
                break;
            case 500:
                message = 'خطای داخلی سرور';
                break;
            default:
                message = error.response.data?.message || message;
        }
    } else if (error.request) {
        message = 'اتصال به سرور برقرار نشد';
    }
    
    showToast(message, 'error');
    throw error;
};