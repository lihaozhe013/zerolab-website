# ZeroLab Website

天璺科技（上海）有限公司官方网站

## 技术栈

- **Vite 8** - 构建工具
- **React 19** - UI 框架
- **TypeScript** (ES2024)
- **MUI v9** - 组件库
- **Tailwind CSS v4** - 样式
- **React Router v7** - 路由

## 快速开始

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

## 项目结构

```
├── src/
│   ├── components/    # 可复用组件
│   ├── pages/         # 页面组件（7个路由）
│   ├── theme.ts       # MUI 主题配置
│   └── App.tsx        # 路由入口
├── public/
│   ├── images/        # 图片资源（需外部管理）
│   ├── videos/        # 视频资源（需外部管理）
│   └── document/      # 文档资源（需外部管理）
└── index.html
```

## 资源管理

**重要：二进制资源文件未纳入 Git 版本管理**，需要在部署时手动放置到 `public/` 目录下：

| 目录 | 内容 | 格式 |
|------|------|------|
| `public/images/` | 合作伙伴 Logo、产品图片、场景图片、Banner 等 | png, jpg, gif |
| `public/videos/` | 产品演示视频 | mp4 |
| `public/document/` | 产品彩页、开发者资料 | pdf, rar |

首次部署时，请将对应的资源文件放入上述目录，否则页面中的图片、视频、文档链接将无法加载。

## 路由

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/about` | 关于我们 |
| `/product` | 产品详情（全屏翻页） |
| `/project` | 方案展示 |
| `/application` | 应用场景 |
| `/contact` | 联系我们（高德地图） |
| `/teleop` | 遥操作方案 |
