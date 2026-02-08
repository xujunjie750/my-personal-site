// api/chat.js

import siteData from '../../src/data/siteData.json';

// ... (generateSystemPrompt function remains the same)
const generateSystemPrompt = (data) => {
    const { personalInfo, careerTimeline, detailedProjects, research } = data;
    return `## Role Definition
    You are the "Digital Twin" of ${personalInfo.name} (${personalInfo.englishName}), a ${personalInfo.title}.
    Your personality is: Innovative, Minimalist, Insightful, and Action-oriented.
    Your core philosophy: "${personalInfo.subTitle}".
    ## Knowledge Base
    [Career Highlights]
    ${careerTimeline.map(c => `- ${c.period}: ${c.stage} (${c.desc})`).join('\n')}
    [Featured Projects]
    ${detailedProjects.map(p => `- ${p.name}: ${p.description} (Solution: ${p.solution})`).join('\n')}
    [Research Interests]
    ${research.reports.map(r => `- ${r.title}: ${r.summary}`).join('\n')}
    [Contact]
    Email: ${personalInfo.email}
    WeChat: ${personalInfo.wechat}
    ## Strict Guidelines
    1. **Scope Restriction**: You ONLY answer questions related to ${personalInfo.name}'s portfolio, projects, career experience, and views on AI/Design/Storyboarding.
    2. **Refusal Policy**: If a user asks general questions, politely refuse and say: "作为徐郡婕的数字分身，我更乐意与您探讨我的作品集、AI工作流或分镜设计相关的话题。"
    3. **Tone**: Use First-Person ("I", "我"). Be professional but conversational.
    4. **Language**: Match the user's language (Default to Chinese).
    ## Response Style
    - Keep it concise (under 150 words).
    - Use bullet points for lists.
    - Be confident about your achievements.`;
};


export default async function handler(req, res) {
  console.log('[API /api/chat] Received request');

  if (req.method !== 'POST') {
    console.log(`[API /api/chat] Blocked non-POST request with method: ${req.method}`);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    console.log('[API /api/chat] Parsed request body');

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('[API /api/chat] Validation Error: Messages are missing or invalid.');
      return res.status(400).json({ error: '请求体中缺少有效 a的 messages 字段' });
    }

    const apiKey = process.env.MODELSCOPE_API_KEY;
    if (!apiKey) {
      console.error('[API /api/chat] CRITICAL: MODELSCOPE_API_KEY environment variable is not set.');
      return res.status(500).json({ error: '服务器未配置 API Key，请检查 Vercel 环境变量。' });
    }
    console.log('[API /api/chat] Successfully loaded API Key from environment.');

    const systemPrompt = generateSystemPrompt(siteData);
    const apiEndpoint = 'https://api-inference.modelscope.cn/v1/chat/completions';
    const model = 'Qwen/Qwen2.5-7B-Instruct';

    console.log('[API /api/chat] Sending request to ModelScope API...');
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
      }),
    });

    console.log(`[API /api/chat] Received response from ModelScope with status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[API /api/chat] ModelScope API Error (Status: ${response.status}):`, errorText);
      try {
        const errorJson = JSON.parse(errorText);
        const errorMessage = errorJson.errors?.[0]?.message || errorJson.message || '模型服务调用失败';
        return res.status(response.status).json({ error: errorMessage });
      } catch (e) {
        // If the error response is not JSON, return the raw text.
        return res.status(response.status).json({ error: errorText });
      }
    }

    const data = await response.json();
    console.log('[API /api/chat] Successfully parsed ModelScope response. Sending data to client.');
    res.status(200).json(data);

  } catch (error) {
    console.error('[API /api/chat] UNHANDLED EXCEPTION:', error);
    res.status(500).json({ error: `服务器内部出现意外错误: ${error.message}` });
  }
}
