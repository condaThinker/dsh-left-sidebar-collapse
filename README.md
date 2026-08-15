# dsh-left-sidebar-collapse

English | [中文](README.zh.md)

Auto-collapse / fully-collapse the DSH **left sidebar** when you select a
conversation. A standalone, installable DSH plugin (pure client, no
`ui-layout` framework changes).

Two independent preferences appear in **Settings → General**:

1. **Auto-collapse sidebar** — after you select a conversation, the left
   sidebar collapses to its 56px rail. Deterministic: a plugin-internal state
   machine drives `ctx.layout` and reads the stable `data-sidebar-collapsed`
   frame signal, holding against the layout's own feedback so it never
   double-toggles.
2. **Fully collapse** — when the sidebar is collapsed, tuck it *completely*
   away (the rail is removed, the grid's first track collapses to 0) and show a
   single floating **expand** button in the top-left. Clicking it restores the
   full sidebar. The conversation pane stays at full width — nothing else is
   disturbed.

The preferences are persisted in `localStorage` (process-local browser
preference), so the toggles are always writable and survive reloads.

## Install

Requires DSH (DeepSeek Harness) `dsh` CLI.

```sh
dsh plugin --profile web add git+https://github.com/condaThinker/dsh-left-sidebar-collapse
```

Then restart the profile:

```sh
dsh --profile web
# or whatever your run command is for the profile you installed into
```

After install, open **Settings → General** and toggle **Auto-collapse
sidebar** (and optionally **Fully collapse**).

### Git install and the `prepare` build

This plugin ships a self-contained `prepare` build script (`tsdown`), per the
DSH plugin distribution convention. When installed by git, pnpm runs that
script to build `lib/` in the profile, so it needs network access to resolve
the DSH peer/dev dependencies and the profile must allow the build script:
add `dsh-left-sidebar-collapse` to the profile's `allowBuilds` (see pnpm ≥10
`allowBuilds`/`strictDepBuilds`), then re-run the `dsh plugin add`. For a
zero-build alternative, a maintainer may instead commit a freshly built `lib/`
into the repo and drop `prepare` — but the recommended path is `prepare`.

## Build

```sh
pnpm install
pnpm build
pnpm test
```

## How it works

- **Auto-collapse**: a listener on `ctx.sessions.list` notices when the
  current session moves to a different real session; the
  [`AutoCollapseMachine`](src/client/collapse-machine.ts) then collapses the
  sidebar via `ctx.layout.toggleSidebar()` only while the frame renders it
  expanded (reading `data-sidebar-collapsed`), and suppresses further flips
  until the frame confirms the collapse — no double-toggle, no flip-back.
- **Fully collapse**: a `shell.overlay` occupant (`FullCollapseButton`)
  reactively watches `data-sidebar-collapsed`; when collapsed and
  "fully collapse" is on it injects a tiny `grid-template-columns:
  0 minmax(0,1fr) 0 !important` override (so the sidebar track → 0 and the
  center reclaims the width) and shows the single expand button.

The client bundle respects DSH's module-table purity: only platform modules
(`ui-primitives`, the documented `dsh-client-runtime` exemption) are
value-imported; everything else is a type-only contract pull.

## Model Experience

None, as the plugin only moves the browser layout column and never enters the append-only Session log, the model context, or telemetry.

#### KV Cache effect

None; the collapse gesture does not touch the history tail.

## Known Limitations and Deferred Work

- **`dsh-better-sidebar` coexistence** — both plugins manage sidebar state
  independently; if the toggle looks like it fires without the flag on, check
  whether another sidebar plugin (e.g. `dsh-better-sidebar`) is also
  collapsing. This plugin is strictly off when its toggle is off.
- **The collapse gesture is a toggle, not a store write** — because
  `ctx.layout` exposes only `toggleSidebar()`, the plugin keeps the state
  machine above to avoid double-toggling, but it cannot move the layout store
  directly.
