class RealEstateAIAssistant {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isOpen = false;
        this.messages = [];
        this.currentProperty = null;
        
        this.init();
    }

    init() {
        this.createAssistantUI();
        this.setupEventListeners();
        this.loadWelcomeMessage();
    }

    createAssistantUI() {
        const assistantHTML = `
            <div class="ai-assistant" id="ai-assistant">
                <div class="assistant-header">
                    <div class="assistant-avatar">🤖</div>
                    <div class="assistant-info">
                        <h4>AI Консультант</h4>
                        <span class="assistant-status online">В сети</span>
                    </div>
                    <button class="assistant-toggle" onclick="toggleAIAssistant()">
                        <span class="toggle-icon">💬</span>
                    </button>
                </div>
                
                <div class="assistant-body" style="display: none;">
                    <div class="messages-container" id="messages-container">
                        <!-- Сообщения будут добавляться динамически -->
                    </div>
                    
                    <div class="quick-actions">
                        <button class="quick-action-btn" onclick="askAboutProperty()">
                            📋 Об объекте
                        </button>
                        <button class="quick-action-btn" onclick="askAboutLocation()">
                            📍 О районе
                        </button>
                        <button class="quick-action-btn" onclick="askAboutPrice()">
                            💰 О цене
                        </button>
                        <button class="quick-action-btn" onclick="askAboutMortgage()">
                            🏦 Ипотека
                        </button>
                    </div>
                    
                    <div class="message-input-container">
                        <input type="text" 
                               class="message-input" 
                               id="message-input" 
                               placeholder="Задайте вопрос о недвижимости...">
                        <button class="send-button" onclick="sendMessage()">
                            <span>📤</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем в контейнер или в body
        if (this.container) {
            this.container.innerHTML = assistantHTML;
        } else {
            document.body.insertAdjacentHTML('beforeend', assistantHTML);
        }
    }

    setupEventListeners() {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    }

    loadWelcomeMessage() {
        setTimeout(() => {
            this.addMessage({
                type: 'bot',
                text: '👋 Саламатсызбы! Мен Кыргызстандагы мүлкө боюнча AI-консультантмын. Объект, район, баа жана ипотека боюнча суроолорго жардам бере алам! 🇰🇬',
                timestamp: new Date()
            });
        }, 1000);
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const body = document.querySelector('.assistant-body');
        const toggleIcon = document.querySelector('.toggle-icon');
        
        if (this.isOpen) {
            body.style.display = 'block';
            toggleIcon.textContent = '✖️';
            setTimeout(() => {
                body.style.opacity = '1';
                body.style.transform = 'translateY(0)';
            }, 10);
        } else {
            body.style.opacity = '0';
            body.style.transform = 'translateY(20px)';
            setTimeout(() => {
                body.style.display = 'none';
                toggleIcon.textContent = '💬';
            }, 300);
        }
    }

    sendMessage(text = null) {
        const input = document.getElementById('message-input');
        const messageText = text || input.value.trim();
        
        if (!messageText) return;

        // Добавляем сообщение пользователя
        this.addMessage({
            type: 'user',
            text: messageText,
            timestamp: new Date()
        });

        // Очищаем поле ввода
        if (!text) input.value = '';

        // Показываем индикатор печати
        this.showTypingIndicator();

        // Генерируем ответ AI
        setTimeout(() => {
            const response = this.generateAIResponse(messageText);
            this.hideTypingIndicator();
            this.addMessage({
                type: 'bot',
                text: response,
                timestamp: new Date()
            });
        }, 1500);
    }

    addMessage(message) {
        const container = document.getElementById('messages-container');
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}-message`;
        
        const time = message.timestamp.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${time}</div>
            </div>
        `;

        container.appendChild(messageElement);
        container.scrollTop = container.scrollHeight;

        // Анимация появления
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 100);
    }

    showTypingIndicator() {
        const container = document.getElementById('messages-container');
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // База знаний AI
        const responses = {
            // Общая информация об объекте
            property: [
                "🏠 Бул үй заманбап архитектуранын мыкты үлгүсү - сапаттуу планировка жана жакшы отделка менен.",
                "📐 Жалпы аянты 120 кв.м, 3 уктоочу бөлмө, конок бөлмө, ашкана жана 2 дарет бар.",
                "🌟 Негизги артыкчылыктары: бийик шыптар, чоң терезелер, А+ класстагы энергия үнөмдүү.",
                "🛠️ Үй 2023-жылы заманбап материалдар жана технологиялар менен курулган."
            ],
            
            // Информация о районе
            location: [
                "📍 Район өнүккөн инфраструктура жана ыңгайлуу транспорт байланышы менен айырмаланат.",
                "🏫 Жакында мектептер, балдар бакчалары, медициналык борборлор жана соода борборлору бар.",
                "🌳 Жөө жүрүп жетүүчү аралыкта парктар, спорт аянтчалары жана эс алуу зоналары.",
                "🚌 Мыкты транспорт жеткиликтүүлүгү - шаар борборуна коомдук транспорт менен 25 мүнөт."
            ],
            
            // Информация о цене
            price: [
                "💰 Бул объекттин баасы 15 000 000 сом ($171,429), бул базар наркына туура келет.",
                "📊 Чарчы метринин наркы - 125,000 сом ($1,429), бул райондо орточо деңгээлден төмөн.",
                "💡 Тез чечим кабыл алууда акылга с��ярлык соодалашуу мүмкүн.",
                "📈 Акыркы жылда бул райондо баалар 15%га өскөн, бул сатып алууну пайдалуу инвестиция кылат."
            ],
            
            // Информация об ипотеке
            mortgage: [
                "🏦 Бул объект үчүн КР банктарынан жылына 14-22% менен ипотекалык программалар жеткиликтүү.",
                "💳 25% алгачкы төлөмдө 15 жылга айлык төлөм болжол менен 180,000 сом ($2,057) түзөт.",
                "📋 Керектүү документтер: паспорт, кирешелер тууралуу справка, эмгек китепчеси.",
                "✅ 250,000 сом ($2,857) кирешеде банктар ипотеканы 90% учурда бекитишет."
            ],
            
            // Общие вопросы
            general: [
                "🤔 Мыкты суроо! Муну кеңири карап көрөлү...",
                "💭 Мага ойлонуп, толук жооп берүүгө уруксат бериңиз.",
                "📚 Кыргызстандагы мүлкө рыногу жөнүндө билимиме таянып:",
                "🎯 Бул мүлкө тандоодо маанилүү учур. Деталдарды карайлы:"
            ]
        };

        // Определяем тип вопроса
        if (message.includes('объект') || message.includes('дом') || message.includes('квартир') || message.includes('площад')) {
            return this.getRandomResponse(responses.property);
        } else if (message.includes('район') || message.includes('местоположен') || message.includes('где') || message.includes('адрес')) {
            return this.getRandomResponse(responses.location);
        } else if (message.includes('цен') || message.includes('стоим') || message.includes('дорог') || message.includes('руб')) {
            return this.getRandomResponse(responses.price);
        } else if (message.includes('ипотек') || message.includes('кредит') || message.includes('банк') || message.includes('проц')) {
            return this.getRandomResponse(responses.mortgage);
        } else {
            return this.getRandomResponse(responses.general) + " " + this.getContextualResponse(message);
        }
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getContextualResponse(message) {
        const contextResponses = [
            "Эгер дагы так суроолоруңуз бар болсо, жардам берүүгө даярмын!",
            "Бул объект жөнүндө дагы эмне билгиңиз келеби?",
            "Каалаган аспект боюнча кошумча маалымат бере алам.",
            "3D-турду көрүүнү сунуштайм - объектти жакшы түшүнүү үчүн.",
            "Кызыктуу болсо, бул райондогу окшош объектилер жөнүндө айта алам."
        ];
        
        return this.getRandomResponse(contextResponses);
    }

    // Быстрые действия  
    askAboutProperty() {
        this.sendMessage("Бул объект жөнүндө кеңири айтып берчи");
    }

    askAboutLocation() {
        this.sendMessage("Бул район жөнүндө эмне айта аласың?");
    }

    askAboutPrice() {
        this.sendMessage("Бул объекттин баасы туурабы?");
    }

    askAboutMortgage() {
        this.sendMessage("Кандай ипотека варианттары бар?");
    }
}

// Глобальные функции
let aiAssistant = null;

function initAIAssistant() {
    if (!aiAssistant) {
        aiAssistant = new RealEstateAIAssistant('ai-assistant-container');
    }
}

function toggleAIAssistant() {
    if (aiAssistant) {
        aiAssistant.toggle();
    }
}

function sendMessage() {
    if (aiAssistant) {
        aiAssistant.sendMessage();
    }
}

function askAboutProperty() {
    if (aiAssistant) {
        aiAssistant.askAboutProperty();
    }
}

function askAboutLocation() {
    if (aiAssistant) {
        aiAssistant.askAboutLocation();
    }
}

function askAboutPrice() {
    if (aiAssistant) {
        aiAssistant.askAboutPrice();
    }
}

function askAboutMortgage() {
    if (aiAssistant) {
        aiAssistant.askAboutMortgage();
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем AI-помощника только на страницах объектов
    if (document.querySelector('#model3d') || document.querySelector('.property-details')) {
        initAIAssistant();
    }
});