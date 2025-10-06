// 3D Viewer для отображения моделей недвижимости
class RealEstate3DViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.mixer = null;
        this.clock = new THREE.Clock();
        this.isFullscreen = false;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Создаем сцену
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);

        // Настраиваем камеру
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(10, 10, 10);

        // Создаем рендерер
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.container.appendChild(this.renderer.domElement);

        // Добавляем орбитальные контроллы
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;

        // Добавляем освещение
        this.setupLighting();

        // Добавляем пол/землю
        this.setupGround();

        // Режимы просмотра
        this.currentViewMode = 'normal';
        this.setupViewModes();

        // Система измерений
        this.measurementMode = false;
        this.measurementPoints = [];
        this.setupMeasurements();

        // Система туров
        this.tourPoints = [];
        this.currentTourPoint = -1;
        this.setupTourSystem();

        // Запускаем анимационный цикл
        this.animate();
    }

    setupLighting() {
        // Окружающий свет
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Направленный свет (солнце)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 200;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        this.scene.add(directionalLight);

        // Точечные источники света (для интерьера)
        const pointLight1 = new THREE.PointLight(0xffffff, 0.3, 30);
        pointLight1.position.set(5, 8, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 30);
        pointLight2.position.set(-5, 8, -5);
        this.scene.add(pointLight2);
    }

    setupGround() {
        // Создаем землю/пол
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x7fb069,
            transparent: true,
            opacity: 0.8 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Добавляем сетку координат
        const gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0xcccccc);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        gridHelper.name = 'gridHelper';
        this.scene.add(gridHelper);
    }

    // Загрузка 3D модели
    async loadModel(modelUrl) {
        try {
            this.showLoading(true);
            
            // Удаляем предыдущую модель
            if (this.model) {
                this.scene.remove(this.model);
            }

            // Определяем тип файла и загружаем соответствующим лоадером
            const extension = modelUrl.split('.').pop().toLowerCase();
            let loader;

            switch (extension) {
                case 'gltf':
                case 'glb':
                    loader = new THREE.GLTFLoader();
                    break;
                case 'obj':
                    loader = new THREE.OBJLoader();
                    break;
                case 'fbx':
                    loader = new THREE.FBXLoader();
                    break;
                default:
                    // Если модель не найдена, создаем демо-дом
                    this.createDemoHouse();
                    return;
            }

            const gltf = await new Promise((resolve, reject) => {
                loader.load(modelUrl, resolve, undefined, reject);
            });

            this.model = extension === 'gltf' || extension === 'glb' ? gltf.scene : gltf;
            
            // Настраиваем модель
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // Центрируем модель
            const box = new THREE.Box3().setFromObject(this.model);
            const center = box.getCenter(new THREE.Vector3());
            this.model.position.x = -center.x;
            this.model.position.y = -box.min.y;
            this.model.position.z = -center.z;

            // Масштабируем модель
            const size = box.getSize(new THREE.Vector3());
            const maxSize = Math.max(size.x, size.y, size.z);
            const scale = 10 / maxSize;
            this.model.scale.setScalar(scale);

            this.scene.add(this.model);

            // Настраиваем анимации если есть
            if (gltf && gltf.animations && gltf.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.model);
                gltf.animations.forEach((clip) => {
                    this.mixer.clipAction(clip).play();
                });
            }

            // Фокусируем камеру на модели
            this.focusCamera();
            
            this.showLoading(false);
            this.showSuccess('3D модель успешно загружена!');

        } catch (error) {
            console.error('Ошибка загрузки модели:', error);
            this.showError('Ошибка загрузки 3D модели. Создаем демо-версию...');
            this.createDemoHouse();
        }
    }

    // Создание демо-дома если модель недоступна
    createDemoHouse() {
        this.showLoading(true);

        // Удаляем предыдущую модель
        if (this.model) {
            this.scene.remove(this.model);
        }

        // Добавляем систему частиц (снег или листья)
        this.addParticleSystem();

        const houseGroup = new THREE.Group();

        // Основание дома
        const baseGeometry = new THREE.BoxGeometry(8, 3, 6);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xd4af37 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1.5;
        base.castShadow = true;
        base.receiveShadow = true;
        houseGroup.add(base);

        // Крыша
        const roofGeometry = new THREE.ConeGeometry(6, 3, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 4.5;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        houseGroup.add(roof);

        // Дверь
        const doorGeometry = new THREE.BoxGeometry(1.5, 2.5, 0.1);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 1.25, 3.05);
        houseGroup.add(door);

        // Окна
        const windowGeometry = new THREE.BoxGeometry(1.2, 1.2, 0.1);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb });
        
        const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
        window1.position.set(-2.5, 2, 3.05);
        houseGroup.add(window1);

        const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
        window2.position.set(2.5, 2, 3.05);
        houseGroup.add(window2);

        // Боковые окна
        const sideWindow1 = new THREE.Mesh(windowGeometry, windowMaterial);
        sideWindow1.position.set(4.05, 2, 1);
        houseGroup.add(sideWindow1);

        const sideWindow2 = new THREE.Mesh(windowGeometry, windowMaterial);
        sideWindow2.position.set(4.05, 2, -1);
        houseGroup.add(sideWindow2);

        // Дымоход
        const chimneyGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const chimneyMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
        chimney.position.set(2, 6, 1);
        chimney.castShadow = true;
        houseGroup.add(chimney);

        // Деревья вокруг дома
        this.addTrees(houseGroup);

        // Забор
        this.addFence(houseGroup);

        this.model = houseGroup;
        this.scene.add(this.model);

        this.focusCamera();
        this.showLoading(false);
        this.showInfo('Демонстрационная 3D модель дома создана');
    }

    addTrees(parent) {
        for (let i = 0; i < 5; i++) {
            const treeGroup = new THREE.Group();
            
            // Ствол
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 1.5;
            trunk.castShadow = true;
            treeGroup.add(trunk);

            // Листва
            const leavesGeometry = new THREE.SphereGeometry(2);
            const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
            const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
            leaves.position.y = 4;
            leaves.castShadow = true;
            treeGroup.add(leaves);

            // Случайное расположение
            const angle = (i / 5) * Math.PI * 2;
            const radius = 12 + Math.random() * 5;
            treeGroup.position.x = Math.cos(angle) * radius;
            treeGroup.position.z = Math.sin(angle) * radius;
            
            parent.add(treeGroup);
        }
    }

    addFence(parent) {
        const fenceGroup = new THREE.Group();
        const postGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
        const postMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        
        const railGeometry = new THREE.BoxGeometry(2, 0.1, 0.1);
        const railMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });

        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = 10;
            
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.x = Math.cos(angle) * radius;
            post.position.z = Math.sin(angle) * radius;
            post.position.y = 1;
            post.castShadow = true;
            fenceGroup.add(post);

            if (i < 19) {
                const rail = new THREE.Mesh(railGeometry, railMaterial);
                const nextAngle = ((i + 1) / 20) * Math.PI * 2;
                rail.position.x = (Math.cos(angle) * radius + Math.cos(nextAngle) * radius) / 2;
                rail.position.z = (Math.sin(angle) * radius + Math.sin(nextAngle) * radius) / 2;
                rail.position.y = 1.5;
                rail.rotation.y = angle + Math.PI / 2;
                fenceGroup.add(rail);
            }
        }

        parent.add(fenceGroup);
    }

    focusCamera() {
        if (!this.model) return;

        const box = new THREE.Box3().setFromObject(this.model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        const maxSize = Math.max(size.x, size.y, size.z);
        const distance = maxSize * 1.5;
        
        this.camera.position.set(
            center.x + distance,
            center.y + distance * 0.7,
            center.z + distance
        );
        
        this.controls.target.copy(center);
        this.controls.update();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Обновляем систему частиц
        this.updateParticles();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    // Управление вьювером
    resetCamera() {
        this.focusCamera();
        this.showInfo('Камера сброшена к исходному положению');
    }

    toggleWireframe() {
        if (this.model) {
            this.model.traverse((child) => {
                if (child.isMesh) {
                    child.material.wireframe = !child.material.wireframe;
                }
            });
            this.showInfo(`Режим каркаса: ${this.model.children[0]?.material?.wireframe ? 'включен' : 'выключен'}`);
        }
    }

    toggleAutoRotate() {
        this.controls.autoRotate = !this.controls.autoRotate;
        this.showInfo(`Авто-поворот: ${this.controls.autoRotate ? 'включен' : 'выключен'}`);
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            if (this.container.requestFullscreen) {
                this.container.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    takeScreenshot() {
        const canvas = this.renderer.domElement;
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        link.download = `realestate3d-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        this.showSuccess('📸 Скриншот высокого качества сохранен!');
    }

    toggleSettings() {
        const settings = document.getElementById('viewer-settings');
        if (settings.style.display === 'none') {
            settings.style.display = 'block';
            this.setupSettingsListeners();
        } else {
            settings.style.display = 'none';
        }
    }

    setupSettingsListeners() {
        // Настройка освещения
        const lightingSlider = document.getElementById('lighting-intensity');
        if (lightingSlider && !lightingSlider.hasListener) {
            lightingSlider.addEventListener('input', (e) => {
                const intensity = parseFloat(e.target.value);
                this.scene.children.forEach(child => {
                    if (child.type === 'DirectionalLight') {
                        child.intensity = intensity;
                    }
                });
            });
            lightingSlider.hasListener = true;
        }

        // Настройка фона
        const backgroundSelect = document.getElementById('background-type');
        if (backgroundSelect && !backgroundSelect.hasListener) {
            backgroundSelect.addEventListener('change', (e) => {
                this.changeBackground(e.target.value);
            });
            backgroundSelect.hasListener = true;
        }

        // Показ/скрытие сетки
        const gridCheckbox = document.getElementById('show-grid');
        if (gridCheckbox && !gridCheckbox.hasListener) {
            gridCheckbox.addEventListener('change', (e) => {
                this.toggleGrid(e.target.checked);
            });
            gridCheckbox.hasListener = true;
        }
    }

    changeBackground(type) {
        switch (type) {
            case 'gradient':
                this.scene.background = new THREE.Color(0xf0f0f0);
                break;
            case 'sky':
                this.scene.background = new THREE.Color(0x87CEEB);
                break;
            case 'dark':
                this.scene.background = new THREE.Color(0x1a1a1a);
                break;
        }
        this.showInfo(`Фон изменен на: ${type}`);
    }

    toggleGrid(show) {
        const grid = this.scene.getObjectByName('gridHelper');
        if (grid) {
            grid.visible = show;
            this.showInfo(`Сетка: ${show ? 'показана' : 'скрыта'}`);
        }
    }

    // Обработка изменения размера
    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.handleResize());
        
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            setTimeout(() => this.handleResize(), 100);
        });
    }

    // Уведомления
    showLoading(show) {
        const loader = document.getElementById('model-loader');
        if (loader) {
            loader.style.display = show ? 'flex' : 'none';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Очистка ресурсов
    addParticleSystem() {
        const particleCount = 100;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100; // x
            positions[i + 1] = Math.random() * 50; // y  
            positions[i + 2] = (Math.random() - 0.5) * 100; // z
            
            velocities[i] = (Math.random() - 0.5) * 0.02; // vx
            velocities[i + 1] = -Math.random() * 0.05; // vy (падение вниз)
            velocities[i + 2] = (Math.random() - 0.5) * 0.02; // vz
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.7,
            alphaTest: 0.5
        });

        this.particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    updateParticles() {
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            const velocities = this.particleSystem.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i]; // x
                positions[i + 1] += velocities[i + 1]; // y
                positions[i + 2] += velocities[i + 2]; // z

                // Сброс частиц при достижении земли
                if (positions[i + 1] < -5) {
                    positions[i] = (Math.random() - 0.5) * 100;
                    positions[i + 1] = 50;
                    positions[i + 2] = (Math.random() - 0.5) * 100;
                }
            }

            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }
    }

    dispose() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        if (this.controls) {
            this.controls.dispose();
        }
        if (this.particleSystem) {
            this.scene.remove(this.particleSystem);
        }
    }

    // Настройка режимов просмотра
    setupViewModes() {
        const viewModeButtons = document.querySelectorAll('.view-mode-btn');
        viewModeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setViewMode(mode);
            });
        });
    }

    setViewMode(mode) {
        // Убираем активный класс со всех кнопок
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Добавляем активный класс к выбранной кнопке
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

        this.currentViewMode = mode;

        switch (mode) {
            case 'normal':
                this.setNormalMode();
                break;
            case 'cinematic':
                this.setCinematicMode();
                break;
            case 'blueprint':
                this.setBlueprintMode();
                break;
            case 'vr':
                this.setVRMode();
                break;
        }
    }

    setNormalMode() {
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
    }

    setCinematicMode() {
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 30, 150);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.02;
        
        // Добавляем кинематографическое освещение
        const spotLight = new THREE.SpotLight(0xffffff, 2);
        spotLight.position.set(10, 20, 10);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    setBlueprintMode() {
        this.scene.background = new THREE.Color(0x1e1e1e);
        this.scene.fog = null;
        
        // Делаем все материалы в стиле чертежа
        this.scene.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    color: 0x00ff00,
                    wireframe: true
                });
            }
        });
    }

    setVRMode() {
        this.scene.background = new THREE.Color(0x000011);
        // Подготовка к VR режиму
        if (this.renderer.xr) {
            this.renderer.xr.enabled = true;
        }
    }

    // Настройка системы измерений
    setupMeasurements() {
        const measureCheckbox = document.getElementById('show-measurements');
        if (measureCheckbox) {
            measureCheckbox.addEventListener('change', (e) => {
                this.toggleMeasurements(e.target.checked);
            });
        }

        // Обработчик кликов для измерений
        this.container.addEventListener('click', (event) => {
            if (this.measurementMode) {
                this.addMeasurementPoint(event);
            }
        });
    }

    toggleMeasurements(enabled) {
        this.measurementMode = enabled;
        const measurementTools = document.getElementById('measurement-tools');
        
        if (enabled) {
            measurementTools.style.display = 'block';
            this.container.style.cursor = 'crosshair';
        } else {
            measurementTools.style.display = 'none';
            this.container.style.cursor = 'default';
            this.clearMeasurementPoints();
        }
    }

    addMeasurementPoint(event) {
        const rect = this.container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - rect.left) / rect.width) * 2 - 1,
            -((event.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        
        if (intersects.length > 0) {
            const point = intersects[0].point;
            this.measurementPoints.push(point);
            
            // Создаем визуальную точку
            const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
            const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
            pointMesh.position.copy(point);
            pointMesh.name = 'measurementPoint';
            this.scene.add(pointMesh);
            
            this.updateMeasurements();
        }
    }

    updateMeasurements() {
        if (this.measurementPoints.length >= 2) {
            const lastTwo = this.measurementPoints.slice(-2);
            const distance = lastTwo[0].distanceTo(lastTwo[1]);
            
            document.getElementById('length-measure').textContent = `${distance.toFixed(2)} м`;
            
            if (this.measurementPoints.length >= 3) {
                // Вычисляем площадь для треугольника
                const p1 = this.measurementPoints[0];
                const p2 = this.measurementPoints[1];
                const p3 = this.measurementPoints[2];
                
                const area = this.calculateTriangleArea(p1, p2, p3);
                document.getElementById('area-measure').textContent = `${area.toFixed(2)} м²`;
            }
        }
    }

    calculateTriangleArea(p1, p2, p3) {
        const v1 = new THREE.Vector3().subVectors(p2, p1);
        const v2 = new THREE.Vector3().subVectors(p3, p1);
        const cross = new THREE.Vector3().crossVectors(v1, v2);
        return cross.length() / 2;
    }

    clearMeasurementPoints() {
        this.measurementPoints = [];
        
        // Удаляем визуальные точки
        const pointsToRemove = [];
        this.scene.traverse((child) => {
            if (child.name === 'measurementPoint') {
                pointsToRemove.push(child);
            }
        });
        
        pointsToRemove.forEach(point => this.scene.remove(point));
        
        // Очищаем отображение измерений
        document.getElementById('length-measure').textContent = '--';
        document.getElementById('width-measure').textContent = '--';
        document.getElementById('height-measure').textContent = '--';
        document.getElementById('area-measure').textContent = '--';
    }

    // Настройка системы туров
    setupTourSystem() {
        const tourCheckbox = document.getElementById('show-tour-points');
        if (tourCheckbox) {
            tourCheckbox.addEventListener('change', (e) => {
                this.toggleTourPoints(e.target.checked);
            });
        }

        // Создаем точки тура по умолчанию
        this.createDefaultTourPoints();
    }

    createDefaultTourPoints() {
        this.tourPoints = [
            {
                position: new THREE.Vector3(0, 5, 10),
                target: new THREE.Vector3(0, 0, 0),
                title: "Общий вид",
                description: "Обзор всего дома"
            },
            {
                position: new THREE.Vector3(-8, 3, 0),
                target: new THREE.Vector3(0, 1, 0),
                title: "Вход в дом",
                description: "Главный вход и фасад"
            },
            {
                position: new THREE.Vector3(8, 3, 0),
                target: new THREE.Vector3(0, 1, 0),
                title: "Боковой вид",
                description: "Вид сбоку на дом"
            },
            {
                position: new THREE.Vector3(0, 15, 0),
                target: new THREE.Vector3(0, 0, 0),
                title: "Вид сверху",
                description: "Вид на крышу и планировку"
            }
        ];
    }

    toggleTourPoints(enabled) {
        const tourContainer = document.getElementById('tour-points');
        
        if (enabled) {
            this.createTourPointsUI();
            tourContainer.style.display = 'block';
        } else {
            tourContainer.style.display = 'none';
            tourContainer.innerHTML = '';
        }
    }

    createTourPointsUI() {
        const tourContainer = document.getElementById('tour-points');
        tourContainer.innerHTML = '';

        this.tourPoints.forEach((point, index) => {
            const pointElement = document.createElement('div');
            pointElement.className = 'tour-point';
            pointElement.innerHTML = `
                <div class="tour-point-number">${index + 1}</div>
                <div class="tour-point-content">
                    <div class="tour-point-title">${point.title}</div>
                    <div class="tour-point-desc">${point.description}</div>
                </div>
            `;
            
            pointElement.addEventListener('click', () => {
                this.goToTourPoint(index);
            });
            
            tourContainer.appendChild(pointElement);
        });

        // Добавляем кнопки навигации
        const navElement = document.createElement('div');
        navElement.className = 'tour-navigation';
        navElement.innerHTML = `
            <button class="tour-nav-btn" onclick="viewer3D.previousTourPoint()">← Пред</button>
            <button class="tour-nav-btn" onclick="viewer3D.nextTourPoint()">След →</button>
            <button class="tour-nav-btn" onclick="viewer3D.autoTour()">🎬 Авто-тур</button>
        `;
        
        tourContainer.appendChild(navElement);
    }

    goToTourPoint(index) {
        if (index >= 0 && index < this.tourPoints.length) {
            const point = this.tourPoints[index];
            this.currentTourPoint = index;
            
            // Анимируем камеру к точке
            this.animateCamera(point.position, point.target);
            
            // Подсвечиваем активную точку
            document.querySelectorAll('.tour-point').forEach((el, i) => {
                el.classList.toggle('active', i === index);
            });
        }
    }

    nextTourPoint() {
        const nextIndex = (this.currentTourPoint + 1) % this.tourPoints.length;
        this.goToTourPoint(nextIndex);
    }

    previousTourPoint() {
        const prevIndex = this.currentTourPoint <= 0 
            ? this.tourPoints.length - 1 
            : this.currentTourPoint - 1;
        this.goToTourPoint(prevIndex);
    }

    autoTour() {
        let currentIndex = 0;
        
        const tourInterval = setInterval(() => {
            this.goToTourPoint(currentIndex);
            currentIndex++;
            
            if (currentIndex >= this.tourPoints.length) {
                clearInterval(tourInterval);
                // Возвращаемся к первой точке
                setTimeout(() => {
                    this.goToTourPoint(0);
                }, 3000);
            }
        }, 4000);
    }

    animateCamera(targetPosition, targetLookAt, duration = 2000) {
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Используем easing функцию для плавности
            const eased = this.easeInOutCubic(progress);
            
            // Интерполяция позиции камеры
            this.camera.position.lerpVectors(startPosition, targetPosition, eased);
            
            // Интерполяция цели
            this.controls.target.lerpVectors(startTarget, targetLookAt, eased);
            this.controls.update();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Глобальные функции для использования в HTML
let viewer3D = null;

function load3DModel(modelUrl) {
    if (!viewer3D) {
        viewer3D = new RealEstate3DViewer('model3d');
    }
    viewer3D.loadModel(modelUrl);
}

function resetCamera() {
    if (viewer3D) {
        viewer3D.resetCamera();
    }
}

function toggleFullscreen() {
    if (viewer3D) {
        viewer3D.toggleFullscreen();
    }
}

function takeScreenshot() {
    if (viewer3D) {
        viewer3D.takeScreenshot();
    }
}

function toggleAutoRotate() {
    if (viewer3D) {
        viewer3D.toggleAutoRotate();
    }
}

function toggleSettings() {
    if (viewer3D) {
        viewer3D.toggleSettings();
    }
}

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const model3DContainer = document.getElementById('model3d');
    if (model3DContainer) {
        viewer3D = new RealEstate3DViewer('model3d');
        
        // Если есть URL модели в data-атрибуте, загружаем её
        const modelUrl = model3DContainer.dataset.modelUrl;
        if (modelUrl && modelUrl !== '/models/generated_undefined.glb' && modelUrl !== '' && modelUrl !== 'undefined') {
            viewer3D.loadModel(modelUrl);
        } else {
            // Загружаем демо-дом
            viewer3D.createDemoHouse();
        }
    }
});