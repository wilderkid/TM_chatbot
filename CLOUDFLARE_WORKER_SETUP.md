# Cloudflare Worker 代理部署指南

## 步骤 1：注册 Cloudflare 账号

1. 访问 https://dash.cloudflare.com/sign-up
2. 注册一个免费账号（只需要邮箱）
3. 验证邮箱

## 步骤 2：创建 Worker

1. 登录 Cloudflare Dashboard
2. 点击左侧菜单的 "Workers & Pages"
3. 点击 "Create application"
4. 选择 "Create Worker"
5. 给 Worker 起个名字，例如：`ai-proxy`
6. 点击 "Deploy"

## 步骤 3：部署代理代码

1. 部署完成后，点击 "Edit code"
2. 删除默认代码
3. 复制 `cloudflare-worker-proxy.js` 文件中的所有代码
4. 粘贴到编辑器中
5. 点击右上角 "Save and Deploy"

## 步骤 4：获取 Worker URL

部署成功后，你会看到 Worker 的 URL，格式如：
```
https://ai-proxy.your-subdomain.workers.dev
```

**复制这个 URL，你需要在前端代码中使用它！**

## 步骤 5：配置前端

在油猴脚本中，将 Worker URL 配置为代理地址。

## 免费额度

Cloudflare Workers 免费计划：
- 每天 100,000 次请求
- 完全够个人使用
- 无需信用卡

## 注意事项

- Worker URL 是公开的，任何人都可以访问
- 如果担心被滥用，可以添加简单的认证机制
- 免费版本足够个人使用，无需升级