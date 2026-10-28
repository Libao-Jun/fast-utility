# fast-utility 项目记忆

## 发布规则（强制安全约束）

- **禁止助手自动发布**：不得执行 `npm publish`、`pnpm publish`、`yarn publish` 或 `npx npm publish`，也不得通过脚本、CI、自动化任务间接触发。
- **只能确认后手动发布**：发布前必须先向用户复述以下信息，由用户确认并手动执行发布命令。
  - 包名与版本号（须与 `package.json` 一致）
  - 目标 registry（当前为 `https://registry.npmjs.org/`）
  - `npm pack --dry-run` 的文件清单与体积
- **不得擅自改版本号**：不主动修改 `package.json` 的 `version`，不打 tag、不创建 release。

## 发布前检查清单

1. `pnpm exec tsc --noEmit` 通过。
2. `pnpm exec vitest run` 全部通过。
3. `pnpm build` 成功，产物应恰为 5 个文件：`dist/index.js`、`dist/index.cjs`、`dist/index.d.ts`（单文件声明）、`dist/index.global.js`、`dist/index.global.min.js`；不输出 sourcemap。
4. `npm pack --dry-run` 包含 `dist` 下全部产物、两份 README、`LICENSE`、`package.json`。
5. `CHANGELOG.md` 已记录本次版本变更。
6. npm 上该版本号未被占用。

## 凭据文件（强制安全约束）

- **禁止读取 `.npmrc`**：不得查看、打印或搜索其内容，包括 `Read` 工具与 `cat` / `type` / `Get-Content` / `sed` / `grep` / `git show` 等方式。
- 确认 registry 用 `npm config get registry`，确认身份用 `npm whoami`；排查发布失败时查看 npm 的 debug 日志，不读 `.npmrc`。
- `.npmrc` 已在 `.gitignore` 中忽略，禁止 `git add -f` 强制提交；令牌泄露后须立即在 npm 后台吊销并更换。
- `.yarnrc.yml`、`.env` 等含密钥文件按同一规则处理。

## 其他约定

- 已发布版本不可覆盖，任何修复都需递增版本号。
- 项目仍处早期，公开 API 变更按破坏性变更处理，需同步 `README.md`、`README.en.md`、`CHANGELOG.md`。
