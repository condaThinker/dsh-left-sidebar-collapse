# dsh-left-sidebar-collapse

[English](README.md) | 中文

选中会话后自动收起 / 彻底收起 DSH **左侧边栏**。一个独立、可安装的 DSH 插件（纯客户端，不改 `ui-layout` 框架）。

在 **设置 → General** 里有两个独立偏好：

1. **自动收起侧边栏** —— 选中某个会话后，左侧边栏收起为 56px 的工具栏。行为确定：插件内置状态机驱动 `ctx.layout`，读取稳定的 `data-sidebar-collapsed` frame 信号，并对布局自身的反馈进行抑制，因此不会来回翻转。
2. **完全缩回** —— 当侧边栏处于收起态时，把它**整个隐藏**（移除工具栏，grid 第一轨道收为 0），并在左上角显示一个浮动**展开**按钮。点击即恢复完整侧边栏；会话内容保持全宽，其余界面不受影响。

偏好存储在 `localStorage`（进程内浏览器偏好），因此开关始终可写、并能在刷新后保留。

## 安装

需要 DSH（DeepSeek Harness）的 `dsh` CLI。

```sh
dsh plugin --profile web add git+https://github.com/condaThinker/dsh-left-sidebar-collapse
```

然后重启目标 profile：

```sh
dsh --profile web
```

安装后打开 **设置 → General**，打开 **自动收起侧边栏**（可选再加 **完全缩回**）。

### Git 安装与 `prepare` 构建

本插件携带一个自包含的 `prepare` 构建脚本（`tsdown`），符合 DSH 插件分发约定。以 Git 方式安装时，pnpm 会在 profile 里执行该脚本构建 `lib/`，因此需要网络来解析 DSH 的 peer/dev 依赖，且需在 profile 放行构建脚本：把 `dsh-left-sidebar-collapse` 加入 profile 的 `allowBuilds`（参见 pnpm ≥10 的 `allowBuilds`/`strictDepBuilds`），然后再跑 `dsh plugin add`。若想免构建安装，维护者可把构建好的 `lib/` 提交进 Git 并去掉 `prepare`——但推荐路径是 `prepare`。

## 构建

```sh
pnpm install
pnpm build
pnpm test
```

## 工作原理

- **自动收起**：监听 `ctx.sessions.list`，当当前会话切到另一个真实会话时，[`AutoCollapseMachine`](src/client/collapse-machine.ts) 仅在 frame 渲染为展开（读取 `data-sidebar-collapsed`）时通过 `ctx.layout.toggleSidebar()` 收起，并抑制后续翻转直到 frame 确认收起——不会双击、不会弹回。
- **完全缩回**：`shell.overlay` 里的 `FullCollapseButton` 组件响应式监听 `data-sidebar-collapsed`；当已收起且开启“完全缩回”时，注入一条 `grid-template-columns: 0 minmax(0,1fr) 0 !important` 覆盖（侧边栏轨道 → 0，中心列重回全宽），并显示唯一的展开按钮。

client bundle 遵循 DSH 模块表纯度：仅值导入平台模块（`ui-primitives`、文档明确的 `dsh-client-runtime` 豁免）；其余均为仅类型导入的契约拉取。

## 模型体验

无，因为插件只移动浏览器分栏布局，且从不进入 append-only 的 Session 日志、模型上下文或遥测。

#### KV Cache 影响

无；收起手势不触碰历史尾部。

## Known Limitations and Deferred Work

- **与 `dsh-better-sidebar` 共存** —— 两者各自独立管理侧边栏状态；若开关关着却看起来触发了收起，请检查是否另有侧边栏插件（如 `dsh-better-sidebar`）也在收起。本插件的开关关闭时严格不动作。
- **收起动作是翻转而非 store 写入** —— 因为 `ctx.layout` 仅暴露 `toggleSidebar()`，插件以上述状态机避免来回翻转，但无法直接改动布局 store。
