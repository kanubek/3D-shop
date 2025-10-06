class ReviewSystem {
    constructor(propertyId) {
        this.propertyId = propertyId;
        this.reviews = [];
        this.currentRating = 0;
        this.userReview = null;
        
        this.init();
    }

    init() {
        this.createReviewInterface();
        this.loadReviews();
        this.setupEventListeners();
    }

    createReviewInterface() {
        const reviewHTML = `
            <div class="reviews-section" id="reviews-section">
                <div class="reviews-header">
                    <h3>⭐ Отзывы и рейтинги</h3>
                    <div class="overall-rating">
                        <div class="rating-display">
                            <div class="rating-number" id="overall-rating">4.5</div>
                            <div class="rating-stars" id="overall-stars">
                                <span class="star filled">⭐</span>
                                <span class="star filled">⭐</span>
                                <span class="star filled">⭐</span>
                                <span class="star filled">⭐</span>
                                <span class="star half">⭐</span>
                            </div>
                            <div class="rating-count" id="rating-count">(0 отзывов)</div>
                        </div>
                        <button class="add-review-btn" onclick="openReviewForm()">
                            ✍️ Написать отзыв
                        </button>
                    </div>
                </div>
                
                <div class="rating-breakdown">
                    <div class="breakdown-item">
                        <span class="rating-label">5 звезд</span>
                        <div class="rating-bar">
                            <div class="rating-fill" data-rating="5" style="width: 0%"></div>
                        </div>
                        <span class="rating-percent" id="rating-5-count">0</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="rating-label">4 звезды</span>
                        <div class="rating-bar">
                            <div class="rating-fill" data-rating="4" style="width: 0%"></div>
                        </div>
                        <span class="rating-percent" id="rating-4-count">0</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="rating-label">3 звезды</span>
                        <div class="rating-bar">
                            <div class="rating-fill" data-rating="3" style="width: 0%"></div>
                        </div>
                        <span class="rating-percent" id="rating-3-count">0</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="rating-label">2 звезды</span>
                        <div class="rating-bar">
                            <div class="rating-fill" data-rating="2" style="width: 0%"></div>
                        </div>
                        <span class="rating-percent" id="rating-2-count">0</span>
                    </div>
                    <div class="breakdown-item">
                        <span class="rating-label">1 звезда</span>
                        <div class="rating-bar">
                            <div class="rating-fill" data-rating="1" style="width: 0%"></div>
                        </div>
                        <span class="rating-percent" id="rating-1-count">0</span>
                    </div>
                </div>

                <div class="reviews-filters">
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">Все отзывы</button>
                        <button class="filter-tab" data-filter="5">5 звезд</button>
                        <button class="filter-tab" data-filter="4">4 звезды</button>
                        <button class="filter-tab" data-filter="3">3 звезды</button>
                        <button class="filter-tab" data-filter="with-photos">С фото</button>
                    </div>
                    
                    <select class="sort-select" id="reviews-sort">
                        <option value="date-desc">Сначала новые</option>
                        <option value="date-asc">Сначала старые</option>
                        <option value="rating-desc">Сначала с высоким рейтингом</option>
                        <option value="rating-asc">Сначала с низким рейтингом</option>
                        <option value="helpful">Самые полезные</option>
                    </select>
                </div>

                <div class="reviews-list" id="reviews-list">
                    <!-- Отзывы будут добавлены динамически -->
                </div>

                <div class="reviews-pagination" id="reviews-pagination">
                    <!-- Пагинация будет добавлена динамически -->
                </div>
            </div>

            <!-- Форма добавления отзыва -->
            <div class="review-form-modal" id="review-form-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>✍️ Написать отзыв</h3>
                        <button class="close-btn" onclick="closeReviewForm()">×</button>
                    </div>
                    
                    <div class="modal-body">
                        <form id="review-form">
                            <div class="form-group">
                                <label>Ваша оценка *</label>
                                <div class="rating-input">
                                    <span class="rating-star" data-rating="1">⭐</span>
                                    <span class="rating-star" data-rating="2">⭐</span>
                                    <span class="rating-star" data-rating="3">⭐</span>
                                    <span class="rating-star" data-rating="4">⭐</span>
                                    <span class="rating-star" data-rating="5">⭐</span>
                                </div>
                                <div class="rating-text" id="rating-text">Выберите оценку</div>
                            </div>

                            <div class="form-group">
                                <label for="review-title">Заголовок отзыва *</label>
                                <input type="text" id="review-title" class="form-input" 
                                       placeholder="Кратко опишите ваше впечатление" required>
                            </div>

                            <div class="form-group">
                                <label for="review-text">Ваш отзыв *</label>
                                <textarea id="review-text" class="form-textarea" rows="6" 
                                          placeholder="Поделитесь подробным мнением об объекте..." required></textarea>
                                <div class="char-counter">
                                    <span id="char-count">0</span>/1000
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Аспекты оценки</label>
                                <div class="aspects-rating">
                                    <div class="aspect-item">
                                        <span class="aspect-label">Расположение</span>
                                        <div class="aspect-stars" data-aspect="location">
                                            <span class="aspect-star" data-rating="1">⭐</span>
                                            <span class="aspect-star" data-rating="2">⭐</span>
                                            <span class="aspect-star" data-rating="3">⭐</span>
                                            <span class="aspect-star" data-rating="4">⭐</span>
                                            <span class="aspect-star" data-rating="5">⭐</span>
                                        </div>
                                    </div>
                                    
                                    <div class="aspect-item">
                                        <span class="aspect-label">Инфраструктура</span>
                                        <div class="aspect-stars" data-aspect="infrastructure">
                                            <span class="aspect-star" data-rating="1">⭐</span>
                                            <span class="aspect-star" data-rating="2">⭐</span>
                                            <span class="aspect-star" data-rating="3">⭐</span>
                                            <span class="aspect-star" data-rating="4">⭐</span>
                                            <span class="aspect-star" data-rating="5">⭐</span>
                                        </div>
                                    </div>
                                    
                                    <div class="aspect-item">
                                        <span class="aspect-label">Транспорт</span>
                                        <div class="aspect-stars" data-aspect="transport">
                                            <span class="aspect-star" data-rating="1">⭐</span>
                                            <span class="aspect-star" data-rating="2">⭐</span>
                                            <span class="aspect-star" data-rating="3">⭐</span>
                                            <span class="aspect-star" data-rating="4">⭐</span>
                                            <span class="aspect-star" data-rating="5">⭐</span>
                                        </div>
                                    </div>
                                    
                                    <div class="aspect-item">
                                        <span class="aspect-label">Цена/качество</span>
                                        <div class="aspect-stars" data-aspect="value">
                                            <span class="aspect-star" data-rating="1">⭐</span>
                                            <span class="aspect-star" data-rating="2">⭐</span>
                                            <span class="aspect-star" data-rating="3">⭐</span>
                                            <span class="aspect-star" data-rating="4">⭐</span>
                                            <span class="aspect-star" data-rating="5">⭐</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="review-photos">Фото (необязательно)</label>
                                <div class="photo-upload">
                                    <input type="file" id="review-photos" multiple accept="image/*" style="display: none;">
                                    <button type="button" class="photo-upload-btn" onclick="document.getElementById('review-photos').click()">
                                        📷 Добавить фото
                                    </button>
                                    <div class="photos-preview" id="photos-preview"></div>
                                </div>
                            </div>

                            <div class="form-group">
                                <div class="form-checkbox">
                                    <input type="checkbox" id="review-recommend" checked>
                                    <label for="review-recommend">Я рекомендую этот объект</label>
                                </div>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn-secondary" onclick="closeReviewForm()">
                                    Отмена
                                </button>
                                <button type="submit" class="btn-primary">
                                    📝 Опубликовать отзыв
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Находим место для вставки (после описания объекта)
        const insertTarget = document.querySelector('.property-specs') || document.querySelector('.property-details');
        if (insertTarget) {
            insertTarget.insertAdjacentHTML('afterend', reviewHTML);
        }
    }

    loadReviews() {
        // Генерируем демо-отзывы для примера
        this.reviews = this.generateDemoReviews();
        this.renderReviews();
        this.updateRatingBreakdown();
    }

    generateDemoReviews() {
        const demoReviews = [
            {
                id: 1,
                author: "Анна К.",
                rating: 5,
                title: "Отличный объект в прекрасном районе!",
                text: "Купили квартиру здесь полгода назад и очень довольны. Отличная планировка, хорошие соседи, развитая инфраструктура. Рядом школа, детский сад, магазины. Транспортная доступность на высоте.",
                date: "2024-10-01",
                helpful: 12,
                aspects: { location: 5, infrastructure: 5, transport: 4, value: 4 },
                photos: [],
                recommend: true
            },
            {
                id: 2,
                author: "Михаил С.",
                rating: 4,
                title: "Хорошее соотношение цены и качества",
                text: "Приобрел дом для семьи. В целом доволен покупкой. Есть небольшие нюансы с парковкой, но в остальном все устраивает. Качественная постройка, хорошая отделка.",
                date: "2024-09-15",
                helpful: 8,
                aspects: { location: 4, infrastructure: 4, transport: 3, value: 5 },
                photos: [],
                recommend: true
            },
            {
                id: 3,
                author: "Елена В.",
                rating: 5,
                title: "Превзошло все ожидания!",
                text: "Искали долго, рассматривали много вариантов. Этот объект оказался именно тем, что нужно. Современная планировка, качественные материалы, прекрасный вид из окон. Агентство работало профессионально.",
                date: "2024-08-20",
                helpful: 15,
                aspects: { location: 5, infrastructure: 5, transport: 5, value: 4 },
                photos: [],
                recommend: true
            }
        ];

        return demoReviews;
    }

    renderReviews(filter = 'all') {
        const reviewsList = document.getElementById('reviews-list');
        let filteredReviews = [...this.reviews];

        // Применяем фильтры
        if (filter !== 'all') {
            if (filter === 'with-photos') {
                filteredReviews = filteredReviews.filter(review => review.photos.length > 0);
            } else {
                filteredReviews = filteredReviews.filter(review => review.rating == filter);
            }
        }

        // Сортировка
        const sortBy = document.getElementById('reviews-sort')?.value || 'date-desc';
        this.sortReviews(filteredReviews, sortBy);

        reviewsList.innerHTML = filteredReviews.map(review => this.createReviewHTML(review)).join('');

        // Обновляем счетчик
        document.getElementById('rating-count').textContent = `(${this.reviews.length} отзывов)`;
        
        // Вычисляем средний рейтинг
        const avgRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / this.reviews.length;
        document.getElementById('overall-rating').textContent = avgRating.toFixed(1);
    }

    createReviewHTML(review) {
        const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        const recommendBadge = review.recommend ? '<span class="recommend-badge">👍 Рекомендует</span>' : '';
        
        return `
            <div class="review-item">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.author.charAt(0)}</div>
                        <div class="reviewer-details">
                            <div class="reviewer-name">${review.author}</div>
                            <div class="review-date">${this.formatDate(review.date)}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        <div class="review-stars">${stars}</div>
                        ${recommendBadge}
                    </div>
                </div>
                
                <div class="review-content">
                    <h4 class="review-title">${review.title}</h4>
                    <p class="review-text">${review.text}</p>
                    
                    ${this.createAspectsHTML(review.aspects)}
                    
                    ${review.photos.length > 0 ? this.createPhotosHTML(review.photos) : ''}
                </div>
                
                <div class="review-actions">
                    <button class="review-action-btn" onclick="toggleReviewHelpful(${review.id})">
                        👍 Полезно (${review.helpful})
                    </button>
                    <button class="review-action-btn">
                        💬 Ответить
                    </button>
                    <button class="review-action-btn">
                        ⚠️ Пожаловаться
                    </button>
                </div>
            </div>
        `;
    }

    createAspectsHTML(aspects) {
        return `
            <div class="review-aspects">
                <div class="aspect-rating">
                    <span class="aspect-name">Расположение:</span>
                    <span class="aspect-value">${'⭐'.repeat(aspects.location)}${'☆'.repeat(5-aspects.location)}</span>
                </div>
                <div class="aspect-rating">
                    <span class="aspect-name">Инфраструктура:</span>
                    <span class="aspect-value">${'⭐'.repeat(aspects.infrastructure)}${'☆'.repeat(5-aspects.infrastructure)}</span>
                </div>
                <div class="aspect-rating">
                    <span class="aspect-name">Транспорт:</span>
                    <span class="aspect-value">${'⭐'.repeat(aspects.transport)}${'☆'.repeat(5-aspects.transport)}</span>
                </div>
                <div class="aspect-rating">
                    <span class="aspect-name">Цена/качество:</span>
                    <span class="aspect-value">${'⭐'.repeat(aspects.value)}${'☆'.repeat(5-aspects.value)}</span>
                </div>
            </div>
        `;
    }

    createPhotosHTML(photos) {
        return `
            <div class="review-photos">
                ${photos.map(photo => `
                    <div class="review-photo">
                        <img src="${photo}" alt="Фото от покупателя" onclick="openPhotoModal('${photo}')">
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateRatingBreakdown() {
        const ratingCounts = [0, 0, 0, 0, 0, 0]; // индексы 1-5
        
        this.reviews.forEach(review => {
            ratingCounts[review.rating]++;
        });

        const total = this.reviews.length;
        
        for (let i = 1; i <= 5; i++) {
            const percentage = total > 0 ? (ratingCounts[i] / total) * 100 : 0;
            const fill = document.querySelector(`[data-rating="${i}"]`);
            const count = document.getElementById(`rating-${i}-count`);
            
            if (fill) fill.style.width = `${percentage}%`;
            if (count) count.textContent = ratingCounts[i];
        }
    }

    setupEventListeners() {
        // Фильтры отзывов
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.renderReviews(e.target.dataset.filter);
            });
        });

        // Сортировка
        const sortSelect = document.getElementById('reviews-sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                const activeFilter = document.querySelector('.filter-tab.active').dataset.filter;
                this.renderReviews(activeFilter);
            });
        }

        // Рейтинг в форме
        document.querySelectorAll('.rating-star').forEach(star => {
            star.addEventListener('click', (e) => {
                const rating = parseInt(e.target.dataset.rating);
                this.setFormRating(rating);
            });
        });

        // Аспекты рейтинга
        document.querySelectorAll('.aspect-stars').forEach(aspectStars => {
            aspectStars.addEventListener('click', (e) => {
                if (e.target.classList.contains('aspect-star')) {
                    const rating = parseInt(e.target.dataset.rating);
                    const aspect = aspectStars.dataset.aspect;
                    this.setAspectRating(aspect, rating);
                }
            });
        });

        // Счетчик символов
        const reviewTextarea = document.getElementById('review-text');
        if (reviewTextarea) {
            reviewTextarea.addEventListener('input', (e) => {
                const count = e.target.value.length;
                document.getElementById('char-count').textContent = count;
                
                if (count > 1000) {
                    e.target.value = e.target.value.substring(0, 1000);
                    document.getElementById('char-count').textContent = 1000;
                }
            });
        }

        // Отправка формы
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
    }

    setFormRating(rating) {
        this.currentRating = rating;
        
        document.querySelectorAll('.rating-star').forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#fbbf24';
                star.classList.add('selected');
            } else {
                star.style.color = '#d1d5db';
                star.classList.remove('selected');
            }
        });

        const ratingTexts = ['', 'Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
        document.getElementById('rating-text').textContent = ratingTexts[rating];
    }

    setAspectRating(aspect, rating) {
        const aspectStars = document.querySelector(`[data-aspect="${aspect}"]`);
        const stars = aspectStars.querySelectorAll('.aspect-star');
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.style.color = '#fbbf24';
            } else {
                star.style.color = '#d1d5db';
            }
        });
    }

    sortReviews(reviews, sortBy) {
        switch (sortBy) {
            case 'date-desc':
                reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                reviews.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'rating-desc':
                reviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-asc':
                reviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'helpful':
                reviews.sort((a, b) => b.helpful - a.helpful);
                break;
        }
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    submitReview() {
        // Собираем данные формы
        const reviewData = {
            rating: this.currentRating,
            title: document.getElementById('review-title').value,
            text: document.getElementById('review-text').value,
            recommend: document.getElementById('review-recommend').checked,
            propertyId: this.propertyId
        };

        // Валидация
        if (reviewData.rating === 0) {
            alert('Пожалуйста, поставьте оценку');
            return;
        }

        if (!reviewData.title.trim()) {
            alert('Пожалуйста, введите заголовок отзыва');
            return;
        }

        if (!reviewData.text.trim()) {
            alert('Пожалуйста, напишите отзыв');
            return;
        }

        // Имитация отправки (в реальном приложении здесь будет AJAX запрос)
        console.log('Отправка отзыва:', reviewData);
        
        // Добавляем отзыв в список (для демо)
        const newReview = {
            id: Date.now(),
            author: "Вы",
            rating: reviewData.rating,
            title: reviewData.title,
            text: reviewData.text,
            date: new Date().toISOString().split('T')[0],
            helpful: 0,
            aspects: { location: 4, infrastructure: 4, transport: 4, value: 4 },
            photos: [],
            recommend: reviewData.recommend
        };

        this.reviews.unshift(newReview);
        this.renderReviews();
        this.updateRatingBreakdown();
        
        // Закрываем форму
        this.closeReviewForm();
        
        // Показываем уведомление
        this.showNotification('Спасибо! Ваш отзыв был успешно опубликован!', 'success');
    }

    closeReviewForm() {
        document.getElementById('review-form-modal').classList.remove('active');
        document.getElementById('review-form').reset();
        this.currentRating = 0;
        this.setFormRating(0);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Глобальные функции
let reviewSystem = null;

function initReviewSystem(propertyId) {
    reviewSystem = new ReviewSystem(propertyId);
}

function openReviewForm() {
    document.getElementById('review-form-modal').classList.add('active');
}

function closeReviewForm() {
    if (reviewSystem) {
        reviewSystem.closeReviewForm();
    }
}

function toggleReviewHelpful(reviewId) {
    console.log('Toggle helpful for review:', reviewId);
    // Реализация лайков отзывов
}

function openPhotoModal(photoUrl) {
    // Открытие фото в модальном окне
    console.log('Open photo modal:', photoUrl);
}