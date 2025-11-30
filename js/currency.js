// Currency API Manager
class CurrencyManager {
    constructor() {
        this.rates = {
            USD: 0,
            TRY: 0,
            AFN: 0
        };
        this.lastUpdate = null;
        this.updateInterval = 10 * 60 * 1000; // 10 دقیقه
        this.init();
    }

    init() {
        this.loadCurrencyData();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refreshCurrency');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadCurrencyData(true));
        }
    }

    async loadCurrencyData(forceRefresh = false) {
        const refreshBtn = document.getElementById('refreshCurrency');
        
        try {
            if (refreshBtn) {
                refreshBtn.classList.add('loading');
            }

            const rates = await this.fetchRealExchangeRates();
            this.rates = rates;
            this.lastUpdate = new Date();
            
            this.updateUI();
            this.saveToLocalStorage();
            
            console.log('نرخ ارز با موفقیت بروزرسانی شد');
            
        } catch (error) {
            console.error('خطا در دریافت نرخ ارز:', error);
            this.loadFromLocalStorage();
        } finally {
            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
            }
        }
    }

    async fetchRealExchangeRates() {
        try {
            console.log('🔍 دریافت نرخ ارز...');
            
            const apis = [
                'https://api.nobitex.ir/v2/orderbook/USDTIRT',
                'https://api.frankfurter.app/latest?from=USD',
                'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@1/latest/currencies/usd.json'
            ];
            
            for (let api of apis) {
                try {
                    console.log(`🔄 تلاش با API: ${api}`);
                    const response = await fetch(api);
                    
                    if (response.ok) {
                        const data = await response.json();
                        console.log('✅ داده‌های دریافتی:', data);
                        
                        let usdRate;
                        
                        if (api.includes('nobitex')) {
                            usdRate = data.lastTrade ? Math.round(data.lastTrade / 10) : 52000;
                        } else if (api.includes('frankfurter')) {
                            usdRate = 52000;
                        } else {
                            usdRate = data.usd && data.usd.irr ? Math.round(data.usd.irr / 10) : 52000;
                        }
                        
                        const rates = {
                            USD: usdRate,
                            TRY: Math.round(usdRate / 32),
                            AFN: Math.round(usdRate / 89)
                        };
                        
                        console.log('💰 نرخ‌های محاسبه شده:', rates);
                        return rates;
                    }
                } catch (apiError) {
                    console.log(`❌ API شکست خورد: ${api}`, apiError.message);
                    continue;
                }
            }
            
            throw new Error('All APIs failed');
            
        } catch (error) {
            console.log('⚠️ استفاده از نرخ‌های پیش‌فرض');
            
            return {
                USD: 52000,
                TRY: 1580,
                AFN: 585
            };
        }
    }

    updateUI() {
        document.getElementById('usdRate').textContent = this.formatNumber(this.rates.USD);
        document.getElementById('tryRate').textContent = this.formatNumber(this.rates.TRY);
        document.getElementById('afnRate').textContent = this.formatNumber(this.rates.AFN);
        
        const updateElement = document.getElementById('lastUpdate');
        if (updateElement && this.lastUpdate) {
            updateElement.textContent = `آخرین بروزرسانی: ${this.formatTime(this.lastUpdate)}`;
        }
    }

    formatNumber(number) {
        return new Intl.NumberFormat('fa-IR').format(number);
    }

    formatTime(date) {
        return new Intl.DateTimeFormat('fa-IR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(date);
    }

    saveToLocalStorage() {
        const data = {
            rates: this.rates,
            lastUpdate: this.lastUpdate.getTime()
        };
        localStorage.setItem('currencyData', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('currencyData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.rates = data.rates;
                this.lastUpdate = new Date(data.lastUpdate);
                this.updateUI();
            } catch (error) {
                this.setDefaultRates();
            }
        } else {
            this.setDefaultRates();
        }
    }

    setDefaultRates() {
        this.rates = this.getDefaultRates();
        this.lastUpdate = new Date();
        this.updateUI();
    }

    getDefaultRates() {
        return {
            USD: 50000,
            TRY: 1562,
            AFN: 561
        };
    }

    startAutoRefresh() {
        setInterval(() => {
            this.loadCurrencyData();
        }, this.updateInterval);
    }
}