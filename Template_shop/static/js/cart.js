import { showToast, showLoading, hideLoading, formatPrice } from './utils';

class CartManager {
    constructor(appState) {
        this.appState = appState;
        this.cartContainer = document.querySelector('.cart-container');
        this.cartItems = document.querySelector('.cart-items');
        this.cartSummary = document.querySelector('.cart-summary');
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
        
        // Subscribe to cart changes
        this.appState.subscribe((state) => {
            if (state.cart !== this.lastCartState) {
                this.renderCart();
            }
        });
    }

    setupEventListeners() {
        // Delegate events for dynamic cart items
        if (this.cartItems) {
            this.cartItems.addEventListener('click', this.handleCartItemClick.bind(this));
            this.cartItems.addEventListener('input', this.handleQuantityChange.bind(this));
        }

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', this.handleCheckout.bind(this));
        }

        // Continue shopping button
        const continueBtn = document.querySelector('.continue-shopping');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                window.history.back() || (window.location.href = 'index.html');
            });
        }
    }

    renderCart() {
        const { cart } = this.appState.getState();
        this.lastCartState = [...cart];
        
        if (this.cartItems) {
            if (cart.length === 0) {
                this.renderEmptyCart();
            } else {
                this.renderCartItems(cart);
            }
        }
        
        if (this.cartSummary) {
            this.renderCartSummary(cart);
        }
        
        this.updateCartCounter(cart);
    }

    renderCartItems(cart) {
        this.cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item__image">
                    <img src="/assets/images/templates/template-${item.id}.webp" 
                         alt="${item.title}" 
                         loading="lazy">
                </div>
                
                <div class="cart-item__details">
                    <h3 class="cart-item__title">${item.title}</h3>
                    <div class="cart-item__meta">
                        <span class="cart-item__category">${item.category}</span>
                        <span class="cart-item__price">${formatPrice(item.price)}</span>
                    </div>
                </div>
                
                <div class="cart-item__quantity">
                    <button class="quantity-btn quantity-btn--decrease" 
                            aria-label="کاهش تعداد">
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" 
                           class="quantity-input" 
                           value="${item.quantity}" 
                           min="1" 
                           max="10"
                           aria-label="تعداد">
                    <button class="quantity-btn quantity-btn--increase" 
                            aria-label="افزایش تعداد">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div class="cart-item__total">
                    ${formatPrice(item.price * item.quantity)}
                </div>
                
                <button class="cart-item__remove" 
                        aria-label="حذف از سبد خرید">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    renderEmptyCart() {
        this.cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart__icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <h3 class="empty-cart__title">سبد خرید شما خالی است</h3>
                <p class="empty-cart__message">می‌توانید از فروشگاه ما دیدن کنید و قالب‌های زیبایی پیدا کنید.</p>
                <a href="index.html" class="btn btn--primary">
                    <i class="fas fa-arrow-left"></i>
                    بازگشت به فروشگاه
                </a>
            </div>
        `;
    }

    renderCartSummary(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.09; // 9% tax
        const total = subtotal + tax;
        
        this.cartSummary.innerHTML = `
            <div class="summary-row">
                <span>جمع کل:</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>مالیات (۹٪):</span>
                <span>${formatPrice(tax)}</span>
            </div>
            <div class="summary-row summary-row--total">
                <span>مبلغ قابل پرداخت:</span>
                <span>${formatPrice(total)}</span>
            </div>
            
            <button class="btn btn--primary btn--lg checkout-btn w-full">
                <i class="fas fa-lock"></i>
                ادامه فرآیند خرید
            </button>
            
            <a href="index.html" class="btn btn--outline continue-shopping w-full text-center">
                <i class="fas fa-arrow-left"></i>
                ادامه خرید
            </a>
        `;
    }

    updateCartCounter(cart) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    handleCartItemClick(event) {
        const cartItem = event.target.closest('.cart-item');
        if (!cartItem) return;
        
        const itemId = parseInt(cartItem.dataset.itemId);
        
        if (event.target.closest('.quantity-btn--decrease')) {
            this.decreaseQuantity(itemId);
        } else if (event.target.closest('.quantity-btn--increase')) {
            this.increaseQuantity(itemId);
        } else if (event.target.closest('.cart-item__remove')) {
            this.removeItem(itemId);
        }
    }

    handleQuantityChange(event) {
        if (event.target.classList.contains('quantity-input')) {
            const cartItem = event.target.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.itemId);
            const newQuantity = parseInt(event.target.value);
            
            if (newQuantity >= 1 && newQuantity <= 10) {
                this.updateQuantity(itemId, newQuantity);
            } else {
                // Reset to previous value
                const { cart } = this.appState.getState();
                const item = cart.find(item => item.id === itemId);
                event.target.value = item ? item.quantity : 1;
            }
        }
    }

    increaseQuantity(itemId) {
        const { cart } = this.appState.getState();
        const item = cart.find(item => item.id === itemId);
        
        if (item && item.quantity < 10) {
            this.updateQuantity(itemId, item.quantity + 1);
        } else {
            showToast('حداکثر تعداد مجاز ۱۰ عدد است', 'warning');
        }
    }

    decreaseQuantity(itemId) {
        const { cart } = this.appState.getState();
        const item = cart.find(item => item.id === itemId);
        
        if (item && item.quantity > 1) {
            this.updateQuantity(itemId, item.quantity - 1);
        } else {
            this.removeItem(itemId);
        }
    }

    updateQuantity(itemId, newQuantity) {
        const { cart } = this.appState.getState();
        const updatedCart = cart.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        
        this.appState.setState({ cart: updatedCart });
        showToast('تعداد به‌روز شد', 'success');
    }

    removeItem(itemId) {
        if (confirm('آیا از حذف این قالب از سبد خرید مطمئن هستید؟')) {
            this.appState.removeFromCart(itemId);
        }
    }

    async handleCheckout() {
        const { cart, user } = this.appState.getState();
        
        if (cart.length === 0) {
            showToast('سبد خرید شما خالی است', 'warning');
            return;
        }
        
        if (!user) {
            showToast('لطفاً برای ادامه خرید وارد حساب کاربری خود شوید', 'warning');
            window.location.href = `login.html?redirect=${encodeURIComponent('checkout.html')}`;
            return;
        }
        
        const spinner = showLoading(this.cartContainer);
        
        try {
            // Simulate checkout process
            await this.processCheckout(cart);
            
            // Clear cart after successful checkout
            this.appState.clearCart();
            
            showToast('سفارش شما با موفقیت ثبت شد!', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'checkout-success.html';
            }, 1500);
            
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('خطا در ثبت سفارش. لطفاً مجدداً تلاش کنید.', 'error');
        } finally {
            hideLoading(spinner);
        }
    }

    async processCheckout(cart) {
        // Simulate API call - replace with actual endpoint
        const response = await fetch('/api/checkout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify({
                items: cart,
                total: this.calculateTotal(cart)
            })
        });

        if (!response.ok) {
            throw new Error('Checkout failed');
        }

        return await response.json();
    }

    calculateTotal(cart) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.09;
        return subtotal + tax;
    }

    // Mini cart functionality
    toggleMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        if (miniCart) {
            miniCart.classList.toggle('mini-cart--open');
        }
    }

    // Quick add to cart
    async quickAddToCart(templateId, quantity = 1) {
        try {
            // Fetch template details
            const template = await this.fetchTemplateDetails(templateId);
            const cartItem = { ...template, quantity };
            
            this.appState.addToCart(cartItem);
            return true;
        } catch (error) {
            console.error('Quick add error:', error);
            showToast('خطا در افزودن به سبد خرید', 'error');
            return false;
        }
    }

    async fetchTemplateDetails(templateId) {
        // Simulate API call
        const response = await fetch(`/api/templates/${templateId}/`);
        if (!response.ok) {
            throw new Error('Template not found');
        }
        return await response.json();
    }

    // Export cart data
    exportCart() {
        const { cart } = this.appState.getState();
        const data = {
            items: cart,
            exportedAt: new Date().toISOString(),
            totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: this.calculateTotal(cart)
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cart-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import cart data
    importCart(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.items && Array.isArray(data.items)) {
                    this.appState.setState({ cart: data.items });
                    showToast('سبد خرید با موفقیت وارد شد', 'success');
                } else {
                    throw new Error('Invalid cart data');
                }
            } catch (error) {
                showToast('خطا در وارد کردن سبد خرید', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.app && window.app.state) {
        window.cartManager = new CartManager(window.app.state);
    }
});

export default CartManager;