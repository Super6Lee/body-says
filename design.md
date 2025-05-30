# 「身体有话对你说」项目设计文档

## 目录结构

- /public                # 静态资源（图片、icon等）
- /src
  - /components          # 复用型 UI 组件
  - /pages               # NextJS 页面目录
  - /styles              # 全局与模块样式
  - /utils               # 工具函数（如localStorage、API请求等）
  - /constants           # 常量、题库等
  - /hooks               # 自定义 hooks
- /types                 # TypeScript 类型定义
- design.md              # 项目设计文档（本文件）
- package.json           # 依赖与脚本
- tsconfig.json          # TypeScript 配置
- next.config.js         # NextJS 配置

## 技术要点

### 技术栈
- NextJS (React 框架，支持 SSR/SSG，SEO 友好)
- TypeScript（类型安全）
- 不使用数据库，数据存储于 localStorage
- 移动端优先响应式设计，兼容桌面端
- UI 配色参考苹果官网，简洁现代
- 与 openrouter.ai 上的 GPT-4.1 API 集成，获取医学建议

### 主要功能流程
1. 用户无需登录，打开即用
2. 首屏选择身体部位（如肾、肝、胃等）
3. 针对所选部位，依次展示 10 个常见生活现象问题，每题有 4 个从正常到严重的选项
4. 用户答完 10 题后，前端将答案汇总，调用 GPT-4.1 API 获取分析和医学建议
5. 展示分析结果和建议，支持用户重新选择部位或重测

### 关键技术实现
- 响应式 UI：使用 CSS Flex/Grid + 媒体查询，保证手机和电脑端美观
- 题库与选项：常量文件管理，便于扩展
- 答题进度与答案：用 React 状态管理，答题数据存 localStorage，支持断点续答
- GPT-4.1 API 调用：
  - 通过 fetch/axios 以 POST 方式请求 openrouter.ai
  - 携带 API Key，构造 messages 数组，传递用户答题内容
  - 处理返回的医学建议文本
- 安全与隐私：不存储用户身份信息，所有数据仅本地保存

### 其他
- 代码风格统一，TypeScript 严格类型
- 组件化开发，便于维护和扩展
- 适当注释与文档说明 

## UI风格规范（2024版）

本项目所有页面风格统一参考 https://chaojia-baoying-max-jf24.vercel.app/ ，具体规范如下：

- **主色调**：明亮渐变背景（白色、蓝色、粉色等），大面积留白，整体氛围轻松有趣。
- **强调色**：粉色（#ec4899）、蓝色（#38bdf8）等渐变，按钮和高亮元素采用渐变色或鲜明色块。
- **卡片/分区**：内容区块采用白色圆角卡片，带阴影，突出层次感。
- **按钮**：大号、圆角、色彩鲜明，渐变背景，hover/active有缩放和色彩变化，交互反馈强。
- **emoji/icon**：大量使用emoji和icon点缀，提升趣味性和互动感。
- **字体**：现代无衬线字体（如Inter、system-ui），字号偏大，标题加粗，正文清晰易读。
- **响应式**：移动端优先，所有布局和按钮在手机端也易于点击和阅读。
- **动画/反馈**：按钮、卡片等交互元素有平滑缩放、阴影、色彩变化等视觉反馈。
- **整体气质**：现代、活泼、卡通、表情包风格，适合健康互动类产品。

> 后续所有页面、组件均需遵循本UI风格规范，确保全站体验一致。 