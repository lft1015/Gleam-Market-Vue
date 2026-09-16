# 拾光集市前端

校园与社区二手交易、失物招领平台的 Vue 3 前端，配套后端位于 `E:\gleam-market`。

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
