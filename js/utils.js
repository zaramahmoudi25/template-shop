// ==================== UTILITY FUNCTIONS ====================

/**
 * @param {Function} func - تابع اصلی
 * @param {number} wait - زمان انتظار
 * @param {boolean} immediate - اجرای فوری
 * @returns {Function} تابع debounced
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
 * تابع throttle برای محدود کردن نرخ فراخوانی
 * @param {Function} func - تابع اصلی
 * @param {number} limit - محدودیت زمانی
 * @returns {Function} تابع throttled
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
 * فرمت قیمت با locale فارسی
 * @param {number} price - قیمت
 * @returns {string} قیمت فرمت شده
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR', {
        style: 'currency',
        currency: 'IRR'
    }).format(price).replace('ریال', 'تومان');
};

/**
 * اعتبارسنجی فرمت ایمیل
 * @param {string} email - آدرس ایمیل
 * @returns {boolean} معتبر بودن ایمیل
 */
export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * اعتبارسنجی قدرت رمز عبور
 * @param {string} password - رمز عبور
 * @returns {boolean} معتبر بودن رمز عبور
 */
export const validatePassword = (password) => {
    return password.length >= 8;
};

/**
 * پاکسازی HTML برای جلوگیری از XSS
 * @param {string} str - رشته ورودی
 * @returns {string} رشته پاکسازی شده
 */
export const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
 * دریافت CSRF token از cookies
 * @returns {string|null} CSRF token
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
 * نمایش spinner loading
 * @param {HTMLElement} container - کانتینر
 * @returns {HTMLElement} المنت spinner
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
 * پنهان کردن spinner loading
 * @param {HTMLElement} spinner - المنت spinner
 */
export const hideLoading = (spinner) => {
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
};

/**
 * نمایش toast notification
 * @param {string} message - پیام
 * @param {string} type - نوع (success, error, warning, info)
 * @param {number} duration - مدت زمان نمایش
 * @returns {HTMLElement} المنت toast
 */
export const showToast = (message, type = 'success', duration = 5000) => {
    // حذف toast های موجود
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

    // افزودن استایل‌های toast اگر وجود ندارند
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

    // انیمیشن ورود
    setTimeout(() => toast.classList.add('show'), 100);

    // حذف خودکار
    const autoRemove = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);

    // بستن دستی
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });

    return toast;
};

/**
 * @param {Error} error - خطا
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