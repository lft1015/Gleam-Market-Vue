# 拾光集市前端

校园与社区二手交易、失物招领平台的 Vue 3 前端。

> 配套后端仓库：[Gleam-Market](https://github.com/lft1015/Gleam-Market.git)

## 项目简介

拾光集市是一个面向校园与社区的二手交易和失物招领平台，前端基于 **Vue 3 + TypeScript + Vite** 构建，使用 **Element Plus** 作为 UI 组件库。

### 用户端功能

- **二手市场** — 浏览、发布、编辑二手商品，支持分类筛选与关键词搜索
- **失物招领** — 发布寻物/招领信息，支持失主认领流程
- **私信聊天** — 买家卖家之间实时沟通，支持会话管理
- **收藏夹** — 收藏感兴趣的商品，方便随时查看
- **举报** — 对违规商品或用户进行举报
- **个人中心** — 管理个人信息、查看我的发布与认领记录

### 管理后台

- **仪表盘** — 平台数据概览
- **商品审核** — 审核用户发布的商品
- **举报处理** — 处理用户提交的举报
- **认领审核** — 审核失物认领请求
- **用户管理** — 管理平台用户及状态
- **分类管理** — 维护商品与失物分类
- **公告管理** — 发布与维护平台公告
- **审计日志** — 查看管理员操作记录

### 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 语言 | TypeScript |
| 构建 | Vite |
| 状态管理 | Pinia |
| 路由 | Vue Router 4 |
| UI 组件 | Element Plus |
| HTTP 请求 | Axios |
| 图标 | Lucide Vue Next |
| 日期处理 | dayjs |
| 单元测试 | Vitest + Vue Test Utils |
| E2E 测试 | Playwright |

## 本地开发

```sh
npm install
npm run dev
```

开发服务器会将 `/api/v1` 代理到 `http://localhost:8080`。可通过 `VITE_API_BASE_URL` 覆盖接口地址。

## 构建与测试

```sh
npm run type-check
npm run build
npm test
npm run test:e2e
```

后端可通过 Docker Compose 启动。首次需要在后端 `.env` 中设置 `APP_ADMIN_USERNAME` 和 `APP_ADMIN_PASSWORD`，以创建管理员账号。