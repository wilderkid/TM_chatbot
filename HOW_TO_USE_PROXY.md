# 如何使用 Cloudflare Worker 代理实现流式输出

## 问题说明

由于浏览器的 CORS 安全策略：
- `GM_xmlhttpRequest` 可以绕过 CORS，但**无法实现流式输出**
- 原生 `fetch` 可以实现流式输出，但**会被 CORS 阻止**

## 解决方案

使用 Cloudflare Worker 作为代理服务器：
1. 前端使用 `fetch` 请求 Worker（同域，无 CORS）
2. Worker 转发请求到 AI API
3. Worker 返回流式响应给前端
4. 实现真正的流式输出效果 ✅

## 部署步骤

### 1. 部署 Cloudflare Worker

按照 `CLOUDFLARE_WORKER_SETUP.md` 的说明部署 Worker，获得 URL，例如：
```
https://ai-proxy.your-subdomain.workers.dev
```

### 2. 配置前端代码

打开 `src/proxy-fetch.js`，填写你的 Worker URL：

```javascript
const CLOUDFLARE_WORKER_URL = 'https://ai-proxy.your-subdomain.workers.dev';
```

### 3. 修改 main.js 使用代理

在 `src/main.js` 中，找到 `executeApiRequestWithStream` 函数，替换为使用代理的实现。

或者，你可以在 `main.js` 顶部导入：

```javascript
import { fetchWithProxy } from './proxy-fetch.js';
```

然后在需要的地方调用：

```javascript
await fetchWithProxy(finalUrl, provider, requestData, {
    onProgress: ({ content, reasoning }) => {
        // 更新 UI
        fullContent = content;
        reasoningContent = reasoning;
        updateUI();
    },
    onComplete: ({ content, reasoning }) => {
        // 完成处理
    },
    onError: (error) => {
        // 错误处理
    }
});
```

### 4. 重新构建

```bash
npm run build
```

### 5. 安装并测试

安装生成的油猴脚本，发送消息测试流式输出效果。

## 优势

✅ 真正的流式输出（逐字符显示）
✅ 绕过 CORS 限制
✅ 完全免费（Cloudflare 免费额度）
✅ 无需自己的域名
✅ 部署简单，5分钟完成

## 注意事项

1. **Worker URL 是公开的**：任何人都可以访问你的 Worker
2. **免费额度**：每天 100,000 次请求，个人使用完全够用
3. **延迟**：通过代理会增加一点延迟，但通常可以忽略不计

## 可选：添加认证

如果担心 Worker 被滥用，可以在 Worker 代码中添加简单的认证：

```javascript
// 在 cloudflare-worker-proxy.js 中添加
const SECRET_KEY = 'your-secret-key';

// 在 fetch 函数开始处检查
const authHeader = request.headers.get('X-Auth-Key');
if (authHeader !== SECRET_KEY) {
    return new Response('Unauthorized', { status: 401 });
}
```

然后在前端请求时添加这个 header。

## 故障排除

### Worker 返回 500 错误
- 检查 Worker 代码是否正确部署
- 查看 Cloudflare Dashboard 中的 Worker 日志

### 仍然看到 CORS 错误
- 确认 Worker URL 配置正确
- 检查 Worker 代码中的 CORS 头设置

### 没有流式输出效果
- 确认使用的是 `fetch` 而不是 `GM_xmlhttpRequest`
- 检查浏览器控制台是否有错误信息