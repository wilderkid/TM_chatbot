export const addStyles = () => {
    // 添加highlight.js样式
    const highlightStyle = document.createElement('link');
    highlightStyle.rel = 'stylesheet';
    highlightStyle.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css';
    document.head.appendChild(highlightStyle);

    const style = document.createElement('style');
    style.textContent = `
        #tm-ai-chat-trigger {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--ai-primaryGradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9998;
            transition: transform 0.2s;
        }
        #tm-ai-chat-trigger:hover {
            transform: scale(1.1);
        }
        #tm-ai-chat-sidebar {
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            height: 100vh;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
            box-shadow: var(--ai-shadowLg, -2px 0 8px rgba(0,0,0,0.1));
            z-index: 9999;
            display: none;
            flex-direction: column;
            border-radius: 0;
            font-family: var(--ai-fontFamily, inherit);
        }
        #tm-ai-chat-sidebar.tm-open {
            display: flex;
        }
        #tm-ai-chat-sidebar.tm-resizing, #tm-ai-chat-sidebar.tm-dragging {
            transition: none;
        }
        .tm-resize-handle-left, .tm-resize-handle-right {
            position: absolute;
            top: 0;
            width: 5px;
            height: 100%;
            cursor: ew-resize;
            z-index: 10;
        }
        .tm-resize-handle-left {
            left: 0;
        }
        .tm-resize-handle-right {
            right: 0;
        }
        .tm-resize-handle-top, .tm-resize-handle-bottom {
            position: absolute;
            left: 0;
            width: 100%;
            height: 5px;
            cursor: ns-resize;
            z-index: 10;
        }
        .tm-resize-handle-top {
            top: 0;
        }
        .tm-resize-handle-bottom {
            bottom: 0;
        }
        .tm-resize-handle-corner-tl, .tm-resize-handle-corner-tr,
        .tm-resize-handle-corner-bl, .tm-resize-handle-corner-br {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 11;
        }
        .tm-resize-handle-corner-tl {
            top: 0;
            left: 0;
            cursor: nwse-resize;
        }
        .tm-resize-handle-corner-tr {
            top: 0;
            right: 0;
            cursor: nesw-resize;
        }
        .tm-resize-handle-corner-bl {
            bottom: 0;
            left: 0;
            cursor: nesw-resize;
        }
        .tm-resize-handle-corner-br {
            bottom: 0;
            right: 0;
            cursor: nwse-resize;
        }
        .tm-sidebar-header {
            padding: 0 var(--ai-spacing, 15px);
            height: var(--ai-headerHeight, auto);
            min-height: 50px;
            background: var(--ai-primaryGradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
            color: white;
            display: flex;
            gap: 10px;
            align-items: center;
            cursor: move;
            user-select: none;
            flex-wrap: wrap;
            font-weight: 600;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-header-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
            position: relative;
        }
        .tm-theme-btn {
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            width: 28px;
            height: 28px;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            transition: background 0.2s;
        }
        .tm-theme-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .tm-theme-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: var(--ai-bg, white);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            box-shadow: var(--ai-shadowLg, 0 2px 8px rgba(0,0,0,0.1));
            padding: 5px;
            display: none;
            z-index: 1000;
            min-width: 150px;
        }
        .tm-theme-dropdown.tm-show {
            display: block;
        }
        .tm-theme-item {
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: var(--ai-borderRadius, 4px);
            color: var(--ai-text, #333);
            font-size: 13px;
        }
        .tm-theme-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-theme-preview {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.1);
        }
        .tm-tabs {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            flex: 1;
        }
        .tm-tab {
            background: transparent;
            border: none;
            color: inherit;
            padding: 8px 12px;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            transition: var(--ai-transition, all 0.2s ease);
            font-family: inherit;
            font-size: var(--ai-fontSize, 14px);
            font-weight: 500;
            opacity: 0.8;
        }
        .tm-tab:hover {
            opacity: 1;
            background: rgba(255,255,255,0.1);
        }
        .tm-tab.tm-active {
            opacity: 1;
            background: rgba(255,255,255,0.2);
            font-weight: 600;
        }
        .tm-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
        }
        .tm-sidebar-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: var(--ai-bg, white);
        }
        .tm-tab-content {
            display: none;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        .tm-tab-content.tm-active {
            display: flex;
        }
        .tm-messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            background: var(--ai-bg, white);
        }
        .tm-message {
            margin-bottom: 25px;
            padding: 10px;
            border-radius: var(--ai-borderRadius, 8px);
            max-width: 80%;
            width: fit-content;
            text-align: left;
            position: relative;
            color: var(--ai-text, #333);
            border: var(--ai-borderWidth, 1px) solid transparent;
        }
        .tm-message.tm-user {
            background: var(--ai-userMsgBg, #667eea);
            color: var(--ai-userMsgText, white);
            align-self: flex-end;
            border-color: transparent;
        }
        .tm-message.tm-ai {
            background: var(--ai-aiMsgBg, #f0f0f0);
            color: var(--ai-aiMsgText, #333);
            align-self: flex-start;
            border-color: var(--ai-border, #ddd);
        }
        .tm-message:hover .tm-message-actions {
            opacity: 1;
        }
        .tm-message.tm-user {
            background: var(--ai-userMsgBg, #667eea);
            color: var(--ai-userMsgText, white);
            align-self: flex-end;
        }
        .tm-message.tm-ai {
            background: var(--ai-aiMsgBg, #f0f0f0);
            color: var(--ai-aiMsgText, #333);
            align-self: flex-start;
        }
        .tm-message-actions {
            opacity: 0;
            position: absolute;
            bottom: -20px;
            display: flex;
            gap: 5px;
            transition: opacity 0.2s;
        }
        .tm-message.tm-user .tm-message-actions {
            right: 0;
        }
        .tm-message.tm-ai .tm-message-actions {
            left: 0;
        }
        .tm-message-action-btn {
            background: var(--ai-bg, rgba(255,255,255,0.95));
            border: 1px solid var(--ai-border, #ddd);
            cursor: pointer;
            font-size: 12px;
            padding: 4px 8px;
            border-radius: var(--ai-btnRadius, 3px);
            transition: var(--ai-transition, all 0.2s ease);
            color: var(--ai-textSecondary, #666);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .tm-message-action-btn:hover {
            background: var(--ai-hover, #f5f5f5);
            color: var(--ai-primary, #667eea);
            transform: scale(1.05);
        }
        #tm-ai-chat-sidebar .tm-message pre {
            background: #282c34;
            padding: 12px;
            border-radius: var(--ai-borderRadius, 6px);
            overflow-x: auto;
            margin: 8px 0;
        }
        #tm-ai-chat-sidebar .tm-message code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
        }
        #tm-ai-chat-sidebar .tm-message pre code {
            background: none;
            padding: 0;
        }
        #tm-ai-chat-sidebar .tm-message:not(pre) > code {
            background: var(--ai-hover, rgba(0,0,0,0.1));
            padding: 2px 6px;
            border-radius: var(--ai-btnRadius, 3px);
        }
        #tm-ai-chat-sidebar .tm-message p {
            margin: 8px 0;
        }
        #tm-ai-chat-sidebar .tm-message p:first-child {
            margin-top: 0;
        }
        #tm-ai-chat-sidebar .tm-message p:last-child {
            margin-bottom: 0;
        }
        #tm-ai-chat-sidebar .tm-message ul, #tm-ai-chat-sidebar .tm-message ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        #tm-ai-chat-sidebar .tm-message blockquote {
            border-left: 3px solid var(--ai-primary, #667eea);
            padding-left: 12px;
            margin: 8px 0;
            color: var(--ai-textSecondary, #666);
        }
        #tm-ai-chat-sidebar .tm-message table {
            border-collapse: collapse;
            margin: 8px 0;
            width: 100%;
        }
        #tm-ai-chat-sidebar .tm-message th, #tm-ai-chat-sidebar .tm-message td {
            border: 1px solid var(--ai-border, #ddd);
            padding: 8px;
            text-align: left;
        }
        #tm-ai-chat-sidebar .tm-message th {
            background: var(--ai-bgSecondary, #f5f5f5);
            font-weight: bold;
        }
        .tm-thinking-section {
            margin: 8px 0;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            overflow: hidden;
        }
        .tm-thinking-header {
            background: var(--ai-bgSecondary, #f5f5f5);
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
            color: var(--ai-text, #333);
        }
        .tm-thinking-header:hover {
            background: var(--ai-hover, #e8e8e8);
        }
        .tm-thinking-toggle {
            font-size: 12px;
            transition: transform 0.2s;
        }
        .tm-thinking-toggle.tm-collapsed {
            transform: rotate(-90deg);
        }
        .tm-thinking-content {
            padding: 12px;
            background: var(--ai-bgSecondary, #fafafa);
            border-top: 1px solid var(--ai-border, #ddd);
            max-height: 300px;
            overflow-y: auto;
            color: var(--ai-text, #333);
        }
        .tm-thinking-content.tm-collapsed {
            display: none;
        }
        .tm-model-selector {
            padding: 10px var(--ai-spacing, 15px);
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            position: relative;
            background: var(--ai-bg, white);
            transition: var(--ai-transition, all 0.2s ease);
        }
        #tm-model-display-btn {
            background: none !important;
            border: none !important;
            color: var(--ai-primary, #667eea) !important;
            font-size: var(--ai-fontSize, 14px) !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
            padding: 5px 0 !important;
            font-weight: 600 !important;
            font-family: inherit !important;
            box-shadow: none !important;
            outline: none !important;
        }
        #tm-model-display-btn:hover {
            opacity: 0.8;
        }
        #tm-model-display-btn .tm-arrow {
            font-size: 10px;
            transition: transform 0.2s;
        }
        #tm-model-display-btn.tm-open .tm-arrow {
            transform: rotate(180deg);
        }
        .tm-model-dropdown {
            position: absolute;
            top: 100%;
            left: var(--ai-spacing, 15px);
            right: var(--ai-spacing, 15px);
            background: var(--ai-bg, white);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            box-shadow: var(--ai-shadowLg, 0 2px 8px rgba(0,0,0,0.1));
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
            margin-top: 5px;
        }
        .tm-model-dropdown-item {
            padding: 10px var(--ai-spacing, 15px);
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #f0f0f0);
            color: var(--ai-text, #333);
            font-size: var(--ai-fontSize, 14px);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-model-dropdown-item:last-child {
            border-bottom: none;
        }
        .tm-model-dropdown-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-model-dropdown-item.tm-selected {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .tm-input-area {
            padding: var(--ai-spacing, 15px);
            border-top: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            position: relative;
            background: var(--ai-bg, white);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-input-wrapper {
            position: relative;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            resize: vertical;
            overflow: hidden;
            min-height: 80px;
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .tm-input-wrapper:focus-within {
            border-color: var(--ai-primary, #667eea);
            box-shadow: 0 0 0 2px var(--ai-shadow, rgba(102, 126, 234, 0.1));
        }
        .tm-prompt-icon-top {
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 4px;
            align-self: flex-start;
            line-height: 1;
            border-radius: 4px;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .tm-prompt-icon-top:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .tm-prompt-icon-top.tm-selected {
            background: rgba(102, 126, 234, 0.2);
        }
        #tm-user-input {
            flex: 1;
            width: 100%;
            border: none;
            outline: none;
            box-shadow: none;
            resize: none;
            font-family: inherit;
            min-height: 40px;
            padding: 0;
            overflow-y: auto;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        #tm-send-btn {
            margin-top: 10px;
        }
        .tm-prompt-dropdown {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background: var(--ai-bg, white);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            box-shadow: var(--ai-shadowLg, 0 -2px 8px rgba(0,0,0,0.1));
            max-height: 300px;
            overflow-y: auto;
            z-index: 100;
            margin-bottom: 8px;
        }
        .tm-prompt-dropdown-item {
            padding: 10px var(--ai-spacing, 15px);
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #f0f0f0);
            color: var(--ai-text, #333);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-prompt-dropdown-item:last-child {
            border-bottom: none;
        }
        .tm-prompt-dropdown-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-prompt-dropdown-item .tm-prompt-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: var(--ai-fontSize, 14px);
        }
        .tm-prompt-dropdown-item .tm-prompt-preview {
            font-size: 12px;
            color: var(--ai-textSecondary, #999);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tm-params-panel {
            position: absolute;
            bottom: 100%;
            left: 0;
            right: 0;
            background: var(--ai-bg, white);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            box-shadow: var(--ai-shadowLg, 0 -2px 8px rgba(0,0,0,0.1));
            padding: var(--ai-spacing, 15px);
            z-index: 100;
            margin-bottom: 8px;
        }
        .tm-params-item {
            margin-bottom: 10px;
        }
        .tm-params-item:last-child {
            margin-bottom: 0;
        }
        .tm-params-item label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            font-weight: 500;
            color: var(--ai-text, #333);
        }
        .tm-params-item input {
            width: 100%;
            padding: 6px;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 4px;
            font-size: 13px;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        #tm-send-btn {
            padding: 10px 24px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: var(--ai-transition, all 0.2s ease);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #tm-send-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        #tm-send-btn:active {
            transform: translateY(0);
        }
        .tm-chat-container {
            display: flex;
            height: 100%;
        }
        .tm-conversations-sidebar {
            width: 200px;
            border-right: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            flex-direction: column;
            background: var(--ai-bgSecondary, #fafafa);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-conversations-toolbar {
            padding: 10px;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            gap: 5px;
        }
        .tm-conversations-toolbar button {
            flex: 1;
            padding: 6px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
            color: white;
            font-family: inherit;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-new-conv-btn {
            background: #2da44e;
        }
        .tm-batch-delete-conv-btn {
            background: #e74c3c;
        }
        .tm-batch-delete-conv-btn:hover {
            opacity: 0.9;
        }
        .tm-conversations-list {
            flex: 1;
            overflow-y: auto;
        }
        .tm-conversation-item {
            padding: 10px 12px;
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            transition: background 0.2s;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            color: var(--ai-text, #333);
        }
        .tm-conversation-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            flex-shrink: 0;
        }
        .tm-conversation-item .tm-conv-title {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .tm-conversation-item .tm-conv-actions {
            display: none;
            gap: 4px;
            flex-shrink: 0;
        }
        .tm-conversation-item:hover .tm-conv-actions {
            display: flex;
        }
        .tm-conversation-item .tm-conv-action-btn {
            padding: 2px 6px;
            background: rgba(0,0,0,0.1);
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .tm-conversation-item .tm-conv-action-btn:hover {
            background: rgba(0,0,0,0.2);
        }
        .tm-conversation-item:hover {
            background: var(--ai-hover, #f0f0f0);
        }
        .tm-conversation-item.tm-active {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .tm-conversation-item.tm-active .tm-conv-action-btn {
            background: rgba(255,255,255,0.2);
        }
        .tm-conversation-item.tm-active .tm-conv-action-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .tm-conversation-item.tm-editing .tm-conv-title {
            display: none;
        }
        .tm-conversation-item .tm-conv-rename-input {
            display: none;
            flex: 1;
            padding: 4px;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 3px;
            font-size: 12px;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .tm-conversation-item.tm-editing .tm-conv-rename-input {
            display: block;
        }
        .tm-chat-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: var(--ai-bg, white);
        }
        .tm-providers-container {
            display: flex;
            height: 100%;
            background: var(--ai-bg, white);
        }
        .tm-providers-sidebar {
            width: 200px;
            border-right: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            flex-direction: column;
            background: var(--ai-bgSecondary, #fafafa);
        }
        #tm-add-provider-btn {
            margin: 15px;
            padding: 10px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-weight: 600;
            transition: var(--ai-transition, all 0.2s ease);
        }
        #tm-add-provider-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .tm-providers-list {
            flex: 1;
            overflow-y: auto;
        }
        .tm-provider-sidebar-item {
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--ai-text, #333);
        }
        .tm-provider-sidebar-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-provider-sidebar-item.tm-active {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .tm-provider-sidebar-item .tm-delete-icon {
            opacity: 0;
            cursor: pointer;
            font-size: 16px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: opacity 0.2s;
        }
        .tm-provider-sidebar-item:hover .tm-delete-icon {
            opacity: 1;
        }
        .tm-provider-sidebar-item .tm-delete-icon:hover {
            background: rgba(231, 76, 60, 0.2);
        }
        .tm-provider-sidebar-item.tm-active .tm-delete-icon:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .tm-provider-detail {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            color: var(--ai-text, #333);
        }
        .tm-empty-state {
            text-align: center;
            color: var(--ai-textSecondary, #999);
            padding: 50px 20px;
        }
        .tm-provider-form {
            max-width: 600px;
        }
        .tm-provider-form h3 {
            margin: 0 0 20px 0;
        }
        .tm-form-group {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .tm-form-group label {
            min-width: 100px;
            font-weight: bold;
        }
        .tm-form-group input {
            flex: 1;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .tm-final-url-display {
            margin-left: 115px;
            padding: 8px;
            background: var(--ai-bgSecondary, #f0f0f0);
            border-radius: 4px;
            font-size: 12px;
            color: var(--ai-textSecondary, #666);
            word-break: break-all;
        }
        .tm-final-url-display strong {
            color: var(--ai-text, #333);
        }
        .tm-form-group.tm-password-group {
            position: relative;
        }
        .tm-form-group.tm-password-group input {
            padding-right: 40px;
        }
        .tm-form-group .tm-toggle-password {
            position: absolute;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            user-select: none;
        }
        .tm-form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            margin-left: 115px;
        }
        .tm-form-actions button {
            padding: 10px 20px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
        }
        .tm-save-provider-btn {
            background: var(--ai-primary, #667eea);
        }
        .tm-models-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: calc(var(--ai-borderWidth, 1px) * 2) solid var(--ai-border, #eee);
        }
        .tm-models-section h3 {
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--ai-text, #333);
        }
        .tm-fetch-models-btn, .tm-refresh-models-btn {
            padding: 6px 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-fetch-models-btn:hover, .tm-refresh-models-btn:hover {
            opacity: 0.9;
        }
        .tm-refresh-models-btn {
            background: #2ecc71;
        }
        .tm-available-models-section {
            margin-top: 20px;
            padding: 15px;
            background: var(--ai-bgSecondary, #f9f9f9);
            border-radius: var(--ai-borderRadius, 8px);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
        }
        .tm-available-models-section h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .tm-model-search {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .tm-available-models-list {
            max-height: 300px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .tm-available-model-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            background: var(--ai-bg, white);
            border-radius: var(--ai-borderRadius, 4px);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
        }
        .tm-available-model-item .tm-model-name {
            flex: 1;
            font-size: 13px;
        }
        .tm-available-model-item .tm-add-model-icon {
            cursor: pointer;
            color: var(--ai-primary, #667eea);
            font-size: 18px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: background 0.2s;
        }
        .tm-available-model-item .tm-add-model-icon:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .tm-loading-models {
            text-align: center;
            padding: 20px;
            color: var(--ai-textSecondary, #999);
        }
        .tm-models-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tm-model-item {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 10px;
            border-radius: var(--ai-borderRadius, 4px);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .tm-model-item input {
            flex: 1;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .tm-model-item button {
            padding: 6px 12px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
            color: white;
        }
        .tm-save-model-btn {
            background: var(--ai-primary, #667eea);
        }
        .tm-delete-model-btn {
            background: #e74c3c;
        }
        .tm-add-model-btn {
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .tm-prompts-toolbar {
            padding: var(--ai-spacing, 15px);
            display: flex;
            gap: 10px;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            background: var(--ai-bg, white);
        }
        .tm-prompts-toolbar button {
            padding: 8px 16px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
            font-weight: 600;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-prompts-toolbar button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        #tm-add-prompt {
            background: var(--ai-primary, #667eea);
        }
        #tm-batch-delete-prompt {
            background: #e74c3c;
        }
        .tm-prompts-list {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: var(--ai-bg, white);
        }
        .tm-prompts-list h4 {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tm-help-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--ai-textSecondary, #999);
            color: var(--ai-bg, white);
            text-align: center;
            font-size: 12px;
            line-height: 16px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.2s;
        }
        .tm-help-icon:hover {
            background: var(--ai-primary, #667eea);
        }
        .tm-prompt-item {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 15px;
            margin-bottom: 10px;
            border-radius: var(--ai-borderRadius, 8px);
            position: relative;
            color: var(--ai-text, #333);
        }
        .tm-prompt-item.tm-editing {
            background: var(--ai-bg, #fff);
            border: 2px solid var(--ai-primary, #667eea);
        }
        .tm-prompt-item input[type="checkbox"] {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        .tm-prompt-item .tm-prompt-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            padding-left: 30px;
        }
        .tm-prompt-item .tm-prompt-title {
            flex: 1;
            font-weight: bold;
            font-size: 16px;
        }
        .tm-prompt-item .tm-prompt-actions {
            display: flex;
            gap: 5px;
        }
        .tm-prompt-item .tm-prompt-actions button {
            padding: 4px 10px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
        }
        .tm-prompt-item .tm-view-btn {
            background: #3498db;
            color: white;
        }
        .tm-prompt-item .tm-edit-btn {
            background: #f39c12;
            color: white;
        }
        .tm-prompt-item .tm-delete-btn {
            background: #e74c3c;
            color: white;
        }
        .tm-prompt-item .tm-prompt-content {
            padding-left: 30px;
            color: var(--ai-textSecondary, #666);
            white-space: pre-wrap;
            word-break: break-word;
        }
        .tm-prompt-item .tm-prompt-form {
            padding-left: 30px;
        }
        .tm-prompt-item .tm-prompt-form input,
        .tm-prompt-item .tm-prompt-form textarea {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            font-family: inherit;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .tm-prompt-item .tm-prompt-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        .tm-prompt-item .tm-prompt-form .tm-form-actions {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .tm-prompt-item .tm-prompt-form .tm-form-actions button {
            padding: 6px 16px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
        }
        .tm-prompt-item .tm-save-prompt-btn {
            background: var(--ai-primary, #667eea);
        }
        .tm-prompt-item .tm-cancel-btn {
            background: #95a5a6;
        }
        
        .tm-system-config-container {
            padding: 20px;
            color: var(--ai-text, #333);
        }
        .tm-system-config-container h3 {
            margin: 0 0 20px 0;
        }
        .tm-config-section {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 20px;
            border-radius: var(--ai-borderRadius, 8px);
            margin-bottom: 20px;
        }
        .tm-config-section h4 {
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .tm-config-select {
            width: 100%;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
            font-size: 14px;
        }
        .tm-save-btn {
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-weight: 600;
        }
        .tm-save-btn:hover {
            opacity: 0.9;
        }
        
        /* Scrollbar Styling */
        #tm-ai-chat-sidebar ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        #tm-ai-chat-sidebar ::-webkit-scrollbar-track {
            background: transparent;
        }
        #tm-ai-chat-sidebar ::-webkit-scrollbar-thumb {
            background: var(--ai-border, rgba(0, 0, 0, 0.1));
            border-radius: 3px;
        }
        #tm-ai-chat-sidebar ::-webkit-scrollbar-thumb:hover {
            background: var(--ai-textSecondary, rgba(0, 0, 0, 0.2));
        }

        /* 翻译页面样式 */
        .tm-translate-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 16px;
            background: var(--ai-bg, white);
            gap: 16px;
            overflow-y: auto;
        }
        .tm-translate-card {
            background: var(--ai-bgSecondary, #f9f9f9);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 6px);
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            position: relative;
        }
        .tm-translate-card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--ai-text, #333);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }
        .tm-translate-card-title i {
            color: var(--ai-primary, #667eea);
        }
        .tm-translate-current-settings {
            font-size: 12px;
            color: var(--ai-textSecondary, #666);
            margin-top: -8px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .tm-translate-current-settings .tm-separator {
            color: var(--ai-border, #ddd);
        }
        .tm-translate-dropdown {
            position: absolute;
            top: 45px;
            right: 16px;
            background: var(--ai-bg, white);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            box-shadow: var(--ai-shadowLg, 0 2px 8px rgba(0,0,0,0.1));
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
            min-width: 200px;
        }
        .tm-translate-dropdown-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #f0f0f0);
            color: var(--ai-text, #333);
            font-size: 13px;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .tm-translate-dropdown-item:last-child {
            border-bottom: none;
        }
        .tm-translate-dropdown-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-translate-dropdown-item.tm-selected {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .tm-translate-text-area-container {
            position: relative;
            margin-top: 8px;
        }
        .tm-translate-text-area-container textarea {
            width: 100%;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 6px);
            padding: 12px;
            font-size: 14px;
            resize: vertical;
            min-height: 120px;
            outline: none;
            transition: border-color 0.2s;
            font-family: inherit;
            box-sizing: border-box;
        }
        .tm-translate-text-area-container textarea:focus {
            border-color: var(--ai-primary, #667eea);
        }
        .tm-translate-text-area-actions {
            display: flex;
            gap: 8px;
        }
        .tm-translate-action-btn {
            background: var(--ai-bgSecondary, rgba(255,255,255,0.8));
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: 4px;
            color: var(--ai-textSecondary, #666);
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        .tm-translate-action-btn:hover {
            background: var(--ai-hover, #f5f5f5);
            color: var(--ai-primary, #667eea);
            border-color: var(--ai-primary, #667eea);
        }
        .tm-translate-char-count {
            font-size: 12px;
            color: var(--ai-textSecondary, #999);
            text-align: right;
            margin-top: 4px;
        }
        .tm-translate-main-btn {
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: var(--ai-borderRadius, 6px);
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: opacity 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            box-sizing: border-box;
        }
        .tm-translate-main-btn:hover {
            opacity: 0.9;
        }
        .tm-translate-main-btn:active {
            opacity: 1;
        }
        .tm-translate-main-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }

        /* Language Selector Styles */
        .tm-translate-language-selector {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid var(--ai-border, #eee);
        }
        .tm-language-btn-container {
            position: relative;
            flex: 1;
        }
        .tm-language-btn {
            width: 100%;
            padding: 8px 12px;
            background: var(--ai-bg, white);
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 4px;
            cursor: pointer;
            text-align: left;
            font-size: 13px;
            color: var(--ai-text, #333);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.2s;
            box-sizing: border-box;
        }
        .tm-language-btn:hover {
            border-color: var(--ai-primary, #667eea);
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-language-btn::after {
            content: '▼';
            font-size: 10px;
            opacity: 0.6;
        }
        .tm-swap-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            color: var(--ai-textSecondary, #666);
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s;
            position: relative;
            z-index: 102;
        }
        .tm-swap-btn:hover {
            background: var(--ai-hover, #f5f5f5);
            color: var(--ai-primary, #667eea);
            transform: rotate(180deg);
        }
        .tm-language-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 250px;
            background: var(--ai-bg, white);
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 101;
            margin-top: 4px;
            display: flex;
            flex-direction: column;
            box-sizing: border-box;
        }
        .tm-language-search {
            padding: 8px;
            border: none;
            border-bottom: 1px solid var(--ai-border, #eee);
            width: 100%;
            font-size: 12px;
            outline: none;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
            box-sizing: border-box;
        }
        .tm-language-list {
            overflow-y: auto;
            flex: 1;
        }
        .tm-language-item {
            padding: 8px 12px;
            cursor: pointer;
            font-size: 13px;
            color: var(--ai-text, #333);
            transition: background 0.2s;
        }
        .tm-language-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .tm-language-item.tm-selected {
            background: var(--ai-primary, #667eea);
            color: white;
        }

        /* 提示词帮助弹窗样式 */
        .tm-prompt-help-modal {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1001; /* 比侧边栏内容高 */
        }
        .tm-prompt-help-modal .tm-modal-content {
            background: var(--ai-bg, white);
            padding: 25px;
            border-radius: var(--ai-borderRadius, 8px);
            width: 90%;
            max-width: 500px;
            position: relative;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            color: var(--ai-text, #333);
        }
        .tm-prompt-help-modal .tm-modal-close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            color: var(--ai-textSecondary, #999);
        }
        .tm-prompt-help-modal .tm-modal-close-btn:hover {
            color: var(--ai-text, #333);
        }
        .tm-prompt-help-modal h3 {
            margin: 0 0 15px 0;
            color: var(--ai-text, #333);
        }
        .tm-prompt-help-modal p {
            margin: 0 0 10px 0;
            line-height: 1.6;
        }
        .tm-prompt-help-modal ul {
            margin: 0 0 15px 0;
            padding-left: 20px;
        }
        .tm-prompt-help-modal li {
            margin-bottom: 8px;
        }
        .tm-prompt-help-modal code {
            background: var(--ai-hover, rgba(0,0,0,0.1));
            padding: 2px 6px;
            border-radius: var(--ai-btnRadius, 3px);
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        }
        .tm-prompt-help-modal pre {
            background: var(--ai-bgSecondary, #f5f5f5);
            padding: 12px;
            border-radius: var(--ai-borderRadius, 6px);
            overflow-x: auto;
            margin-top: 10px;
        }
        .tm-prompt-help-modal pre code {
            background: none;
            padding: 0;
        }
    `;
    style.textContent += `
        /* 模式指示器样式 */
        .tm-mode-indicator {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 12px;
            border-radius: 12px;
            font-size: 12px;
            margin-bottom: 5px;
            white-space: nowrap;
            z-index: 101;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            pointer-events: none; /* 避免遮挡下方元素 */
        }
        .tm-mode-indicator.tm-visible {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
        }
    `;
    document.head.appendChild(style);
};