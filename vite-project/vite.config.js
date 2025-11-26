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
        version: '1.0',
        description: 'AI对话侧边栏，支持多AI提供商配置',
        author: 'You',
        match: ['*://*/*'],
        grant: ['GM_setValue', 'GM_getValue', 'GM_xmlhttpRequest'],
        connect: ['*'],
        require: [
          'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js',
          'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js'
        ],
      },
    }),
  ],
});