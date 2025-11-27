import { GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client';

// 配置管理
export const ConfigManager = {
    get: (key, defaultValue) => GM_getValue(key, defaultValue),
    set: (key, value) => GM_setValue(key, value),
    getProviders: () => GM_getValue('ai_providers', []),
    saveProviders: (providers) => GM_setValue('ai_providers', providers),
    getPrompts: () => {
        let prompts = GM_getValue('prompts', []);
        // Migration: Add type 'chat' to existing prompts if missing
        let hasChanges = false;
        prompts = prompts.map(p => {
            if (!p.type) {
                p.type = 'chat';
                hasChanges = true;
            }
            return p;
        });
        
        // Ensure default translation prompt exists if no translation prompts found
        const hasTranslate = prompts.some(p => p.type === 'translate');
        if (!hasTranslate) {
            prompts.push({
                title: '通用翻译',
                content: 'Translate the following text. Be accurate and natural.',
                type: 'translate'
            });
            hasChanges = true;
        }

        if (hasChanges) {
            GM_setValue('prompts', prompts);
        }
        return prompts;
    },
    savePrompts: (prompts) => GM_setValue('prompts', prompts),
    getModels: (providerIndex) => GM_getValue(`models_${providerIndex}`, []),
    saveModels: (providerIndex, models) => GM_setValue(`models_${providerIndex}`, models),
    getAvailableModels: (providerIndex) => GM_getValue(`available_models_${providerIndex}`, []),
    saveAvailableModels: (providerIndex, models) => GM_setValue(`available_models_${providerIndex}`, models),
    getConversations: () => GM_getValue('conversations', []),
    saveConversations: (conversations) => GM_setValue('conversations', conversations),
    getTheme: () => GM_getValue('theme', 'default'),
    saveTheme: (theme) => GM_setValue('theme', theme),
    getSystemConfig: () => GM_getValue('system_config', {defaultModel: null, defaultPrompt: null, defaultTranslatePrompt: null}),
    saveSystemConfig: (config) => GM_setValue('system_config', config),
    getTriggerPosition: () => GM_getValue('trigger_position', null),
    saveTriggerPosition: (pos) => GM_setValue('trigger_position', pos),
    getSidebarOpen: () => GM_getValue('sidebar_open', false),
    saveSidebarOpen: (isOpen) => GM_setValue('sidebar_open', isOpen),
    getSidebarStyle: () => GM_getValue('sidebar_style', null),
    saveSidebarStyle: (style) => GM_setValue('sidebar_style', style)
};

export const THEMES = {
    default: {
        name: '默认极光',
        colors: {
            primary: '#667eea',
            primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            bg: '#ffffff',
            bgSecondary: '#f8f9fa',
            text: '#333333',
            textSecondary: '#666666',
            border: '#e1e4e8',
            hover: '#f1f3f5',
            userMsgBg: '#667eea',
            userMsgText: '#ffffff',
            aiMsgBg: '#f1f3f5',
            aiMsgText: '#333333',
            shadow: 'rgba(0,0,0,0.1)'
        },
        styles: {
            borderRadius: '4px',
            btnRadius: '4px',
            fontFamily: 'inherit',
            borderWidth: '1px',
            shadowLg: '-2px 0 8px rgba(0,0,0,0.1)',
            spacing: '15px',
            fontSize: '14px',
            fontWeight: '400',
            headerHeight: 'auto',
            transition: 'all 0.2s ease'
        }
    },
    notion: {
        name: 'Notion风格',
        colors: {
            primary: '#333333',
            primaryGradient: '#ffffff',
            bg: '#ffffff',
            bgSecondary: '#f7f7f5',
            text: '#37352f',
            textSecondary: 'rgba(55, 53, 47, 0.65)',
            border: '#e9e9e8',
            hover: 'rgba(55, 53, 47, 0.08)',
            userMsgBg: 'transparent', // Notion style: minimal background
            userMsgText: '#37352f',
            aiMsgBg: 'transparent',
            aiMsgText: '#37352f',
            shadow: 'rgba(15, 15, 15, 0.05)'
        },
        styles: {
            borderRadius: '3px',
            btnRadius: '3px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif',
            borderWidth: '1px',
            shadowLg: '0 0 0 1px rgba(15,15,15,0.02), 0 3px 6px rgba(15,15,15,0.04)',
            spacing: '12px',
            fontSize: '14px',
            fontWeight: '400',
            headerHeight: '45px',
            transition: 'background 0.1s ease'
        }
    },
    youtube: {
        name: 'YouTube风格',
        colors: {
            primary: '#ff0000',
            primaryGradient: '#ffffff',
            bg: '#ffffff',
            bgSecondary: '#f2f2f2',
            text: '#0f0f0f',
            textSecondary: '#606060',
            border: 'transparent', // Flat design
            hover: '#e5e5e5',
            userMsgBg: '#f2f2f2',
            userMsgText: '#0f0f0f',
            aiMsgBg: '#ffffff',
            aiMsgText: '#0f0f0f',
            shadow: 'rgba(0,0,0,0.1)'
        },
        styles: {
            borderRadius: '12px',
            btnRadius: '18px', // Pill shape
            fontFamily: 'Roboto, Arial, sans-serif',
            borderWidth: '0px',
            shadowLg: '0 4px 12px rgba(0,0,0,0.08)',
            spacing: '16px',
            fontSize: '14px',
            fontWeight: '400',
            headerHeight: '56px',
            transition: 'background 0.2s cubic-bezier(0.2, 0, 0, 1)'
        }
    },
    github: {
        name: 'GitHub风格',
        colors: {
            primary: '#2da44e',
            primaryGradient: '#2da44e',
            bg: '#ffffff',
            bgSecondary: '#f6f8fa',
            text: '#24292f',
            textSecondary: '#57606a',
            border: '#d0d7de',
            hover: '#f3f4f6',
            userMsgBg: '#ddf4ff',
            userMsgText: '#24292f',
            aiMsgBg: '#f6f8fa',
            aiMsgText: '#24292f',
            shadow: 'rgba(140,149,159,0.2)'
        },
        styles: {
            borderRadius: '6px',
            btnRadius: '6px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
            borderWidth: '1px',
            shadowLg: '0 8px 24px rgba(140,149,159,0.2)',
            spacing: '16px',
            fontSize: '14px',
            fontWeight: '400',
            headerHeight: '60px',
            transition: 'all 0.2s cubic-bezier(0.3, 0, 0.5, 1)'
        }
    },
    discord: {
        name: 'Discord风格',
        colors: {
            primary: '#5865F2',
            primaryGradient: '#313338',
            bg: '#313338',
            bgSecondary: '#2b2d31',
            text: '#dbdee1',
            textSecondary: '#949ba4',
            border: '#1e1f22',
            hover: '#3f4147',
            userMsgBg: '#5865F2',
            userMsgText: '#ffffff',
            aiMsgBg: '#2b2d31',
            aiMsgText: '#dbdee1',
            shadow: 'rgba(0,0,0,0.2)'
        },
        styles: {
            borderRadius: '8px',
            btnRadius: '4px',
            fontFamily: '"gg sans", "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
            borderWidth: '0px',
            shadowLg: '0 0 10px rgba(0,0,0,0.5)',
            spacing: '16px',
            fontSize: '15px',
            fontWeight: '500',
            headerHeight: '48px',
            transition: 'background 0.15s ease-out'
        }
    },
    apple: {
        name: 'Apple风格',
        colors: {
            primary: '#0071e3',
            primaryGradient: 'rgba(255, 255, 255, 0.72)', // Glassmorphism
            bg: 'rgba(255, 255, 255, 0.72)',
            bgSecondary: 'rgba(245, 245, 247, 0.5)',
            text: '#1d1d1f',
            textSecondary: '#86868b',
            border: 'rgba(0,0,0,0.05)',
            hover: 'rgba(0,0,0,0.03)',
            userMsgBg: '#0071e3',
            userMsgText: '#ffffff',
            aiMsgBg: 'rgba(255,255,255,0.5)',
            aiMsgText: '#1d1d1f',
            shadow: 'rgba(0,0,0,0.1)'
        },
        styles: {
            borderRadius: '12px',
            btnRadius: '980px', // Fully rounded
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif',
            borderWidth: '1px',
            shadowLg: '0 20px 40px rgba(0,0,0,0.1)',
            backdropFilter: 'saturate(180%) blur(20px)',
            spacing: '18px',
            fontSize: '15px',
            fontWeight: '400',
            headerHeight: '52px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
        }
    }
};