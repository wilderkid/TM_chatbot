import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        // pure_funcs: ['console.log']
      },
      format: {
        comments: false
      }
    }
  },
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'AI Chat Sidebar',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMCAySDRjLTEuMSAwLTIgLjktMiAydjE4bDQtNGgxNGMxLjEgMCAyLS45IDItMlY0YzAtMS4xLS45LTItMi0yem0wIDE0SDZsLTIgMlY0aDE2djEyeiIvPjwvc3ZnPg==',
        namespace: 'http://tampermonkey.net/',
        version: '3.0',
        description: 'AI对话侧边栏，支持多AI提供商配置',
        author: 'You',
        license: 'MIT',
        match: ['*://*/*'],
        grant: ['GM_addStyle', 'GM_setValue', 'GM_getValue', 'GM_xmlhttpRequest'],
        connect: [
          'https://cdn.jsdelivr.net',
          'https://aisiderbarproxy.wa631016583.workers.dev',
          '*'
        ],
      },
    }),
  ],
});