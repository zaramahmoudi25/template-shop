import { showToast, showLoading, hideLoading, validateEmail, validatePassword, handleApiError } from './utils';

class AuthManager {
    constructor(appState) {
        this.appState = appState;
        this.loginForm = document.querySelector('#loginForm');
        this.signupForm = document.querySelector('#signupForm');
        this.logoutButtons = document.querySelectorAll('.logout-btn');
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupSignupForm();
        this.setupLogout();
        this.checkAuthStatus();
    }

    setupLoginForm() {
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
            
            // Real-time validation
            const emailInput = this.loginForm.querySelector('#email');
            const passwordInput = this.loginForm.querySelector('#password');
            
            if (emailInput) {
                emailInput.addEventListener('blur', () => this.validateEmailField(emailInput));
            }
            if (passwordInput) {
                passwordInput.addEventListener('blur', () => this.validatePasswordField(passwordInput));
            }
        }
    }

    setupSignupForm() {
        if (this.signupForm) {
            this.signupForm.addEventListener('submit', this.handleSignup.bind(this));
            
            // Real-time validation
            const inputs = this.signupForm.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
            });
        }
    }

    setupLogout() {
        this.logoutButtons.forEach(button => {
            button.addEventListener('click', this.handleLogout.bind(this));
        });
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(this.loginForm);
        const credentials = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        if (!this.validateLoginForm(credentials)) {
            return;
        }

        const spinner = showLoading(this.loginForm);
        
        try {
            const user = await this.performLogin(credentials);
            this.appState.setUser(user);
            showToast('با موفقیت وارد شدید!', 'success');
            
            // Redirect to dashboard or previous page
            setTimeout(() => {
                const redirectTo = new URLSearchParams(window.location.search).get('redirect') || 'dashboard.html';
                window.location.href = redirectTo;
            }, 1000);
            
        } catch (error) {
            handleApiError(error);
        } finally {
            hideLoading(spinner);
        }
    }

    async handleSignup(event) {
        event.preventDefault();
        
        const formData = new FormData(this.signupForm);
        const userData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        if (!this.validateSignupForm(userData)) {
            return;
        }

        const spinner = showLoading(this.signupForm);
        
        try {
            const user = await this.performSignup(userData);
            this.appState.setUser(user);
            showToast('حساب کاربری با موفقیت ایجاد شد!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            handleApiError(error);
        } finally {
            hideLoading(spinner);
        }
    }

    async handleLogout(event) {
        event.preventDefault();
        
        try {
            await this.performLogout();
            this.appState.logout();
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
            
        } catch (error) {
            handleApiError(error);
            // Force logout anyway
            this.appState.logout();
            window.location.href = 'index.html';
        }
    }

    validateLoginForm(credentials) {
        let isValid = true;
        
        if (!validateEmail(credentials.email)) {
            this.showFieldError('email', 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        if (!validatePassword(credentials.password)) {
            this.showFieldError('password', 'رمز عبور باید حداقل ۸ کاراکتر باشد');
            isValid = false;
        }
        
        return isValid;
    }

    validateSignupForm(userData) {
        let isValid = true;
        
        if (!userData.username || userData.username.length < 3) {
            this.showFieldError('username', 'نام کاربری باید حداقل ۳ کاراکتر باشد');
            isValid = false;
        }
        
        if (!validateEmail(userData.email)) {
            this.showFieldError('email', 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        if (!validatePassword(userData.password)) {
            this.showFieldError('password', 'رمز عبور باید حداقل ۸ کاراکتر باشد');
            isValid = false;
        }
        
        if (userData.password !== userData.confirmPassword) {
            this.showFieldError('confirmPassword', 'رمز عبور و تکرار آن مطابقت ندارند');
            isValid = false;
        }
        
        return isValid;
    }

    validateEmailField(input) {
        if (!validateEmail(input.value)) {
            this.showFieldError(input.name, 'لطفاً یک ایمیل معتبر وارد کنید');
            return false;
        } else {
            this.clearFieldError(input.name);
            return true;
        }
    }

    validatePasswordField(input) {
        if (!validatePassword(input.value)) {
            this.showFieldError(input.name, 'رمز عبور باید حداقل ۸ کاراکتر باشد');
            return false;
        } else {
            this.clearFieldError(input.name);
            return true;
        }
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        
        if (!value && input.required) {
            this.showFieldError(fieldName, 'این فیلد اجباری است');
            return false;
        }
        
        this.clearFieldError(fieldName);
        return true;
    }

    showFieldError(fieldName, message) {
        // Remove existing error
        this.clearFieldError(fieldName);
        
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (!input) return;
        
        // Add error class to input
        input.classList.add('form-control--error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.id = `${fieldName}-error`;
        errorElement.textContent = message;
        
        // Insert after input
        input.parentNode.appendChild(errorElement);
        
        // Focus on invalid field
        input.focus();
    }

    clearFieldError(fieldName) {
        const input = document.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (input) {
            input.classList.remove('form-control--error');
        }
        
        if (errorElement) {
            errorElement.remove();
        }
    }

    async performLogin(credentials) {
        // Simulate API call - replace with actual endpoint
        const response = await fetch('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        return data.user;
    }

    async performSignup(userData) {
        // Simulate API call - replace with actual endpoint
        const response = await fetch('/api/auth/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Signup failed');
        }

        const data = await response.json();
        return data.user;
    }

    async performLogout() {
        // Simulate API call - replace with actual endpoint
        const response = await fetch('/api/auth/logout/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            }
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/user/', {
                credentials: 'include'
            });

            if (response.ok) {
                const user = await response.json();
                this.appState.setUser(user);
            }
        } catch (error) {
            console.log('Not authenticated');
        }
    }

    // Social login methods
    async loginWithGoogle() {
        try {
            // Implement Google OAuth
            window.location.href = '/api/auth/google/';
        } catch (error) {
            handleApiError(error);
        }
    }

    async loginWithGitHub() {
        try {
            // Implement GitHub OAuth
            window.location.href = '/api/auth/github/';
        } catch (error) {
            handleApiError(error);
        }
    }

    // Password reset methods
    async requestPasswordReset(email) {
        try {
            const response = await fetch('/api/auth/password/reset/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Password reset request failed');
            }

            showToast('لینک بازنشانی رمز عبور به ایمیل شما ارسال شد', 'success');
        } catch (error) {
            handleApiError(error);
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const response = await fetch('/api/auth/password/reset/confirm/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken()
                },
                body: JSON.stringify({ token, new_password: newPassword })
            });

            if (!response.ok) {
                throw new Error('Password reset failed');
            }

            showToast('رمز عبور با موفقیت تغییر کرد', 'success');
            return true;
        } catch (error) {
            handleApiError(error);
            return false;
        }
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.app && window.app.state) {
        window.authManager = new AuthManager(window.app.state);
    }
});

export default AuthManager;