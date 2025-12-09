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



        // سیستم احراز هویت مودال
// سیستم احراز هویت مودال - VERSION 2.0
class VerificationSystem {
    constructor() {
        this.currentStep = 1;
        this.userVerificationData = {
            step1: null,
            step2: null,
            step3: null,
            nationality: 'iranian' // مقدار پیش‌فرض
        };
        this.loadVerificationData();
        this.initEventListeners();
    }

    init() {
        this.updateVerificationStatus();
        this.initializeNationality();
    }

    initializeNationality() {
        // تنظیم انتخاب ملیت بر اساس داده‌های ذخیره شده
        const nationality = this.userVerificationData.nationality || 'iranian';
        const radio = document.querySelector(`input[name="nationality"][value="${nationality}"]`);
        if (radio) {
            radio.checked = true;
            handleNationalityChange(radio);
        }
    }

    loadVerificationData() {
        const savedData = localStorage.getItem('userVerificationData');
        if (savedData) {
            this.userVerificationData = JSON.parse(savedData);
            this.updateVerificationDisplay();
        }
    }

    saveVerificationData() {
        localStorage.setItem('userVerificationData', JSON.stringify(this.userVerificationData));
        this.updateVerificationDisplay();
    }

    updateVerificationDisplay() {
        // بروزرسانی وضعیت در سایدبار
        const verificationLevel = this.getVerificationLevel();
        document.getElementById('verificationLevelText').textContent = verificationLevel.text;
        
        // بروزرسانی بج
        const badge = document.getElementById('verificationBadge');
        badge.className = 'verification-badge ' + verificationLevel.class;
        
        // بروزرسانی مراحل در مودال
        this.updateModalStatus();
    }

    getVerificationLevel() {
        if (this.userVerificationData.step3) {
            return { text: 'سطح ۳ (تکمیل شده)', class: 'level-3' };
        } else if (this.userVerificationData.step2) {
            return { text: 'سطح ۲', class: 'level-2' };
        } else if (this.userVerificationData.step1) {
            return { text: 'سطح ۱', class: 'level-1' };
        } else {
            return { text: 'تکمیل نشده', class: 'level-0' };
        }
    }

    updateModalStatus() {
        // مرحله ۱
        const step1Status = document.getElementById('step1StatusBadge');
        
        if (this.userVerificationData.step1) {
            step1Status.className = 'step-status-badge completed';
            step1Status.innerHTML = '<span class="status-dot"></span> تکمیل شده';
        }

        // مرحله ۲
        const step2Status = document.getElementById('step2StatusBadge');
        
        if (this.userVerificationData.step2) {
            step2Status.className = 'step-status-badge completed';
            step2Status.innerHTML = '<span class="status-dot"></span> تکمیل شده';
        } else if (this.userVerificationData.step1) {
            step2Status.className = 'step-status-badge pending';
            step2Status.innerHTML = '<span class="status-dot"></span> در انتظار';
        }

        // مرحله ۳
        const step3Status = document.getElementById('step3StatusBadge');
        
        if (this.userVerificationData.step3) {
            step3Status.className = 'step-status-badge completed';
            step3Status.innerHTML = '<span class="status-dot"></span> تکمیل شده';
        } else if (this.userVerificationData.step2) {
            step3Status.className = 'step-status-badge pending';
            step3Status.innerHTML = '<span class="status-dot"></span> در انتظار';
        }
    }

    updateVerificationStatus() {
        // محاسبه درصد پیشرفت
        let progress = 0;
        if (this.userVerificationData.step1) progress += 33;
        if (this.userVerificationData.step2) progress += 33;
        if (this.userVerificationData.step3) progress += 34;
        
        // بروزرسانی نوار پیشرفت
        const progressFill = document.getElementById('verificationProgressFill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }

        // بروزرسانی مراحل فعال
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.remove('active', 'completed');
            
            if (stepNum <= this.currentStep) {
                step.classList.add('active');
            }
            
            if ((stepNum === 1 && this.userVerificationData.step1) ||
                (stepNum === 2 && this.userVerificationData.step2) ||
                (stepNum === 3 && this.userVerificationData.step3)) {
                step.classList.add('completed');
            }
        });
    }

    goToStep(step) {
        if (step < 1 || step > 3) return;
        
        // بررسی مجوز دسترسی به مرحله
        if (step === 2 && !this.userVerificationData.step1) {
            alert('لطفاً ابتدا مرحله ۱ را تکمیل کنید.');
            return;
        }
        
        if (step === 3 && !this.userVerificationData.step2) {
            alert('لطفاً ابتدا مرحله ۲ را تکمیل کنید.');
            return;
        }

        this.currentStep = step;
        
        // مخفی کردن همه مراحل
        document.querySelectorAll('.verification-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // نمایش مرحله جاری
        const currentStepEl = document.getElementById(`modalStep${step}`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        this.updateVerificationStatus();
    }

    submitStep1() {
        const phoneNumber = document.getElementById('modalPhoneNumber').value.trim();
        const cardNumber = document.getElementById('modalCardNumber').value.trim();
        const nationality = document.querySelector('input[name="nationality"]:checked').value;
        
        // اعتبارسنجی
        if (!phoneNumber) {
            alert('لطفاً شماره موبایل وارد کنید');
            return;
        }
        
        if (!cardNumber || !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumber)) {
            alert('لطفاً شماره کارت معتبر وارد کنید (6037-XXXX-XXXX-XXXX)');
            return;
        }
        
        // ذخیره داده‌ها
        this.userVerificationData.step1 = {
            phoneNumber,
            cardNumber,
            nationality,
            submittedAt: new Date().toISOString()
        };
        
        this.saveVerificationData();
        this.goToStep(2);
        
        // فعال کردن دکمه مرحله ۲
        const step2Btn = document.getElementById('submitModalStep2Btn');
        if (step2Btn) {
            step2Btn.disabled = false;
        }
        
        alert('مرحله ۱ با موفقیت تکمیل شد!');
    }

    submitStep2() {
        const cardFront = document.getElementById('modalNationalCardFront');
        const cardBack = document.getElementById('modalNationalCardBack');
        
        if (!cardFront.files[0] || !cardBack.files[0]) {
            alert('لطفاً هر دو تصویر مدارک شناسایی را بارگذاری کنید.');
            return;
        }
        
        // ذخیره داده‌ها
        this.userVerificationData.step2 = {
            frontFile: cardFront.files[0].name,
            backFile: cardBack.files[0].name,
            submittedAt: new Date().toISOString()
        };
        
        this.saveVerificationData();
        this.goToStep(3);
        
        // فعال کردن دکمه مرحله ۳
        const step3Btn = document.getElementById('submitModalStep3Btn');
        if (step3Btn) {
            step3Btn.disabled = false;
        }
        
        alert('مرحله ۲ با موفقیت تکمیل شد! ویدیو خود را ضبط کنید.');
    }

    submitStep3() {
        if (!this.recordedVideoBlob) {
            alert('لطفاً ابتدا ویدیوی خود را ضبط کنید.');
            return;
        }
        
        // ذخیره داده‌ها
        this.userVerificationData.step3 = {
            videoSubmitted: true,
            submittedAt: new Date().toISOString(),
            duration: this.recordingDuration || 0
        };
        
        this.saveVerificationData();
        
        alert('احراز هویت شما با موفقیت ثبت شد! ✅\n\nویدیوی شما برای بررسی ارسال شد. نتیجه بررسی حداکثر تا ۴۸ ساعت آینده اعلام خواهد شد.');
        
        // بستن مودال پس از ۳ ثانیه
        setTimeout(() => {
            closeVerificationModal();
        }, 3000);
    }

    initEventListeners() {
        // فرمت شماره کارت
        const cardInput = document.getElementById('modalCardNumber');
        if (cardInput) {
            cardInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 16) value = value.substr(0, 16);
                
                let formatted = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += '-';
                    formatted += value[i];
                }
                
                e.target.value = formatted;
            });
        }

        // فرمت شماره موبایل
        const phoneInput = document.getElementById('modalPhoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 11) value = value.substr(0, 11);
                e.target.value = value;
            });
        }

        // کلیک روی مراحل پیشرفت
        document.querySelectorAll('.progress-step').forEach(step => {
            step.addEventListener('click', () => {
                const stepNum = parseInt(step.dataset.step);
                this.goToStep(stepNum);
            });
        });
    }

    // متغیرهای ضبط ویدیو
    recordedVideoBlob = null;
    mediaRecorder = null;
    recordedChunks = [];
    recordingDuration = 0;
    recordingTimer = null;
    recordingStartTime = null;

    startRecording() {
        navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        })
        .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.recordedChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                this.recordedVideoBlob = new Blob(this.recordedChunks, { 
                    type: 'video/webm' 
                });
                
                const videoURL = URL.createObjectURL(this.recordedVideoBlob);
                const videoElement = document.getElementById('modalRecordedVideo');
                const videoPreview = document.getElementById('modalVideoPreview');
                
                videoElement.src = videoURL;
                videoElement.style.display = 'block';
                videoPreview.querySelector('.video-placeholder').style.display = 'none';
                
                // فعال کردن دکمه‌ها
                document.getElementById('modalPlayRecordingBtn').disabled = false;
                document.getElementById('modalRetryRecordingBtn').disabled = false;
                document.getElementById('submitModalStep3Btn').disabled = false;
                
                // متوقف کردن استریم
                stream.getTracks().forEach(track => track.stop());
            };
            
            // شروع ضبط
            this.mediaRecorder.start();
            this.recordingStartTime = Date.now();
            
            // شروع تایمر
            this.startRecordingTimer();
            
            // به‌روزرسانی دکمه‌ها
            document.getElementById('modalStartRecordingBtn').disabled = true;
            document.getElementById('modalStopRecordingBtn').disabled = false;
            document.getElementById('modalPlayRecordingBtn').disabled = true;
            document.getElementById('modalRetryRecordingBtn').disabled = true;
            
            // نمایش تایمر
            const timerElement = document.getElementById('modalRecordingTimer');
            if (timerElement) {
                timerElement.style.display = 'inline-flex';
            }
        })
        .catch(err => {
            console.error('خطا در دسترسی به دوربین:', err);
            alert('دسترسی به دوربین/میکروفون مجاز نیست. لطفاً تنظیمات مرورگر خود را بررسی کنید.');
        });
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.recordingDuration = Date.now() - this.recordingStartTime;
            
            // متوقف کردن تایمر
            this.stopRecordingTimer();
            
            // به‌روزرسانی دکمه‌ها
            document.getElementById('modalStartRecordingBtn').disabled = false;
            document.getElementById('modalStopRecordingBtn').disabled = true;
            
            // مخفی کردن تایمر
            const timerElement = document.getElementById('modalRecordingTimer');
            if (timerElement) {
                timerElement.style.display = 'none';
            }
        }
    }

    startRecordingTimer() {
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            const seconds = Math.floor(elapsed / 1000);
            const display = document.getElementById('modalTimerDisplay');
            
            if (display) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                display.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
            
            // توقف خودکار بعد از ۳۰ ثانیه
            if (seconds >= 30) {
                this.stopRecording();
                alert('حداکثر زمان ضبط (۳۰ ثانیه) به پایان رسید.');
            }
        }, 1000);
    }

    stopRecordingTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }

    playRecording() {
        const videoElement = document.getElementById('modalRecordedVideo');
        if (videoElement && videoElement.src) {
            videoElement.play();
        }
    }

    retryRecording() {
        if (confirm('آیا مطمئن هستید که می‌خواهید ویدیوی جدید ضبط کنید؟')) {
            this.recordedVideoBlob = null;
            this.recordedChunks = [];
            this.recordingDuration = 0;
            
            const videoElement = document.getElementById('modalRecordedVideo');
            const videoPreview = document.getElementById('modalVideoPreview');
            
            videoElement.src = '';
            videoElement.style.display = 'none';
            videoPreview.querySelector('.video-placeholder').style.display = 'flex';
            
            // غیرفعال کردن دکمه‌ها
            document.getElementById('modalPlayRecordingBtn').disabled = true;
            document.getElementById('modalRetryRecordingBtn').disabled = true;
            document.getElementById('submitModalStep3Btn').disabled = true;
            document.getElementById('modalStartRecordingBtn').disabled = false;
            
            // ریست تایمر
            const timerElement = document.getElementById('modalRecordingTimer');
            if (timerElement) {
                timerElement.style.display = 'none';
                document.getElementById('modalTimerDisplay').textContent = '00:00';
            }
        }
    }
}

// متغیرهای جهانی
let verificationSystem = null;

// ==================== توابع عمومی ====================

// تابع مدیریت تغییر ملیت
function handleNationalityChange(radio) {
    const nationality = radio.value;
    const uploadItems = document.querySelectorAll('.upload-item');
    const step2Header = document.querySelector('#modalStep2 .step-header h3');
    const step2Icon = document.querySelector('#modalStep2 .step-header h3 i');
    
    if (nationality === 'afghan') {
        // تغییر آیکون و عنوان مرحله ۲
        if (step2Icon) step2Icon.className = 'fas fa-passport';
        if (step2Header) step2Header.innerHTML = '<i class="fas fa-passport"></i> مرحله ۲: مدارک تذکره';
        
        // تغییر متن برای افغانستانی‌ها
        document.querySelector('[for="modalPhoneNumber"]').innerHTML = 
            '<i class="fas fa-mobile-alt"></i> شماره موبایل (افغانستان) *';
        
        // تغییر متن مدارک
        uploadItems[0].querySelector('.upload-title').textContent = 'روی تذکره';
        uploadItems[0].querySelector('.upload-subtitle').textContent = 'تصویر واضح از روی تذکره';
        uploadItems[1].querySelector('.upload-title').textContent = 'پشت تذکره';
        uploadItems[1].querySelector('.upload-subtitle').textContent = 'تصویر واضح از پشت تذکره';
        
        // تغییر متن ویدیو
        const textToRead = document.querySelector('.verification-text p');
        if (textToRead) {
            textToRead.textContent = '«من به عنوان کاربر افغانستانی سایت ایران اد پی رسماً اعلام می‌کنم که با شرکت ایران اد پی همکاری داشته و کلیه مسئولیت‌های ناشی از این همکاری را به طور کامل می‌پذیرم. متعهد می‌شوم تمام فعالیت‌هایم مطابق با قوانین جمهوری اسلامی ایران باشد.»';
        }
        
        // تغییر دستورالعمل ویدیو
        const videoInstructions = document.querySelectorAll('.instructions-list li');
        if (videoInstructions[4]) {
            videoInstructions[4].innerHTML = '<i class="fas fa-passport"></i> تذکره را در ابتدای ویدیو نشان دهید';
        }
        
    } else {
        // بازگشت به حالت ایرانی
        if (step2Icon) step2Icon.className = 'fas fa-id-card-alt';
        if (step2Header) step2Header.innerHTML = '<i class="fas fa-id-card-alt"></i> مرحله ۲: مدارک شناسایی';
        
        document.querySelector('[for="modalPhoneNumber"]').innerHTML = 
            '<i class="fas fa-mobile-alt"></i> شماره موبایل *';
        
        uploadItems[0].querySelector('.upload-title').textContent = 'روی کارت ملی';
        uploadItems[0].querySelector('.upload-subtitle').textContent = 'تصویر واضح از روی کارت ملی';
        uploadItems[1].querySelector('.upload-title').textContent = 'پشت کارت ملی';
        uploadItems[1].querySelector('.upload-subtitle').textContent = 'تصویر واضح از پشت کارت ملی';
        
        const textToRead = document.querySelector('.verification-text p');
        if (textToRead) {
            textToRead.textContent = '«من به عنوان کاربر سایت ایران اد پی رسماً اعلام می‌کنم که با شرکت ایران اد پی همکاری داشته و کلیه مسئولیت‌های ناشی از این همکاری را به طور کامل می‌پذیرم. متعهد می‌شوم تمام فعالیت‌هایم مطابق با قوانین جمهوری اسلامی ایران باشد.»';
        }
        
        const videoInstructions = document.querySelectorAll('.instructions-list li');
        if (videoInstructions[4]) {
            videoInstructions[4].innerHTML = '<i class="fas fa-id-card"></i> کارت ملی را در ابتدای ویدیو نشان دهید';
        }
    }
    
    // ذخیره انتخاب ملیت
    if (verificationSystem) {
        verificationSystem.userVerificationData.nationality = nationality;
        verificationSystem.saveVerificationData();
    }
}

function openVerificationModal() {
    const modal = document.getElementById('verificationModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // مقداردهی اولیه سیستم
    if (!verificationSystem) {
        verificationSystem = new VerificationSystem();
        verificationSystem.init();
    }
    
    // رفتن به آخرین مرحله تکمیل شده
    let targetStep = 1;
    if (verificationSystem.userVerificationData.step3) {
        targetStep = 3;
    } else if (verificationSystem.userVerificationData.step2) {
        targetStep = 3;
    } else if (verificationSystem.userVerificationData.step1) {
        targetStep = 2;
    }
    
    verificationSystem.goToStep(targetStep);
}

function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // متوقف کردن ضبط اگر فعال است
    if (verificationSystem && verificationSystem.mediaRecorder && 
        verificationSystem.mediaRecorder.state === 'recording') {
        verificationSystem.stopRecording();
    }
}

function openFileUpload(inputId) {
    document.getElementById(`modal${inputId}`).click();
}

function previewImage(input, previewId) {
    const file = input.files[0];
    if (!file) return;
    
    // بررسی اندازه فایل (حداکثر 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از ۵ مگابایت باشد.');
        input.value = '';
        return;
    }
    
    // بررسی فرمت
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
        alert('فرمت فایل باید JPG یا PNG باشد.');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(previewId);
        preview.innerHTML = `<img src="${e.target.result}" alt="پیش‌نمایش">`;
        
        // فعال کردن دکمه ارسال اگر هر دو تصویر آپلود شده باشند
        const cardFront = document.getElementById('modalNationalCardFront').files[0];
        const cardBack = document.getElementById('modalNationalCardBack').files[0];
        const submitBtn = document.getElementById('submitModalStep2Btn');
        
        if (cardFront && cardBack && submitBtn) {
            submitBtn.disabled = false;
        }
    };
    reader.readAsDataURL(file);
}

// توابع مرحله‌ای
function submitModalStep1() {
    if (verificationSystem) {
        verificationSystem.submitStep1();
    }
}

function submitModalStep2() {
    if (verificationSystem) {
        verificationSystem.submitStep2();
    }
}

function submitModalStep3() {
    if (verificationSystem) {
        verificationSystem.submitStep3();
    }
}

function goToModalStep(step) {
    if (verificationSystem) {
        verificationSystem.goToStep(step);
    }
}

// توابع ضبط ویدیو
function startModalRecording() {
    if (verificationSystem) {
        verificationSystem.startRecording();
    }
}

function stopModalRecording() {
    if (verificationSystem) {
        verificationSystem.stopRecording();
    }
}

function playModalRecording() {
    if (verificationSystem) {
        verificationSystem.playRecording();
    }
}

function retryModalRecording() {
    if (verificationSystem) {
        verificationSystem.retryRecording();
    }
}

// بستن مودال با کلیک خارج
document.getElementById('verificationModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeVerificationModal();
    }
});

// بستن مودال با کلید ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && document.getElementById('verificationModal').classList.contains('show')) {
        closeVerificationModal();
    }
});

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    verificationSystem = new VerificationSystem();
    verificationSystem.init();
});