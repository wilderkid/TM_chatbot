import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'AI Chat Sidebar',
        namespace: 'http://tampermonkey.net/',
        version: '3.0',
        description: 'AI对话侧边栏，支持多AI提供商配置',
        author: 'You',
        license: 'MIT',
        match: ['*://*/*'],
        grant: ['GM_setValue', 'GM_getValue', 'GM_xmlhttpRequest'],
        connect: [
          'https://cdn.jsdelivr.net',
          'https://api.openai.com',
          'https://api.anthropic.com',
          'https://api.gemini.google.com',
          '*'
        ],
        require: [
          'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js',
          'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/build/highlight.min.js'
        ],
      },
    }),
  ],
});