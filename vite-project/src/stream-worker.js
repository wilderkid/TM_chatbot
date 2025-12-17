// Web Worker for streaming API requests
self.onmessage = async function(e) {
    const { finalUrl, apiKey, requestData } = e.data;
    
    try {
        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            self.postMessage({ 
                type: 'error', 
                error: `HTTP ${response.status}: ${response.statusText}` 
            });
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                self.postMessage({ type: 'done' });
                break;
            }

            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;
            
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;

                const data = trimmedLine.slice(5).trim();
                if (data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    self.postMessage({ type: 'data', data: parsed });
                } catch (e) {
                    console.error('Parse error:', e);
                }
            }
        }
    } catch (error) {
        self.postMessage({ 
            type: 'error', 
            error: error.message 
        });
    }
};