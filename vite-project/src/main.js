import { GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client';
import { ConfigManager } from './config.js';
import { safeInnerHTML, applyTheme, createSidebar, createTriggerButton } from './ui.js';
import { addStyles } from './styles.js';
import { LANGUAGES } from './languages.js';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

(function() {
    'use strict';

    // 初始化
    const init = () => {
        console.log('[TM Debug] 开始初始化');
        addStyles();
        console.log('[TM Debug] 样式已添加');
        
        const triggerBtn = createTriggerButton();
        console.log('[TM Debug] 触发按钮已创建:', triggerBtn);
        
        const sidebar = createSidebar();
        console.log('[TM Debug] 侧边栏已创建:', sidebar);
        
        // 将元素添加到页面
        document.body.appendChild(triggerBtn);
        console.log('[TM Debug] 触发按钮已添加到DOM');
        
        document.body.appendChild(sidebar);
        console.log('[TM Debug] 侧边栏已添加到DOM');

        // 恢复侧边栏状态和样式
        if (ConfigManager.getSidebarOpen()) {
            sidebar.classList.add('tm-open');
        }
        const savedStyle = ConfigManager.getSidebarStyle();
        if (savedStyle) {
            if (savedStyle.width) sidebar.style.width = savedStyle.width;
            if (savedStyle.height) sidebar.style.height = savedStyle.height;
            if (savedStyle.left) sidebar.style.left = savedStyle.left;
            if (savedStyle.top) sidebar.style.top = savedStyle.top;
        }

        // 拖拽 Trigger Button Logic
        let isDraggingTrigger = false;
        let triggerHasMoved = false;
        let triggerStartX, triggerStartY;
        let triggerInitialLeft, triggerInitialTop;

        triggerBtn.addEventListener('mousedown', (e) => {
            isDraggingTrigger = true;
            triggerHasMoved = false;
            triggerStartX = e.clientX;
            triggerStartY = e.clientY;
            
            const rect = triggerBtn.getBoundingClientRect();
            triggerInitialLeft = rect.left;
            triggerInitialTop = rect.top;
            
            // Switch to left/top positioning to allow dragging
            triggerBtn.style.right = 'auto';
            triggerBtn.style.bottom = 'auto';
            triggerBtn.style.left = triggerInitialLeft + 'px';
            triggerBtn.style.top = triggerInitialTop + 'px';
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingTrigger) return;
            
            const deltaX = e.clientX - triggerStartX;
            const deltaY = e.clientY - triggerStartY;
            
            if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
                triggerHasMoved = true;
            }
            
            triggerBtn.style.left = (triggerInitialLeft + deltaX) + 'px';
            triggerBtn.style.top = (triggerInitialTop + deltaY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingTrigger) {
                isDraggingTrigger = false;
                if (triggerHasMoved) {
                    ConfigManager.saveTriggerPosition({
                        left: triggerBtn.style.left,
                        top: triggerBtn.style.top
                    });
                }
            }
        });

        // 切换侧边栏
        triggerBtn.addEventListener('click', (e) => {
            console.log('[TM Debug] 触发按钮被点击');
            if (triggerHasMoved) {
                console.log('[TM Debug] 按钮被拖动过，忽略点击');
                e.preventDefault();
                e.stopPropagation();
                triggerHasMoved = false;
                return;
            }
            console.log('[TM Debug] 切换侧边栏状态');
            sidebar.classList.toggle('tm-open');
            const isOpen = sidebar.classList.contains('tm-open');
            console.log('[TM Debug] 侧边栏现在是:', isOpen ? '打开' : '关闭');
            ConfigManager.saveSidebarOpen(isOpen);
        });

        sidebar.querySelector('.tm-close-btn').addEventListener('click', () => {
            sidebar.classList.remove('tm-open');
            ConfigManager.saveSidebarOpen(false);
        });

        // 主题切换
        const themeBtn = sidebar.querySelector('.tm-theme-btn');
        const themeDropdown = sidebar.querySelector('.tm-theme-dropdown');
        
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('tm-show');
        });
        
        themeDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-theme-item');
            if (!item) return;
            
            const themeName = item.dataset.theme;
            applyTheme(themeName);
            themeDropdown.classList.remove('tm-show');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tm-header-controls')) {
                themeDropdown.classList.remove('tm-show');
            }
        });

        // 初始化主题
        applyTheme(ConfigManager.getTheme());

        // 拖拽调整大小
        let isResizing = false;
        let resizeType = '';
        let startX = 0;
        let startY = 0;
        let startWidth = 0;
        let startHeight = 0;
        let startLeft = 0;
        let startTop = 0;

        const startResize = (e, type) => {
            isResizing = true;
            resizeType = type;
            startX = e.clientX;
            startY = e.clientY;
            const rect = sidebar.getBoundingClientRect();
            startWidth = rect.width;
            startHeight = rect.height;
            startLeft = rect.left;
            startTop = rect.top;
            sidebar.classList.add('tm-resizing');
            e.preventDefault();
            e.stopPropagation();
        };

        sidebar.querySelector('.tm-resize-handle-left').addEventListener('mousedown', (e) => startResize(e, 'left'));
        sidebar.querySelector('.tm-resize-handle-right').addEventListener('mousedown', (e) => startResize(e, 'right'));
        sidebar.querySelector('.tm-resize-handle-top').addEventListener('mousedown', (e) => startResize(e, 'top'));
        sidebar.querySelector('.tm-resize-handle-bottom').addEventListener('mousedown', (e) => startResize(e, 'bottom'));
        sidebar.querySelector('.tm-resize-handle-corner-tl').addEventListener('mousedown', (e) => startResize(e, 'top-left'));
        sidebar.querySelector('.tm-resize-handle-corner-tr').addEventListener('mousedown', (e) => startResize(e, 'top-right'));
        sidebar.querySelector('.tm-resize-handle-corner-bl').addEventListener('mousedown', (e) => startResize(e, 'bottom-left'));
        sidebar.querySelector('.tm-resize-handle-corner-br').addEventListener('mousedown', (e) => startResize(e, 'bottom-right'));

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (resizeType.includes('left')) {
                const newWidth = startWidth - deltaX;
                if (newWidth >= 200) {
                    sidebar.style.width = newWidth + 'px';
                }
            }
            if (resizeType.includes('right')) {
                const newWidth = startWidth + deltaX;
                if (newWidth >= 200) {
                    sidebar.style.width = newWidth + 'px';
                }
            }
            if (resizeType.includes('top')) {
                const newHeight = startHeight - deltaY;
                if (newHeight >= 200) {
                    sidebar.style.height = newHeight + 'px';
                    sidebar.style.top = (startTop + deltaY) + 'px';
                }
            }
            if (resizeType.includes('bottom')) {
                const newHeight = startHeight + deltaY;
                if (newHeight >= 200) {
                    sidebar.style.height = newHeight + 'px';
                }
            }
        });


        // 拖拽移动窗口
        const header = sidebar.querySelector('.tm-sidebar-header');
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let sidebarLeft = 0;
        let sidebarTop = 0;

        header.addEventListener('mousedown', (e) => {
            // 如果点击的是按钮，不触发拖动
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = sidebar.getBoundingClientRect();
            sidebarLeft = rect.left;
            sidebarTop = rect.top;
            sidebar.classList.add('tm-dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            const newLeft = sidebarLeft + deltaX;
            const newTop = sidebarTop + deltaY;
            sidebar.style.left = newLeft + 'px';
            sidebar.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizeType = '';
                sidebar.classList.remove('tm-resizing');
                
                // 保存调整后的大小和位置
                ConfigManager.saveSidebarStyle({
                    width: sidebar.style.width,
                    height: sidebar.style.height,
                    left: sidebar.style.left,
                    top: sidebar.style.top
                });
            }
            if (isDragging) {
                isDragging = false;
                sidebar.classList.remove('tm-dragging');
                
                // 保存拖动后的位置
                ConfigManager.saveSidebarStyle({
                    width: sidebar.style.width,
                    height: sidebar.style.height,
                    left: sidebar.style.left,
                    top: sidebar.style.top
                });
            }
        });

        // 选项卡切换
        sidebar.querySelectorAll('.tm-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                sidebar.querySelectorAll('.tm-tab').forEach(t => t.classList.remove('tm-active'));
                sidebar.querySelectorAll('.tm-tab-content').forEach(c => c.classList.remove('tm-active'));
                tab.classList.add('tm-active');
                sidebar.querySelector(`#tm-${tabName}-tab`).classList.add('tm-active');
            });
        });

        // 提示词帮助弹窗逻辑
        const helpIcon = sidebar.querySelector('#tm-translate-prompt-help');
        const helpModal = sidebar.querySelector('#tm-prompt-help-modal');
        const closeModalBtn = helpModal.querySelector('.tm-modal-close-btn');

        helpIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            helpModal.style.display = 'block';
        });

        closeModalBtn.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.style.display = 'none';
            }
        });

        // AI提供商管理
        let currentProviderIndex = null;

        const renderProvidersSidebar = () => {
            const providers = ConfigManager.getProviders();
            const list = sidebar.querySelector('#tm-providers-sidebar-list');
            list.textContent = '';

            providers.forEach((provider, index) => {
                const item = document.createElement('div');
                item.className = 'tm-provider-sidebar-item';
                if (index === currentProviderIndex) {
                    item.classList.add('tm-active');
                }
                safeInnerHTML(item, `
                    <span class="tm-provider-name">${provider.name || '未命名供应商'}</span>
                    <span class="tm-delete-icon" data-index="${index}">×</span>
                `);
                item.dataset.index = index;
                list.appendChild(item);
            });

            updateModelSelect();
        };

        const normalizeApiUrl = (url) => {
            if (!url) return '';
            url = url.trim();

            // 如果已经包含 /chat/completions，直接返回
            if (url.includes('/chat/completions')) {
                return url;
            }

            // 移除末尾的斜杠
            url = url.replace(/\/+$/, '');

            // 如果包含版本号（v1, v2, v3等），在其后添加 /chat/completions
            if (/\/v\d+$/i.test(url)) {
                return url + '/chat/completions';
            }

            // 默认添加 /v1/chat/completions
            return url + '/v1/chat/completions';
        };

        const getModelsUrl = (url) => {
            if (!url) return '';
            url = url.trim();

            // 如果已经包含 /models，直接返回
            if (url.includes('/models')) {
                return url;
            }

            // 移除末尾的斜杠
            url = url.replace(/\/+$/, '');

            // 如果包含版本号（v1, v2, v3等），在其后添加 /models
            if (/\/v\d+$/i.test(url)) {
                return url + '/models';
            }

            // 默认添加 /v1/models
            return url + '/v1/models';
        };

        const updateFinalUrl = (index) => {
            const urlInput = sidebar.querySelector(`#provider-url-${index}`);
            const finalUrlDisplay = sidebar.querySelector(`#final-url-${index}`);
            if (urlInput && finalUrlDisplay) {
                const finalUrl = normalizeApiUrl(urlInput.value);
                safeInnerHTML(finalUrlDisplay, `<strong>最终调用地址：</strong>${finalUrl || '请输入API URL'}`);
            }
        };

        const renderProviderDetail = (index) => {
            const providers = ConfigManager.getProviders();
            const provider = providers[index];
            const detail = sidebar.querySelector('#tm-provider-detail');
            const models = ConfigManager.getModels(index);

            safeInnerHTML(detail, `
                <div class="tm-provider-form">
                    <h3>供应商信息</h3>
                    <div class="tm-form-group">
                        <label>供应商名称</label>
                        <input type="text" value="${provider.name || ''}" id="provider-name-${index}">
                    </div>
                    <div class="tm-form-group">
                        <label>API URL</label>
                        <input type="text" value="${provider.url || ''}" id="provider-url-${index}" placeholder="例如: https://api.openai.com">
                    </div>
                    <div class="tm-final-url-display" id="final-url-${index}"></div>
                    <div class="tm-form-group tm-password-group">
                        <label>API Key</label>
                        <input type="password" value="${provider.key || ''}" id="provider-key-${index}">
                        <span class="tm-toggle-password" data-target="provider-key-${index}">👁️</span>
                    </div>
                    <div class="tm-form-actions">
                        <button class="tm-save-provider-btn" data-index="${index}">保存</button>
                    </div>

                    <div class="tm-models-section">
                        <h3>
                            已添加模型
                            <button class="tm-fetch-models-btn" data-index="${index}">获取模型列表</button>
                            <button class="tm-refresh-models-btn" data-index="${index}" style="display:none;">刷新</button>
                        </h3>
                        <div class="tm-models-list" id="models-list-${index}"></div>
                        <button class="tm-add-model-btn" data-index="${index}">+ 手动添加模型</button>

                        <div class="tm-available-models-section" id="available-models-${index}" style="display:none;">
                            <h4>可用模型列表</h4>
                            <input type="text" class="tm-model-search" placeholder="搜索模型..." id="model-search-${index}">
                            <div class="tm-available-models-list" id="available-models-list-${index}"></div>
                        </div>
                    </div>
                </div>
            `);

            const modelsList = detail.querySelector(`#models-list-${index}`);
            models.forEach((model, modelIndex) => {
                const item = document.createElement('div');
                item.className = 'tm-model-item';
                safeInnerHTML(item, `
                    <input type="text" value="${model}" data-model="${modelIndex}">
                    <button class="tm-save-model-btn" data-provider="${index}" data-model="${modelIndex}">保存</button>
                    <button class="tm-delete-model-btn" data-provider="${index}" data-model="${modelIndex}">删除</button>
                `);
                modelsList.appendChild(item);
            });

            // 初始化显示最终URL
            updateFinalUrl(index);

            // 监听URL输入框变化
            const urlInput = sidebar.querySelector(`#provider-url-${index}`);
            if (urlInput) {
                urlInput.addEventListener('input', () => updateFinalUrl(index));
            }

            // 监听模型搜索
            const searchInput = detail.querySelector(`#model-search-${index}`);
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    filterAvailableModels(index, e.target.value);
                });
            }

            // 加载已保存的可用模型列表
            loadAvailableModels(index);
        };

        const loadAvailableModels = (index) => {
            const availableModels = ConfigManager.getAvailableModels(index);
            if (availableModels.length > 0) {
                const availableSection = document.querySelector(`#available-models-${index}`);
                const fetchBtn = document.querySelector(`.tm-fetch-models-btn[data-index="${index}"]`);
                const refreshBtn = document.querySelector(`.tm-refresh-models-btn[data-index="${index}"]`);

                if (availableSection) availableSection.style.display = 'block';
                if (fetchBtn) fetchBtn.style.display = 'none';
                if (refreshBtn) refreshBtn.style.display = 'inline-block';

                renderAvailableModels(index, availableModels);
            }
        };

        const fetchAvailableModels = async (index) => {
            const providers = ConfigManager.getProviders();
            const provider = providers[index];

            if (!provider.url || !provider.key) {
                alert('请先配置API URL和API Key');
                return;
            }

            const availableSection = sidebar.querySelector(`#available-models-${index}`);
            const availableList = sidebar.querySelector(`#available-models-list-${index}`);
            const fetchBtn = sidebar.querySelector(`.tm-fetch-models-btn[data-index="${index}"]`);
            const refreshBtn = sidebar.querySelector(`.tm-refresh-models-btn[data-index="${index}"]`);

            safeInnerHTML(availableList, '<div class="tm-loading-models">正在获取模型列表...</div>');
            availableSection.style.display = 'block';

            const modelsUrl = getModelsUrl(provider.url);

            GM_xmlhttpRequest({
                method: 'GET',
                url: modelsUrl,
                headers: {
                    'Authorization': `Bearer ${provider.key}`
                },
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        const models = data.data || data.models || [];
                        const modelNames = models.map(m => m.id || m.name || m).filter(Boolean);

                        ConfigManager.saveAvailableModels(index, modelNames);
                        renderAvailableModels(index, modelNames);

                        fetchBtn.style.display = 'none';
                        refreshBtn.style.display = 'inline-block';
                    } catch (e) {
                        safeInnerHTML(availableList, '<div class="tm-loading-models">获取失败: ' + e.message + '</div>');
                    }
                },
                onerror: () => {
                    safeInnerHTML(availableList, '<div class="tm-loading-models">请求失败，请检查URL和API Key</div>');
                }
            });
        };

        const renderAvailableModels = (index, models) => {
            const availableList = sidebar.querySelector(`#available-models-list-${index}`);
            const existingModels = ConfigManager.getModels(index);

            availableList.textContent = '';
            models.forEach(modelName => {
                const item = document.createElement('div');
                item.className = 'tm-available-model-item';
                item.dataset.modelName = modelName;
                safeInnerHTML(item, `
                    <span class="tm-model-name">${modelName}</span>
                    <span class="tm-add-model-icon" data-provider="${index}" data-model-name="${modelName}">+</span>
                `);
                availableList.appendChild(item);
            });
        };

        const filterAvailableModels = (index, keyword) => {
            const models = ConfigManager.getAvailableModels(index);
            const filtered = keyword ? models.filter(m => m.toLowerCase().includes(keyword.toLowerCase())) : models;
            renderAvailableModels(index, filtered);
        };

        const updateModelSelect = () => {
            // 保持兼容性，但不再使用
        };

        sidebar.querySelector('#tm-add-provider-btn').addEventListener('click', () => {
            const providers = ConfigManager.getProviders();
            providers.push({name: '新供应商', url: '', key: ''});
            ConfigManager.saveProviders(providers);
            currentProviderIndex = providers.length - 1;
            renderProvidersSidebar();
            renderProviderDetail(currentProviderIndex);
        });

        sidebar.querySelector('#tm-providers-sidebar-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('tm-delete-icon')) {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                if (!confirm('确定删除此供应商吗？')) return;

                const providers = ConfigManager.getProviders();
                providers.splice(index, 1);
                ConfigManager.saveProviders(providers);

                if (currentProviderIndex === index) {
                    currentProviderIndex = null;
                    safeInnerHTML(sidebar.querySelector('#tm-provider-detail'), '<div class="tm-empty-state">请选择或添加一个供应商</div>');
                } else if (currentProviderIndex > index) {
                    currentProviderIndex--;
                }
                renderProvidersSidebar();
                updateModelSelect();
                return;
            }

            const item = e.target.closest('.tm-provider-sidebar-item');
            if (!item) return;

            currentProviderIndex = parseInt(item.dataset.index);
            renderProvidersSidebar();
            renderProviderDetail(currentProviderIndex);
        });

        sidebar.querySelector('#tm-provider-detail').addEventListener('click', (e) => {
            if (e.target.classList.contains('tm-toggle-password')) {
                const targetId = e.target.dataset.target;
                const input = sidebar.querySelector(`#${targetId}`);
                if (input.type === 'password') {
                    input.type = 'text';
                    e.target.textContent = '🙈';
                } else {
                    input.type = 'password';
                    e.target.textContent = '👁️';
                }
            } else if (e.target.classList.contains('tm-save-provider-btn')) {
                const index = parseInt(e.target.dataset.index);
                const providers = ConfigManager.getProviders();

                providers[index] = {
                    name: sidebar.querySelector(`#provider-name-${index}`).value,
                    url: sidebar.querySelector(`#provider-url-${index}`).value,
                    key: sidebar.querySelector(`#provider-key-${index}`).value
                };

                ConfigManager.saveProviders(providers);
                renderProvidersSidebar();
                updateModelSelect();
                alert('保存成功');
            } else if (e.target.classList.contains('tm-fetch-models-btn')) {
                const providerIndex = parseInt(e.target.dataset.index);
                fetchAvailableModels(providerIndex);
            } else if (e.target.classList.contains('tm-refresh-models-btn')) {
                const providerIndex = parseInt(e.target.dataset.index);
                fetchAvailableModels(providerIndex);
            } else if (e.target.classList.contains('tm-add-model-icon')) {
                const providerIndex = parseInt(e.target.dataset.provider);
                const modelName = e.target.dataset.modelName;
                const models = ConfigManager.getModels(providerIndex);

                if (!models.includes(modelName)) {
                    models.push(modelName);
                    ConfigManager.saveModels(providerIndex, models);
                    renderProviderDetail(providerIndex);
                    updateModelSelect();

                    // 恢复可用模型列表显示
                    const availableSection = sidebar.querySelector(`#available-models-${providerIndex}`);
                    if (availableSection) {
                        availableSection.style.display = 'block';
                        const searchInput = sidebar.querySelector(`#model-search-${providerIndex}`);
                        if (searchInput) {
                            filterAvailableModels(providerIndex, searchInput.value);
                        }
                    }
                } else {
                    alert('该模型已存在');
                }
            } else if (e.target.classList.contains('tm-add-model-btn')) {
                const providerIndex = parseInt(e.target.dataset.index);
                const models = ConfigManager.getModels(providerIndex);
                models.push('');
                ConfigManager.saveModels(providerIndex, models);
                renderProviderDetail(providerIndex);
            } else if (e.target.classList.contains('tm-save-model-btn')) {
                const providerIndex = parseInt(e.target.dataset.provider);
                const modelIndex = parseInt(e.target.dataset.model);
                const input = e.target.closest('.tm-model-item').querySelector('input');
                const models = ConfigManager.getModels(providerIndex);
                models[modelIndex] = input.value.trim();
                ConfigManager.saveModels(providerIndex, models);
                updateModelSelect();
                alert('模型保存成功');
            } else if (e.target.classList.contains('tm-delete-model-btn')) {
                const providerIndex = parseInt(e.target.dataset.provider);
                const modelIndex = parseInt(e.target.dataset.model);
                if (!confirm('确定删除此模型吗？')) return;

                const models = ConfigManager.getModels(providerIndex);
                models.splice(modelIndex, 1);
                ConfigManager.saveModels(providerIndex, models);
                renderProviderDetail(providerIndex);
                updateModelSelect();
            }
        });

        renderProvidersSidebar();

        // 模型选择下拉菜单
        const modelDisplayBtn = sidebar.querySelector('#tm-model-display-btn');
        const modelDropdown = sidebar.querySelector('#tm-model-dropdown');
        const modelNameSpan = sidebar.querySelector('#tm-model-name');
        let currentSelectedModel = null;
        let currentSystemPrompt = '';
        let currentTranslatePromptIndex = "";
        const promptSelectorBtn = sidebar.querySelector('#tm-prompt-selector-btn');
        let isQaMode = false;

        const applySystemDefaults = () => {
            const systemConfig = ConfigManager.getSystemConfig();
            if (systemConfig.defaultModel) {
                currentSelectedModel = systemConfig.defaultModel;
                const config = JSON.parse(currentSelectedModel);
                const providers = ConfigManager.getProviders();
                const provider = providers[config.provider];
                if (provider) {
                    modelNameSpan.textContent = `${provider.name} - ${config.model}`;
                }
            }
            if (systemConfig.defaultPrompt !== null && systemConfig.defaultPrompt !== "") {
                const prompts = ConfigManager.getPrompts();
                const prompt = prompts[systemConfig.defaultPrompt];
                if (prompt) {
                    currentSystemPrompt = prompt.content;
                    promptSelectorBtn.classList.add('tm-selected');
                    promptSelectorBtn.title = `已选择: ${prompt.title}`;
                }
            } else {
                 currentSystemPrompt = '';
                 promptSelectorBtn.classList.remove('tm-selected');
                 promptSelectorBtn.title = '选择提示词';
            }
            if (systemConfig.defaultTranslatePrompt !== null && systemConfig.defaultTranslatePrompt !== "") {
                const prompts = ConfigManager.getPrompts();
                const prompt = prompts[systemConfig.defaultTranslatePrompt];
                // 确保提示词存在且类型正确
                if (prompt && prompt.type === 'translate') {
                    // 设置当前翻译提示词的索引，后续渲染时会使用此值
                    currentTranslatePromptIndex = systemConfig.defaultTranslatePrompt.toString();
                }
            }
        };

        const renderModelDropdown = () => {
            const providers = ConfigManager.getProviders();
            modelDropdown.textContent = '';

            providers.forEach((provider, providerIndex) => {
                const models = ConfigManager.getModels(providerIndex);
                models.forEach(model => {
                    const item = document.createElement('div');
                    item.className = 'tm-model-dropdown-item';
                    const modelValue = JSON.stringify({provider: providerIndex, model: model});
                    if (currentSelectedModel === modelValue) {
                        item.classList.add('tm-selected');
                    }
                    item.textContent = `${provider.name} - ${model}`;
                    item.dataset.value = modelValue;
                    modelDropdown.appendChild(item);
                });
            });
        };

        modelDisplayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = modelDropdown.style.display === 'block';
            modelDropdown.style.display = isOpen ? 'none' : 'block';
            modelDisplayBtn.classList.toggle('tm-open', !isOpen);
            if (!isOpen) renderModelDropdown();
        });

        modelDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-model-dropdown-item');
            if (!item) return;

            currentSelectedModel = item.dataset.value;
            const config = JSON.parse(currentSelectedModel);
            const providers = ConfigManager.getProviders();
            const provider = providers[config.provider];
            modelNameSpan.textContent = `${provider.name} - ${config.model}`;
            modelDropdown.style.display = 'none';
            modelDisplayBtn.classList.remove('tm-open');
        });

        document.addEventListener('click', () => {
            modelDropdown.style.display = 'none';
            modelDisplayBtn.classList.remove('tm-open');
        });

        // 历史对话管理
        let currentConversationId = null;
        let conversationMessages = [];

        const renderConversations = () => {
            const conversations = ConfigManager.getConversations();
            const sidebar = document.querySelector('#tm-conversations-sidebar');

            // Always render the toolbar and list container to ensure they are present
            sidebar.innerHTML = `
                <div class="tm-conversations-toolbar">
                    <button class="tm-new-conv-btn">新建对话</button>
                    <button class="tm-batch-delete-conv-btn">批量删除</button>
                </div>
                <div class="tm-conversations-list"></div>
            `;

            // Add event listeners to the newly created buttons
            sidebar.querySelector('.tm-new-conv-btn').addEventListener('click', createNewConversation);

            sidebar.querySelector('.tm-batch-delete-conv-btn').addEventListener('click', () => {
                const checkboxes = sidebar.querySelectorAll('.tm-conv-checkbox:checked');
                if (checkboxes.length === 0) {
                    alert('请选择要删除的对话');
                    return;
                }
                if (!confirm(`确定删除选中的 ${checkboxes.length} 个对话吗？`)) return;

                const currentConversations = ConfigManager.getConversations();
                const idsToDelete = Array.from(checkboxes).map(cb => cb.dataset.id);
                const filtered = currentConversations.filter(c => !idsToDelete.includes(c.id));
                ConfigManager.saveConversations(filtered);

                if (idsToDelete.includes(currentConversationId)) {
                    const remainingConversations = ConfigManager.getConversations();
                    if (remainingConversations.length > 0) {
                        loadConversation(remainingConversations[0].id);
                    } else {
                        createNewConversation();
                    }
                } else {
                    renderConversations();
                }
            });

            // Populate the list
            const list = sidebar.querySelector('.tm-conversations-list');
            conversations.forEach((conv) => {
                const item = document.createElement('div');
                item.className = 'tm-conversation-item';
                if (conv.id === currentConversationId) {
                    item.classList.add('tm-active');
                }
                item.dataset.id = conv.id;

                safeInnerHTML(item, `
                    <input type="checkbox" class="tm-conv-checkbox" data-id="${conv.id}">
                    <span class="tm-conv-title">${conv.title}</span>
                    <input type="text" class="tm-conv-rename-input" value="${conv.title}">
                    <div class="tm-conv-actions">
                        <button class="tm-conv-action-btn tm-rename-conv-btn" title="重命名">✏️</button>
                        <button class="tm-conv-action-btn tm-delete-conv-btn" title="删除">🗑️</button>
                    </div>
                `);

                list.appendChild(item);
            });
        };

        const saveCurrentConversation = () => {
            if (!currentConversationId) return;

            const conversations = ConfigManager.getConversations();
            const index = conversations.findIndex(c => c.id === currentConversationId);
            
            if (index !== -1) {
                conversations[index].messages = conversationMessages;
                conversations[index].updatedAt = Date.now();
                ConfigManager.saveConversations(conversations);
            }
        };

        const loadConversation = (id) => {
            saveCurrentConversation();

            const conversations = ConfigManager.getConversations();
            const conv = conversations.find(c => c.id === id);
            
            if (!conv) return;

            currentConversationId = id;
            conversationMessages = conv.messages || [];

            const messagesContainer = document.querySelector('#tm-messages');
            messagesContainer.textContent = '';

            conversationMessages.forEach((msg, index) => {
                const msgDiv = document.createElement('div');
                msgDiv.className = `tm-message tm-${msg.role}`;
                msgDiv.dataset.index = index;
                
                if (msg.role === 'user') {
                    // 如果是总结类型，显示简洁文本
                    msgDiv.textContent = msg.isSummary ? msg.displayText : msg.content;
                } else {
                    safeInnerHTML(msgDiv, msg.html || msg.content, msg.content);
                }
                
                // 添加操作按钮
                const actions = document.createElement('div');
                actions.className = 'tm-message-actions';
                if (msg.role === 'ai') {
                    safeInnerHTML(actions, `
                        <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                        <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                        <button class="tm-message-action-btn tm-regenerate-msg-btn" title="重新生成">🔄</button>
                    `);
                } else {
                    safeInnerHTML(actions, `
                        <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                        <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                    `);
                }
                msgDiv.appendChild(actions);
                messagesContainer.appendChild(msgDiv);
            });

            renderConversations();
        };

        const createNewConversation = () => {
            saveCurrentConversation();

            const conversations = ConfigManager.getConversations();
            const newConv = {
                id: Date.now().toString(),
                title: '新对话',
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };

            conversations.unshift(newConv);
            ConfigManager.saveConversations(conversations);

            currentConversationId = newConv.id;
            conversationMessages = [];

            document.querySelector('#tm-messages').textContent = '';
            renderConversations();
            
            // 应用系统配置的默认设置
            applySystemDefaults();
        };

        document.querySelector('#tm-conversations-sidebar').addEventListener('click', (e) => {
            if (e.target.classList.contains('tm-conv-checkbox')) {
                e.stopPropagation();
                return;
            }

            if (e.target.classList.contains('tm-delete-conv-btn')) {
                e.stopPropagation();
                const item = e.target.closest('.tm-conversation-item');
                const id = item.dataset.id;
                
                if (!confirm('确定删除此对话吗？')) return;

                const conversations = ConfigManager.getConversations();
                const filtered = conversations.filter(c => c.id !== id);
                ConfigManager.saveConversations(filtered);

                if (id === currentConversationId) {
                    const remainingConversations = ConfigManager.getConversations();
                    if (remainingConversations.length > 0) {
                        loadConversation(remainingConversations[0].id);
                    } else {
                        createNewConversation();
                    }
                } else {
                    renderConversations();
                }
                return;
            }

            if (e.target.classList.contains('tm-rename-conv-btn')) {
                e.stopPropagation();
                const item = e.target.closest('.tm-conversation-item');
                const input = item.querySelector('.tm-conv-rename-input');
                
                item.classList.add('tm-editing');
                input.focus();
                input.select();
                return;
            }

            const item = e.target.closest('.tm-conversation-item');
            if (!item || item.classList.contains('tm-editing')) return;
            loadConversation(item.dataset.id);
        });

        document.querySelector('#tm-conversations-sidebar').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.classList.contains('tm-conv-rename-input')) {
                const item = e.target.closest('.tm-conversation-item');
                const id = item.dataset.id;
                const newTitle = e.target.value.trim();

                if (newTitle) {
                    const conversations = ConfigManager.getConversations();
                    const conv = conversations.find(c => c.id === id);
                    if (conv) {
                        conv.title = newTitle;
                        ConfigManager.saveConversations(conversations);
                    }
                }

                item.classList.remove('tm-editing');
                renderConversations();
            } else if (e.key === 'Escape' && e.target.classList.contains('tm-conv-rename-input')) {
                const item = e.target.closest('.tm-conversation-item');
                item.classList.remove('tm-editing');
            }
        });

        document.querySelector('#tm-conversations-sidebar').addEventListener('blur', (e) => {
            if (e.target.classList.contains('tm-conv-rename-input')) {
                const item = e.target.closest('.tm-conversation-item');
                setTimeout(() => {
                    if (item.classList.contains('tm-editing')) {
                        item.classList.remove('tm-editing');
                    }
                }, 200);
            }
        }, true);

        document.querySelector('#tm-new-chat-btn').addEventListener('click', createNewConversation);

        // 清除对话功能
        document.querySelector('#tm-clear-chat-btn').addEventListener('click', () => {
            if (confirm('确定要清除当前对话记录吗？')) {
                conversationMessages = [];
                document.querySelector('#tm-messages').textContent = '';
                saveCurrentConversation();
            }
        });

        // 总结网页功能
        document.querySelector('#tm-summarize-page-btn').addEventListener('click', async () => {
            if (!currentSelectedModel) {
                alert('请先选择模型');
                return;
            }

            const input = sidebar.querySelector('#tm-user-input');
            const messages = sidebar.querySelector('#tm-messages');

            // 提取页面内容
            const pageTitle = document.title;
            const pageUrl = window.location.href;
            
            // 获取页面主要文本内容
            let pageContent = '';
            
            // 尝试获取主要内容区域
            const mainContent = document.querySelector('main, article, .content, .main, #content, #main');
            if (mainContent) {
                pageContent = mainContent.innerText;
            } else {
                pageContent = document.body.innerText;
            }
            
            // 限制内容长度，避免超出token限制
            const maxLength = 8000;
            if (pageContent.length > maxLength) {
                pageContent = pageContent.substring(0, maxLength) + '...(内容过长已截断)';
            }

            // 构建实际发送给AI的完整提示词
            const actualPrompt = `请详细总结以下网页的内容。要求：
1. 准确概括网页的主题和核心内容
2. 列出关键信息点和重要细节
3. 保持逻辑清晰，结构分明
4. 不要遗漏重要信息
5. 如果是文章，请总结主要观点；如果是产品页面，请总结产品特点；如果是新闻，请总结事件要点

网页标题：${pageTitle}
网页地址：${pageUrl}

网页内容：
${pageContent}

请开始总结：`;

            // 显示给用户的简洁文本
            const displayText = `总结当前页面：${pageTitle}`;

            // 如果是新对话的第一条消息，自动命名
            if (conversationMessages.length === 0) {
                const conversations = ConfigManager.getConversations();
                const index = conversations.findIndex(c => c.id === currentConversationId);
                if (index !== -1) {
                    conversations[index].title = displayText.slice(0, 20);
                    ConfigManager.saveConversations(conversations);
                    renderConversations();
                }
            }

            // 显示用户消息（简洁版本）
            const userMsg = document.createElement('div');
            userMsg.className = 'tm-message tm-user';
            userMsg.dataset.index = conversationMessages.length;
            userMsg.textContent = displayText;
            
            const userActions = document.createElement('div');
            userActions.className = 'tm-message-actions';
            safeInnerHTML(userActions, `
                <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
            `);
            userMsg.appendChild(userActions);
            messages.appendChild(userMsg);
            
            // 保存到历史（保存完整提示词用于API调用，但标记为总结类型）
            conversationMessages.push({role: 'user', content: actualPrompt, displayText: displayText, isSummary: true});
            
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            const config = JSON.parse(currentSelectedModel);
            const providers = ConfigManager.getProviders();
            const provider = providers[config.provider];

            const aiMsg = document.createElement('div');
            aiMsg.className = 'tm-message tm-ai';
            aiMsg.textContent = '正在总结...';
            messages.appendChild(aiMsg);

            try {
                const finalUrl = normalizeApiUrl(provider.url);
                let fullContent = '';
                let buffer = '';
                let lastIndex = 0;

                // UI 更新节流
                let updateScheduled = false;
                let isStreamComplete = false;
                // 用于存储从API响应中提取的reasoning_content
                let reasoningContent = '';
                
                // 提取思考过程的通用函数，支持多种格式
                const extractThinkingContent = (content, reasoning = '') => {
                    let thinkingContent = reasoning;
                    let mainContent = content;
                    
                    // 格式1: <think>...</think> (智谱AI, DeepSeek等)
                    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
                    if (thinkMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + thinkMatch[1].trim();
                        mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                    }
                    
                    // 格式2: <thinking>...</thinking> (部分模型)
                    const thinkingMatch = mainContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
                    if (thinkingMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + thinkingMatch[1].trim();
                        mainContent = mainContent.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
                    }
                    
                    // 格式3: <reasoning>...</reasoning> (部分模型)
                    const reasoningMatch = mainContent.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
                    if (reasoningMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + reasoningMatch[1].trim();
                        mainContent = mainContent.replace(/<reasoning>[\s\S]*?<\/reasoning>/, '').trim();
                    }
                    
                    // 格式4: 处理未闭合的思考标签（流式输出时可能出现）
                    // <think> 开始但未结束
                    const unclosedThinkMatch = mainContent.match(/<think>([\s\S]*)$/);
                    if (unclosedThinkMatch && !mainContent.includes('</think>')) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + unclosedThinkMatch[1].trim();
                        mainContent = mainContent.replace(/<think>[\s\S]*$/, '').trim();
                    }
                    
                    // <thinking> 开始但未结束
                    const unclosedThinkingMatch = mainContent.match(/<thinking>([\s\S]*)$/);
                    if (unclosedThinkingMatch && !mainContent.includes('</thinking>')) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + unclosedThinkingMatch[1].trim();
                        mainContent = mainContent.replace(/<thinking>[\s\S]*$/, '').trim();
                    }
                    
                    return { thinkingContent, mainContent };
                };
                
                const updateUI = () => {
                    if (updateScheduled) return;
                    updateScheduled = true;
                    requestAnimationFrame(() => {
                        // 使用通用函数提取思考过程
                        const { thinkingContent, mainContent } = extractThinkingContent(fullContent, reasoningContent);

                        let html = '';
                        if (thinkingContent) {
                            const collapsed = isStreamComplete ? 'collapsed' : '';
                            html += `<div class="tm-thinking-section">
                                <div class="tm-thinking-header">
                                    <span class="tm-thinking-toggle ${collapsed}">▼</span>
                                    <span>思考过程</span>
                                </div>
                                <div class="tm-thinking-content ${collapsed}">${marked.parse(thinkingContent)}</div>
                            </div>`;
                        }
                        if (mainContent) {
                            html += marked.parse(mainContent);
                        }

                        safeInnerHTML(aiMsg, html, fullContent);
                        aiMsg.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });

                        // 折叠功能已通过事件委托实现

                        // 持续滚动到底部
                        aiMsg.scrollIntoView({ behavior: 'auto', block: 'end' });
                        updateScheduled = false;
                    });
                };

                const processStreamLine = (line) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine.startsWith('data:')) return;

                    const data = trimmedLine.slice(5).trim();
                    if (data === '[DONE]') return;

                    try {
                        const parsed = JSON.parse(data);
                        let delta = '';
                        let reasoningDelta = '';
                        
                        if (parsed.choices && parsed.choices.length > 0) {
                            const choice = parsed.choices[0];
                            
                            // 处理常规内容
                            if (choice.delta) {
                                // OpenAI/通用格式
                                if (choice.delta.content) {
                                    delta = choice.delta.content;
                                }
                                // OpenAI o1系列的reasoning_content
                                if (choice.delta.reasoning_content) {
                                    reasoningDelta = choice.delta.reasoning_content;
                                }
                                // 部分API使用reasoning字段
                                if (choice.delta.reasoning) {
                                    reasoningDelta = choice.delta.reasoning;
                                }
                            } else if (choice.message) {
                                if (choice.message.content) {
                                    delta = choice.message.content;
                                }
                                // 非流式响应中的reasoning_content
                                if (choice.message.reasoning_content) {
                                    reasoningDelta = choice.message.reasoning_content;
                                }
                            } else if (choice.text) {
                                delta = choice.text;
                            }
                        } else if (parsed.content) {
                            delta = parsed.content;
                        }
                        
                        // 处理Claude格式的thinking
                        if (parsed.type === 'content_block_delta') {
                            if (parsed.delta && parsed.delta.type === 'thinking_delta') {
                                reasoningDelta = parsed.delta.thinking || '';
                            } else if (parsed.delta && parsed.delta.type === 'text_delta') {
                                delta = parsed.delta.text || '';
                            }
                        }
                        
                        // 处理DeepSeek格式
                        if (parsed.choices && parsed.choices[0]) {
                            const choice = parsed.choices[0];
                            // DeepSeek的reasoning_content在delta中
                            if (choice.delta && choice.delta.reasoning_content !== undefined) {
                                reasoningDelta = choice.delta.reasoning_content;
                            }
                        }

                        // 累积reasoning内容
                        if (reasoningDelta) {
                            reasoningContent += reasoningDelta;
                            updateUI();
                        }
                        
                        if (delta) {
                            fullContent += delta;
                            updateUI();
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                };

                // 构建消息历史
                const buildMessages = () => {
                    const messages = [];
                    if (currentSystemPrompt) {
                        messages.push({role: 'system', content: currentSystemPrompt});
                    }
                    
                    // 获取历史消息
                    const memoryRounds = modelParams.memory_rounds;
                    if (memoryRounds > 0 && conversationMessages.length > 0) {
                        // 计算需要包含的消息数量（每轮包含用户和AI两条消息）
                        const maxMessages = memoryRounds * 2;
                        const startIndex = Math.max(0, conversationMessages.length - maxMessages);
                        const historyMessages = conversationMessages.slice(startIndex);
                        
                        historyMessages.forEach(msg => {
                            messages.push({
                                role: msg.role === 'ai' ? 'assistant' : msg.role,
                                content: msg.content
                            });
                        });
                    }
                    
                    // 添加当前用户消息
                    messages.push({role: 'user', content: actualPrompt});
                    return messages;
                };

                const requestData = {
                    model: config.model,
                    messages: buildMessages(),
                    temperature: modelParams.temperature,
                    max_tokens: modelParams.max_tokens,
                    stream: true
                };

                // 优先尝试使用 fetch (支持流式)
                try {
                    aiMsg.textContent = '';
                    const response = await fetch(finalUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${provider.key}`
                        },
                        body: JSON.stringify(requestData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;
                        const lines = buffer.split('\n');
                        buffer = lines.pop();
                        lines.forEach(processStreamLine);
                    }

                    // 处理剩余 buffer
                    if (buffer) processStreamLine(buffer);
                    isStreamComplete = true;
                    
                    // 等待最后一次 UI 更新完成后再添加按钮
                    requestAnimationFrame(() => {
                        updateUI();
                        requestAnimationFrame(() => {
                            // 流式完成后添加操作按钮
                            const aiActions = document.createElement('div');
                            aiActions.className = 'tm-message-actions';
                            safeInnerHTML(aiActions, `
                                <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                                <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                                <button class="tm-message-action-btn tm-regenerate-msg-btn" title="重新生成">🔄</button>
                            `);
                            aiMsg.appendChild(aiActions);
                            aiMsg.dataset.index = conversationMessages.length;

                            // 保存AI回复
                            conversationMessages.push({role: 'ai', content: fullContent, html: aiMsg.innerHTML});
                            saveCurrentConversation();
                        });
                    });

                } catch (fetchError) {
                    console.warn('Fetch failed, falling back to GM_xmlhttpRequest:', fetchError);

                    // 如果 fetch 失败 (可能是 CORS)，回退到 GM_xmlhttpRequest
                    // 注意：GM_xmlhttpRequest 在某些环境下可能不支持流式，会退化为一次性输出
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: finalUrl,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${provider.key}`
                        },
                        data: JSON.stringify(requestData),
                        onloadstart: () => {
                            if (!fullContent) aiMsg.textContent = '正在重试...';
                        },
                        onprogress: (response) => {
                            const responseText = response.responseText;
                            if (!responseText) return;

                            const newText = responseText.slice(lastIndex);
                            if (newText.length === 0) return;
                            lastIndex = responseText.length;
                            buffer += newText;

                            const lines = buffer.split('\n');
                            buffer = lines.pop();

                            lines.forEach(processStreamLine);
                        },
                        onload: (response) => {
                            if (buffer) processStreamLine(buffer);
                            isStreamComplete = true;
                            updateUI();

                            // 保存AI回复
                            if (fullContent) {
                                // 添加AI消息操作按钮
                                const aiActions = document.createElement('div');
                                aiActions.className = 'tm-message-actions';
                                safeInnerHTML(aiActions, `
                                    <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                                    <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                                    <button class="tm-message-action-btn tm-regenerate-msg-btn" title="重新生成">🔄</button>
                                `);
                                aiMsg.appendChild(aiActions);
                                aiMsg.dataset.index = conversationMessages.length;

                                conversationMessages.push({role: 'ai', content: fullContent, html: aiMsg.innerHTML});
                                saveCurrentConversation();
                            }

                            if (!fullContent) {
                                // 最后的兜底解析
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.choices && data.choices[0]?.message?.content) {
                                        fullContent = data.choices[0].message.content;
                                        updateUI();
                                    } else if (data.error) {
                                        aiMsg.textContent = 'API错误: ' + (data.error.message || JSON.stringify(data.error));
                                    }
                                } catch (e) {
                                    aiMsg.textContent = '请求失败: ' + (fetchError.message || '未知错误');
                                }
                            }
                        },
                        onerror: (err) => {
                            aiMsg.textContent = '请求失败: ' + (err.statusText || '网络错误');
                        }
                    });
                }
            } catch (e) {
                aiMsg.textContent = '发送失败: ' + e.message;
            }
        });

        // 网页问答模式切换
        const qaBtn = sidebar.querySelector('#tm-qa-page-btn');
        const modeIndicator = sidebar.querySelector('#tm-mode-indicator');

        const toggleQaMode = (forceOff = false) => {
            if (forceOff) {
                isQaMode = false;
            } else {
                isQaMode = !isQaMode;
            }

            if (isQaMode) {
                modeIndicator.textContent = '网页问答模式已开启';
                modeIndicator.style.display = 'block';
                setTimeout(() => modeIndicator.classList.add('tm-visible'), 10);
                qaBtn.classList.add('tm-selected');
                sidebar.querySelector('#tm-user-input').focus();
            } else {
                modeIndicator.classList.remove('tm-visible');
                setTimeout(() => {
                    if (!isQaMode) modeIndicator.style.display = 'none';
                }, 300);
                qaBtn.classList.remove('tm-selected');
            }
        };

        qaBtn.addEventListener('click', () => {
            if (!currentSelectedModel) {
                alert('请先选择模型');
                return;
            }
            toggleQaMode();
        });

        // 初始化对话 - 检查是否已有对话，避免每次刷新都创建新对话
        const conversations = ConfigManager.getConversations();
        if (conversations.length > 0) {
            // 加载最近的对话
            loadConversation(conversations[0].id);
            applySystemDefaults();
        } else {
            // 只有在没有任何对话时才创建新对话
            createNewConversation();
        }

        // 提示词选择下拉菜单
        const promptDropdown = sidebar.querySelector('#tm-prompt-dropdown');

        const renderPromptDropdown = () => {
            const allPrompts = ConfigManager.getPrompts();
            const chatPrompts = allPrompts.map((p, i) => ({...p, originalIndex: i}))
                                          .filter(p => p.type === 'chat' || !p.type);
            
            promptDropdown.textContent = '';

            if (chatPrompts.length === 0) {
                safeInnerHTML(promptDropdown, '<div class="tm-prompt-dropdown-item" style="text-align:center;color:#999;">暂无对话提示词</div>');
                return;
            }

            chatPrompts.forEach((prompt) => {
                const item = document.createElement('div');
                item.className = 'tm-prompt-dropdown-item';
                safeInnerHTML(item, `
                    <div class="tm-prompt-title">${prompt.title || '未命名'}</div>
                    <div class="tm-prompt-preview">${prompt.content || ''}</div>
                `);
                item.dataset.index = prompt.originalIndex;
                promptDropdown.appendChild(item);
            });
        };

        promptSelectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = promptDropdown.style.display === 'block';
            promptDropdown.style.display = isOpen ? 'none' : 'block';
            sidebar.querySelector('#tm-params-panel').style.display = 'none';
            sidebar.querySelector('#tm-params-selector-btn').classList.remove('tm-selected');
            if (!isOpen) renderPromptDropdown();
        });

        // 模型参数设置
        let modelParams = {temperature: 0.7, max_tokens: 2048, memory_rounds: 15};
        const paramsSelectorBtn = sidebar.querySelector('#tm-params-selector-btn');
        const paramsPanel = sidebar.querySelector('#tm-params-panel');
        const tempInput = sidebar.querySelector('#tm-param-temperature');
        const maxTokensInput = sidebar.querySelector('#tm-param-max-tokens');
        const memoryInput = sidebar.querySelector('#tm-param-memory-rounds');

        paramsSelectorBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = paramsPanel.style.display === 'block';
            paramsPanel.style.display = isOpen ? 'none' : 'block';
            promptDropdown.style.display = 'none';
            paramsSelectorBtn.classList.toggle('tm-selected', !isOpen);
        });

        tempInput.addEventListener('input', (e) => {
            modelParams.temperature = parseFloat(e.target.value) || 0.7;
        });

        maxTokensInput.addEventListener('input', (e) => {
            modelParams.max_tokens = parseInt(e.target.value) || 2048;
        });

        memoryInput.addEventListener('input', (e) => {
            modelParams.memory_rounds = parseInt(e.target.value) || 15;
        });

        promptDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-prompt-dropdown-item');
            if (!item || !item.dataset.index) return;

            const prompts = ConfigManager.getPrompts();
            const prompt = prompts[parseInt(item.dataset.index)];
            currentSystemPrompt = prompt.content;
            promptDropdown.style.display = 'none';
            promptSelectorBtn.classList.add('tm-selected');
            promptSelectorBtn.title = `已选择: ${prompt.title}`;
        });

        // 初始化加载模型和提示词
        renderModelDropdown();
        renderPromptDropdown();

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tm-input-area')) {
                promptDropdown.style.display = 'none';
                paramsPanel.style.display = 'none';
                paramsSelectorBtn.classList.remove('tm-selected');
            }
        });

        // 对话功能
        const sendMessage = async (options = {}) => {
            const input = sidebar.querySelector('#tm-user-input');
            const messages = sidebar.querySelector('#tm-messages');
            
            let text = options.text !== undefined ? options.text : input.value.trim();
            let isSummary = options.isSummary || false;
            let displayText = options.displayText || text;

            if (!text) return;

            if (isQaMode) {
                const userQuestion = text;
                const pageTitle = document.title;
                let pageContent = '';
                const mainContent = document.querySelector('main, article, .content, .main, #content, #main');
                if (mainContent) {
                    pageContent = mainContent.innerText;
                } else {
                    pageContent = document.body.innerText;
                }
                
                const maxLength = 8000;
                if (pageContent.length > maxLength) {
                    pageContent = pageContent.substring(0, maxLength) + '...(内容过长已截断)';
                }

                text = `请根据以下网页内容，回答用户提出的问题。

网页标题：${pageTitle}

--- 网页内容开始 ---
${pageContent}
--- 网页内容结束 ---

用户问题：${userQuestion}

请开始回答：`;
                
                displayText = `问答页面 "${pageTitle}": ${userQuestion}`;
                isSummary = true; // 复用isSummary来显示displayText

                // 关闭问答模式
                toggleQaMode(true);
            }
            if (!currentSelectedModel) {
                alert('请先选择模型');
                return;
            }

            // 如果是新对话的第一条消息，自动命名
            if (conversationMessages.length === 0) {
                const conversations = ConfigManager.getConversations();
                const index = conversations.findIndex(c => c.id === currentConversationId);
                if (index !== -1) {
                    conversations[index].title = displayText.slice(0, 20);
                    ConfigManager.saveConversations(conversations);
                    renderConversations();
                }
            }

            const userMsg = document.createElement('div');
            userMsg.className = 'tm-message tm-user';
            userMsg.dataset.index = conversationMessages.length;
            userMsg.textContent = displayText;
            
            const userActions = document.createElement('div');
            userActions.className = 'tm-message-actions';
            safeInnerHTML(userActions, `
                <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
            `);
            userMsg.appendChild(userActions);
            messages.appendChild(userMsg);
            
            if (isSummary) {
                conversationMessages.push({role: 'user', content: text, displayText: displayText, isSummary: true});
            } else {
                conversationMessages.push({role: 'user', content: text});
            }
            
            input.value = '';
            messages.scrollTop = messages.scrollHeight;

            const config = JSON.parse(currentSelectedModel);
            const providers = ConfigManager.getProviders();
            const provider = providers[config.provider];

            const aiMsg = document.createElement('div');
            aiMsg.className = 'tm-message tm-ai';
            aiMsg.textContent = '思考中...';
            messages.appendChild(aiMsg);

            try {
                const finalUrl = normalizeApiUrl(provider.url);
                let fullContent = '';
                let buffer = '';
                let lastIndex = 0;

                // UI 更新节流
                let updateScheduled = false;
                let isStreamComplete = false;
                // 用于存储从API响应中提取的reasoning_content
                let reasoningContent = '';
                
                // 提取思考过程的通用函数，支持多种格式
                const extractThinkingContent = (content, reasoning = '') => {
                    let thinkingContent = reasoning;
                    let mainContent = content;
                    
                    // 格式1: <think>...</think> (智谱AI, DeepSeek等)
                    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
                    if (thinkMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + thinkMatch[1].trim();
                        mainContent = content.replace(/<think>[\s\S]*?<\/think>/, '').trim();
                    }
                    
                    // 格式2: <thinking>...</thinking> (部分模型)
                    const thinkingMatch = mainContent.match(/<thinking>([\s\S]*?)<\/thinking>/);
                    if (thinkingMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + thinkingMatch[1].trim();
                        mainContent = mainContent.replace(/<thinking>[\s\S]*?<\/thinking>/, '').trim();
                    }
                    
                    // 格式3: <reasoning>...</reasoning> (部分模型)
                    const reasoningMatch = mainContent.match(/<reasoning>([\s\S]*?)<\/reasoning>/);
                    if (reasoningMatch) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + reasoningMatch[1].trim();
                        mainContent = mainContent.replace(/<reasoning>[\s\S]*?<\/reasoning>/, '').trim();
                    }
                    
                    // 格式4: 处理未闭合的思考标签（流式输出时可能出现）
                    // <think> 开始但未结束
                    const unclosedThinkMatch = mainContent.match(/<think>([\s\S]*)$/);
                    if (unclosedThinkMatch && !mainContent.includes('</think>')) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + unclosedThinkMatch[1].trim();
                        mainContent = mainContent.replace(/<think>[\s\S]*$/, '').trim();
                    }
                    
                    // <thinking> 开始但未结束
                    const unclosedThinkingMatch = mainContent.match(/<thinking>([\s\S]*)$/);
                    if (unclosedThinkingMatch && !mainContent.includes('</thinking>')) {
                        thinkingContent = (thinkingContent ? thinkingContent + '\n' : '') + unclosedThinkingMatch[1].trim();
                        mainContent = mainContent.replace(/<thinking>[\s\S]*$/, '').trim();
                    }
                    
                    return { thinkingContent, mainContent };
                };
                
                const updateUI = () => {
                    if (updateScheduled) return;
                    updateScheduled = true;
                    requestAnimationFrame(() => {
                        // 使用通用函数提取思考过程
                        const { thinkingContent, mainContent } = extractThinkingContent(fullContent, reasoningContent);

                        let html = '';
                        if (thinkingContent) {
                            const collapsed = isStreamComplete ? 'collapsed' : '';
                            html += `<div class="tm-thinking-section">
                                <div class="tm-thinking-header">
                                    <span class="tm-thinking-toggle ${collapsed}">▼</span>
                                    <span>思考过程</span>
                                </div>
                                <div class="tm-thinking-content ${collapsed}">${marked.parse(thinkingContent)}</div>
                            </div>`;
                        }
                        if (mainContent) {
                            html += marked.parse(mainContent);
                        }

                        safeInnerHTML(aiMsg, html, fullContent);
                        aiMsg.querySelectorAll('pre code').forEach((block) => {
                            hljs.highlightElement(block);
                        });

                        // 折叠功能已通过事件委托实现

                        // 持续滚动到底部
                        aiMsg.scrollIntoView({ behavior: 'auto', block: 'end' });
                        updateScheduled = false;
                    });
                };

                const processStreamLine = (line) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine.startsWith('data:')) return;

                    const data = trimmedLine.slice(5).trim();
                    if (data === '[DONE]') return;

                    try {
                        const parsed = JSON.parse(data);
                        let delta = '';
                        let reasoningDelta = '';
                        
                        if (parsed.choices && parsed.choices.length > 0) {
                            const choice = parsed.choices[0];
                            
                            // 处理常规内容
                            if (choice.delta) {
                                // OpenAI/通用格式
                                if (choice.delta.content) {
                                    delta = choice.delta.content;
                                }
                                // OpenAI o1系列的reasoning_content
                                if (choice.delta.reasoning_content) {
                                    reasoningDelta = choice.delta.reasoning_content;
                                }
                                // 部分API使用reasoning字段
                                if (choice.delta.reasoning) {
                                    reasoningDelta = choice.delta.reasoning;
                                }
                            } else if (choice.message) {
                                if (choice.message.content) {
                                    delta = choice.message.content;
                                }
                                // 非流式响应中的reasoning_content
                                if (choice.message.reasoning_content) {
                                    reasoningDelta = choice.message.reasoning_content;
                                }
                            } else if (choice.text) {
                                delta = choice.text;
                            }
                        } else if (parsed.content) {
                            delta = parsed.content;
                        }
                        
                        // 处理Claude格式的thinking
                        if (parsed.type === 'content_block_delta') {
                            if (parsed.delta && parsed.delta.type === 'thinking_delta') {
                                reasoningDelta = parsed.delta.thinking || '';
                            } else if (parsed.delta && parsed.delta.type === 'text_delta') {
                                delta = parsed.delta.text || '';
                            }
                        }
                        
                        // 处理DeepSeek格式
                        if (parsed.choices && parsed.choices[0]) {
                            const choice = parsed.choices[0];
                            // DeepSeek的reasoning_content在delta中
                            if (choice.delta && choice.delta.reasoning_content !== undefined) {
                                reasoningDelta = choice.delta.reasoning_content;
                            }
                        }

                        // 累积reasoning内容
                        if (reasoningDelta) {
                            reasoningContent += reasoningDelta;
                            updateUI();
                        }
                        
                        if (delta) {
                            fullContent += delta;
                            updateUI();
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                };

                // 构建消息历史
                const buildMessages = () => {
                    const messages = [];
                    if (currentSystemPrompt) {
                        messages.push({role: 'system', content: currentSystemPrompt});
                    }
                    
                    // 获取历史消息
                    const memoryRounds = modelParams.memory_rounds;
                    if (memoryRounds > 0 && conversationMessages.length > 0) {
                        // 计算需要包含的消息数量（每轮包含用户和AI两条消息）
                        const maxMessages = memoryRounds * 2;
                        const startIndex = Math.max(0, conversationMessages.length - maxMessages);
                        const historyMessages = conversationMessages.slice(startIndex);
                        
                        historyMessages.forEach(msg => {
                            messages.push({
                                role: msg.role === 'ai' ? 'assistant' : msg.role,
                                content: msg.content
                            });
                        });
                    }
                    
                    // 添加当前用户消息
                    messages.push({role: 'user', content: text});
                    return messages;
                };

                const requestData = {
                    model: config.model,
                    messages: buildMessages(),
                    temperature: modelParams.temperature,
                    max_tokens: modelParams.max_tokens,
                    stream: true
                };

                // 优先尝试使用 fetch (支持流式)
                try {
                    aiMsg.textContent = '';
                    const response = await fetch(finalUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${provider.key}`
                        },
                        body: JSON.stringify(requestData)
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        buffer += chunk;
                        const lines = buffer.split('\n');
                        buffer = lines.pop();
                        lines.forEach(processStreamLine);
                    }

                    // 处理剩余 buffer
                    if (buffer) processStreamLine(buffer);
                    isStreamComplete = true;
                    
                    // 等待最后一次 UI 更新完成后再添加按钮
                    requestAnimationFrame(() => {
                        updateUI();
                        requestAnimationFrame(() => {
                            // 流式完成后添加操作按钮
                            const aiActions = document.createElement('div');
                            aiActions.className = 'tm-message-actions';
                            safeInnerHTML(aiActions, `
                                <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                                <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                                <button class="tm-message-action-btn tm-regenerate-msg-btn" title="重新生成">🔄</button>
                            `);
                            aiMsg.appendChild(aiActions);
                            aiMsg.dataset.index = conversationMessages.length;

                            // 保存AI回复
                            conversationMessages.push({role: 'ai', content: fullContent, html: aiMsg.innerHTML});
                            saveCurrentConversation();
                        });
                    });

                } catch (fetchError) {
                    console.warn('Fetch failed, falling back to GM_xmlhttpRequest:', fetchError);

                    // 如果 fetch 失败 (可能是 CORS)，回退到 GM_xmlhttpRequest
                    // 注意：GM_xmlhttpRequest 在某些环境下可能不支持流式，会退化为一次性输出
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: finalUrl,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${provider.key}`
                        },
                        data: JSON.stringify(requestData),
                        onloadstart: () => {
                            if (!fullContent) aiMsg.textContent = '正在重试...';
                        },
                        onprogress: (response) => {
                            const responseText = response.responseText;
                            if (!responseText) return;

                            const newText = responseText.slice(lastIndex);
                            if (newText.length === 0) return;
                            lastIndex = responseText.length;
                            buffer += newText;

                            const lines = buffer.split('\n');
                            buffer = lines.pop();

                            lines.forEach(processStreamLine);
                        },
                        onload: (response) => {
                            if (buffer) processStreamLine(buffer);
                            isStreamComplete = true;
                            updateUI();

                            // 保存AI回复
                            if (fullContent) {
                                // 添加AI消息操作按钮
                                const aiActions = document.createElement('div');
                                aiActions.className = 'tm-message-actions';
                                safeInnerHTML(aiActions, `
                                    <button class="tm-message-action-btn tm-copy-msg-btn" title="复制">📋</button>
                                    <button class="tm-message-action-btn tm-delete-msg-btn" title="删除">🗑️</button>
                                    <button class="tm-message-action-btn tm-regenerate-msg-btn" title="重新生成">🔄</button>
                                `);
                                aiMsg.appendChild(aiActions);
                                aiMsg.dataset.index = conversationMessages.length;

                                conversationMessages.push({role: 'ai', content: fullContent, html: aiMsg.innerHTML});
                                saveCurrentConversation();
                            }

                            if (!fullContent) {
                                // 最后的兜底解析
                                try {
                                    const data = JSON.parse(response.responseText);
                                    if (data.choices && data.choices[0]?.message?.content) {
                                        fullContent = data.choices[0].message.content;
                                        updateUI();
                                    } else if (data.error) {
                                        aiMsg.textContent = 'API错误: ' + (data.error.message || JSON.stringify(data.error));
                                    }
                                } catch (e) {
                                    aiMsg.textContent = '请求失败: ' + (fetchError.message || '未知错误');
                                }
                            }
                        },
                        onerror: (err) => {
                            aiMsg.textContent = '请求失败: ' + (err.statusText || '网络错误');
                        }
                    });
                }
            } catch (e) {
                aiMsg.textContent = '发送失败: ' + e.message;
            }
        };

        // 消息操作事件处理
        sidebar.querySelector('#tm-messages').addEventListener('click', async (e) => {
            const thinkingHeader = e.target.closest('.tm-thinking-header');
            if (thinkingHeader) {
                const toggle = thinkingHeader.querySelector('.tm-thinking-toggle');
                const content = thinkingHeader.nextElementSibling;
                if (toggle && content) {
                    toggle.classList.toggle('tm-collapsed');
                    content.classList.toggle('tm-collapsed');
                }
                return;
            }

            const btn = e.target.closest('.tm-message-action-btn');
            if (!btn) return;

            const msgDiv = btn.closest('.tm-message');
            const msgIndex = parseInt(msgDiv.dataset.index);

            if (btn.classList.contains('tm-copy-msg-btn')) {
                // 复制消息
                const msg = conversationMessages[msgIndex];
                try {
                    await navigator.clipboard.writeText(msg.content);
                    btn.textContent = '✓';
                    setTimeout(() => btn.textContent = '📋', 1000);
                } catch (err) {
                    alert('复制失败');
                }
            } else if (btn.classList.contains('tm-delete-msg-btn')) {
                // 删除消息
                if (!confirm('确定删除此消息吗？')) return;
                
                conversationMessages.splice(msgIndex, 1);
                msgDiv.remove();
                
                // 更新后续消息的索引
                const allMsgs = sidebar.querySelectorAll('#messages .message');
                allMsgs.forEach((m, i) => {
                    m.dataset.index = i;
                });
                
                saveCurrentConversation();
            } else if (btn.classList.contains('tm-regenerate-msg-btn')) {
                // 重新生成
                if (!confirm('确定重新生成此回复吗？')) return;

                // 找到对应的用户消息
                const userMsgIndex = msgIndex - 1;
                if (userMsgIndex < 0) return; // Sanity check

                const userMsg = conversationMessages[userMsgIndex];

                if (userMsg && userMsg.role === 'user') {
                    // 截断历史记录，从用户消息开始（即删除用户和AI的回复）
                    conversationMessages.splice(userMsgIndex);

                    // 从DOM中移除对应的用户消息及之后的所有消息
                    const allMsgs = sidebar.querySelectorAll('#messages .message');
                    allMsgs.forEach(m => {
                        if (parseInt(m.dataset.index) >= userMsgIndex) {
                            m.remove();
                        }
                    });

                    // 使用sendMessage重新发送，它会把用户消息和AI回复都加回来
                    await sendMessage({
                        text: userMsg.content,
                        isSummary: userMsg.isSummary || false,
                        displayText: userMsg.displayText
                    });
                }
            }
        });

        sidebar.querySelector('#tm-send-btn').addEventListener('click', sendMessage);
        sidebar.querySelector('#tm-user-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // 提示词库功能
        const renderPrompts = () => {
            const prompts = ConfigManager.getPrompts();
            const chatList = sidebar.querySelector('#tm-chat-prompts-list');
            const translateList = sidebar.querySelector('#tm-translate-prompts-list');
            
            chatList.textContent = '';
            translateList.textContent = '';

            prompts.forEach((prompt, index) => {
                const item = document.createElement('div');
                item.className = 'tm-prompt-item';
                item.dataset.index = index;
                safeInnerHTML(item, `
                    <input type="checkbox" class="tm-prompt-checkbox" data-index="${index}">
                    <div class="tm-prompt-header">
                        <div class="tm-prompt-title">${prompt.title || '未命名'}</div>
                        <div class="tm-prompt-actions">
                            <button class="tm-view-btn" data-index="${index}">查看</button>
                            <button class="tm-edit-btn" data-index="${index}">编辑</button>
                            <button class="tm-delete-btn" data-index="${index}">删除</button>
                        </div>
                    </div>
                    <div class="tm-prompt-content" style="display:none;">${prompt.content || ''}</div>
                `);
                
                if (prompt.type === 'translate') {
                    translateList.appendChild(item);
                } else {
                    chatList.appendChild(item);
                }
            });
        };

        sidebar.querySelector('#tm-add-prompt').addEventListener('click', () => {
            const prompts = ConfigManager.getPrompts();
            // Default to chat type
            prompts.push({title: '', content: '', type: 'chat'});
            ConfigManager.savePrompts(prompts);
            renderPrompts();
            // Find the newly added item (last one)
            const index = prompts.length - 1;
            const item = sidebar.querySelector(`.tm-prompt-item[data-index="${index}"]`);
            if (item) {
                item.querySelector('.tm-edit-btn').click();
            }
        });

        sidebar.querySelector('#tm-batch-delete-prompt').addEventListener('click', () => {
            const checkboxes = sidebar.querySelectorAll('.tm-prompt-checkbox:checked');
            if (checkboxes.length === 0) {
                alert('请选择要删除的提示词');
                return;
            }
            if (!confirm(`确定删除选中的 ${checkboxes.length} 个提示词吗？`)) return;

            const prompts = ConfigManager.getPrompts();
            const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index)).sort((a, b) => b - a);
            indices.forEach(index => prompts.splice(index, 1));
            ConfigManager.savePrompts(prompts);
            renderPrompts();
        });

        const handlePromptListClick = (e) => {
            const index = parseInt(e.target.dataset.index);
            const item = sidebar.querySelector(`.tm-prompt-item[data-index="${index}"]`);

            if (e.target.classList.contains('tm-view-btn')) {
                const content = item.querySelector('.tm-prompt-content');
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            } else if (e.target.classList.contains('tm-edit-btn')) {
                const prompts = ConfigManager.getPrompts();
                const prompt = prompts[index];
                item.classList.add('tm-editing');
                safeInnerHTML(item, `
                    <div class="tm-prompt-form">
                        <input type="text" placeholder="标题" value="${prompt.title || ''}" class="tm-prompt-title-input">
                        <div class="tm-form-group" style="margin: 5px 0;">
                            <label style="font-size: 12px; margin-right: 10px;">类型:</label>
                            <select class="tm-prompt-type-select" style="padding: 4px; border-radius: 4px; border: 1px solid #ddd;">
                                <option value="chat" ${(!prompt.type || prompt.type === 'chat') ? 'selected' : ''}>对话提示词</option>
                                <option value="translate" ${prompt.type === 'translate' ? 'selected' : ''}>翻译提示词</option>
                            </select>
                        </div>
                        <textarea placeholder="内容" class="tm-prompt-content-input">${prompt.content || ''}</textarea>
                        <div class="tm-form-actions">
                            <button class="tm-save-prompt-btn" data-index="${index}">保存</button>
                            <button class="tm-cancel-btn" data-index="${index}">取消</button>
                        </div>
                    </div>
                `);
            } else if (e.target.classList.contains('tm-delete-btn')) {
                if (!confirm('确定删除此提示词吗？')) return;
                const prompts = ConfigManager.getPrompts();
                prompts.splice(index, 1);
                ConfigManager.savePrompts(prompts);
                renderPrompts();
            } else if (e.target.classList.contains('tm-save-prompt-btn')) {
                const prompts = ConfigManager.getPrompts();
                const titleInput = item.querySelector('.tm-prompt-title-input');
                const contentInput = item.querySelector('.tm-prompt-content-input');
                const typeSelect = item.querySelector('.tm-prompt-type-select');
                
                prompts[index] = {
                    title: titleInput.value.trim() || '未命名',
                    content: contentInput.value.trim(),
                    type: typeSelect.value
                };
                ConfigManager.savePrompts(prompts);
                renderPrompts();
            } else if (e.target.classList.contains('tm-cancel-btn')) {
                renderPrompts();
            }
        };

        sidebar.querySelector('#tm-prompts-container').addEventListener('click', handlePromptListClick);

        renderPrompts();
        
        // 系统配置功能
        const renderSystemConfig = () => {
            const systemConfig = ConfigManager.getSystemConfig();
            const modelSelect = sidebar.querySelector('#tm-default-model-select');
            const promptSelect = sidebar.querySelector('#tm-default-prompt-select');
            const translatePromptSelect = sidebar.querySelector('#tm-default-translate-prompt-select');
            
            // 填充模型选项
            modelSelect.innerHTML = '<option value="">未设置</option>';
            const providers = ConfigManager.getProviders();
            providers.forEach((provider, providerIndex) => {
                const models = ConfigManager.getModels(providerIndex);
                models.forEach(model => {
                    const option = document.createElement('option');
                    const modelValue = JSON.stringify({provider: providerIndex, model: model});
                    option.value = modelValue;
                    option.textContent = `${provider.name} - ${model}`;
                    if (systemConfig.defaultModel === modelValue) {
                        option.selected = true;
                    }
                    modelSelect.appendChild(option);
                });
            });
            
            // 填充提示词选项
            promptSelect.innerHTML = '<option value="">未设置</option>';
            const prompts = ConfigManager.getPrompts();
            prompts.forEach((prompt, index) => {
                if (prompt.type === 'translate') return; // Skip translate prompts for chat default
                
                const option = document.createElement('option');
                option.value = index;
                option.textContent = prompt.title || '未命名';
                if (systemConfig.defaultPrompt === index) {
                    option.selected = true;
                }
                promptSelect.appendChild(option);
            });

            // 填充翻译提示词选项
            translatePromptSelect.innerHTML = '<option value="">未设置</option>';
            prompts.forEach((prompt, index) => {
                if (prompt.type !== 'translate') return; // Only show translate prompts
                
                const option = document.createElement('option');
                option.value = index;
                option.textContent = prompt.title || '未命名';
                if (systemConfig.defaultTranslatePrompt === index) {
                    option.selected = true;
                }
                translatePromptSelect.appendChild(option);
            });
        };
        
        sidebar.querySelector('#tm-save-system-config').addEventListener('click', () => {
            const modelSelect = sidebar.querySelector('#tm-default-model-select');
            const promptSelect = sidebar.querySelector('#tm-default-prompt-select');
            const translatePromptSelect = sidebar.querySelector('#tm-default-translate-prompt-select');
            
            const config = {
                defaultModel: modelSelect.value || null,
                defaultPrompt: promptSelect.value ? parseInt(promptSelect.value) : null,
                defaultTranslatePrompt: translatePromptSelect.value ? parseInt(translatePromptSelect.value) : null
            };
            
            ConfigManager.saveSystemConfig(config);
            alert('系统配置已保存');
        });
        
        // 监听标签页切换，当切换到系统配置时刷新选项
        sidebar.querySelectorAll('.tm-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                if (tab.dataset.tab === 'system') {
                    renderSystemConfig();
                } else if (tab.dataset.tab === 'translate') {
                    // 确保翻译页面能正确加载模型和提示词
                    setTimeout(() => {
                        renderTranslatePrompts();
                        renderTranslateModels();
                    }, 100);
                }
            });
        });

        // 翻译功能
        let currentTranslateModel = null;
        let sourceLang = 'auto';
        let targetLang = 'en';

        const renderTranslateModels = () => {
            const dropdown = sidebar.querySelector('#tm-translate-model-dropdown');
            const systemConfig = ConfigManager.getSystemConfig();
            const providers = ConfigManager.getProviders();
            const currentModelSpan = sidebar.querySelector('#tm-current-translate-model');
            
            dropdown.innerHTML = '';
            
            let hasModels = false;
            providers.forEach((provider, providerIndex) => {
                const models = ConfigManager.getModels(providerIndex);
                if (models.length > 0) hasModels = true;
                models.forEach(model => {
                    const item = document.createElement('div');
                    item.className = 'tm-translate-dropdown-item';
                    const modelValue = JSON.stringify({provider: providerIndex, model: model});
                    item.dataset.value = modelValue;
                    item.textContent = `${provider.name} - ${model}`;
                    
                    if (currentTranslateModel === modelValue) {
                        item.classList.add('tm-selected');
                        currentModelSpan.textContent = `${provider.name} - ${model}`;
                    }
                    
                    dropdown.appendChild(item);
                });
            });

            if (!hasModels) {
                dropdown.innerHTML = '<div class="tm-translate-dropdown-item">请先在AI提供商中添加模型</div>';
                // 如果没有模型，重置当前翻译模型
                currentTranslateModel = null;
                if (currentModelSpan) currentModelSpan.textContent = '未选择模型';
                return;
            }

            // 设置默认值
            if (!currentTranslateModel && systemConfig.defaultModel) {
                currentTranslateModel = systemConfig.defaultModel;
                const config = JSON.parse(currentTranslateModel);
                const provider = providers[config.provider];
                if (provider) {
                    currentModelSpan.textContent = `${provider.name} - ${config.model}`;
                    // 重新渲染以高亮选中项
                    renderTranslateModels();
                }
            }
        };

        const renderTranslatePrompts = () => {
            const systemConfig = ConfigManager.getSystemConfig();
            const prompts = ConfigManager.getPrompts();
            const dropdown = sidebar.querySelector('#tm-translate-style-dropdown');
            const currentStyleSpan = sidebar.querySelector('#tm-current-translate-style');
            
            dropdown.innerHTML = '';
            
            // 默认选项
            const defaultItem = document.createElement('div');
            defaultItem.className = 'tm-translate-dropdown-item';
            defaultItem.dataset.value = "";
            defaultItem.textContent = '默认 (通用翻译)';
            if (currentTranslatePromptIndex === "") {
                defaultItem.classList.add('tm-selected');
                currentStyleSpan.textContent = '默认 (通用翻译)';
            }
            dropdown.appendChild(defaultItem);

            prompts.forEach((prompt, index) => {
                if (prompt.type !== 'translate') return; // Only show translate prompts

                const item = document.createElement('div');
                item.className = 'tm-translate-dropdown-item';
                item.dataset.value = index;
                item.textContent = prompt.title || '未命名';
                
                if (currentTranslatePromptIndex === index.toString()) {
                    item.classList.add('tm-selected');
                    currentStyleSpan.textContent = prompt.title || '未命名';
                }
                
                dropdown.appendChild(item);
            });
        };

        // 翻译设置下拉菜单事件
        const translateModelBtn = sidebar.querySelector('#tm-translate-model-btn');
        const translateStyleBtn = sidebar.querySelector('#tm-translate-style-btn');
        const translateModelDropdown = sidebar.querySelector('#tm-translate-model-dropdown');
        const translateStyleDropdown = sidebar.querySelector('#tm-translate-style-dropdown');

        translateModelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = translateModelDropdown.style.display === 'block';
            translateModelDropdown.style.display = isOpen ? 'none' : 'block';
            translateStyleDropdown.style.display = 'none';
        });

        translateStyleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = translateStyleDropdown.style.display === 'block';
            translateStyleDropdown.style.display = isOpen ? 'none' : 'block';
            translateModelDropdown.style.display = 'none';
        });

        translateModelDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-translate-dropdown-item');
            if (!item || !item.dataset.value) return;

            currentTranslateModel = item.dataset.value;
            renderTranslateModels();
            translateModelDropdown.style.display = 'none';
        });

        translateStyleDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.tm-translate-dropdown-item');
            if (!item) return;

            currentTranslatePromptIndex = item.dataset.value;
            renderTranslatePrompts();
            translateStyleDropdown.style.display = 'none';
        });

        // Language Selection Logic
        const sourceLangBtn = sidebar.querySelector('#tm-source-lang-btn');
        const targetLangBtn = sidebar.querySelector('#tm-target-lang-btn');
        const swapLangBtn = sidebar.querySelector('#tm-swap-lang-btn');
        const sourceLangDropdown = sidebar.querySelector('#tm-source-lang-dropdown');
        const targetLangDropdown = sidebar.querySelector('#tm-target-lang-dropdown');

        const renderLanguageList = (container, type) => {
            const listContainer = container.querySelector('.tm-language-list');
            listContainer.innerHTML = '';

            LANGUAGES.forEach(lang => {
                if (type !== 'source' && lang.isSourceOnly) return;

                const item = document.createElement('div');
                item.className = 'tm-language-item';
                const isSelected = type === 'source' ? sourceLang === lang.code : targetLang === lang.code;
                if (isSelected) item.classList.add('tm-selected');
                item.textContent = lang.zh;
                item.dataset.code = lang.code;
                item.dataset.zh = lang.zh;
                item.dataset.en = lang.en;
                item.dataset.pinyin = lang.pinyin;
                listContainer.appendChild(item);
            });
        };

        const filterLanguages = (container, keyword) => {
            const items = container.querySelectorAll('.tm-language-item');
            keyword = keyword.toLowerCase();
            items.forEach(item => {
                if (item.dataset.code === 'auto') return; // Always show auto
                const zh = item.dataset.zh || '';
                const en = item.dataset.en || '';
                const pinyin = item.dataset.pinyin || '';
                
                if (zh.includes(keyword) || en.toLowerCase().includes(keyword) || pinyin.includes(keyword)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        const updateLanguageBtnText = (btn, code) => {
            if (code === 'auto') {
                btn.textContent = '自动检测';
                return;
            }
            const lang = LANGUAGES.find(l => l.code === code);
            if (lang) {
                btn.textContent = lang.zh;
            }
        };

        // Initialize Language Lists
        renderLanguageList(sourceLangDropdown, 'source');
        renderLanguageList(targetLangDropdown, 'target');

        // Event Listeners for Language Selection
        sourceLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sourceLangDropdown.style.display === 'flex';
            sourceLangDropdown.style.display = isOpen ? 'none' : 'flex';
            targetLangDropdown.style.display = 'none';
            if (!isOpen) {
                sourceLangDropdown.querySelector('.tm-language-search').focus();
            }
        });

        targetLangBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = targetLangDropdown.style.display === 'flex';
            targetLangDropdown.style.display = isOpen ? 'none' : 'flex';
            sourceLangDropdown.style.display = 'none';
            if (!isOpen) {
                targetLangDropdown.querySelector('.tm-language-search').focus();
            }
        });

        swapLangBtn.addEventListener('click', () => {
            if (sourceLang === 'auto') {
                // Can't swap if source is auto, maybe alert or just set source to target
                sourceLang = targetLang;
                targetLang = 'en'; // Default fallback
            } else {
                const temp = sourceLang;
                sourceLang = targetLang;
                targetLang = temp;
            }
            updateLanguageBtnText(sourceLangBtn, sourceLang);
            updateLanguageBtnText(targetLangBtn, targetLang);
            
            // Re-render lists to update selection state
            renderLanguageList(sourceLangDropdown, 'source');
            renderLanguageList(targetLangDropdown, 'target');
        });

        // Search Functionality
        sidebar.querySelectorAll('.tm-language-search').forEach(input => {
            input.addEventListener('input', (e) => {
                const container = e.target.closest('.tm-language-dropdown');
                filterLanguages(container, e.target.value);
            });
            input.addEventListener('click', (e) => e.stopPropagation());
        });

        // Selection Event
        const handleLanguageSelect = (e, type) => {
            const item = e.target.closest('.tm-language-item');
            if (!item) return;

            const code = item.dataset.code;
            if (type === 'source') {
                sourceLang = code;
                updateLanguageBtnText(sourceLangBtn, code);
                sourceLangDropdown.style.display = 'none';
            } else {
                targetLang = code;
                updateLanguageBtnText(targetLangBtn, code);
                targetLangDropdown.style.display = 'none';
            }
            
            // Re-render to update selection styling
            renderLanguageList(type === 'source' ? sourceLangDropdown : targetLangDropdown, type);
        };

        sourceLangDropdown.addEventListener('click', (e) => handleLanguageSelect(e, 'source'));
        targetLangDropdown.addEventListener('click', (e) => handleLanguageSelect(e, 'target'));

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.tm-translate-language-selector')) {
                sourceLangDropdown.style.display = 'none';
                targetLangDropdown.style.display = 'none';
            }
            if (!e.target.closest('.tm-translate-card-title')) {
                translateModelDropdown.style.display = 'none';
                translateStyleDropdown.style.display = 'none';
            }
        });

        const translate = async () => {
            const input = sidebar.querySelector('#tm-translate-input').value.trim();
            const output = sidebar.querySelector('#tm-translate-output');

            if (!input) {
                alert('请输入要翻译的内容');
                return;
            }
            if (!currentTranslateModel) {
                alert('请先选择一个模型');
                return;
            }

            const prompts = ConfigManager.getPrompts();
            
            // Get language names for prompt
            const getLangName = (code, type = 'zh') => {
                if (code === 'auto') return type === 'zh' ? '自动检测' : 'Auto Detect';
                const lang = LANGUAGES.find(l => l.code === code);
                return lang ? (type === 'zh' ? lang.zh : lang.en) : code;
            };

            const sourceNameZh = getLangName(sourceLang, 'zh');
            const targetNameZh = getLangName(targetLang, 'zh');
            const sourceNameEn = getLangName(sourceLang, 'en');
            const targetNameEn = getLangName(targetLang, 'en');

            let systemPrompt = `You are a professional translator. Translate the following text from ${sourceNameEn} to ${targetNameEn}. Be accurate and natural.`;
            
            if (currentTranslatePromptIndex !== "" && prompts[currentTranslatePromptIndex]) {
                let content = prompts[currentTranslatePromptIndex].content;
                
                // Variable substitution
                content = content.replace(/{{原语言}}/g, sourceNameZh);
                content = content.replace(/{{目标语言}}/g, targetNameZh);
                content = content.replace(/{{输入内容}}/g, input);
                
                // Also support English variable names for compatibility
                content = content.replace(/{{source_lang}}/g, sourceNameEn);
                content = content.replace(/{{target_lang}}/g, targetNameEn);
                content = content.replace(/{{input_text}}/g, input);

                systemPrompt = content;
            }

            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: input }
            ];

            const config = JSON.parse(currentTranslateModel);
            const providers = ConfigManager.getProviders();
            const provider = providers[config.provider];
            const finalUrl = normalizeApiUrl(provider.url);

            output.value = '翻译中...';

            try {
                const response = await fetch(finalUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${provider.key}`
                    },
                    body: JSON.stringify({
                        model: config.model,
                        messages: messages,
                        stream: false
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.choices && data.choices[0].message && data.choices[0].message.content) {
                    output.value = data.choices[0].message.content;
                } else {
                    output.value = '翻译失败，未收到有效回复。';
                }
            } catch (error) {
                console.error('Translation error:', error);
                output.value = `翻译出错: ${error.message}`;
            }
            // 更新输出字数
            const outputCount = sidebar.querySelector('#tm-output-count');
            if (outputCount) outputCount.textContent = output.value.length;
        };

        sidebar.querySelector('#tm-translate-btn').addEventListener('click', translate);
        
        // 字数统计更新函数
        const updateCharCount = (inputId, countId) => {
            const input = sidebar.querySelector(inputId);
            const count = sidebar.querySelector(countId);
            if (input && count) {
                count.textContent = input.value.length;
            }
        };

        // 输入框事件监听
        const translateInput = sidebar.querySelector('#tm-translate-input');
        if (translateInput) {
            translateInput.addEventListener('input', () => {
                updateCharCount('#tm-translate-input', '#tm-input-count');
            });
        }

        // 清空按钮
        sidebar.querySelector('#tm-clear-translate-btn').addEventListener('click', () => {
            sidebar.querySelector('#tm-translate-input').value = '';
            sidebar.querySelector('#tm-translate-output').value = '';
            updateCharCount('#tm-translate-input', '#tm-input-count');
            const outputCount = sidebar.querySelector('#tm-output-count');
            if (outputCount) outputCount.textContent = '0';
        });

        // 复制输入按钮
        const copyInputBtn = sidebar.querySelector('#tm-copy-input-btn');
        if (copyInputBtn) {
            copyInputBtn.addEventListener('click', async () => {
                const input = sidebar.querySelector('#tm-translate-input');
                if (!input.value) return;
                
                try {
                    await navigator.clipboard.writeText(input.value);
                    const originalText = copyInputBtn.textContent;
                    copyInputBtn.textContent = '✓';
                    setTimeout(() => copyInputBtn.textContent = originalText, 1000);
                } catch (err) {
                    console.error('复制失败', err);
                }
            });
        }

        // 复制输出按钮
        sidebar.querySelector('#tm-copy-translate-btn').addEventListener('click', async () => {
            const output = sidebar.querySelector('#tm-translate-output');
            if (!output.value) return;
            
            try {
                await navigator.clipboard.writeText(output.value);
                const btn = sidebar.querySelector('#tm-copy-translate-btn');
                const originalText = btn.textContent;
                btn.textContent = '✓';
                setTimeout(() => btn.textContent = originalText, 1000);
            } catch (err) {
                alert('复制失败');
            }
        });
        
        // 初始化翻译页面
        setTimeout(() => {
            renderTranslatePrompts();
            renderTranslateModels();
        }, 200);

    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();