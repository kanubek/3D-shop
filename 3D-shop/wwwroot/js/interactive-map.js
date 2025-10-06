class InteractiveMapManager {
    constructor(containerId, properties = []) {
        this.container = document.getElementById(containerId);
        this.properties = properties;
        this.map = null;
        this.markers = [];
        this.selectedProperty = null;
        this.clusterer = null;
        
        this.init();
    }

    async init() {
        // Создаем интерфейс карты
        this.createMapInterface();
        
        // Инициализируем карту (используем Leaflet как альтернативу Google Maps)
        await this.loadLeafletLibrary();
        this.initializeMap();
        
        // Добавляем свойства на карту
        this.addPropertiesToMap();
        
        // Настраиваем обработчики событий
        this.setupEventListeners();
    }

    createMapInterface() {
        const mapHTML = `
            <div class="map-container">
                <div class="map-controls">
                    <div class="control-group">
                        <h4>🗺️ Карта объектов</h4>
                        <div class="map-stats">
                            <span class="stats-item">📍 Объектов: <span id="properties-count">${this.properties.length}</span></span>
                            <span class="stats-item">🎯 Выбрано: <span id="selected-count">0</span></span>
                        </div>
                    </div>
                    
                    <div class="filter-controls">
                        <select id="price-filter" class="filter-select">
                            <option value="">Все цены</option>
                            <option value="0-5000000">До 5 млн ₽</option>
                            <option value="5000000-10000000">5-10 млн ₽</option>
                            <option value="10000000-20000000">10-20 млн ₽</option>
                            <option value="20000000-999999999">Свыше 20 млн ₽</option>
                        </select>
                        
                        <select id="type-filter" class="filter-select">
                            <option value="">Все типы</option>
                            <option value="Квартира">Квартиры</option>
                            <option value="Дом">Дома</option>
                            <option value="Коттедж">Коттеджи</option>
                        </select>
                        
                        <button class="reset-filters-btn" onclick="resetMapFilters()">
                            🔄 Сбросить
                        </button>
                    </div>
                    
                    <div class="map-view-controls">
                        <button class="view-btn active" data-view="map" onclick="switchMapView('map')">
                            🗺️ Карта
                        </button>
                        <button class="view-btn" data-view="satellite" onclick="switchMapView('satellite')">
                            🛰️ Спутник
                        </button>
                        <button class="view-btn" data-view="hybrid" onclick="switchMapView('hybrid')">
                            🔗 Гибрид
                        </button>
                    </div>
                </div>
                
                <div id="interactive-map" class="interactive-map"></div>
                
                <div class="map-legend">
                    <div class="legend-item">
                        <div class="legend-marker available"></div>
                        <span>Доступно</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-marker sold"></div>
                        <span>Продано</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-marker reserved"></div>
                        <span>Забронировано</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-marker premium"></div>
                        <span>Премиум</span>
                    </div>
                </div>
                
                <div class="property-popup" id="property-popup" style="display: none;">
                    <div class="popup-content">
                        <button class="popup-close" onclick="closePropertyPopup()">×</button>
                        <div class="popup-image">
                            <img id="popup-image" src="" alt="">
                            <div class="popup-badge" id="popup-badge"></div>
                        </div>
                        <div class="popup-details">
                            <h4 id="popup-title"></h4>
                            <div class="popup-price" id="popup-price"></div>
                            <div class="popup-specs">
                                <span id="popup-area"></span>
                                <span id="popup-rooms"></span>
                            </div>
                            <div class="popup-actions">
                                <button class="popup-btn primary" onclick="viewPropertyDetails()">
                                    👁️ Подробнее
                                </button>
                                <button class="popup-btn secondary" onclick="add3DView()">
                                    🎯 3D Просмотр
                                </button>
                                <button class="popup-btn favorite" onclick="togglePropertyFavorite()">
                                    ❤️ В избранное
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = mapHTML;
    }

    async loadLeafletLibrary() {
        // Загружаем Leaflet CSS и JS если еще не загружены
        if (!window.L) {
            return new Promise((resolve) => {
                // CSS
                const cssLink = document.createElement('link');
                cssLink.rel = 'stylesheet';
                cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
                document.head.appendChild(cssLink);

                // JS
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
        }
    }

    initializeMap() {
        // Инициализируем карту Leaflet
        initMap() {
        // Создаем карту с центром в Бишкеке
        this.map = L.map('interactive-map').setView([42.8746, 74.5698], 11); // Москва

        // Добавляем тайлы OpenStreetMap
        this.mapLayers = {
            map: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }),
            satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            }),
            hybrid: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '© Esri'
            })
        };

        // Устанавливаем базовый слой
        this.mapLayers.map.addTo(this.map);
        this.currentLayer = 'map';

        // Добавляем контролы
        this.map.addControl(L.control.zoom({ position: 'bottomright' }));
        this.map.addControl(L.control.scale({ position: 'bottomleft' }));
    }

    addPropertiesToMap() {
        this.properties.forEach((property, index) => {
            // Генерируем координаты для демо (в реальном приложении они будут из базы)
            const lat = 55.7558 + (Math.random() - 0.5) * 0.2;
            const lng = 37.6176 + (Math.random() - 0.5) * 0.3;

            // Определяем статус объекта
            const status = this.getPropertyStatus(property);
            
            // Создаем кастомную иконку
            const icon = this.createPropertyIcon(status, property.price);

            // Создаем маркер
            const marker = L.marker([lat, lng], { icon })
                .bindPopup(this.createPopupContent(property))
                .on('click', () => this.selectProperty(property));

            marker.propertyData = property;
            this.markers.push(marker);
            marker.addTo(this.map);
        });

        // Если есть маркеры, подгоняем вид карты
        if (this.markers.length > 0) {
            const group = new L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    getPropertyStatus(property) {
        // Определяем статус на основе ID (для демо)
        if (property.id % 10 === 0) return 'sold';
        if (property.id % 7 === 0) return 'reserved';
        if (property.price > 15000000) return 'premium';
        return 'available';
    }

    createPropertyIcon(status, price) {
        const colors = {
            available: '#10b981',
            sold: '#ef4444', 
            reserved: '#f59e0b',
            premium: '#8b5cf6'
        };

        const priceText = price > 999999 ? `${Math.round(price/1000000)}M` : `${Math.round(price/1000)}K`;

        const iconHtml = `
            <div class="property-marker ${status}">
                <div class="marker-price">${priceText}</div>
                <div class="marker-point"></div>
            </div>
        `;

        return L.divIcon({
            html: iconHtml,
            className: 'custom-property-icon',
            iconSize: [50, 60],
            iconAnchor: [25, 60],
            popupAnchor: [0, -60]
        });
    }

    createPopupContent(property) {
        return `
            <div class="map-popup-content">
                <h4>${property.title}</h4>
                <div class="popup-price">${property.price.toLocaleString()} ₽</div>
                <div class="popup-details">
                    <span>${property.area} м²</span> • 
                    <span>${property.rooms} комн.</span>
                </div>
                <button onclick="openPropertyDetails(${property.id})" class="popup-detail-btn">
                    Подробнее →
                </button>
            </div>
        `;
    }

    selectProperty(property) {
        this.selectedProperty = property;
        this.showPropertyPopup(property);
        this.updateSelectedCount();
    }

    showPropertyPopup(property) {
        const popup = document.getElementById('property-popup');
        
        // Заполняем данные
        document.getElementById('popup-title').textContent = property.title;
        document.getElementById('popup-price').textContent = `${property.price.toLocaleString()} ₽`;
        document.getElementById('popup-area').textContent = `${property.area} м²`;
        document.getElementById('popup-rooms').textContent = `${property.rooms} комн.`;
        
        const image = document.getElementById('popup-image');
        image.src = property.imagePath || '/images/no-image.svg';
        
        const badge = document.getElementById('popup-badge');
        const status = this.getPropertyStatus(property);
        badge.textContent = this.getStatusText(status);
        badge.className = `popup-badge ${status}`;

        popup.style.display = 'block';
        setTimeout(() => popup.classList.add('show'), 100);
    }

    getStatusText(status) {
        const texts = {
            available: 'Доступно',
            sold: 'Продано',
            reserved: 'Забронировано',
            premium: 'Премиум'
        };
        return texts[status] || 'Доступно';
    }

    setupEventListeners() {
        // Фильтры
        document.getElementById('price-filter').addEventListener('change', () => this.applyFilters());
        document.getElementById('type-filter').addEventListener('change', () => this.applyFilters());

        // Закрытие попапа при клике вне его
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('property-popup');
            if (!popup.contains(e.target) && !e.target.closest('.leaflet-marker-icon')) {
                this.closePropertyPopup();
            }
        });
    }

    applyFilters() {
        const priceFilter = document.getElementById('price-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        
        let visibleCount = 0;

        this.markers.forEach(marker => {
            const property = marker.propertyData;
            let visible = true;

            // Фильтр по цене
            if (priceFilter) {
                const [min, max] = priceFilter.split('-').map(Number);
                visible = visible && (property.price >= min && property.price <= max);
            }

            // Фильтр по типу
            if (typeFilter) {
                visible = visible && (property.propertyType === typeFilter);
            }

            if (visible) {
                marker.addTo(this.map);
                visibleCount++;
            } else {
                this.map.removeLayer(marker);
            }
        });

        document.getElementById('properties-count').textContent = visibleCount;
    }

    switchMapView(viewType) {
        // Удаляем текущий слой
        this.map.removeLayer(this.mapLayers[this.currentLayer]);
        
        // Добавляем новый слой
        this.mapLayers[viewType].addTo(this.map);
        this.currentLayer = viewType;

        // Обновляем кнопки
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    }

    resetFilters() {
        document.getElementById('price-filter').value = '';
        document.getElementById('type-filter').value = '';
        this.applyFilters();
    }

    closePropertyPopup() {
        const popup = document.getElementById('property-popup');
        popup.classList.remove('show');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }

    updateSelectedCount() {
        const count = this.selectedProperty ? 1 : 0;
        document.getElementById('selected-count').textContent = count;
    }

    // Публичные методы для глобального доступа
    static instance = null;

    static getInstance() {
        return InteractiveMapManager.instance;
    }
}

// Глобальные функции
function initInteractiveMap(properties) {
    InteractiveMapManager.instance = new InteractiveMapManager('map-container', properties);
}

function switchMapView(viewType) {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager) {
        mapManager.switchMapView(viewType);
    }
}

function resetMapFilters() {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager) {
        mapManager.resetFilters();
    }
}

function closePropertyPopup() {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager) {
        mapManager.closePropertyPopup();
    }
}

function openPropertyDetails(propertyId) {
    window.open(`/Property/Details/${propertyId}`, '_blank');
}

function viewPropertyDetails() {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager && mapManager.selectedProperty) {
        window.open(`/Property/Details/${mapManager.selectedProperty.id}`, '_blank');
    }
}

function add3DView() {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager && mapManager.selectedProperty) {
        // Открываем 3D просмотр в новом окне
        window.open(`/Property/Details/${mapManager.selectedProperty.id}#3d-view`, '_blank');
    }
}

function togglePropertyFavorite() {
    const mapManager = InteractiveMapManager.getInstance();
    if (mapManager && mapManager.selectedProperty) {
        // Логика добавления в избранное
        console.log('Toggle favorite for property:', mapManager.selectedProperty.id);
        
        // Визуальная обратная связь
        const btn = event.target;
        if (btn.textContent.includes('❤️')) {
            btn.textContent = '💖 В избранном';
            btn.classList.add('favorited');
        } else {
            btn.textContent = '❤️ В избранное';
            btn.classList.remove('favorited');
        }
    }
}