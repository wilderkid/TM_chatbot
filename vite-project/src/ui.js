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
    const sidebar = document.getElementById('tm-ai-chat-sidebar');
    
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
    const header = sidebar.querySelector('.tm-sidebar-header');
    if (header) {
        if (themeName === 'notion' || themeName === 'youtube' || themeName === 'apple') {
            header.style.color = '#333';
            header.style.borderBottom = `1px solid ${theme.colors.border}`;
            header.querySelectorAll('button').forEach(btn => {
                if (!btn.classList.contains('tm-close-btn')) {
                    btn.style.color = '#333';
                    btn.style.background = 'rgba(0,0,0,0.05)';
                }
            });
            const closeBtn = header.querySelector('.tm-close-btn');
            if (closeBtn) closeBtn.style.color = '#333';
        } else {
            header.style.color = 'white';
            header.style.borderBottom = 'none';
            header.querySelectorAll('button').forEach(btn => {
                if (!btn.classList.contains('tm-close-btn')) {
                    btn.style.color = 'white';
                    btn.style.background = 'rgba(255,255,255,0.2)';
                }
            });
            const closeBtn = header.querySelector('.tm-close-btn');
            if (closeBtn) closeBtn.style.color = 'white';
        }
    }
    
    ConfigManager.saveTheme(themeName);
};

// 创建侧边栏HTML
export const createSidebar = () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'tm-ai-chat-sidebar';

    // 创建调整大小的手柄
    ['left', 'right', 'top', 'bottom'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `tm-resize-handle-${pos}`;
        sidebar.appendChild(handle);
    });
    ['tl', 'tr', 'bl', 'br'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `tm-resize-handle-corner-${pos}`;
        sidebar.appendChild(handle);
    });

    // 创建头部
    const header = document.createElement('div');
    header.className = 'tm-sidebar-header';

    const tabs = document.createElement('div');
    tabs.className = 'tm-tabs';
    tabs.id = 'tm-tabs-container';

    ['chat', 'translate', 'providers', 'prompts', 'system'].forEach((tab, i) => {
        const btn = document.createElement('button');
        btn.className = i === 0 ? 'tm-tab tm-active' : 'tm-tab';
        btn.dataset.tab = tab;
        btn.textContent = tab === 'chat' ? '对话' : tab === 'translate' ? '翻译' : tab === 'providers' ? 'AI提供商' : tab === 'prompts' ? '提示词库' : '系统配置';
        tabs.appendChild(btn);
    });

    const controls = document.createElement('div');
    controls.className = 'tm-header-controls';
    
    const themeBtn = document.createElement('button');
    themeBtn.className = 'tm-theme-btn';
    themeBtn.textContent = '🎨';
    themeBtn.title = '切换主题';
    
    const themeDropdown = document.createElement('div');
    themeDropdown.className = 'tm-theme-dropdown';
    Object.entries(THEMES).forEach(([key, theme]) => {
        const item = document.createElement('div');
        item.className = 'tm-theme-item';
        item.dataset.theme = key;
        item.innerHTML = `
            <span class="tm-theme-preview" style="background: ${theme.colors.primaryGradient}"></span>
            <span>${theme.name}</span>
        `;
        themeDropdown.appendChild(item);
    });
    
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'tm-refresh-btn';
    refreshBtn.textContent = '🔄';
    refreshBtn.title = '刷新脚本状态';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'tm-close-btn';
    closeBtn.textContent = '×';

    controls.appendChild(themeBtn);
    controls.appendChild(themeDropdown);
    controls.appendChild(refreshBtn);
    controls.appendChild(closeBtn);

    header.appendChild(tabs);
    header.appendChild(controls);
    sidebar.appendChild(header);

    // 创建内容区
    const content = document.createElement('div');
    content.className = 'tm-sidebar-content';

    // 对话标签页
    const chatTab = document.createElement('div');
    chatTab.className = 'tm-tab-content tm-active';
    chatTab.id = 'tm-chat-tab';

    const chatContainer = document.createElement('div');
    chatContainer.className = 'tm-chat-container';

    const conversationsSidebar = document.createElement('div');
    conversationsSidebar.className = 'tm-conversations-sidebar';
    conversationsSidebar.id = 'tm-conversations-sidebar';

    const conversationsToolbar = document.createElement('div');
    conversationsToolbar.className = 'tm-conversations-toolbar';

    const batchDeleteConversationBtn = document.createElement('button');
    batchDeleteConversationBtn.id = 'tm-batch-delete-conversation-btn';
    batchDeleteConversationBtn.textContent = '批量删除';

    const newConversationBtn = document.createElement('button');
    newConversationBtn.id = 'tm-new-conversation-btn-toolbar';
    newConversationBtn.textContent = '新建对话';

    conversationsToolbar.appendChild(batchDeleteConversationBtn);
    conversationsToolbar.appendChild(newConversationBtn);
    conversationsSidebar.appendChild(conversationsToolbar);

    const chatMain = document.createElement('div');
    chatMain.className = 'tm-chat-main';

    const modelSelector = document.createElement('div');
    modelSelector.className = 'tm-model-selector';
    const modelBtn = document.createElement('button');
    modelBtn.id = 'tm-model-display-btn';
    const modelName = document.createElement('span');
    modelName.id = 'tm-model-name';
    modelName.textContent = '选择模型';
    const arrow = document.createElement('span');
    arrow.className = 'tm-arrow';
    arrow.textContent = '▼';
    modelBtn.appendChild(modelName);
    modelBtn.appendChild(arrow);
    const modelDropdown = document.createElement('div');
    modelDropdown.id = 'tm-model-dropdown';
    modelDropdown.className = 'tm-model-dropdown';
    modelDropdown.style.display = 'none';
    modelSelector.appendChild(modelBtn);
    modelSelector.appendChild(modelDropdown);

    const messages = document.createElement('div');
    messages.className = 'tm-messages';
    messages.id = 'tm-messages';

    const inputArea = document.createElement('div');
    inputArea.className = 'tm-input-area';
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'tm-input-wrapper';

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '5px';

    const newChatBtn = document.createElement('button');
    newChatBtn.id = 'tm-new-chat-btn';
    newChatBtn.className = 'tm-prompt-icon-top';
    newChatBtn.title = '新建对话';
    newChatBtn.textContent = '➕';

    const promptBtn = document.createElement('button');
    promptBtn.id = 'tm-prompt-selector-btn';
    promptBtn.className = 'tm-prompt-icon-top';
    promptBtn.title = '选择提示词';
    promptBtn.textContent = '💡';

    const paramsBtn = document.createElement('button');
    paramsBtn.id = 'tm-params-selector-btn';
    paramsBtn.className = 'tm-prompt-icon-top';
    paramsBtn.title = '模型参数';
    paramsBtn.textContent = '⚙️';

    const clearBtn = document.createElement('button');
    clearBtn.id = 'tm-clear-chat-btn';
    clearBtn.className = 'tm-prompt-icon-top';
    clearBtn.title = '清除对话';
    clearBtn.textContent = '🗑️';

    const summarizeBtn = document.createElement('button');
    summarizeBtn.id = 'tm-summarize-page-btn';
    summarizeBtn.className = 'tm-prompt-icon-top';
    summarizeBtn.title = '总结网页';
    summarizeBtn.textContent = '📄';

    const qaBtn = document.createElement('button');
    qaBtn.id = 'tm-qa-page-btn';
    qaBtn.className = 'tm-prompt-icon-top';
    qaBtn.title = '问答网页';
    qaBtn.textContent = '❓';
 
    btnContainer.appendChild(newChatBtn);
    btnContainer.appendChild(promptBtn);
    btnContainer.appendChild(paramsBtn);
    btnContainer.appendChild(clearBtn);
    btnContainer.appendChild(summarizeBtn);
    btnContainer.appendChild(qaBtn);

    const textarea = document.createElement('textarea');
    textarea.id = 'tm-user-input';
    textarea.placeholder = '输入消息...';

    inputWrapper.appendChild(btnContainer);
    inputWrapper.appendChild(textarea);

    const sendBtn = document.createElement('button');
    sendBtn.id = 'tm-send-btn';
    sendBtn.textContent = '发送';

    const promptDropdown = document.createElement('div');
    promptDropdown.id = 'tm-prompt-dropdown';
    promptDropdown.className = 'tm-prompt-dropdown';
    promptDropdown.style.display = 'none';

    const paramsPanel = document.createElement('div');
    paramsPanel.id = 'tm-params-panel';
    paramsPanel.className = 'tm-params-panel';
    paramsPanel.style.display = 'none';

    const tempItem = document.createElement('div');
    tempItem.className = 'tm-params-item';
    const tempLabel = document.createElement('label');
    tempLabel.textContent = '温度 (Temperature):';
    const tempInput = document.createElement('input');
    tempInput.type = 'number';
    tempInput.id = 'tm-param-temperature';
    tempInput.min = '0';
    tempInput.max = '2';
    tempInput.step = '0.1';
    tempInput.value = '0.7';
    tempItem.appendChild(tempLabel);
    tempItem.appendChild(tempInput);

    const tokensItem = document.createElement('div');
    tokensItem.className = 'tm-params-item';
    const tokensLabel = document.createElement('label');
    tokensLabel.textContent = '最大上下文 (Max Tokens):';
    const tokensInput = document.createElement('input');
    tokensInput.type = 'number';
    tokensInput.id = 'tm-param-max-tokens';
    tokensInput.min = '1';
    tokensInput.step = '1';
    tokensInput.value = '2048';
    tokensItem.appendChild(tokensLabel);
    tokensItem.appendChild(tokensInput);

    const memoryItem = document.createElement('div');
    memoryItem.className = 'tm-params-item';
    const memoryLabel = document.createElement('label');
    memoryLabel.textContent = '记忆轮数:';
    const memoryInput = document.createElement('input');
    memoryInput.type = 'number';
    memoryInput.id = 'tm-param-memory-rounds';
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

    const modeIndicator = document.createElement('div');
    modeIndicator.id = 'tm-mode-indicator';
    modeIndicator.className = 'tm-mode-indicator';
    modeIndicator.style.display = 'none';
    inputArea.appendChild(modeIndicator);
 
    chatMain.appendChild(modelSelector);
    chatMain.appendChild(messages);
    chatMain.appendChild(inputArea);

    chatContainer.appendChild(conversationsSidebar);
    chatContainer.appendChild(chatMain);
    chatTab.appendChild(chatContainer);

    // 提供商标签页
    const providersTab = document.createElement('div');
    providersTab.className = 'tm-tab-content';
    providersTab.id = 'tm-providers-tab';
    const providersContainer = document.createElement('div');
    providersContainer.className = 'tm-providers-container';
    const providersSidebar = document.createElement('div');
    providersSidebar.className = 'tm-providers-sidebar';
    const addProviderBtn = document.createElement('button');
    addProviderBtn.id = 'tm-add-provider-btn';
    addProviderBtn.textContent = '+ 添加供应商';
    const providersList = document.createElement('div');
    providersList.className = 'tm-providers-list';
    providersList.id = 'tm-providers-sidebar-list';
    providersSidebar.appendChild(addProviderBtn);
    providersSidebar.appendChild(providersList);
    const providerDetail = document.createElement('div');
    providerDetail.className = 'tm-provider-detail';
    providerDetail.id = 'tm-provider-detail';
    const emptyState = document.createElement('div');
    emptyState.className = 'tm-empty-state';
    emptyState.textContent = '请选择或添加一个供应商';
    providerDetail.appendChild(emptyState);
    providersContainer.appendChild(providersSidebar);
    providersContainer.appendChild(providerDetail);
    providersTab.appendChild(providersContainer);

    // 提示词标签页
    const promptsTab = document.createElement('div');
    promptsTab.className = 'tm-tab-content';
    promptsTab.id = 'tm-prompts-tab';
    const promptsToolbar = document.createElement('div');
    promptsToolbar.className = 'tm-prompts-toolbar';
    const addPromptBtn = document.createElement('button');
    addPromptBtn.id = 'tm-add-prompt';
    addPromptBtn.textContent = '+ 新增';
    const batchDeleteBtn = document.createElement('button');
    batchDeleteBtn.id = 'tm-batch-delete-prompt';
    batchDeleteBtn.textContent = '批量删除';
    promptsToolbar.appendChild(addPromptBtn);
    promptsToolbar.appendChild(batchDeleteBtn);
    const promptsContainer = document.createElement('div');
    promptsContainer.className = 'tm-prompts-list';
    promptsContainer.id = 'tm-prompts-container';

    const chatHeader = document.createElement('h4');
    chatHeader.textContent = '对话提示词';
    chatHeader.style.margin = '0 0 10px 0';
    chatHeader.style.color = 'var(--ai-text, #333)';
    
    const chatList = document.createElement('div');
    chatList.id = 'tm-chat-prompts-list';
    
    const translateHeader = document.createElement('h4');
    translateHeader.innerHTML = `
        翻译提示词
        <span id="tm-translate-prompt-help" class="tm-help-icon" title="查看可用变量">?</span>
    `;
    translateHeader.style.margin = '20px 0 10px 0';
    translateHeader.style.color = 'var(--ai-text, #333)';
    
    const translateList = document.createElement('div');
    translateList.id = 'tm-translate-prompts-list';

    promptsContainer.appendChild(chatHeader);
    promptsContainer.appendChild(chatList);
    promptsContainer.appendChild(translateHeader);
    promptsContainer.appendChild(translateList);

    promptsTab.appendChild(promptsToolbar);
    promptsTab.appendChild(promptsContainer);

    // 系统配置标签页
    const systemTab = document.createElement('div');
    systemTab.className = 'tm-tab-content';
    systemTab.id = 'tm-system-tab';
    const systemContainer = document.createElement('div');
    systemContainer.className = 'tm-system-config-container';
    systemContainer.innerHTML = `
        <h3>系统配置</h3>
        <div class="tm-config-section">
            <h4>新建对话默认设置</h4>
            <div class="tm-form-group">
                <label>默认模型</label>
                <select id="tm-default-model-select" class="tm-config-select">
                    <option value="">未设置</option>
                </select>
            </div>
            <div class="tm-form-group">
                <label>默认提示词</label>
                <select id="tm-default-prompt-select" class="tm-config-select">
                    <option value="">未设置</option>
                </select>
            </div>
            <div class="tm-form-group">
                <label>默认翻译提示词</label>
                <select id="tm-default-translate-prompt-select" class="tm-config-select">
                    <option value="">未设置</option>
                </select>
            </div>
            <div class="tm-form-group">
                <label>默认温度</label>
                <input type="number" id="tm-default-temperature" class="tm-config-select" min="0" max="2" step="0.1" placeholder="0.7">
            </div>
            <div class="tm-form-group">
                <label>默认最大上下文</label>
                <input type="number" id="tm-default-max-tokens" class="tm-config-select" min="1" step="1" placeholder="2048">
            </div>
            <div class="tm-form-group">
                <label>默认记忆轮数</label>
                <input type="number" id="tm-default-memory-rounds" class="tm-config-select" min="0" step="1" placeholder="15">
            </div>
            <button id="tm-save-system-config" class="tm-save-btn">保存配置</button>
        </div>
    `;
    systemTab.appendChild(systemContainer);

    // 翻译标签页
    const translateTab = document.createElement('div');
    translateTab.className = 'tm-tab-content';
    translateTab.id = 'tm-translate-tab';
    const translateContainer = document.createElement('div');
    translateContainer.className = 'tm-translate-container';
    translateContainer.innerHTML = `
        <div class="tm-translate-card">
            <div class="tm-translate-card-title">
                <span>⚙️ 翻译设置</span>
                <div class="tm-translate-text-area-actions">
                    <div class="tm-translate-action-btn" id="tm-translate-model-btn" title="选择模型">
                        <span>🤖</span>
                    </div>
                    <div class="tm-translate-action-btn" id="tm-translate-style-btn" title="选择风格">
                        <span>🎨</span>
                    </div>
                </div>
            </div>
            <div class="tm-translate-current-settings">
                <span id="tm-current-translate-model">未选择模型</span>
                <span class="tm-separator">|</span>
                <span id="tm-current-translate-style">默认风格</span>
            </div>
            
            <!-- Language Selection -->
            <div class="tm-translate-language-selector">
                <div class="tm-language-btn-container">
                    <button id="tm-source-lang-btn" class="tm-language-btn" data-lang="auto">自动检测</button>
                    <div id="tm-source-lang-dropdown" class="tm-language-dropdown" style="display: none;">
                        <input type="text" class="tm-language-search" placeholder="搜索语言 (中文/英文/拼音)...">
                        <div class="tm-language-list"></div>
                    </div>
                </div>
                
                <button id="tm-swap-lang-btn" class="tm-swap-btn" title="交换语言">⇄</button>
                
                <div class="tm-language-btn-container">
                    <button id="tm-target-lang-btn" class="tm-language-btn" data-lang="en">英语</button>
                    <div id="tm-target-lang-dropdown" class="tm-language-dropdown" style="display: none;">
                        <input type="text" class="tm-language-search" placeholder="搜索语言 (中文/英文/拼音)...">
                        <div class="tm-language-list"></div>
                    </div>
                </div>
            </div>
            
            <!-- Hidden Dropdowns -->
            <div id="tm-translate-model-dropdown" class="tm-translate-dropdown" style="display: none;">
                <!-- Models will be populated here -->
            </div>
            <div id="tm-translate-style-dropdown" class="tm-translate-dropdown" style="display: none;">
                <!-- Styles will be populated here -->
            </div>
        </div>

        <div class="tm-translate-card">
            <div class="tm-translate-card-title">
                <span>⌨️ 输入文本</span>
                <div class="tm-translate-text-area-actions">
                    <div class="tm-translate-action-btn" id="tm-clear-translate-btn" title="清除">
                        <span>🗑️</span>
                    </div>
                    <div class="tm-translate-action-btn" id="tm-copy-input-btn" title="复制">
                        <span>📋</span>
                    </div>
                </div>
            </div>
            <div class="tm-translate-text-area-container">
                <textarea id="tm-translate-input" placeholder="请输入要翻译的文本..."></textarea>
            </div>
            <div class="tm-translate-char-count">
                <span id="tm-input-count">0</span>/5000
            </div>
        </div>

        <button class="tm-translate-main-btn" id="tm-translate-btn">
            <span>🌐 翻译文本</span>
        </button>

        <div class="tm-translate-card">
            <div class="tm-translate-card-title">
                <span>📄 翻译结果</span>
                <div class="tm-translate-text-area-actions">
                    <div class="tm-translate-action-btn" id="tm-copy-translate-btn" title="复制">
                        <span>📋</span>
                    </div>
                </div>
            </div>
            <div class="tm-translate-text-area-container">
                <textarea id="tm-translate-output" placeholder="翻译结果将显示在这里..." readonly></textarea>
            </div>
            <div class="tm-translate-char-count">
                <span id="tm-output-count">0</span> 字符
            </div>
        </div>
    `;
    translateTab.appendChild(translateContainer);

    content.appendChild(chatTab);
    content.appendChild(translateTab);
    content.appendChild(providersTab);
    content.appendChild(promptsTab);
    content.appendChild(systemTab);
    sidebar.appendChild(content);

    // 添加提示词帮助弹窗
    const helpModal = document.createElement('div');
    helpModal.id = 'tm-prompt-help-modal';
    helpModal.className = 'tm-prompt-help-modal';
    helpModal.style.display = 'none';
    helpModal.innerHTML = `
        <div class="tm-modal-content">
            <span class="tm-modal-close-btn">&times;</span>
            <h3>翻译提示词可用变量</h3>
            <p>您可以在翻译提示词中使用以下变量，系统会在翻译时自动替换它们：</p>
            <ul>
                <li><code>{{原语言}}</code> - 将被替换为当前设置的源语言名称（例如，“中文”）。</li>
                <li><code>{{目标语言}}</code> - 将被替换为当前设置的目标语言名称（例如，“英语”）。</li>
                <li><code>{{输入内容}}</code> - 将被替换为在翻译输入框中输入的完整文本。</li>
            </ul>
            <h4>示例：</h4>
            <pre><code>请将以下内容从 {{原语言}} 翻译成 {{目标语言}}，请注意保持专业的语气：\n\n{{输入内容}}</code></pre>
        </div>
    `;
    sidebar.appendChild(helpModal);

    return sidebar;
};

// 创建触发按钮
export const createTriggerButton = () => {
    const btn = document.createElement('button');
    btn.id = 'tm-ai-chat-trigger';
    btn.textContent = '💬';
    btn.title = 'AI对话';
    
    const pos = ConfigManager.getTriggerPosition();
    if (pos) {
        btn.style.left = pos.left;
        btn.style.top = pos.top;
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
    }
    
    return btn;
};