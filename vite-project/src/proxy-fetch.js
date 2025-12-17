// 使用 Cloudflare Worker 代理的 fetch 实现
// 支持流式响应，解决 CORS 和 CSP 问题
import { GM_xmlhttpRequest } from 'vite-plugin-monkey/dist/client';

// 配置你的 Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL = 'https://aisiderbarproxy.wa631016583.workers.dev/';

// 使用 GM_xmlhttpRequest 的降级方案（非流式，一次性返回）
async function fetchWithGM(finalUrl, provider, requestData, callbacks) {
    const { onProgress, onComplete, onError } = callbacks;
    
    console.log('[Proxy Debug] 使用 GM_xmlhttpRequest 降级方案（非流式）');
    
    GM_xmlhttpRequest({
        method: 'POST',
        url: CLOUDFLARE_WORKER_URL,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            url: finalUrl,
            headers: {
                'Authorization': `Bearer ${provider.key}`,
            },
            body: requestData,
        }),
        onload: (response) => {
            console.log('[Proxy Debug] GM 请求完成，状态码:', response.status);
            console.log('[Proxy Debug] GM 响应文本长度:', response.responseText?.length || 0);
            console.log('[Proxy Debug] GM 响应文本前500字符:', response.responseText?.substring(0, 500));
            
            if (response.status !== 200) {
                console.error('[Proxy Debug] GM 请求失败，状态码:', response.status);
                onError(new Error(`HTTP error! status: ${response.status}`));
                return;
            }
            
            let fullContent = '';
            let reasoningContent = '';
            const text = response.responseText;
            const lines = text.split('\n');
            
            console.log('[Proxy Debug] GM 响应行数:', lines.length);
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
                
                const data = trimmedLine.slice(5).trim();
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    
                    if (parsed.choices?.[0]?.finish_reason === 'sensitive') {
                        fullContent = '请求失败：内容可能违反了API提供商的安全策略。';
                        break;
                    }
                    
                    let delta = '';
                    let reasoningDelta = '';
                    
                    const choice = parsed.choices?.[0];
                    if (choice?.delta) {
                        delta = choice.delta.content || '';
                        reasoningDelta = choice.delta.reasoning_content || choice.delta.reasoning || '';
                    }
                    
                    if (parsed.type === 'content_block_delta') {
                        if (parsed.delta?.type === 'thinking_delta') {
                            reasoningDelta = parsed.delta.thinking || '';
                        } else if (parsed.delta?.type === 'text_delta') {
                            delta = parsed.delta.text || '';
                        }
                    }
                    
                    if (reasoningDelta) {
                        reasoningContent += reasoningDelta;
                    }
                    if (delta) {
                        fullContent += delta;
                    }
                } catch (e) {
                    console.error('[Proxy Debug] JSON解析错误:', e);
                }
            }
            
            console.log('[Proxy Debug] GM 解析完成，内容长度:', fullContent.length);
            console.log('[Proxy Debug] GM 先调用 onProgress 更新UI');
            onProgress({ content: fullContent, reasoning: reasoningContent });
            
            // 等待UI更新完成后再调用onComplete保存消息
            setTimeout(() => {
                console.log('[Proxy Debug] GM 准备调用 onComplete');
                onComplete({ content: fullContent, reasoning: reasoningContent });
                console.log('[Proxy Debug] GM onComplete 已调用');
            }, 100);
        },
        onerror: (error) => {
            console.error('[Proxy Debug] GM 请求错误:', error);
            onError(error);
        }
    });
}

export async function fetchWithProxy(finalUrl, provider, requestData, callbacks) {
    const { onProgress, onComplete, onError } = callbacks;
    
    let fullContent = '';
    let reasoningContent = '';
    
    console.log('[Proxy Debug] 使用 Cloudflare Worker 代理');
    console.log('[Proxy Debug] Worker URL:', CLOUDFLARE_WORKER_URL);
    console.log('[Proxy Debug] 目标 URL:', finalUrl);
    
    try {
        console.log('[Proxy Debug] 尝试使用 fetch API');
        
        // 通过代理发送请求
        const response = await fetch(CLOUDFLARE_WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: finalUrl,
                headers: {
                    'Authorization': `Bearer ${provider.key}`,
                },
                body: requestData,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 读取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('[Proxy Debug] 流式传输完成');
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            console.log('[Proxy Debug] 收到数据块:', chunk.length, '字节');

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
                
                const data = trimmedLine.slice(5).trim();
                if (data === '[DONE]') continue;
                
                try {
                    const parsed = JSON.parse(data);
                    
                    if (parsed.choices?.[0]?.finish_reason === 'sensitive') {
                        fullContent = '请求失败：内容可能违反了API提供商的安全策略。';
                        break;
                    }
                    
                    let delta = '';
                    let reasoningDelta = '';
                    
                    const choice = parsed.choices?.[0];
                    if (choice?.delta) {
                        delta = choice.delta.content || '';
                        reasoningDelta = choice.delta.reasoning_content || choice.delta.reasoning || '';
                    }
                    
                    if (parsed.type === 'content_block_delta') {
                        if (parsed.delta?.type === 'thinking_delta') {
                            reasoningDelta = parsed.delta.thinking || '';
                        } else if (parsed.delta?.type === 'text_delta') {
                            delta = parsed.delta.text || '';
                        }
                    }
                    
                    if (reasoningDelta) {
                        reasoningContent += reasoningDelta;
                        onProgress({ content: fullContent, reasoning: reasoningContent });
                    }
                    if (delta) {
                        fullContent += delta;
                        onProgress({ content: fullContent, reasoning: reasoningContent });
                    }
                } catch (e) {
                    console.error('[Proxy Debug] JSON解析错误:', e);
                }
            }
        }

        onComplete({ content: fullContent, reasoning: reasoningContent });
        
    } catch (error) {
        console.error('[Proxy Debug] fetch 请求失败:', error);
        
        // 检查是否是 CSP 或网络错误，尝试降级到 GM_xmlhttpRequest
        const errorMsg = error.message || '';
        if (errorMsg.includes('CSP') ||
            errorMsg.includes('Content Security Policy') ||
            errorMsg.includes('Failed to fetch') ||
            errorMsg.includes('violates') ||
            error.name === 'TypeError') {
            console.log('[Proxy Debug] 检测到 CSP/网络限制，切换到 GM_xmlhttpRequest');
            fetchWithGM(finalUrl, provider, requestData, callbacks);
            return; // 重要：防止继续执行
        } else {
            onError(error);
        }
    }
}