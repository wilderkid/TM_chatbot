export const addStyles = () => {
    // 添加highlight.js样式
    const highlightStyle = document.createElement('link');
    highlightStyle.rel = 'stylesheet';
    highlightStyle.href = 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/github-dark.min.css';
    document.head.appendChild(highlightStyle);

    const style = document.createElement('style');
    style.textContent = `
        #ai-chat-trigger {
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
        #ai-chat-trigger:hover {
            transform: scale(1.1);
        }
        #ai-chat-sidebar {
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
        #ai-chat-sidebar.open {
            display: flex;
        }
        #ai-chat-sidebar.resizing, #ai-chat-sidebar.dragging {
            transition: none;
        }
        .resize-handle-left, .resize-handle-right {
            position: absolute;
            top: 0;
            width: 5px;
            height: 100%;
            cursor: ew-resize;
            z-index: 10;
        }
        .resize-handle-left {
            left: 0;
        }
        .resize-handle-right {
            right: 0;
        }
        .resize-handle-top, .resize-handle-bottom {
            position: absolute;
            left: 0;
            width: 100%;
            height: 5px;
            cursor: ns-resize;
            z-index: 10;
        }
        .resize-handle-top {
            top: 0;
        }
        .resize-handle-bottom {
            bottom: 0;
        }
        .resize-handle-corner-tl, .resize-handle-corner-tr,
        .resize-handle-corner-bl, .resize-handle-corner-br {
            position: absolute;
            width: 10px;
            height: 10px;
            z-index: 11;
        }
        .resize-handle-corner-tl {
            top: 0;
            left: 0;
            cursor: nwse-resize;
        }
        .resize-handle-corner-tr {
            top: 0;
            right: 0;
            cursor: nesw-resize;
        }
        .resize-handle-corner-bl {
            bottom: 0;
            left: 0;
            cursor: nesw-resize;
        }
        .resize-handle-corner-br {
            bottom: 0;
            right: 0;
            cursor: nwse-resize;
        }
        .sidebar-header {
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
        .header-controls {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: auto;
            position: relative;
        }
        .theme-btn {
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
        .theme-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .theme-dropdown {
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
        .theme-dropdown.show {
            display: block;
        }
        .theme-item {
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            border-radius: var(--ai-borderRadius, 4px);
            color: var(--ai-text, #333);
            font-size: 13px;
        }
        .theme-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .theme-preview {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid rgba(0,0,0,0.1);
        }
        .tabs {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            flex: 1;
        }
        .tab {
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
        .tab:hover {
            opacity: 1;
            background: rgba(255,255,255,0.1);
        }
        .tab.active {
            opacity: 1;
            background: rgba(255,255,255,0.2);
            font-weight: 600;
        }
        .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
            padding: 0 5px;
        }
        .sidebar-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            background: var(--ai-bg, white);
        }
        .tab-content {
            display: none;
            flex: 1;
            flex-direction: column;
            overflow: hidden;
        }
        .tab-content.active {
            display: flex;
        }
        .messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            background: var(--ai-bg, white);
        }
        .message {
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
        .message.user {
            background: var(--ai-userMsgBg, #667eea);
            color: var(--ai-userMsgText, white);
            align-self: flex-end;
            border-color: transparent;
        }
        .message.ai {
            background: var(--ai-aiMsgBg, #f0f0f0);
            color: var(--ai-aiMsgText, #333);
            align-self: flex-start;
            border-color: var(--ai-border, #ddd);
        }
        .message:hover .message-actions {
            opacity: 1;
        }
        .message.user {
            background: var(--ai-userMsgBg, #667eea);
            color: var(--ai-userMsgText, white);
            align-self: flex-end;
        }
        .message.ai {
            background: var(--ai-aiMsgBg, #f0f0f0);
            color: var(--ai-aiMsgText, #333);
            align-self: flex-start;
        }
        .message-actions {
            opacity: 0;
            position: absolute;
            bottom: -20px;
            display: flex;
            gap: 5px;
            transition: opacity 0.2s;
        }
        .message.user .message-actions {
            right: 0;
        }
        .message.ai .message-actions {
            left: 0;
        }
        .message-action-btn {
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
        .message-action-btn:hover {
            background: var(--ai-hover, #f5f5f5);
            color: var(--ai-primary, #667eea);
            transform: scale(1.05);
        }
        #ai-chat-sidebar .message pre {
            background: #282c34;
            padding: 12px;
            border-radius: var(--ai-borderRadius, 6px);
            overflow-x: auto;
            margin: 8px 0;
        }
        #ai-chat-sidebar .message code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 13px;
        }
        #ai-chat-sidebar .message pre code {
            background: none;
            padding: 0;
        }
        #ai-chat-sidebar .message :not(pre) > code {
            background: var(--ai-hover, rgba(0,0,0,0.1));
            padding: 2px 6px;
            border-radius: var(--ai-btnRadius, 3px);
        }
        #ai-chat-sidebar .message p {
            margin: 8px 0;
        }
        #ai-chat-sidebar .message p:first-child {
            margin-top: 0;
        }
        #ai-chat-sidebar .message p:last-child {
            margin-bottom: 0;
        }
        #ai-chat-sidebar .message ul, #ai-chat-sidebar .message ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        #ai-chat-sidebar .message blockquote {
            border-left: 3px solid var(--ai-primary, #667eea);
            padding-left: 12px;
            margin: 8px 0;
            color: var(--ai-textSecondary, #666);
        }
        #ai-chat-sidebar .message table {
            border-collapse: collapse;
            margin: 8px 0;
            width: 100%;
        }
        #ai-chat-sidebar .message th, #ai-chat-sidebar .message td {
            border: 1px solid var(--ai-border, #ddd);
            padding: 8px;
            text-align: left;
        }
        #ai-chat-sidebar .message th {
            background: var(--ai-bgSecondary, #f5f5f5);
            font-weight: bold;
        }
        .thinking-section {
            margin: 8px 0;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            overflow: hidden;
        }
        .thinking-header {
            background: var(--ai-bgSecondary, #f5f5f5);
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            user-select: none;
            color: var(--ai-text, #333);
        }
        .thinking-header:hover {
            background: var(--ai-hover, #e8e8e8);
        }
        .thinking-toggle {
            font-size: 12px;
            transition: transform 0.2s;
        }
        .thinking-toggle.collapsed {
            transform: rotate(-90deg);
        }
        .thinking-content {
            padding: 12px;
            background: var(--ai-bgSecondary, #fafafa);
            border-top: 1px solid var(--ai-border, #ddd);
            max-height: 300px;
            overflow-y: auto;
            color: var(--ai-text, #333);
        }
        .thinking-content.collapsed {
            display: none;
        }
        .model-selector {
            padding: 10px var(--ai-spacing, 15px);
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            position: relative;
            background: var(--ai-bg, white);
            transition: var(--ai-transition, all 0.2s ease);
        }
        #model-display-btn {
            background: none;
            border: none;
            color: var(--ai-primary, #667eea);
            font-size: var(--ai-fontSize, 14px);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 0;
            font-weight: 600;
            font-family: inherit;
        }
        #model-display-btn:hover {
            opacity: 0.8;
        }
        #model-display-btn .arrow {
            font-size: 10px;
            transition: transform 0.2s;
        }
        #model-display-btn.open .arrow {
            transform: rotate(180deg);
        }
        .model-dropdown {
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
        .model-dropdown-item {
            padding: 10px var(--ai-spacing, 15px);
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #f0f0f0);
            color: var(--ai-text, #333);
            font-size: var(--ai-fontSize, 14px);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .model-dropdown-item:last-child {
            border-bottom: none;
        }
        .model-dropdown-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .model-dropdown-item.selected {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .input-area {
            padding: var(--ai-spacing, 15px);
            border-top: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            position: relative;
            background: var(--ai-bg, white);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .input-wrapper {
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
        .input-wrapper:focus-within {
            border-color: var(--ai-primary, #667eea);
            box-shadow: 0 0 0 2px var(--ai-shadow, rgba(102, 126, 234, 0.1));
        }
        .prompt-icon-top {
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
        .prompt-icon-top:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .prompt-icon-top.selected {
            background: rgba(102, 126, 234, 0.2);
        }
        #user-input {
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
        #send-btn {
            margin-top: 10px;
        }
        .prompt-dropdown {
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
        .prompt-dropdown-item {
            padding: 10px var(--ai-spacing, 15px);
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #f0f0f0);
            color: var(--ai-text, #333);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .prompt-dropdown-item:last-child {
            border-bottom: none;
        }
        .prompt-dropdown-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .prompt-dropdown-item .prompt-title {
            font-weight: 600;
            margin-bottom: 4px;
            font-size: var(--ai-fontSize, 14px);
        }
        .prompt-dropdown-item .prompt-preview {
            font-size: 12px;
            color: var(--ai-textSecondary, #999);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .params-panel {
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
        .params-item {
            margin-bottom: 10px;
        }
        .params-item:last-child {
            margin-bottom: 0;
        }
        .params-item label {
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            font-weight: 500;
            color: var(--ai-text, #333);
        }
        .params-item input {
            width: 100%;
            padding: 6px;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 4px;
            font-size: 13px;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        #send-btn {
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
        #send-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        #send-btn:active {
            transform: translateY(0);
        }
        .chat-container {
            display: flex;
            height: 100%;
        }
        .conversations-sidebar {
            width: 200px;
            border-right: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            flex-direction: column;
            background: var(--ai-bgSecondary, #fafafa);
            transition: var(--ai-transition, all 0.2s ease);
        }
        .conversations-toolbar {
            padding: 10px;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            gap: 5px;
        }
        .conversations-toolbar button {
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
        .new-conv-btn {
            background: #2ecc71;
        }
        .batch-delete-conv-btn {
            background: #e74c3c;
        }
        .batch-delete-conv-btn:hover {
            opacity: 0.9;
        }
        .conversations-list {
            flex: 1;
            overflow-y: auto;
        }
        .conversation-item {
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
        .conversation-item input[type="checkbox"] {
            width: 16px;
            height: 16px;
            cursor: pointer;
            flex-shrink: 0;
        }
        .conversation-item .conv-title {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .conversation-item .conv-actions {
            display: none;
            gap: 4px;
            flex-shrink: 0;
        }
        .conversation-item:hover .conv-actions {
            display: flex;
        }
        .conversation-item .conv-action-btn {
            padding: 2px 6px;
            background: rgba(0,0,0,0.1);
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        .conversation-item .conv-action-btn:hover {
            background: rgba(0,0,0,0.2);
        }
        .conversation-item:hover {
            background: var(--ai-hover, #f0f0f0);
        }
        .conversation-item.active {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .conversation-item.active .conv-action-btn {
            background: rgba(255,255,255,0.2);
        }
        .conversation-item.active .conv-action-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        .conversation-item.editing .conv-title {
            display: none;
        }
        .conversation-item .conv-rename-input {
            display: none;
            flex: 1;
            padding: 4px;
            border: 1px solid var(--ai-border, #ddd);
            border-radius: 3px;
            font-size: 12px;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .conversation-item.editing .conv-rename-input {
            display: block;
        }
        .chat-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: var(--ai-bg, white);
        }
        .providers-container {
            display: flex;
            height: 100%;
            background: var(--ai-bg, white);
        }
        .providers-sidebar {
            width: 200px;
            border-right: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            display: flex;
            flex-direction: column;
            background: var(--ai-bgSecondary, #fafafa);
        }
        #add-provider-btn {
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
        #add-provider-btn:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        .providers-list {
            flex: 1;
            overflow-y: auto;
        }
        .provider-sidebar-item {
            padding: 12px 15px;
            cursor: pointer;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            transition: background 0.2s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: var(--ai-text, #333);
        }
        .provider-sidebar-item:hover {
            background: var(--ai-hover, #f5f5f5);
        }
        .provider-sidebar-item.active {
            background: var(--ai-primary, #667eea);
            color: white;
        }
        .provider-sidebar-item .delete-icon {
            opacity: 0;
            cursor: pointer;
            font-size: 16px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: opacity 0.2s;
        }
        .provider-sidebar-item:hover .delete-icon {
            opacity: 1;
        }
        .provider-sidebar-item .delete-icon:hover {
            background: rgba(231, 76, 60, 0.2);
        }
        .provider-sidebar-item.active .delete-icon:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        .provider-detail {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            color: var(--ai-text, #333);
        }
        .empty-state {
            text-align: center;
            color: var(--ai-textSecondary, #999);
            padding: 50px 20px;
        }
        .provider-form {
            max-width: 600px;
        }
        .provider-form h3 {
            margin: 0 0 20px 0;
        }
        .form-group {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .form-group label {
            min-width: 100px;
            font-weight: bold;
        }
        .form-group input {
            flex: 1;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .final-url-display {
            margin-left: 115px;
            padding: 8px;
            background: var(--ai-bgSecondary, #f0f0f0);
            border-radius: 4px;
            font-size: 12px;
            color: var(--ai-textSecondary, #666);
            word-break: break-all;
        }
        .final-url-display strong {
            color: var(--ai-text, #333);
        }
        .form-group.password-group {
            position: relative;
        }
        .form-group.password-group input {
            padding-right: 40px;
        }
        .form-group .toggle-password {
            position: absolute;
            right: 10px;
            cursor: pointer;
            font-size: 18px;
            user-select: none;
        }
        .form-actions {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            margin-left: 115px;
        }
        .form-actions button {
            padding: 10px 20px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
        }
        .save-provider-btn {
            background: var(--ai-primary, #667eea);
        }
        .models-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: calc(var(--ai-borderWidth, 1px) * 2) solid var(--ai-border, #eee);
        }
        .models-section h3 {
            margin: 0 0 15px 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--ai-text, #333);
        }
        .fetch-models-btn, .refresh-models-btn {
            padding: 6px 12px;
            background: #3498db;
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .fetch-models-btn:hover, .refresh-models-btn:hover {
            opacity: 0.9;
        }
        .refresh-models-btn {
            background: #2ecc71;
        }
        .available-models-section {
            margin-top: 20px;
            padding: 15px;
            background: var(--ai-bgSecondary, #f9f9f9);
            border-radius: var(--ai-borderRadius, 8px);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
        }
        .available-models-section h4 {
            margin: 0 0 10px 0;
            font-size: 14px;
        }
        .model-search {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .available-models-list {
            max-height: 300px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .available-model-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px;
            background: var(--ai-bg, white);
            border-radius: var(--ai-borderRadius, 4px);
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
        }
        .available-model-item .model-name {
            flex: 1;
            font-size: 13px;
        }
        .available-model-item .add-model-icon {
            cursor: pointer;
            color: var(--ai-primary, #667eea);
            font-size: 18px;
            padding: 2px 6px;
            border-radius: 3px;
            transition: background 0.2s;
        }
        .available-model-item .add-model-icon:hover {
            background: rgba(102, 126, 234, 0.1);
        }
        .loading-models {
            text-align: center;
            padding: 20px;
            color: var(--ai-textSecondary, #999);
        }
        .models-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .model-item {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 10px;
            border-radius: var(--ai-borderRadius, 4px);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .model-item input {
            flex: 1;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .model-item button {
            padding: 6px 12px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
            color: white;
        }
        .save-model-btn {
            background: var(--ai-primary, #667eea);
        }
        .delete-model-btn {
            background: #e74c3c;
        }
        .add-model-btn {
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .prompts-toolbar {
            padding: var(--ai-spacing, 15px);
            display: flex;
            gap: 10px;
            border-bottom: var(--ai-borderWidth, 1px) solid var(--ai-border, #eee);
            background: var(--ai-bg, white);
        }
        .prompts-toolbar button {
            padding: 8px 16px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
            font-weight: 600;
            transition: var(--ai-transition, all 0.2s ease);
        }
        .prompts-toolbar button:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        #add-prompt {
            background: var(--ai-primary, #667eea);
        }
        #batch-delete-prompt {
            background: #e74c3c;
        }
        .prompts-list {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: var(--ai-bg, white);
        }
        .prompt-item {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 15px;
            margin-bottom: 10px;
            border-radius: var(--ai-borderRadius, 8px);
            position: relative;
            color: var(--ai-text, #333);
        }
        .prompt-item.editing {
            background: var(--ai-bg, #fff);
            border: 2px solid var(--ai-primary, #667eea);
        }
        .prompt-item input[type="checkbox"] {
            position: absolute;
            top: 15px;
            left: 15px;
            width: 18px;
            height: 18px;
            cursor: pointer;
        }
        .prompt-item .prompt-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            padding-left: 30px;
        }
        .prompt-item .prompt-title {
            flex: 1;
            font-weight: bold;
            font-size: 16px;
        }
        .prompt-item .prompt-actions {
            display: flex;
            gap: 5px;
        }
        .prompt-item .prompt-actions button {
            padding: 4px 10px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-size: 12px;
        }
        .prompt-item .view-btn {
            background: #3498db;
            color: white;
        }
        .prompt-item .edit-btn {
            background: #f39c12;
            color: white;
        }
        .prompt-item .delete-btn {
            background: #e74c3c;
            color: white;
        }
        .prompt-item .prompt-content {
            padding-left: 30px;
            color: var(--ai-textSecondary, #666);
            white-space: pre-wrap;
            word-break: break-word;
        }
        .prompt-item .prompt-form {
            padding-left: 30px;
        }
        .prompt-item .prompt-form input,
        .prompt-item .prompt-form textarea {
            width: 100%;
            padding: 8px;
            margin: 5px 0;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            font-family: inherit;
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
        }
        .prompt-item .prompt-form textarea {
            min-height: 100px;
            resize: vertical;
        }
        .prompt-item .prompt-form .form-actions {
            margin-top: 10px;
            display: flex;
            gap: 10px;
        }
        .prompt-item .prompt-form .form-actions button {
            padding: 6px 16px;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            color: white;
        }
        .prompt-item .save-prompt-btn {
            background: var(--ai-primary, #667eea);
        }
        .prompt-item .cancel-btn {
            background: #95a5a6;
        }
        
        .system-config-container {
            padding: 20px;
            color: var(--ai-text, #333);
        }
        .system-config-container h3 {
            margin: 0 0 20px 0;
        }
        .config-section {
            background: var(--ai-bgSecondary, #f9f9f9);
            padding: 20px;
            border-radius: var(--ai-borderRadius, 8px);
            margin-bottom: 20px;
        }
        .config-section h4 {
            margin: 0 0 15px 0;
            font-size: 16px;
        }
        .config-select {
            width: 100%;
            padding: 8px;
            border: var(--ai-borderWidth, 1px) solid var(--ai-border, #ddd);
            border-radius: var(--ai-borderRadius, 4px);
            background: var(--ai-bg, white);
            color: var(--ai-text, #333);
            font-size: 14px;
        }
        .save-btn {
            margin-top: 15px;
            padding: 10px 20px;
            background: var(--ai-primary, #667eea);
            color: white;
            border: none;
            border-radius: var(--ai-btnRadius, 4px);
            cursor: pointer;
            font-weight: 600;
        }
        .save-btn:hover {
            opacity: 0.9;
        }
        
        /* Scrollbar Styling */
        #ai-chat-sidebar ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        #ai-chat-sidebar ::-webkit-scrollbar-track {
            background: transparent;
        }
        #ai-chat-sidebar ::-webkit-scrollbar-thumb {
            background: var(--ai-border, rgba(0, 0, 0, 0.1));
            border-radius: 3px;
        }
        #ai-chat-sidebar ::-webkit-scrollbar-thumb:hover {
            background: var(--ai-textSecondary, rgba(0, 0, 0, 0.2));
        }
    `;
    document.head.appendChild(style);
};