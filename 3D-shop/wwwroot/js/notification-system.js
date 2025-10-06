class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.favorites = this.loadFavorites();
        this.subscriptions = this.loadSubscriptions();
        
        this.init();
    }

    init() {
        this.createNotificationInterface();
        this.createFavoritesInterface();
        this.setupEventListeners();
        this.checkForUpdates();
        
        // Проверяем обновления каждые 30 секунд
        setInterval(() => this.checkForUpdates(), 30000);
    }

    createNotificationInterface() {
        const notificationHTML = `
            <!-- Кнопка уведомлений -->
            <div class="notification-bell" id="notification-bell">
                <div class="bell-icon">🔔</div>
                <div class="notification-badge" id="notification-badge" style="display: none;">0</div>
            </div>

            <!-- Панель уведомлений -->
            <div class="notifications-panel" id="notifications-panel">
                <div class="notifications-header">
                    <h3>🔔 Уведомления</h3>
                    <div class="notification-actions">
                        <button class="mark-all-read-btn" onclick="markAllAsRead()">
                            ✓ Отметить все прочитанными
                        </button>
                        <button class="close-notifications-btn" onclick="closeNotifications()">×</button>
                    </div>
                </div>
                
                <div class="notifications-tabs">
                    <button class="notification-tab active" data-tab="all">Все</button>
                    <button class="notification-tab" data-tab="properties">Объекты</button>
                    <button class="notification-tab" data-tab="system">Система</button>
                </div>

                <div class="notifications-list" id="notifications-list">
                    <!-- Уведомления будут добавлены динамически -->
                </div>

                <div class="notification-settings">
                    <h4>⚙️ Настройки уведомлений</h4>
                    <div class="setting-item">
                        <label class="setting-checkbox">
                            <input type="checkbox" id="notify-price-changes" checked>
                            <span class="checkmark"></span>
                            Изменение цен на избранные объекты
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-checkbox">
                            <input type="checkbox" id="notify-new-properties" checked>
                            <span class="checkmark"></span>
                            Новые объекты в избранных районах
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-checkbox">
                            <input type="checkbox" id="notify-reviews" checked>
                            <span class="checkmark"></span>
                            Новые отзывы на просмотренные объекты
                        </label>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', notificationHTML);
    }

    createFavoritesInterface() {
        const favoritesHTML = `
            <!-- Кнопка избранного -->
            <div class="favorites-button" id="favorites-button">
                <div class="favorites-icon">❤️</div>
                <div class="favorites-count" id="favorites-count">${this.favorites.length}</div>
            </div>

            <!-- Панель избранного -->
            <div class="favorites-panel" id="favorites-panel">
                <div class="favorites-header">
                    <h3>❤️ Избранное</h3>
                    <div class="favorites-actions">
                        <button class="compare-favorites-btn" onclick="compareAllFavorites()">
                            ⚖️ Сравнить все
                        </button>
                        <button class="close-favorites-btn" onclick="closeFavorites()">×</button>
                    </div>
                </div>

                <div class="favorites-filters">
                    <select class="favorites-sort" id="favorites-sort">
                        <option value="date-desc">Сначала новые</option>
                        <option value="date-asc">Сначала старые</option>
                        <option value="price-asc">По возрастанию цены</option>
                        <option value="price-desc">По убыванию цены</option>
                        <option value="area-asc">По площади (меньше)</option>
                        <option value="area-desc">По площади (больше)</option>
                    </select>
                </div>

                <div class="favorites-list" id="favorites-list">
                    <!-- Избранные объекты будут добавлены динамически -->
                </div>
            </div>

            <!-- Кнопка добавления в избранное на странице объекта -->
            <div class="add-to-favorites" id="add-to-favorites" style="display: none;">
                <button class="favorite-btn" onclick="toggleFavorite()">
                    <span class="favorite-icon">🤍</span>
                    <span class="favorite-text">Добавить в избранное</span>
                </button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', favoritesHTML);
    }

    setupEventListeners() {
        // Уведомления
        const notificationBell = document.getElementById('notification-bell');
        const notificationsPanel = document.getElementById('notifications-panel');
        
        if (notificationBell) {
            notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotifications();
            });
        }

        // Избранное
        const favoritesButton = document.getElementById('favorites-button');
        const favoritesPanel = document.getElementById('favorites-panel');
        
        if (favoritesButton) {
            favoritesButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorites();
            });
        }

        // Закрытие панелей при клике вне их
        document.addEventListener('click', (e) => {
            if (notificationsPanel && !notificationsPanel.contains(e.target) && !notificationBell.contains(e.target)) {
                this.closeNotifications();
            }
            
            if (favoritesPanel && !favoritesPanel.contains(e.target) && !favoritesButton.contains(e.target)) {
                this.closeFavorites();
            }
        });

        // Табы уведомлений
        document.querySelectorAll('.notification-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.notification-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.filterNotifications(e.target.dataset.tab);
            });
        });

        // Сортировка избранного
        const favoritesSort = document.getElementById('favorites-sort');
        if (favoritesSort) {
            favoritesSort.addEventListener('change', () => {
                this.renderFavorites();
            });
        }

        // Настройки уведомлений
        document.querySelectorAll('.setting-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.saveNotificationSettings();
            });
        });

        // Показать кнопку избранного если мы на странице объекта
        if (this.isPropertyPage()) {
            this.showFavoriteButton();
        }
    }

    checkForUpdates() {
        // Имитация проверки обновлений (в реальном приложении это будет AJAX запрос)
        const mockUpdates = this.generateMockNotifications();
        
        mockUpdates.forEach(notification => {
            this.addNotification(notification);
        });
    }

    generateMockNotifications() {
        const notifications = [];
        const now = new Date();
        
        // Случайно генерируем уведомления
        if (Math.random() < 0.1) { // 10% шанс на новое уведомление
            const types = [
                {
                    type: 'property_price_change',
                    icon: '💰',
                    title: 'Изменение цены',
                    message: 'Цена на объект в избранном снижена на 500 000 сом ($5,714)',
                    category: 'properties'
                },
                {
                    type: 'new_property',
                    icon: '🏠',
                    title: 'Новый объект',
                    message: 'Добавлен новый объект в районе Центр, Бишкек',
                    category: 'properties'
                },
                {
                    type: 'new_review',
                    icon: '⭐',
                    title: 'Новый отзыв',
                    message: 'Появился новый отзыв на просмотренный объект',
                    category: 'properties'
                },
                {
                    type: 'system',
                    icon: '🔧',
                    title: 'Обновление системы',
                    message: 'Добавлены новые функции в 3D-просмотр',
                    category: 'system'
                }
            ];
            
            const randomType = types[Math.floor(Math.random() * types.length)];
            
            notifications.push({
                id: Date.now(),
                ...randomType,
                date: now.toISOString(),
                read: false,
                urgent: Math.random() < 0.2 // 20% шанс на срочное уведомление
            });
        }
        
        return notifications;
    }

    addNotification(notification) {
        // Проверяем, нет ли уже такого уведомления
        const exists = this.notifications.find(n => 
            n.type === notification.type && 
            n.message === notification.message
        );
        
        if (!exists) {
            this.notifications.unshift(notification);
            this.saveNotifications();
            this.updateNotificationBadge();
            this.renderNotifications();
            
            // Показываем всплывающее уведомление
            this.showToastNotification(notification);
        }
    }

    showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${notification.urgent ? 'urgent' : ''}`;
        toast.innerHTML = `
            <div class="toast-icon">${notification.icon}</div>
            <div class="toast-content">
                <div class="toast-title">${notification.title}</div>
                <div class="toast-message">${notification.message}</div>
            </div>
            <button class="toast-close" onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(toast);

        // Показываем тост
        setTimeout(() => toast.classList.add('show'), 100);

        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 300);
        }, 5000);
    }

    toggleNotifications() {
        const panel = document.getElementById('notifications-panel');
        if (panel.classList.contains('active')) {
            this.closeNotifications();
        } else {
            panel.classList.add('active');
            this.renderNotifications();
        }
    }

    closeNotifications() {
        document.getElementById('notifications-panel').classList.remove('active');
    }

    renderNotifications(filter = 'all') {
        const notificationsList = document.getElementById('notifications-list');
        let filteredNotifications = [...this.notifications];

        if (filter !== 'all') {
            filteredNotifications = filteredNotifications.filter(n => n.category === filter);
        }

        if (filteredNotifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="empty-notifications">
                    <div class="empty-icon">🔔</div>
                    <div class="empty-text">Нет уведомлений</div>
                </div>
            `;
            return;
        }

        notificationsList.innerHTML = filteredNotifications.map(notification => 
            this.createNotificationHTML(notification)
        ).join('');
    }

    createNotificationHTML(notification) {
        const timeAgo = this.getTimeAgo(new Date(notification.date));
        
        return `
            <div class="notification-item ${notification.read ? 'read' : 'unread'} ${notification.urgent ? 'urgent' : ''}" 
                 data-id="${notification.id}">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${timeAgo}</div>
                </div>
                <div class="notification-actions">
                    <button class="mark-read-btn" onclick="markAsRead(${notification.id})" 
                            style="${notification.read ? 'display: none;' : ''}">
                        ✓
                    </button>
                    <button class="delete-notification-btn" onclick="deleteNotification(${notification.id})">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }

    filterNotifications(filter) {
        this.renderNotifications(filter);
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    updateNotificationBadge() {
        const badge = document.getElementById('notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;
        
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Избранное
    toggleFavorites() {
        const panel = document.getElementById('favorites-panel');
        if (panel.classList.contains('active')) {
            this.closeFavorites();
        } else {
            panel.classList.add('active');
            this.renderFavorites();
        }
    }

    closeFavorites() {
        document.getElementById('favorites-panel').classList.remove('active');
    }

    isPropertyPage() {
        return window.location.pathname.includes('/Property/Details/');
    }

    showFavoriteButton() {
        const favoriteBtn = document.getElementById('add-to-favorites');
        if (favoriteBtn) {
            favoriteBtn.style.display = 'block';
            this.updateFavoriteButton();
        }
    }

    getCurrentPropertyId() {
        const pathParts = window.location.pathname.split('/');
        return parseInt(pathParts[pathParts.length - 1]);
    }

    toggleFavorite() {
        const propertyId = this.getCurrentPropertyId();
        if (!propertyId) return;

        const isFavorite = this.favorites.includes(propertyId);
        
        if (isFavorite) {
            this.removeFromFavorites(propertyId);
        } else {
            this.addToFavorites(propertyId);
        }
    }

    addToFavorites(propertyId) {
        if (!this.favorites.includes(propertyId)) {
            this.favorites.push(propertyId);
            this.saveFavorites();
            this.updateFavoriteButton();
            this.updateFavoritesCount();
            
            // Добавляем уведомление
            this.addNotification({
                id: Date.now(),
                type: 'favorite_added',
                icon: '❤️',
                title: 'Добавлено в избранное',
                message: 'Объект успешно добавлен в избранное',
                category: 'system',
                date: new Date().toISOString(),
                read: false,
                urgent: false
            });
        }
    }

    removeFromFavorites(propertyId) {
        this.favorites = this.favorites.filter(id => id !== propertyId);
        this.saveFavorites();
        this.updateFavoriteButton();
        this.updateFavoritesCount();
        this.renderFavorites(); // Обновляем список если панель открыта
    }

    updateFavoriteButton() {
        const propertyId = this.getCurrentPropertyId();
        const isFavorite = this.favorites.includes(propertyId);
        
        const favoriteIcon = document.querySelector('.favorite-icon');
        const favoriteText = document.querySelector('.favorite-text');
        
        if (favoriteIcon && favoriteText) {
            if (isFavorite) {
                favoriteIcon.textContent = '❤️';
                favoriteText.textContent = 'Убрать из избранного';
            } else {
                favoriteIcon.textContent = '🤍';
                favoriteText.textContent = 'Добавить в избранное';
            }
        }
    }

    updateFavoritesCount() {
        const countElement = document.getElementById('favorites-count');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }

    renderFavorites() {
        const favoritesList = document.getElementById('favorites-list');
        
        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="empty-favorites">
                    <div class="empty-icon">❤️</div>
                    <div class="empty-text">Нет избранных объектов</div>
                    <div class="empty-hint">Добавляйте понравившиеся объекты в избранное для быстрого доступа</div>
                </div>
            `;
            return;
        }

        // Генерируем данные объектов (в реальном приложении это будет загрузка с сервера)
        const favoriteProperties = this.generateFavoritePropertiesData();
        
        // Сортировка
        const sortBy = document.getElementById('favorites-sort')?.value || 'date-desc';
        this.sortFavorites(favoriteProperties, sortBy);

        favoritesList.innerHTML = favoriteProperties.map(property => 
            this.createFavoritePropertyHTML(property)
        ).join('');
    }

    generateFavoritePropertiesData() {
        const districts = ['Центр', 'Восток-5', 'Джал', 'Асанбай', 'Кок-Жар', 'Ак-Орго', 'Арча-Бешик', 'Алтын-Казык'];
        const cities = ['Бишкек', 'Ош', 'Джалал-Абад', 'Каракол', 'Нарын', 'Талас'];
        
        return this.favorites.map(id => ({
            id: id,
            title: `Объект недвижимости #${id}`,
            price: Math.floor(Math.random() * 15000000) + 3000000, // от 3 млн до 18 млн сомов
            area: Math.floor(Math.random() * 150) + 40,
            rooms: Math.floor(Math.random() * 5) + 1,
            address: `${cities[Math.floor(Math.random() * cities.length)]}, ${districts[Math.floor(Math.random() * districts.length)]}`,
            image: '/images/no-image.svg',
            dateAdded: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
    }

    createFavoritePropertyHTML(property) {
        const formattedPrice = this.formatMoney(property.price);
        const timeAgo = this.getTimeAgo(new Date(property.dateAdded));
        
        return `
            <div class="favorite-property" data-id="${property.id}">
                <div class="property-image">
                    <img src="${property.image}" alt="${property.title}">
                </div>
                
                <div class="property-info">
                    <h4 class="property-title">${property.title}</h4>
                    <div class="property-price">${formattedPrice}</div>
                    <div class="property-details">
                        <span class="property-area">${property.area} м²</span>
                        <span class="property-rooms">${property.rooms} комн.</span>
                    </div>
                    <div class="property-address">${property.address}</div>
                    <div class="property-added">Добавлено: ${timeAgo}</div>
                </div>
                
                <div class="property-actions">
                    <button class="view-property-btn" onclick="viewProperty(${property.id})">
                        👁️ Посмотреть
                    </button>
                    <button class="remove-favorite-btn" onclick="removeFromFavorites(${property.id})">
                        🗑️ Удалить
                    </button>
                </div>
            </div>
        `;
    }

    sortFavorites(properties, sortBy) {
        switch (sortBy) {
            case 'date-desc':
                properties.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
                break;
            case 'date-asc':
                properties.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
                break;
            case 'price-asc':
                properties.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                properties.sort((a, b) => b.price - a.price);
                break;
            case 'area-asc':
                properties.sort((a, b) => a.area - b.area);
                break;
            case 'area-desc':
                properties.sort((a, b) => b.area - a.area);
                break;
        }
    }

    compareAllFavorites() {
        if (this.favorites.length < 2) {
            alert('Добавьте минимум 2 объекта для сравнения');
            return;
        }
        
        const compareUrl = '/Property/Compare?' + this.favorites.map(id => `ids=${id}`).join('&');
        window.open(compareUrl, '_blank');
    }

    // Утилиты
    getTimeAgo(date) {
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'только что';
        if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} ч назад`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} дн назад`;
        
        return date.toLocaleDateString('ru-RU');
    }

    formatMoney(amount) {
        const kgsAmount = new Intl.NumberFormat('ky-KG').format(amount) + ' сом';
        const usdAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount / 87.5); // Конвертация в доллары
        
        return `${kgsAmount} (${usdAmount})`;
    }

    // Сохранение данных
    saveNotifications() {
        localStorage.setItem('real_estate_notifications', JSON.stringify(this.notifications));
    }

    loadNotifications() {
        const saved = localStorage.getItem('real_estate_notifications');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavorites() {
        localStorage.setItem('real_estate_favorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const saved = localStorage.getItem('real_estate_favorites');
        return saved ? JSON.parse(saved) : [];
    }

    saveSubscriptions() {
        localStorage.setItem('real_estate_subscriptions', JSON.stringify(this.subscriptions));
    }

    loadSubscriptions() {
        const saved = localStorage.getItem('real_estate_subscriptions');
        return saved ? JSON.parse(saved) : {};
    }

    saveNotificationSettings() {
        const settings = {
            priceChanges: document.getElementById('notify-price-changes')?.checked || false,
            newProperties: document.getElementById('notify-new-properties')?.checked || false,
            reviews: document.getElementById('notify-reviews')?.checked || false
        };
        
        localStorage.setItem('notification_settings', JSON.stringify(settings));
    }
}

// Глобальные функции и инициализация
let notificationSystem = null;

function initNotificationSystem() {
    notificationSystem = new NotificationSystem();
}

function markAsRead(notificationId) {
    if (notificationSystem) {
        notificationSystem.markAsRead(notificationId);
    }
}

function markAllAsRead() {
    if (notificationSystem) {
        notificationSystem.markAllAsRead();
    }
}

function deleteNotification(notificationId) {
    if (notificationSystem) {
        notificationSystem.deleteNotification(notificationId);
    }
}

function closeNotifications() {
    if (notificationSystem) {
        notificationSystem.closeNotifications();
    }
}

function toggleFavorite() {
    if (notificationSystem) {
        notificationSystem.toggleFavorite();
    }
}

function removeFromFavorites(propertyId) {
    if (notificationSystem) {
        notificationSystem.removeFromFavorites(propertyId);
    }
}

function closeFavorites() {
    if (notificationSystem) {
        notificationSystem.closeFavorites();
    }
}

function compareAllFavorites() {
    if (notificationSystem) {
        notificationSystem.compareAllFavorites();
    }
}

function viewProperty(propertyId) {
    window.open(`/Property/Details/${propertyId}`, '_blank');
}

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initNotificationSystem();
});