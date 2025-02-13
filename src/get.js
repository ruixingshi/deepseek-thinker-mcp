import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "sk-K4lSTPT2wxLyv2hXtK7O5xkh2cspBtBiCrNLUTpGRiEMrWpD",  // 直接使用 API key
    baseURL: "https://api.lkeap.cloud.tencent.com/v1", 
});

// 定义一个异步函数来处理请求
async function getCompletion() {
    try {
        const completion = await openai.chat.completions.create({
            model: 'deepseek-r1',
            messages: [{ role: 'user', content: '天空为什么是蓝色' }],
            stream: true, 
        });

        let reasoningContent = ''; // 用于收集所有的reasoning_content

        // 处理流式响应
        for await (const chunk of completion) {
            if (chunk.choices) {
                // 如果有reasoning_content，就添加到收集器中
                if (chunk.choices[0]?.delta?.reasoning_content) {
                    reasoningContent += chunk.choices[0].delta.reasoning_content;
                }
                // 当收到content时，表示reasoning已经完成，返回收集的内容
                if (chunk.choices[0]?.delta?.content) {
                    return reasoningContent;
                }
            }
        }
    } catch (error) {
        console.error("Error occurred:", error);
        return null;
    }
}

// 调用异步函数并处理返回结果
getCompletion().then(result => {
    console.log("Complete reasoning content:", result);
});