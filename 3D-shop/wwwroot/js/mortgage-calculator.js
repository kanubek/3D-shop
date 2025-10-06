class MortgageCalculator {
    constructor() {
        this.currentCalculation = null;
        this.banks = this.getBanksData();
        this.currentCurrency = 'KGS'; // KGS или USD
        this.exchangeRates = {
            USD_TO_KGS: 87.5, // Примерный курс USD к сому
            KGS_TO_USD: 1/87.5
        };
        this.init();
    }

    init() {
        this.createCalculatorInterface();
        this.setupEventListeners();
        this.loadBankPrograms();
    }

    getBanksData() {
        return [
            {
                id: 1,
                name: "KICB",
                logo: "🏛️",
                programs: [
                    { name: "Жилищный кредит", rate: 16.0, minRate: 16.0, maxRate: 22.0, minDownPayment: 30 },
                    { name: "Ипотека Комфорт", rate: 17.5, minRate: 17.5, maxRate: 21.0, minDownPayment: 25 },
                    { name: "Молодая семья", rate: 15.0, minRate: 15.0, maxRate: 18.0, minDownPayment: 20 }
                ]
            },
            {
                id: 2,
                name: "Оптима Банк",
                logo: "�",
                programs: [
                    { name: "Мой дом", rate: 17.0, minRate: 17.0, maxRate: 23.0, minDownPayment: 30 },
                    { name: "Семейная ипотека", rate: 16.5, minRate: 16.5, maxRate: 20.5, minDownPayment: 25 }
                ]
            },
            {
                id: 3,
                name: "Банк Азии",
                logo: "🏦",
                programs: [
                    { name: "Жилье в кредит", rate: 18.0, minRate: 18.0, maxRate: 24.0, minDownPayment: 35 },
                    { name: "Новостройки", rate: 17.0, minRate: 17.0, maxRate: 21.0, minDownPayment: 30 }
                ]
            },
            {
                id: 4,
                name: "Айыл Банк",
                logo: "🌾",
                programs: [
                    { name: "Сельская ипотека", rate: 14.0, minRate: 14.0, maxRate: 18.0, minDownPayment: 20 },
                    { name: "Жилье для молодежи", rate: 15.5, minRate: 15.5, maxRate: 19.0, minDownPayment: 25 }
                ]
            },
            {
                id: 5,
                name: "РСК Банк",
                logo: "�",
                programs: [
                    { name: "Недвижимость", rate: 16.8, minRate: 16.8, maxRate: 22.5, minDownPayment: 30 }
                ]
            },
            {
                id: 6,
                name: "Бай-Тушум Банк",
                logo: "🏪",
                programs: [
                    { name: "Ипотечный кредит", rate: 17.2, minRate: 17.2, maxRate: 21.8, minDownPayment: 25 }
                ]
            }
        ];
    }

    createCalculatorInterface() {
        const calculatorHTML = `
            <div class="mortgage-calculator" id="mortgage-calculator">
                <div class="calculator-header">
                    <h3>🏦 Ипотечный калькулятор</h3>
                    <div class="calculator-subtitle">
                        Рассчитайте ипотеку для этого объекта в Кыргызстане
                    </div>
                    <div class="currency-selector">
                        <button class="currency-btn active" data-currency="KGS" onclick="switchCurrency('KGS')">
                            💰 Сом (KGS)
                        </button>
                        <button class="currency-btn" data-currency="USD" onclick="switchCurrency('USD')">
                            💵 Доллар (USD)
                        </button>
                    </div>
                </div>

                <div class="calculator-content">
                    <div class="calculator-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="property-cost">Стоимость недвижимости</label>
                                <div class="input-with-currency">
                                    <input type="number" id="property-cost" placeholder="0" min="500000" max="50000000" step="50000">
                                    <span class="currency" id="property-cost-currency">сом</span>
                                </div>
                                <div class="currency-conversion" id="property-cost-conversion">
                                    ≈ $0
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="down-payment">Первоначальный взнос</label>
                                <div class="input-with-currency">
                                    <input type="number" id="down-payment" placeholder="0" min="0" step="25000">
                                    <span class="currency" id="down-payment-currency">сом</span>
                                </div>
                                <div class="currency-conversion" id="down-payment-conversion">
                                    ≈ $0
                                </div>
                                <div class="slider-container">
                                    <input type="range" id="down-payment-slider" min="0" max="50" value="25" step="5">
                                    <div class="slider-labels">
                                        <span>0%</span>
                                        <span id="down-payment-percent">25%</span>
                                        <span>50%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="loan-term">Срок кредита</label>
                                <div class="input-with-currency">
                                    <input type="number" id="loan-term" value="20" min="1" max="30" step="1">
                                    <span class="currency">лет</span>
                                </div>
                                <div class="slider-container">
                                    <input type="range" id="loan-term-slider" min="1" max="30" value="20" step="1">
                                    <div class="slider-labels">
                                        <span>1 год</span>
                                        <span>15 лет</span>
                                        <span>30 лет</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="monthly-income">Ваш доход в месяц</label>
                                <div class="input-with-currency">
                                    <input type="number" id="monthly-income" placeholder="0" min="0" step="5000">
                                    <span class="currency" id="monthly-income-currency">сом</span>
                                </div>
                                <div class="currency-conversion" id="monthly-income-conversion">
                                    ≈ $0
                                </div>
                                <div class="income-hint">
                                    💡 В Кыргызстане банки требуют доход в 2.5-3 раза больше ежемесячного платежа
                                </div>
                            </div>
                        </div>

                        <button type="button" class="calculate-btn" onclick="calculateMortgage()">
                            🧮 Рассчитать ипотеку
                        </button>
                    </div>

                    <div class="calculation-results" id="calculation-results" style="display: none;">
                        <div class="results-summary">
                            <div class="summary-item">
                                <div class="summary-icon">💰</div>
                                <div class="summary-content">
                                    <div class="summary-label">Ежемесячный платеж</div>
                                    <div class="summary-value" id="monthly-payment">0 ₽</div>
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="summary-icon">📊</div>
                                <div class="summary-content">
                                    <div class="summary-label">Сумма кредита</div>
                                    <div class="summary-value" id="loan-amount">0 ₽</div>
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="summary-icon">💸</div>
                                <div class="summary-content">
                                    <div class="summary-label">Переплата</div>
                                    <div class="summary-value" id="overpayment">0 ₽</div>
                                </div>
                            </div>
                            
                            <div class="summary-item">
                                <div class="summary-icon">📈</div>
                                <div class="summary-content">
                                    <div class="summary-label">Общая сумма</div>
                                    <div class="summary-value" id="total-payment">0 ₽</div>
                                </div>
                            </div>
                        </div>

                        <div class="affordability-check" id="affordability-check">
                            <!-- Проверка доступности будет добавлена динамически -->
                        </div>
                    </div>
                </div>

                <div class="bank-programs" id="bank-programs">
                    <h4>🏛️ Программы банков</h4>
                    <div class="programs-list" id="programs-list">
                        <!-- Программы банков будут добавлены динамически -->
                    </div>
                </div>

                <div class="calculator-actions">
                    <button class="action-btn" onclick="openMortgageApplication()">
                        📋 Подать заявку на ипотеку
                    </button>
                    <button class="action-btn secondary" onclick="downloadCalculation()">
                        📥 Скачать расчет
                    </button>
                    <button class="action-btn secondary" onclick="shareMortgageCalculation()">
                        📤 Поделиться расчетом
                    </button>
                </div>
            </div>
        `;

        // Находим место для вставки (после системы отзывов)
        const insertTarget = document.querySelector('.reviews-section') || document.querySelector('.property-specs');
        if (insertTarget) {
            insertTarget.insertAdjacentHTML('afterend', calculatorHTML);
        }
    }

    setupEventListeners() {
        // Синхронизация полей и слайдеров
        const propertyCost = document.getElementById('property-cost');
        const downPayment = document.getElementById('down-payment');
        const downPaymentSlider = document.getElementById('down-payment-slider');
        const downPaymentPercent = document.getElementById('down-payment-percent');
        const loanTerm = document.getElementById('loan-term');
        const loanTermSlider = document.getElementById('loan-term-slider');

        if (propertyCost) {
            propertyCost.addEventListener('input', (e) => {
                this.updateDownPaymentFromPercent();
                this.updateConversions();
                this.autoCalculate();
            });
        }

        if (downPayment) {
            downPayment.addEventListener('input', (e) => {
                this.updateDownPaymentPercent();
                this.updateConversions();
                this.autoCalculate();
            });
        }

        if (downPaymentSlider) {
            downPaymentSlider.addEventListener('input', (e) => {
                const percent = e.target.value;
                downPaymentPercent.textContent = `${percent}%`;
                this.updateDownPaymentFromPercent();
                this.autoCalculate();
            });
        }

        if (loanTerm) {
            loanTerm.addEventListener('input', (e) => {
                if (loanTermSlider) {
                    loanTermSlider.value = e.target.value;
                }
                this.autoCalculate();
            });
        }

        if (loanTermSlider) {
            loanTermSlider.addEventListener('input', (e) => {
                if (loanTerm) {
                    loanTerm.value = e.target.value;
                }
                this.autoCalculate();
            });
        }

        const monthlyIncome = document.getElementById('monthly-income');
        if (monthlyIncome) {
            monthlyIncome.addEventListener('input', () => {
                this.updateConversions();
                this.updateAffordabilityCheck();
            });
        }
    }

    updateDownPaymentFromPercent() {
        const propertyCost = parseFloat(document.getElementById('property-cost').value) || 0;
        const percent = parseFloat(document.getElementById('down-payment-slider').value) || 0;
        const downPaymentAmount = Math.round(propertyCost * percent / 100);
        
        document.getElementById('down-payment').value = downPaymentAmount;
    }

    updateDownPaymentPercent() {
        const propertyCost = parseFloat(document.getElementById('property-cost').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        
        if (propertyCost > 0) {
            const percent = Math.round((downPayment / propertyCost) * 100);
            document.getElementById('down-payment-slider').value = Math.min(percent, 50);
            document.getElementById('down-payment-percent').textContent = `${Math.min(percent, 50)}%`;
        }
    }

    loadBankPrograms() {
        const programsList = document.getElementById('programs-list');
        if (!programsList) return;

        let programsHTML = '';
        
        this.banks.forEach(bank => {
            bank.programs.forEach((program, index) => {
                programsHTML += `
                    <div class="bank-program" data-bank-id="${bank.id}" data-program-index="${index}">
                        <div class="bank-info">
                            <div class="bank-logo">${bank.logo}</div>
                            <div class="bank-details">
                                <div class="bank-name">${bank.name}</div>
                                <div class="program-name">${program.name}</div>
                            </div>
                        </div>
                        
                        <div class="program-details">
                            <div class="rate-info">
                                <div class="rate-value">${program.rate}%</div>
                                <div class="rate-range">от ${program.minRate}%</div>
                            </div>
                            
                            <div class="program-features">
                                <div class="feature">
                                    <span class="feature-icon">💰</span>
                                    <span class="feature-text">От ${program.minDownPayment}%</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="program-actions">
                            <button class="select-program-btn" onclick="selectBankProgram(${bank.id}, ${index})">
                                Выбрать
                            </button>
                        </div>
                    </div>
                `;
            });
        });

        programsList.innerHTML = programsHTML;
    }

    switchCurrency(currency) {
        this.currentCurrency = currency;
        
        // Обновляем активную кнопку
        document.querySelectorAll('.currency-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.currency === currency) {
                btn.classList.add('active');
            }
        });
        
        // Обновляем символы валют
        const currencySymbol = currency === 'KGS' ? 'сом' : '$';
        document.getElementById('property-cost-currency').textContent = currencySymbol;
        document.getElementById('down-payment-currency').textContent = currencySymbol;
        document.getElementById('monthly-income-currency').textContent = currencySymbol;
        
        // Конвертируем существующие значения
        this.convertValues(currency);
        this.updateConversions();
        this.autoCalculate();
    }
    
    convertValues(newCurrency) {
        const propertyCostInput = document.getElementById('property-cost');
        const downPaymentInput = document.getElementById('down-payment');
        const monthlyIncomeInput = document.getElementById('monthly-income');
        
        if (newCurrency === 'USD' && this.currentCurrency !== 'USD') {
            // Конвертируем из сомов в доллары
            propertyCostInput.value = Math.round((parseFloat(propertyCostInput.value) || 0) * this.exchangeRates.KGS_TO_USD);
            downPaymentInput.value = Math.round((parseFloat(downPaymentInput.value) || 0) * this.exchangeRates.KGS_TO_USD);
            monthlyIncomeInput.value = Math.round((parseFloat(monthlyIncomeInput.value) || 0) * this.exchangeRates.KGS_TO_USD);
        } else if (newCurrency === 'KGS' && this.currentCurrency !== 'KGS') {
            // Конвертируем из долларов в сомы
            propertyCostInput.value = Math.round((parseFloat(propertyCostInput.value) || 0) * this.exchangeRates.USD_TO_KGS);
            downPaymentInput.value = Math.round((parseFloat(downPaymentInput.value) || 0) * this.exchangeRates.USD_TO_KGS);
            monthlyIncomeInput.value = Math.round((parseFloat(monthlyIncomeInput.value) || 0) * this.exchangeRates.USD_TO_KGS);
        }
    }
    
    updateConversions() {
        const propertyCost = parseFloat(document.getElementById('property-cost').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;
        
        if (this.currentCurrency === 'KGS') {
            document.getElementById('property-cost-conversion').textContent = 
                `≈ $${Math.round(propertyCost * this.exchangeRates.KGS_TO_USD).toLocaleString()}`;
            document.getElementById('down-payment-conversion').textContent = 
                `≈ $${Math.round(downPayment * this.exchangeRates.KGS_TO_USD).toLocaleString()}`;
            document.getElementById('monthly-income-conversion').textContent = 
                `≈ $${Math.round(monthlyIncome * this.exchangeRates.KGS_TO_USD).toLocaleString()}`;
        } else {
            document.getElementById('property-cost-conversion').textContent = 
                `≈ ${Math.round(propertyCost * this.exchangeRates.USD_TO_KGS).toLocaleString()} сом`;
            document.getElementById('down-payment-conversion').textContent = 
                `≈ ${Math.round(downPayment * this.exchangeRates.USD_TO_KGS).toLocaleString()} сом`;
            document.getElementById('monthly-income-conversion').textContent = 
                `≈ ${Math.round(monthlyIncome * this.exchangeRates.USD_TO_KGS).toLocaleString()} сом`;
        }
    }

    calculateMortgage() {
        const propertyCost = parseFloat(document.getElementById('property-cost').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        const loanTerm = parseInt(document.getElementById('loan-term').value) || 20;
        const monthlyIncome = parseFloat(document.getElementById('monthly-income').value) || 0;

        if (propertyCost <= 0) {
            alert('Пожалуйста, укажите стоимость недвижимости');
            return;
        }

        if (downPayment >= propertyCost) {
            alert('Первоначальный взнос не может быть больше стоимости недвижимости');
            return;
        }

        // Расчет для средней процентной ставки в Кыргызстане
        const averageRate = 17.0; // Средняя ставка по рынку КР
        const loanAmount = propertyCost - downPayment;
        
        const calculation = this.performMortgageCalculation(loanAmount, averageRate, loanTerm);
        
        this.displayResults(calculation, monthlyIncome);
        this.calculateBankPrograms(propertyCost, downPayment, loanTerm);
        
        this.currentCalculation = {
            propertyCost,
            downPayment,
            loanTerm,
            monthlyIncome,
            calculation
        };
    }

    performMortgageCalculation(loanAmount, annualRate, years) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;
        
        // Аннуитетный платеж
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                              (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        
        const totalPayment = monthlyPayment * numberOfPayments;
        const overpayment = totalPayment - loanAmount;
        
        return {
            loanAmount,
            monthlyPayment,
            totalPayment,
            overpayment,
            rate: annualRate
        };
    }

    displayResults(calculation, monthlyIncome) {
        document.getElementById('monthly-payment').textContent = this.formatMoney(calculation.monthlyPayment);
        document.getElementById('loan-amount').textContent = this.formatMoney(calculation.loanAmount);
        document.getElementById('overpayment').textContent = this.formatMoney(calculation.overpayment);
        document.getElementById('total-payment').textContent = this.formatMoney(calculation.totalPayment);
        
        document.getElementById('calculation-results').style.display = 'block';
        
        this.updateAffordabilityCheck(calculation.monthlyPayment, monthlyIncome);
    }

    updateAffordabilityCheck(monthlyPayment = null, income = null) {
        const affordabilityDiv = document.getElementById('affordability-check');
        if (!affordabilityDiv) return;

        if (monthlyPayment === null) {
            if (!this.currentCalculation) return;
            monthlyPayment = this.currentCalculation.calculation.monthlyPayment;
        }

        if (income === null) {
            income = parseFloat(document.getElementById('monthly-income').value) || 0;
        }

        if (income <= 0) {
            affordabilityDiv.innerHTML = `
                <div class="affordability-neutral">
                    <div class="affordability-icon">💡</div>
                    <div class="affordability-text">
                        Укажите ваш доход для проверки возможности получения кредита
                    </div>
                </div>
            `;
            return;
        }

        const paymentToIncomeRatio = monthlyPayment / income;
        const maxRecommendedRatio = 0.4; // Максимум 40% дохода
        const bankApprovalRatio = 0.5; // Банки обычно одобряют до 50%

        let affordabilityHTML = '';
        
        if (paymentToIncomeRatio <= maxRecommendedRatio) {
            affordabilityHTML = `
                <div class="affordability-good">
                    <div class="affordability-icon">✅</div>
                    <div class="affordability-text">
                        <strong>Отличная доступность!</strong><br>
                        Платеж составляет ${(paymentToIncomeRatio * 100).toFixed(1)}% от дохода.
                        Это комфортная нагрузка для семейного бюджета.
                    </div>
                </div>
            `;
        } else if (paymentToIncomeRatio <= bankApprovalRatio) {
            affordabilityHTML = `
                <div class="affordability-warning">
                    <div class="affordability-icon">⚠️</div>
                    <div class="affordability-text">
                        <strong>Высокая нагрузка</strong><br>
                        Платеж составляет ${(paymentToIncomeRatio * 100).toFixed(1)}% от дохода.
                        Банк может одобрить кредит, но нагрузка на бюджет будет значительной.
                    </div>
                </div>
            `;
        } else {
            affordabilityHTML = `
                <div class="affordability-bad">
                    <div class="affordability-icon">❌</div>
                    <div class="affordability-text">
                        <strong>Кредит недоступен</strong><br>
                        Платеж составляет ${(paymentToIncomeRatio * 100).toFixed(1)}% от дохода.
                        Банки вряд ли одобрят такой кредит. Рассмотрите увеличение первоначального взноса.
                    </div>
                </div>
            `;
        }

        affordabilityDiv.innerHTML = affordabilityHTML;
    }

    calculateBankPrograms(propertyCost, downPayment, loanTerm) {
        const loanAmount = propertyCost - downPayment;
        const downPaymentPercent = (downPayment / propertyCost) * 100;

        document.querySelectorAll('.bank-program').forEach((programElement) => {
            const bankId = parseInt(programElement.dataset.bankId);
            const programIndex = parseInt(programElement.dataset.programIndex);
            
            const bank = this.banks.find(b => b.id === bankId);
            const program = bank.programs[programIndex];
            
            // Проверяем, подходит ли программа
            const isEligible = downPaymentPercent >= program.minDownPayment;
            
            if (isEligible) {
                const calculation = this.performMortgageCalculation(loanAmount, program.rate, loanTerm);
                
                // Обновляем отображение программы
                const monthlyPaymentElement = programElement.querySelector('.monthly-payment');
                if (!monthlyPaymentElement) {
                    const programDetails = programElement.querySelector('.program-details');
                    programDetails.insertAdjacentHTML('beforeend', `
                        <div class="monthly-payment">
                            ${this.formatMoney(calculation.monthlyPayment)}/мес
                        </div>
                    `);
                }
                
                programElement.classList.remove('ineligible');
            } else {
                programElement.classList.add('ineligible');
                const ineligibleText = programElement.querySelector('.ineligible-text');
                if (!ineligibleText) {
                    programElement.insertAdjacentHTML('beforeend', `
                        <div class="ineligible-text">
                            Требуется взнос от ${program.minDownPayment}%
                        </div>
                    `);
                }
            }
        });
    }

    autoCalculate() {
        // Автоматический расчет при изменении значений
        const propertyCost = parseFloat(document.getElementById('property-cost').value) || 0;
        const downPayment = parseFloat(document.getElementById('down-payment').value) || 0;
        
        if (propertyCost > 0 && downPayment < propertyCost) {
            this.calculateMortgage();
        }
    }

    formatMoney(amount) {
        if (this.currentCurrency === 'KGS') {
            return new Intl.NumberFormat('ky-KG').format(amount) + ' сом';
        } else {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(amount);
        }
    }
}

// Глобальные функции
let mortgageCalculator = null;

function initMortgageCalculator(propertyCost = null) {
    mortgageCalculator = new MortgageCalculator();
    
    // Устанавливаем стоимость объекта если передана
    if (propertyCost) {
        const costInput = document.getElementById('property-cost');
        if (costInput) {
            costInput.value = propertyCost;
            mortgageCalculator.updateDownPaymentFromPercent();
        }
    }
}

function calculateMortgage() {
    if (mortgageCalculator) {
        mortgageCalculator.calculateMortgage();
    }
}

function selectBankProgram(bankId, programIndex) {
    console.log('Selected bank program:', bankId, programIndex);
    // Здесь можно добавить логику выбора программы
    alert('Функция выбора программы будет реализована позже');
}

function openMortgageApplication() {
    // Открытие формы заявки на ипотеку
    window.open('https://www.sberbank.ru/ru/person/credits/home/application', '_blank');
}

function downloadCalculation() {
    if (!mortgageCalculator || !mortgageCalculator.currentCalculation) {
        alert('Сначала произведите расчет');
        return;
    }
    
    // Генерируем PDF или текстовый файл с расчетом
    const calc = mortgageCalculator.currentCalculation;
    const content = `
РАСЧЕТ ИПОТЕКИ
=================

Стоимость недвижимости: ${mortgageCalculator.formatMoney(calc.propertyCost)}
Первоначальный взнос: ${mortgageCalculator.formatMoney(calc.downPayment)}
Сумма кредита: ${mortgageCalculator.formatMoney(calc.calculation.loanAmount)}
Срок кредита: ${calc.loanTerm} лет

РЕЗУЛЬТАТ:
Ежемесячный платеж: ${mortgageCalculator.formatMoney(calc.calculation.monthlyPayment)}
Переплата: ${mortgageCalculator.formatMoney(calc.calculation.overpayment)}
Общая сумма к доплате: ${mortgageCalculator.formatMoney(calc.calculation.totalPayment)}

Расчет произведен: ${new Date().toLocaleString('ru-RU')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mortgage_calculation.txt';
    a.click();
    URL.revokeObjectURL(url);
}

function shareMortgageCalculation() {
    if (!mortgageCalculator || !mortgageCalculator.currentCalculation) {
        alert('Сначала произведите расчет');
        return;
    }
    
    const calc = mortgageCalculator.currentCalculation;
    const text = `Расчет ипотеки: ${mortgageCalculator.formatMoney(calc.calculation.monthlyPayment)}/мес на ${calc.loanTerm} лет`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Расчет ипотеки',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text + '\n' + window.location.href);
        alert('Ссылка скопирована в буфер обмена');
    }
}

function switchCurrency(currency) {
    if (mortgageCalculator) {
        mortgageCalculator.switchCurrency(currency);
    }
}