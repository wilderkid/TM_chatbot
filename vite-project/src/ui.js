import { ConfigManager, THEMES } from './config.js';

// Trusted Types 策略支持
let ttPolicy;
if (window.trustedTypes && window.trustedTypes.createPolicy) {
    try {
        ttPolicy = window.trustedTypes.createPolicy('ai-chat-sidebar-policy', {
            createHTML: (string) => string
        });
    } catch (e) {
        console.warn('Failed to create Trusted Types policy:', e);
    }
}

export const safeInnerHTML = (element, html, fallbackText) => {
    if (!element) return;
    try {
        if (ttPolicy) {
            element.innerHTML = ttPolicy.createHTML(html);
        } else {
            element.innerHTML = html;
        }
    } catch (e) {
        console.warn('innerHTML assignment failed:', e);
        element.textContent = fallbackText !== undefined ? fallbackText : html;
    }
};

export const applyTheme = (themeName) => {
    const theme = THEMES[themeName] || THEMES.default;
    const sidebar = document.getElementById('ai-chat-sidebar');
    
    if (!sidebar) return;

    const setVar = (name, value) => {
        sidebar.style.setProperty(`--ai-${name}`, value);
    };

    Object.entries(theme.colors).forEach(([key, value]) => {
        setVar(key, value);
    });

    // Apply default styles if not present in theme
    const defaultStyles = THEMES.default.styles;
    const styles = { ...defaultStyles, ...(theme.styles || {}) };
    
    Object.entries(styles).forEach(([key, value]) => {
        setVar(key, value);
    });
    
    // Special handling for backdrop filter (Apple style)
    if (styles.backdropFilter) {
        sidebar.style.backdropFilter = styles.backdropFilter;
        sidebar.style.webkitBackdropFilter = styles.backdropFilter;
    } else {
        sidebar.style.backdropFilter = 'none';
        sidebar.style.webkitBackdropFilter = 'none';
    }

    // Special handling for header text color based on gradient
    const header = sidebar.querySelector('.sidebar-header');
    if (header) {
        if (themeName === 'notion' || themeName === 'youtube' || themeName === 'apple') {
            header.style.color = '#333';
            header.style.borderBottom = `1px solid ${theme.colors.border}`;
            header.querySelectorAll('button').forEach(btn => {
                if (!btn.classList.contains('close-btn')) {
                    btn.style.color = '#333';
                    btn.style.background = 'rgba(0,0,0,0.05)';
                }
            });
            const closeBtn = header.querySelector('.close-btn');
            if (closeBtn) closeBtn.style.color = '#333';
        } else {
            header.style.color = 'white';
            header.style.borderBottom = 'none';
            header.querySelectorAll('button').forEach(btn => {
                if (!btn.classList.contains('close-btn')) {
                    btn.style.color = 'white';
                    btn.style.background = 'rgba(255,255,255,0.2)';
                }
            });
            const closeBtn = header.querySelector('.close-btn');
            if (closeBtn) closeBtn.style.color = 'white';
        }
    }
    
    ConfigManager.saveTheme(themeName);
};

// 创建侧边栏HTML
export const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'ai-chat-sidebar';

    // 创建调整大小的手柄
    ['left', 'right', 'top', 'bottom'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle-${pos}`;
        sidebar.appendChild(handle);
    });
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle-corner-${pos}`;
        sidebar.appendChild(handle);
    });

    // 创建头部
    const header = document.createElement('div');
    header.className = 'sidebar-header';

    const tabs = document.createElement('div');
    tabs.className = 'tabs';
    tabs.id = 'tabs-container';

    ['chat', 'providers', 'prompts', 'system'].forEach((tab, i) => {
        const btn = document.createElement('button');
        btn.className = i === 0 ? 'tab active' : 'tab';
        btn.dataset.tab = tab;
        btn.textContent = tab === 'chat' ? '对话' : tab === 'providers' ? 'AI提供商' : tab === 'prompts' ? '提示词库' : '系统配置';
        tabs.appendChild(btn);
    });

    const controls = document.createElement('div');
    controls.className = 'header-controls';
    
    const themeBtn = document.createElement('button');
    themeBtn.className = 'theme-btn';
    themeBtn.textContent = '🎨';
    themeBtn.title = '切换主题';
    
    const themeDropdown = document.createElement('div');
    themeDropdown.className = 'theme-dropdown';
    Object.entries(THEMES).forEach(([key, theme]) => {
        const item = document.createElement('div');
        item.className = 'theme-item';
        item.dataset.theme = key;
        item.innerHTML = `
            <span class="theme-preview" style="background: ${theme.colors.primaryGradient}"></span>
            <span>${theme.name}</span>
        `;
        themeDropdown.appendChild(item);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';

    controls.appendChild(themeBtn);
    controls.appendChild(themeDropdown);
    controls.appendChild(closeBtn);

    header.appendChild(tabs);
    header.appendChild(controls);
    sidebar.appendChild(header);

    // 创建内容区
    const content = document.createElement('div');
    content.className = 'sidebar-content';

    // 对话标签页
    const chatTab = document.createElement('div');
    chatTab.className = 'tab-content active';
    chatTab.id = 'chat-tab';

    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';

    const conversationsSidebar = document.createElement('div');
    conversationsSidebar.className = 'conversations-sidebar';
    conversationsSidebar.id = 'conversations-sidebar';

    const chatMain = document.createElement('div');
    chatMain.className = 'chat-main';

    const modelSelector = document.createElement('div');
    modelSelector.className = 'model-selector';
    const modelBtn = document.createElement('button');
    modelBtn.id = 'model-display-btn';
    const modelName = document.createElement('span');
    modelName.id = 'model-name';
    modelName.textContent = '选择模型';
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '▼';
    modelBtn.appendChild(modelName);
    modelBtn.appendChild(arrow);
    const modelDropdown = document.createElement('div');
    modelDropdown.id = 'model-dropdown';
    modelDropdown.className = 'model-dropdown';
    modelDropdown.style.display = 'none';
    modelSelector.appendChild(modelBtn);
    modelSelector.appendChild(modelDropdown);

    const messages = document.createElement('div');
    messages.className = 'messages';
    messages.id = 'messages';

    const inputArea = document.createElement('div');
    inputArea.className = 'input-area';
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '5px';

    const newChatBtn = document.createElement('button');
    newChatBtn.id = 'new-chat-btn';
    newChatBtn.className = 'prompt-icon-top';
    newChatBtn.title = '新建对话';
    newChatBtn.textContent = '➕';

    const promptBtn = document.createElement('button');
    promptBtn.id = 'prompt-selector-btn';
    promptBtn.className = 'prompt-icon-top';
    promptBtn.title = '选择提示词';
    promptBtn.textContent = '💡';

    const paramsBtn = document.createElement('button');
    paramsBtn.id = 'params-selector-btn';
    paramsBtn.className = 'prompt-icon-top';
    paramsBtn.title = '模型参数';
    paramsBtn.textContent = '⚙️';

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clear-chat-btn';
    clearBtn.className = 'prompt-icon-top';
    clearBtn.title = '清除对话';
    clearBtn.textContent = '🗑️';

    const summarizeBtn = document.createElement('button');
    summarizeBtn.id = 'summarize-page-btn';
    summarizeBtn.className = 'prompt-icon-top';
    summarizeBtn.title = '总结网页';
    summarizeBtn.textContent = '📄';

    btnContainer.appendChild(newChatBtn);
    btnContainer.appendChild(promptBtn);
    btnContainer.appendChild(paramsBtn);
    btnContainer.appendChild(clearBtn);
    btnContainer.appendChild(summarizeBtn);

    const textarea = document.createElement('textarea');
    textarea.id = 'user-input';
    textarea.placeholder = '输入消息...';

    inputWrapper.appendChild(btnContainer);
    inputWrapper.appendChild(textarea);

    const sendBtn = document.createElement('button');
    sendBtn.id = 'send-btn';
    sendBtn.textContent = '发送';

    const promptDropdown = document.createElement('div');
    promptDropdown.id = 'prompt-dropdown';
    promptDropdown.className = 'prompt-dropdown';
    promptDropdown.style.display = 'none';

    const paramsPanel = document.createElement('div');
    paramsPanel.id = 'params-panel';
    paramsPanel.className = 'params-panel';
    paramsPanel.style.display = 'none';

    const tempItem = document.createElement('div');
    tempItem.className = 'params-item';
    const tempLabel = document.createElement('label');
    tempLabel.textContent = '温度 (Temperature):';
    const tempInput = document.createElement('input');
    tempInput.type = 'number';
    tempInput.id = 'param-temperature';
    tempInput.min = '0';
    tempInput.max = '2';
    tempInput.step = '0.1';
    tempInput.value = '0.7';
    tempItem.appendChild(tempLabel);
    tempItem.appendChild(tempInput);

    const tokensItem = document.createElement('div');
    tokensItem.className = 'params-item';
    const tokensLabel = document.createElement('label');
    tokensLabel.textContent = '最大上下文 (Max Tokens):';
    const tokensInput = document.createElement('input');
    tokensInput.type = 'number';
    tokensInput.id = 'param-max-tokens';
    tokensInput.min = '1';
    tokensInput.step = '1';
    tokensInput.value = '2048';
    tokensItem.appendChild(tokensLabel);
    tokensItem.appendChild(tokensInput);

    const memoryItem = document.createElement('div');
    memoryItem.className = 'params-item';
    const memoryLabel = document.createElement('label');
    memoryLabel.textContent = '记忆轮数:';
    const memoryInput = document.createElement('input');
    memoryInput.type = 'number';
    memoryInput.id = 'param-memory-rounds';
    memoryInput.min = '0';
    memoryInput.step = '1';
    memoryInput.value = '15';
    memoryInput.title = '设置为0表示不限制';
    memoryItem.appendChild(memoryLabel);
    memoryItem.appendChild(memoryInput);

    paramsPanel.appendChild(tempItem);
    paramsPanel.appendChild(tokensItem);
    paramsPanel.appendChild(memoryItem);

    inputArea.appendChild(inputWrapper);
    inputArea.appendChild(sendBtn);
    inputArea.appendChild(promptDropdown);
    inputArea.appendChild(paramsPanel);

    chatMain.appendChild(modelSelector);
    chatMain.appendChild(messages);
    chatMain.appendChild(inputArea);

    chatContainer.appendChild(conversationsSidebar);
    chatContainer.appendChild(chatMain);
    chatTab.appendChild(chatContainer);

    // 提供商标签页
    const providersTab = document.createElement('div');
    providersTab.className = 'tab-content';
    providersTab.id = 'providers-tab';
    const providersContainer = document.createElement('div');
    providersContainer.className = 'providers-container';
    const providersSidebar = document.createElement('div');
    providersSidebar.className = 'providers-sidebar';
    const addProviderBtn = document.createElement('button');
    addProviderBtn.id = 'add-provider-btn';
    addProviderBtn.textContent = '+ 添加供应商';
    const providersList = document.createElement('div');
    providersList.className = 'providers-list';
    providersList.id = 'providers-sidebar-list';
    providersSidebar.appendChild(addProviderBtn);
    providersSidebar.appendChild(providersList);
    const providerDetail = document.createElement('div');
    providerDetail.className = 'provider-detail';
    providerDetail.id = 'provider-detail';
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.textContent = '请选择或添加一个供应商';
    providerDetail.appendChild(emptyState);
    providersContainer.appendChild(providersSidebar);
    providersContainer.appendChild(providerDetail);
    providersTab.appendChild(providersContainer);

    // 提示词标签页
    const promptsTab = document.createElement('div');
    promptsTab.className = 'tab-content';
    promptsTab.id = 'prompts-tab';
    const promptsToolbar = document.createElement('div');
    promptsToolbar.className = 'prompts-toolbar';
    const addPromptBtn = document.createElement('button');
    addPromptBtn.id = 'add-prompt';
    addPromptBtn.textContent = '+ 新增';
    const batchDeleteBtn = document.createElement('button');
    batchDeleteBtn.id = 'batch-delete-prompt';
    batchDeleteBtn.textContent = '批量删除';
    promptsToolbar.appendChild(addPromptBtn);
    promptsToolbar.appendChild(batchDeleteBtn);
    const promptsList = document.createElement('div');
    promptsList.className = 'prompts-list';
    promptsList.id = 'prompts-list';
    promptsTab.appendChild(promptsToolbar);
    promptsTab.appendChild(promptsList);

    // 系统配置标签页
    const systemTab = document.createElement('div');
    systemTab.className = 'tab-content';
    systemTab.id = 'system-tab';
    const systemContainer = document.createElement('div');
    systemContainer.className = 'system-config-container';
    systemContainer.innerHTML = `
        <h3>系统配置</h3>
        <div class="config-section">
            <h4>新建对话默认设置</h4>
            <div class="form-group">
                <label>默认模型</label>
                <select id="default-model-select" class="config-select">
                    <option value="">未设置</option>
                </select>
            </div>
            <div class="form-group">
                <label>默认提示词</label>
                <select id="default-prompt-select" class="config-select">
                    <option value="">未设置</option>
                </select>
            </div>
            <button id="save-system-config" class="save-btn">保存配置</button>
        </div>
    `;
    systemTab.appendChild(systemContainer);

    content.appendChild(chatTab);
    content.appendChild(providersTab);
    content.appendChild(promptsTab);
    content.appendChild(systemTab);
    sidebar.appendChild(content);

    document.body.appendChild(sidebar);
    return sidebar;
};

// 创建触发按钮
export const createTriggerButton = () => {
    const btn = document.createElement('button');
    btn.id = 'ai-chat-trigger';
    btn.textContent = '💬';
    btn.title = 'AI对话';
    
    const pos = ConfigManager.getTriggerPosition();
    if (pos) {
        btn.style.left = pos.left;
        btn.style.top = pos.top;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
    }
    
    document.body.appendChild(btn);
    return btn;
};