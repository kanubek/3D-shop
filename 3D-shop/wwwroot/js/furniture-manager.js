class VirtualFurnitureManager {
    constructor(viewer3D) {
        this.viewer = viewer3D;
        this.furniture = [];
        this.selectedFurniture = null;
        this.furnitureLibrary = this.initFurnitureLibrary();
        this.isPlacementMode = false;
        this.currentCategory = 'living';
        
        this.init();
    }

    init() {
        this.createFurnitureUI();
        this.setupEventListeners();
    }

    initFurnitureLibrary() {
        return {
            living: [
                { id: 'sofa', name: 'Диван', icon: '🛋️', color: 0x4a5568, size: [2, 0.8, 0.8] },
                { id: 'armchair', name: 'Кресло', icon: '🪑', color: 0x2d3748, size: [0.8, 0.8, 0.8] },
                { id: 'coffee_table', name: 'Журнальный столик', icon: '🟫', color: 0x8b4513, size: [1.2, 0.4, 0.8] },
                { id: 'tv_stand', name: 'ТВ тумба', icon: '📺', color: 0x1a202c, size: [1.6, 0.5, 0.4] },
                { id: 'bookshelf', name: 'Книжная полка', icon: '📚', color: 0x8b4513, size: [0.8, 2, 0.3] }
            ],
            bedroom: [
                { id: 'bed', name: 'Кровать', icon: '🛏️', color: 0x4a5568, size: [2, 0.6, 1.5] },
                { id: 'wardrobe', name: 'Шкаф', icon: '👗', color: 0x2d3748, size: [1.2, 2.2, 0.6] },
                { id: 'nightstand', name: 'Тумбочка', icon: '🕯️', color: 0x8b4513, size: [0.5, 0.6, 0.4] },
                { id: 'dresser', name: 'Комод', icon: '🗃️', color: 0x8b4513, size: [1.2, 0.8, 0.5] },
                { id: 'mirror', name: 'Зеркало', icon: '🪞', color: 0xc0c0c0, size: [0.05, 1.8, 0.8] }
            ],
            kitchen: [
                { id: 'dining_table', name: 'Обеденный стол', icon: '🍽️', color: 0x8b4513, size: [1.4, 0.75, 0.8] },
                { id: 'chair', name: 'Стул', icon: '🪑', color: 0x4a5568, size: [0.5, 0.9, 0.5] },
                { id: 'refrigerator', name: 'Холодильник', icon: '❄️', color: 0xf8f8ff, size: [0.6, 1.8, 0.6] },
                { id: 'kitchen_island', name: 'Кухонный остров', icon: '🏝️', color: 0x8b4513, size: [2, 0.9, 1] },
                { id: 'cabinet', name: 'Шкафчик', icon: '🗄️', color: 0x4a5568, size: [0.8, 0.9, 0.4] }
            ],
            office: [
                { id: 'desk', name: 'Письменный стол', icon: '🖥️', color: 0x8b4513, size: [1.4, 0.75, 0.7] },
                { id: 'office_chair', name: 'Офисное кресло', icon: '💺', color: 0x1a202c, size: [0.6, 1.2, 0.6] },
                { id: 'file_cabinet', name: 'Картотека', icon: '📁', color: 0x4a5568, size: [0.4, 1.3, 0.6] },
                { id: 'bookcase', name: 'Стеллаж', icon: '📖', color: 0x8b4513, size: [0.8, 2, 0.3] },
                { id: 'safe', name: 'Сейф', icon: '🔒', color: 0x2d3748, size: [0.4, 0.6, 0.4] }
            ]
        };
    }

    createFurnitureUI() {
        const furnitureHTML = `
            <div class="furniture-panel" id="furniture-panel">
                <div class="furniture-header">
                    <h4>🪑 Виртуальная мебель</h4>
                    <button class="close-btn" onclick="toggleFurniturePanel()">×</button>
                </div>
                
                <div class="furniture-categories">
                    <button class="category-btn active" data-category="living">🛋️ Гостиная</button>
                    <button class="category-btn" data-category="bedroom">🛏️ Спальня</button>
                    <button class="category-btn" data-category="kitchen">🍽️ Кухня</button>
                    <button class="category-btn" data-category="office">💼 Офис</button>
                </div>
                
                <div class="furniture-grid" id="furniture-grid">
                    <!-- Мебель будет добавлена динамически -->
                </div>
                
                <div class="furniture-controls">
                    <button class="control-btn" onclick="clearAllFurniture()">
                        🗑️ Очистить все
                    </button>
                    <button class="control-btn" onclick="saveFurnitureLayout()">
                        💾 Сохранить
                    </button>
                    <button class="control-btn" onclick="loadFurnitureLayout()">
                        📂 Загрузить
                    </button>
                </div>
                
                <div class="placement-help" id="placement-help" style="display: none;">
                    <div class="help-text">
                        <strong>Режим размещения активен</strong><br>
                        Кликните в 3D пространстве для размещения мебели
                    </div>
                    <button class="cancel-placement" onclick="cancelPlacement()">Отмена</button>
                </div>
            </div>
        `;

        // Добавляем кнопку для открытия панели мебели
        const toggleButton = `
            <button class="furniture-toggle-btn" onclick="toggleFurniturePanel()">
                🪑 Мебель
            </button>
        `;

        // Добавляем в контейнер управления 3D
        const controlsContainer = document.querySelector('.viewer-controls');
        if (controlsContainer) {
            controlsContainer.insertAdjacentHTML('beforeend', toggleButton);
        }

        // Добавляем панель мебели в документ
        document.body.insertAdjacentHTML('beforeend', furnitureHTML);

        // Загружаем мебель для активной категории
        this.loadFurnitureCategory('living');
    }

    setupEventListeners() {
        // Обработчики для категорий
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                const category = e.target.dataset.category;
                this.switchCategory(category);
            }
        });

        // Обработчик клика в 3D пространстве
        this.viewer.container.addEventListener('click', (event) => {
            if (this.isPlacementMode && this.selectedFurniture) {
                this.placeFurniture(event);
            }
        });

        // Обработчики клавиатуры для управления мебелью
        document.addEventListener('keydown', (e) => {
            if (this.selectedFurnitureItem) {
                switch (e.key) {
                    case 'Delete':
                        this.removeFurniture(this.selectedFurnitureItem);
                        break;
                    case 'r':
                    case 'R':
                        this.rotateFurniture(this.selectedFurnitureItem);
                        break;
                }
            }
        });
    }

    switchCategory(category) {
        this.currentCategory = category;
        
        // Обновляем активную кнопку категории
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Загружаем мебель для новой категории
        this.loadFurnitureCategory(category);
    }

    loadFurnitureCategory(category) {
        const grid = document.getElementById('furniture-grid');
        const items = this.furnitureLibrary[category];

        grid.innerHTML = items.map(item => `
            <div class="furniture-item" data-furniture-id="${item.id}" onclick="selectFurnitureForPlacement('${item.id}')">
                <div class="furniture-icon">${item.icon}</div>
                <div class="furniture-name">${item.name}</div>
            </div>
        `).join('');
    }

    selectFurnitureForPlacement(furnitureId) {
        const furnitureData = this.getFurnitureData(furnitureId);
        if (!furnitureData) return;

        this.selectedFurniture = furnitureData;
        this.isPlacementMode = true;

        // Показываем помощь по размещению
        document.getElementById('placement-help').style.display = 'block';

        // Изменяем курсор
        this.viewer.container.style.cursor = 'crosshair';

        // Подсвечиваем выбранную мебель
        document.querySelectorAll('.furniture-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-furniture-id="${furnitureId}"]`).classList.add('selected');
    }

    placeFurniture(event) {
        if (!this.isPlacementMode || !this.selectedFurniture) return;

        const rect = this.viewer.container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.viewer.camera);
        
        // Ищем пересечение с полом
        const groundIntersects = raycaster.intersectObjects(this.viewer.scene.children, true);
        const floorIntersect = groundIntersects.find(intersect => 
            intersect.object.name === 'floor' || intersect.point.y < 0.5
        );

        if (floorIntersect) {
            const furniture = this.createFurnitureMesh(this.selectedFurniture);
            furniture.position.copy(floorIntersect.point);
            furniture.position.y = this.selectedFurniture.size[1] / 2; // Ставим на пол

            // Добавляем в сцену и в список
            this.viewer.scene.add(furniture);
            this.furniture.push({
                id: Date.now(),
                type: this.selectedFurniture.id,
                mesh: furniture,
                data: this.selectedFurniture
            });

            // Выходим из режима размещения
            this.cancelPlacement();

            this.viewer.showInfo(`${this.selectedFurniture.name} добавлена! Нажмите R для поворота, Delete для удаления.`);
        }
    }

    createFurnitureMesh(furnitureData) {
        const [width, height, depth] = furnitureData.size;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        
        // Создаем материал с цветом и небольшой прозрачностью
        const material = new THREE.MeshLambertMaterial({ 
            color: furnitureData.color,
            transparent: true,
            opacity: 0.8
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = `furniture_${furnitureData.id}`;

        // Добавляем обводку
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3 });
        const wireframe = new THREE.LineSegments(edges, lineMaterial);
        mesh.add(wireframe);

        // Добавляем текстовую метку
        this.addFurnitureLabel(mesh, furnitureData.name);

        // Делаем мебель интерактивной
        mesh.userData = { furnitureData, manager: this };
        mesh.addEventListener = this.setupFurnitureInteraction.bind(this, mesh);

        return mesh;
    }

    addFurnitureLabel(mesh, name) {
        // Создаем простую текстовую метку
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0,0,0,0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.fillText(name, canvas.width / 2, canvas.height / 2 + 7);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        sprite.scale.set(1, 0.25, 1);
        sprite.position.y = mesh.geometry.parameters.height / 2 + 0.5;
        
        mesh.add(sprite);
    }

    setupFurnitureInteraction(mesh) {
        mesh.addEventListener('click', () => {
            this.selectFurnitureItem(mesh);
        });
    }

    selectFurnitureItem(mesh) {
        // Снимаем выделение с предыдущего объекта
        if (this.selectedFurnitureItem) {
            this.selectedFurnitureItem.material.emissive = new THREE.Color(0x000000);
        }

        // Выделяем новый объект
        this.selectedFurnitureItem = mesh;
        mesh.material.emissive = new THREE.Color(0x444444);

        this.viewer.showInfo('Мебель выбрана! R - повернуть, Delete - удалить');
    }

    rotateFurniture(mesh) {
        if (mesh) {
            mesh.rotation.y += Math.PI / 2;
            this.viewer.showInfo('Мебель повернута!');
        }
    }

    removeFurniture(mesh) {
        if (mesh) {
            this.viewer.scene.remove(mesh);
            
            // Удаляем из списка
            this.furniture = this.furniture.filter(item => item.mesh !== mesh);
            
            // Снимаем выделение
            this.selectedFurnitureItem = null;
            
            this.viewer.showInfo('Мебель удалена!');
        }
    }

    cancelPlacement() {
        this.isPlacementMode = false;
        this.selectedFurniture = null;
        
        document.getElementById('placement-help').style.display = 'none';
        this.viewer.container.style.cursor = 'default';

        // Снимаем выделение с мебели
        document.querySelectorAll('.furniture-item').forEach(item => {
            item.classList.remove('selected');
        });
    }

    clearAllFurniture() {
        if (confirm('Удалить всю мебель?')) {
            this.furniture.forEach(item => {
                this.viewer.scene.remove(item.mesh);
            });
            
            this.furniture = [];
            this.selectedFurnitureItem = null;
            
            this.viewer.showSuccess('Вся мебель удалена!');
        }
    }

    saveFurnitureLayout() {
        const layout = this.furniture.map(item => ({
            type: item.type,
            position: item.mesh.position.toArray(),
            rotation: item.mesh.rotation.toArray()
        }));

        localStorage.setItem('furniture_layout', JSON.stringify(layout));
        this.viewer.showSuccess('Расстановка мебели сохранена!');
    }

    loadFurnitureLayout() {
        const saved = localStorage.getItem('furniture_layout');
        if (saved) {
            const layout = JSON.parse(saved);
            
            // Очищаем текущую мебель
            this.clearAllFurniture();

            // Загружаем сохраненную
            layout.forEach(item => {
                const furnitureData = this.getFurnitureData(item.type);
                if (furnitureData) {
                    const mesh = this.createFurnitureMesh(furnitureData);
                    mesh.position.fromArray(item.position);
                    mesh.rotation.fromArray(item.rotation);
                    
                    this.viewer.scene.add(mesh);
                    this.furniture.push({
                        id: Date.now(),
                        type: item.type,
                        mesh: mesh,
                        data: furnitureData
                    });
                }
            });

            this.viewer.showSuccess('Расстановка мебели загружена!');
        } else {
            this.viewer.showInfo('Нет сохраненной расстановки мебели.');
        }
    }

    getFurnitureData(id) {
        for (const category of Object.values(this.furnitureLibrary)) {
            const item = category.find(furniture => furniture.id === id);
            if (item) return item;
        }
        return null;
    }

    togglePanel() {
        const panel = document.getElementById('furniture-panel');
        panel.classList.toggle('open');
    }
}

// Глобальные функции
let furnitureManager = null;

function initFurnitureManager() {
    if (viewer3D && !furnitureManager) {
        furnitureManager = new VirtualFurnitureManager(viewer3D);
    }
}

function toggleFurniturePanel() {
    if (!furnitureManager) {
        initFurnitureManager();
    }
    if (furnitureManager) {
        furnitureManager.togglePanel();
    }
}

function selectFurnitureForPlacement(furnitureId) {
    if (furnitureManager) {
        furnitureManager.selectFurnitureForPlacement(furnitureId);
    }
}

function cancelPlacement() {
    if (furnitureManager) {
        furnitureManager.cancelPlacement();
    }
}

function clearAllFurniture() {
    if (furnitureManager) {
        furnitureManager.clearAllFurniture();
    }
}

function saveFurnitureLayout() {
    if (furnitureManager) {
        furnitureManager.saveFurnitureLayout();
    }
}

function loadFurnitureLayout() {
    if (furnitureManager) {
        furnitureManager.loadFurnitureLayout();
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализируем через 2 секунды после загрузки 3D вьювера
    setTimeout(() => {
        if (viewer3D) {
            initFurnitureManager();
        }
    }, 2000);
});