## 1. 修复 MyMemory 翻译报错
- 定位到 `AIWorker` 类中的翻译逻辑。
- 将 `MyMemoryTranslator(source='auto', ...)` 修改为明确指定源语言（如 `source='en'`），或者在调用前进行简单的语言检测，解决截图中的 `INVALID SOURCE LANGUAGE` 报错。

## 2. 集成 Hugging Face 免密 Qwen 翻译引擎
- 在 `AIWorker` 中新增基于 `requests` 的 Qwen 翻译函数。
- 使用 Hugging Face 公开推理端点（Serverless Inference），调用最新的 Qwen 系列模型（如 Qwen2.5-72B 或用户提到的 Flash 版本）。
- 实现“匿名调用”逻辑，确保无需 API Key 即可在国内直连使用。

## 3. 优化翻译优先级策略 (国内加速)
- 重新编排翻译顺序，提升响应速度：
    1. **Qwen (HF)**：首选方案，国内直连极速，翻译质量极高。
    2. **MyMemory (修复版)**：作为第一备选，无需 VPN 且稳定。
    3. **Google**：作为最后备选（仅在 VPN 开启时有效）。

## 4. 增强 UI 反馈
- 在翻译结果窗口明确标注所使用的引擎（例如：`【译文 (Qwen-Flash)】`）。
- 确保在翻译过程中保持鼠标光标为“忙碌”状态，并在结果返回后及时恢复。