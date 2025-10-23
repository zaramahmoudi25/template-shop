import { showToast, showLoading, hideLoading, handleApiError } from './utils';

class DashboardManager {
    constructor(appState) {
        this.appState = appState;
        this.currentSection = 'summary';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.loadDashboardData();
        this.setupFileUpload();
        this.setupCharts();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar__link[data-section]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Set initial active section
        this.switchSection(this.currentSection);
    }

    switchSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show target section
        const targetSection = document.getElementById(`section-${sectionName}`);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = sectionName;
        }

        // Update active nav link
        document.querySelectorAll('.sidebar__link').forEach(link => {
            link.classList.remove('sidebar__link--active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('sidebar__link--active');
        }

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    async loadDashboardData() {
        try {
            const data = await this.fetchDashboardData();
            this.updateDashboardUI(data);
        } catch (error) {
            handleApiError(error);
        }
    }

    async loadSectionData(sectionName) {
        switch (sectionName) {
            case 'templates':
                await this.loadUserTemplates();
                break;
            case 'purchases':
                await this.loadPurchaseHistory();
                break;
            case 'sales':
                await this.loadSalesData();
                break;
            case 'analytics':
                await this.loadAnalytics();
                break;
        }
    }

    async fetchDashboardData() {
        const response = await fetch('/api/dashboard/summary/');
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }
        return await response.json();
    }

    updateDashboardUI(data) {
        // Update summary cards
        this.updateSummaryCard('uploads', data.totalUploads);
        this.updateSummaryCard('purchases', data.totalPurchases);
        this.updateSummaryCard('earnings', data.totalEarnings);
        this.updateSummaryCard('customers', data.totalCustomers);

        // Update recent activity
        if (data.recentActivity) {
            this.updateRecentActivity(data.recentActivity);
        }
    }

    updateSummaryCard(type, value) {
        const card = document.querySelector(`.summary-card--${type}`);
        if (card) {
            const numberElement = card.querySelector('.summary-number');
            if (numberElement) {
                numberElement.textContent = this.formatNumber(value, type);
            }
        }
    }

    formatNumber(value, type) {
        switch (type) {
            case 'earnings':
                return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
            default:
                return new Intl.NumberFormat('fa-IR').format(value);
        }
    }

    updateRecentActivity(activities) {
        const container = document.querySelector('.recent-activity');
        if (!container) return;

        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-item__icon">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-item__content">
                    <p class="activity-item__title">${activity.title}</p>
                    <span class="activity-item__time">${this.formatTime(activity.timestamp)}</span>
                </div>
                <div class="activity-item__amount">
                    ${activity.amount ? this.formatNumber(activity.amount, 'earnings') : ''}
                </div>
            </div>
        `).join('');
    }

    getActivityIcon(type) {
        const icons = {
            upload: 'cloud-upload-alt',
            purchase: 'shopping-bag',
            sale: 'dollar-sign',
            download: 'download',
            message: 'envelope'
        };
        return icons[type] || 'circle';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) {
            return `${minutes} دقیقه پیش`;
        } else if (hours < 24) {
            return `${hours} ساعت پیش`;
        } else {
            return `${days} روز پیش`;
        }
    }

    setupFileUpload() {
        const uploadForm = document.querySelector('#templateUploadForm');
        const fileInput = document.querySelector('#templateFile');
        const preview = document.querySelector('.file-preview');
        
        if (fileInput && preview) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e, preview);
            });
        }
        
        if (uploadForm) {
            uploadForm.addEventListener('submit', this.handleTemplateUpload.bind(this));
        }
    }

    handleFileSelect(event, preview) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['application/zip', 'application/x-zip-compressed'];
        if (!validTypes.includes(file.type)) {
            showToast('لطفاً یک فایل ZIP معتبر انتخاب کنید', 'error');
            event.target.value = '';
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            showToast('حجم فایل نباید بیشتر از ۵۰ مگابایت باشد', 'error');
            event.target.value = '';
            return;
        }

        // Show file info
        preview.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-archive"></i>
                <div class="file-details">
                    <p class="file-name">${file.name}</p>
                    <p class="file-size">${this.formatFileSize(file.size)}</p>
                </div>
                <button type="button" class="btn btn--ghost btn--sm remove-file">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Remove file handler
        preview.querySelector('.remove-file').addEventListener('click', () => {
            event.target.value = '';
            preview.innerHTML = '';
        });
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    async handleTemplateUpload(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        
        if (!this.validateTemplateForm(formData)) {
            return;
        }

        const spinner = showLoading(form);
        
        try {
            const result = await this.uploadTemplate(formData);
            showToast('قالب با موفقیت آپلود شد!', 'success');
            form.reset();
            document.querySelector('.file-preview').innerHTML = '';
            
            // Refresh templates list
            if (this.currentSection === 'templates') {
                await this.loadUserTemplates();
            }
            
        } catch (error) {
            handleApiError(error);
        } finally {
            hideLoading(spinner);
        }
    }

    validateTemplateForm(formData) {
        const title = formData.get('title');
        const price = formData.get('price');
        const category = formData.get('category');
        const file = formData.get('file');
        
        if (!title || title.length < 3) {
            showToast('عنوان قالب باید حداقل ۳ کاراکتر باشد', 'error');
            return false;
        }
        
        if (!price || parseFloat(price) < 0) {
            showToast('قیمت معتبر وارد کنید', 'error');
            return false;
        }
        
        if (!category) {
            showToast('لطفاً دسته‌بندی را انتخاب کنید', 'error');
            return false;
        }
        
        if (!file || file.size === 0) {
            showToast('لطفاً فایل قالب را انتخاب کنید', 'error');
            return false;
        }
        
        return true;
    }

    async uploadTemplate(formData) {
        const response = await fetch('/api/templates/upload/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    }

    async loadUserTemplates() {
        try {
            const templates = await this.fetchUserTemplates();
            this.renderUserTemplates(templates);
        } catch (error) {
            handleApiError(error);
        }
    }

    async fetchUserTemplates() {
        const response = await fetch('/api/templates/my-templates/');
        if (!response.ok) {
            throw new Error('Failed to fetch templates');
        }
        return await response.json();
    }

    renderUserTemplates(templates) {
        const container = document.querySelector('.user-templates');
        if (!container) return;

        if (templates.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h3>هنوز قالبی آپلود نکرده‌اید</h3>
                    <p>اولین قالب خود را آپلود کنید و شروع به فروش کنید</p>
                </div>
            `;
            return;
        }

        container.innerHTML = templates.map(template => `
            <div class="template-item" data-template-id="${template.id}">
                <div class="template-item__image">
                    <img src="${template.thumbnail}" alt="${template.title}" loading="lazy">
                    <div class="template-item__actions">
                        <button class="btn btn--sm btn--outline edit-template" 
                                data-template-id="${template.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn--sm btn--outline delete-template" 
                                data-template-id="${template.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="template-item__info">
                    <h4 class="template-item__title">${template.title}</h4>
                    <p class="template-item__description">${template.description}</p>
                    <div class="template-item__meta">
                        <span class="template-item__price">${formatPrice(template.price)}</span>
                        <span class="template-item__sales">${template.sales} فروش</span>
                        <span class="template-item__rating">
                            <i class="fas fa-star"></i> ${template.rating}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners
        this.addTemplateEventListeners();
    }

    addTemplateEventListeners() {
        // Edit template
        document.querySelectorAll('.edit-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = e.target.closest('.edit-template').dataset.templateId;
                this.editTemplate(parseInt(templateId));
            });
        });

        // Delete template
        document.querySelectorAll('.delete-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const templateId = e.target.closest('.delete-template').dataset.templateId;
                this.deleteTemplate(parseInt(templateId));
            });
        });
    }

    async editTemplate(templateId) {
        // Implement template editing
        console.log('Edit template:', templateId);
    }

    async deleteTemplate(templateId) {
        if (!confirm('آیا از حذف این قالب مطمئن هستید؟ این عمل قابل بازگشت نیست.')) {
            return;
        }

        try {
            await fetch(`/api/templates/${templateId}/`, {
                method: 'DELETE',
                headers: {
                    'X-CSRFToken': getCSRFToken()
                }
            });

            showToast('قالب با موفقیت حذف شد', 'success');
            await this.loadUserTemplates();
        } catch (error) {
            handleApiError(error);
        }
    }

    setupCharts() {
        // Initialize charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            this.initEarningsChart();
            this.initSalesChart();
        }
    }

    initEarningsChart() {
        const ctx = document.getElementById('earningsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                datasets: [{
                    label: 'درآمد (تومان)',
                    data: [1200000, 1900000, 1500000, 2500000, 2200000, 3000000],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Sahel'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString('fa-IR') + ' تومان';
                            }
                        }
                    }
                }
            }
        });
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['فروشگاهی', 'شخصی', 'شرکتی', 'بلاگ', 'آموزشی'],
                datasets: [{
                    label: 'تعداد فروش',
                    data: [12, 19, 8, 15, 7],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(139, 92, 246, 0.8)',
                        'rgba(14, 165, 233, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Sahel'
                            }
                        }
                    }
                }
            }
        });
    }

    // Export dashboard data
    exportData() {
        const data = {
            exportedAt: new Date().toISOString(),
            section: this.currentSection
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast('داده‌ها با موفقیت export شدند', 'success');
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.app && window.app.state) {
        window.dashboardManager = new DashboardManager(window.app.state);
    }
});

export default DashboardManager;