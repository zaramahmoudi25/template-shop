 class DashboardManager {
            constructor() {
                this.currentSection = 'summary';
                this.init();
            }

            init() {
                this.setupNavigation();
                this.setupMobileMenu();
                this.initializeCharts();
            }

            setupNavigation() {
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.switchSection(item.dataset.section);
                        this.updateActiveNav(item);
                    });
                });

                document.querySelectorAll('.sidebar-link:not(.dropdown-toggle)').forEach(link => {
                    link.addEventListener('click', (e) => {
                        if (link.classList.contains('logout-btn')) return;
                        
                        e.preventDefault();
                        this.switchSection(link.dataset.section);
                        this.updateActiveNav(link);
                        
                        this.closeAllDropdowns();
                    });
                });

                this.switchSection('summary');
            }

            switchSection(sectionId) {
                document.querySelectorAll('.dashboard-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                const targetSection = document.getElementById(`section-${sectionId}`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    this.currentSection = sectionId;
                }
            }

            updateActiveNav(activeElement) {
                document.querySelectorAll('.sidebar-link').forEach(link => {
                    link.classList.remove('sidebar-link--active');
                });
                document.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
                    dropdownItem.classList.remove('active');
                });
                
                if (activeElement.classList.contains('dropdown-item')) {
                    activeElement.classList.add('active');
                } else {
                    activeElement.classList.add('sidebar-link--active');
                }
            }

            closeAllDropdowns() {
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    toggle.classList.remove('active');
                });
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }

            setupMobileMenu() {
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const sidebar = document.getElementById('sidebar');
                const sidebarOverlay = document.getElementById('sidebarOverlay');

                function toggleSidebar() {
                    sidebar.classList.toggle('active');
                    sidebarOverlay.classList.toggle('active');
                    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
                }

                if (mobileMenuBtn && sidebar && sidebarOverlay) {
                    mobileMenuBtn.addEventListener('click', toggleSidebar);
                    sidebarOverlay.addEventListener('click', toggleSidebar);
                }
            }

            initializeCharts() {
                // چارت درآمد کلی
                const totalEarningsCtx = document.getElementById('totalEarningsChart');
                if (totalEarningsCtx) {
                    new Chart(totalEarningsCtx, {
                        type: 'line',
                        data: {
                            labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                            datasets: [{
                                label: 'درآمد کل (هزار تومان)',
                                data: [1200, 1900, 1500, 2500, 2200, 3000],
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
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                // چارت توزیع پلتفرم
                const platformCtx = document.getElementById('platformDistributionChart');
                if (platformCtx) {
                    new Chart(platformCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['قالب‌ها', 'یوتیوب', 'ادسنس'],
                            datasets: [{
                                data: [1250, 850, 440],
                                backgroundColor: [
                                    '#3b82f6',
                                    '#ef4444',
                                    '#10b981'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                // سایر چارت‌ها
                this.initializeAdditionalCharts();
            }

            initializeAdditionalCharts() {
                // چارت‌های آمار قالب‌ها
                const templatesSalesCtx = document.getElementById('templatesSalesChart');
                if (templatesSalesCtx) {
                    new Chart(templatesSalesCtx, {
                        type: 'line',
                        data: {
                            labels: ['مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                            datasets: [{
                                label: 'فروش ماهانه',
                                data: [15, 22, 18, 25, 30, 28],
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
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                const templatesCategoryCtx = document.getElementById('templatesCategoryChart');
                if (templatesCategoryCtx) {
                    new Chart(templatesCategoryCtx, {
                        type: 'bar',
                        data: {
                            labels: ['فروشگاهی', 'شخصی', 'شرکتی', 'بلاگ', 'آموزشی'],
                            datasets: [{
                                label: 'تعداد فروش',
                                data: [40, 25, 20, 10, 5],
                                backgroundColor: [
                                    '#3b82f6',
                                    '#10b981',
                                    '#f59e0b',
                                    '#8b5cf6',
                                    '#ec4899'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                // چارت‌های جدید برای یوتیوب
                const youtubeViewsCtx = document.getElementById('youtubeViewsChart');
                if (youtubeViewsCtx) {
                    new Chart(youtubeViewsCtx, {
                        type: 'line',
                        data: {
                            labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                            datasets: [{
                                label: 'بازدید ماهانه (هزار)',
                                data: [32, 28, 35, 42, 38, 45],
                                borderColor: '#ef4444',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                const youtubeRevenueCtx = document.getElementById('youtubeRevenueChart');
                if (youtubeRevenueCtx) {
                    new Chart(youtubeRevenueCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['کانال اصلی', 'کانال آموزشی', 'کانال تفریحی', 'کانال تخصصی'],
                            datasets: [{
                                data: [450, 250, 100, 50],
                                backgroundColor: [
                                    '#ef4444',
                                    '#f97316',
                                    '#f59e0b',
                                    '#dc2626'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                // چارت‌های جدید برای ادسنس
                const adsenseRevenueCtx = document.getElementById('adsenseRevenueChart');
                if (adsenseRevenueCtx) {
                    new Chart(adsenseRevenueCtx, {
                        type: 'line',
                        data: {
                            labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
                            datasets: [{
                                label: 'درآمد ماهانه (هزار تومان)',
                                data: [320, 280, 350, 420, 380, 440],
                                borderColor: '#10b981',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    rtl: true
                                }
                            }
                        }
                    });
                }

                const adsensePerformanceCtx = document.getElementById('adsensePerformanceChart');
                if (adsensePerformanceCtx) {
                    new Chart(adsensePerformanceCtx, {
                        type: 'bar',
                        data: {
                            labels: ['وبلاگ فناوری', 'فروشگاه آنلاین', 'سایت آموزشی', 'پورتال خبری'],
                            datasets: [{
                                label: 'درآمد (هزار تومان)',
                                data: [180, 120, 80, 60],
                                backgroundColor: [
                                    '#10b981',
                                    '#059669',
                                    '#047857',
                                    '#065f46'
                                ]
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    rtl: true
                                }
                            }
                        }
                    });
                }
            }
        }

        // مدیریت منوی دراپ‌دان
        function toggleDropdown(element) {
            const dropdownMenu = element.nextElementSibling;
            const isActive = element.classList.contains('active');
            
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.classList.remove('active');
            });
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            
            if (!isActive) {
                element.classList.add('active');
                dropdownMenu.classList.add('show');
            }
        }

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    toggle.classList.remove('active');
                });
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            }
        });

        // مدیریت بخش رزومه
        let currentResumeTypes = [];
        let currentResumeData = {};

        function toggleResumeInput(type) {
            const checkbox = document.querySelector(`input[name="resumeType"][value="${type}"]`);
            const inputElement = document.getElementById(`resume${type.charAt(0).toUpperCase() + type.slice(1)}Input`);
            
            if (checkbox.checked) {
                if (!currentResumeTypes.includes(type)) {
                    currentResumeTypes.push(type);
                }
                if (inputElement) {
                    inputElement.classList.add('active');
                }
            } else {
                currentResumeTypes = currentResumeTypes.filter(t => t !== type);
                if (inputElement) {
                    inputElement.classList.remove('active');
                }
            }
        }

        function saveResume() {
            if (currentResumeTypes.length === 0) {
                alert('لطفاً حداقل یک نوع رزومه را انتخاب کنید.');
                return;
            }
            
            currentResumeData = {};
            let hasError = false;
            
            currentResumeTypes.forEach(type => {
                const inputElement = document.querySelector(`#resume${type.charAt(0).toUpperCase() + type.slice(1)}Input input`);
                
                if (!inputElement || !inputElement.value) {
                    alert(`لطفاً اطلاعات رزومه برای ${getResumeTypeName(type)} را وارد کنید.`);
                    hasError = true;
                    return;
                }
                
                currentResumeData[type] = {
                    value: inputElement.value,
                    timestamp: new Date().toLocaleString('fa-IR')
                };
            });
            
            if (hasError) return;
            
            const resumeInfo = document.getElementById('resumeInfo');
            const resumeTypesText = currentResumeTypes.map(type => getResumeTypeName(type)).join('، ');
            
            resumeInfo.textContent = `رزومه‌های انتخاب شده: ${resumeTypesText} - ${new Date().toLocaleString('fa-IR')}`;
            
            document.getElementById('uploadedResume').classList.add('active');
            document.querySelector('.resume-options').style.display = 'none';
            
            alert('رزومه شما با موفقیت ذخیره شد.');
        }

        function getResumeTypeName(type) {
            const names = {
                'image': 'تصویر',
                'github': 'گیت‌هاب',
                'website': 'وبسایت',
                'pdf': 'PDF'
            };
            return names[type] || type;
        }

        function editResume() {
            document.querySelector('.resume-options').style.display = 'flex';
            document.getElementById('uploadedResume').classList.remove('active');
            document.querySelectorAll('.resume-input input').forEach(input => {
                input.value = '';
            });
            document.querySelectorAll('.resume-input').forEach(input => {
                input.classList.remove('active');
            });
            currentResumeTypes = [];
            currentResumeData = {};
            document.querySelectorAll('input[name="resumeType"]').forEach(checkbox => {
                checkbox.checked = false;
            });
        }

        function viewResume() {
            if (Object.keys(currentResumeData).length > 0) {
                Object.keys(currentResumeData).forEach(type => {
                    const data = currentResumeData[type];
                    switch(type) {
                        case 'image':
                        case 'pdf':
                            alert(`نمایش فایل ${getResumeTypeName(type)} رزومه`);
                            break;
                        case 'github':
                        case 'website':
                            window.open(data.value, '_blank');
                            break;
                    }
                });
            }
        }

        // مدیریت فرم آپلود
        const featuresList = document.getElementById('featuresList');
        const addFeatureBtn = document.getElementById('addFeature');
        const featureInput = document.getElementById('featureInput');

        addFeatureBtn.addEventListener('click', function() {
            const feature = featureInput.value.trim();
            if (feature) {
                const featureElement = document.createElement('div');
                featureElement.className = 'feature-tag';
                featureElement.innerHTML = `
                    ${feature}
                    <button type="button" class="remove-feature">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                featuresList.appendChild(featureElement);
                featureInput.value = '';
                
                featureElement.querySelector('.remove-feature').addEventListener('click', function() {
                    featureElement.remove();
                });
            }
        });

        // اعتبارسنجی عنوان انگلیسی
        const titleInput = document.getElementById('templateTitle');
        titleInput.addEventListener('input', function() {
            const englishOnly = /^[A-Za-z0-9\s]*$/;
            if (!englishOnly.test(this.value)) {
                this.value = this.value.replace(/[^A-Za-z0-9\s]/g, '');
            }
        });

        // مدیریت تیک‌های تایید
        const agreeTerms = document.getElementById('agreeTerms');
        const notCopied = document.getElementById('notCopied');
        const submitBtn = document.getElementById('submitBtn');

        function checkAgreements() {
            submitBtn.disabled = !(agreeTerms.checked && notCopied.checked);
        }

        agreeTerms.addEventListener('change', checkAgreements);
        notCopied.addEventListener('change', checkAgreements);

        // مدیریت مودال قوانین
        function showTerms() {
            document.getElementById('termsModal').classList.add('show');
        }

        function hideTerms() {
            document.getElementById('termsModal').classList.remove('show');
        }

        // تابع ضبط صفحه (نمونه)
        function startScreenRecording() {
            alert('قابلیت ضبط صفحه به زودی اضافه خواهد شد. در حال حاضر می‌توانید از گزینه آپلود تصاویر استفاده کنید.');
        }

        // راه‌اندازی
        document.addEventListener('DOMContentLoaded', function() {
            window.currencyManager = new CurrencyManager();
            window.dashboardManager = new DashboardManager();

            // مدیریت خروج
            document.querySelectorAll('.logout-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (confirm('آیا از حساب کاربری خود خارج می‌شوید؟')) {
                        window.location.href = '/Pages/index.html';
                    }
                });
            });

            // بستن مودال با کلیک خارج
            document.getElementById('termsModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    hideTerms();
                }
            });

            // مدیریت ریسایز
            function handleResize() {
                if (window.innerWidth > 991.98) {
                    const sidebar = document.getElementById('sidebar');
                    const sidebarOverlay = document.getElementById('sidebarOverlay');
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }

            window.addEventListener('resize', handleResize);
        });