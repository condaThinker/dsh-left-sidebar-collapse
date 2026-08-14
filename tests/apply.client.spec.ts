// @vitest-environment jsdom
/**
 * dsh-left-sidebar-collapse apply wiring: the General-settings row registers
 * into `settings.general.item`, and the session listener collapses the sidebar
 * exactly when the machine decides to, routing through the layout face. The
 * enabled flag is process-local (localStorage), so no settings transport is
 * needed to exercise it.
 */
import { Context } from '@deepseek-ai/cordis'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SlotRegistry } from '@deepseek-ai/dsh-client-runtime/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { apply, inject } from 'dsh-left-sidebar-collapse/client'
import { AUTO_COLLAPSE_SIDEBAR_STORE } from '../src/client/settings-store.ts'
import { AutoCollapseRow } from '../src/client/AutoCollapseRow.tsx'

const SLOT = 'settings.general.item'

/** Minimal controllable session-list fake: current + subscribe. */
function sessionList(initial?: string): {
  current: string | undefined
  setCurrent: (next: string | undefined) => void
  subscribe: (fn: () => void) => () => void
  getSnapshot: () => { current: string | undefined }
} {
  const listeners = new Set<() => void>()
  const list = {
    current: initial,
    setCurrent: (next: string | undefined) => {
      list.current = next
      for (const listener of [...listeners]) listener()
    },
    getSnapshot: () => ({ current: list.current }),
    subscribe: (fn: () => void) => {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
  }
  return list
}

async function bench() {
  const ctx = new Context()
  await ctx.plugin(SlotRegistry).await()
  ctx.provide('locale', new LocaleRuntime(ctx))
  const layout = { toggleSidebar: vi.fn() }
  ctx.provide('layout', layout)
  const sessions = { list: sessionList('s-a') }
  ctx.provide('sessions', sessions as never)
  const slots = ctx.get('slots') as SlotRegistry
  // Stand in for the settings shell: declare the General item slot from root.
  slots.register(
    { name: 'root', children: { [SLOT]: { kind: 'list', scope: 'root' } } } as never,
    () => null,
  )
  return { ctx, slots, layout, sessions }
}

beforeEach(() => { localStorage.clear() })

describe('dsh-left-sidebar-collapse apply', () => {
  it('declares the services it uses', () => {
    expect(inject).toEqual(['slots', 'locale', 'layout', 'sessions'])
  })

  it('registers the settings row and teardown removes it', async () => {
    const b = await bench()
    const fiber = b.ctx.plugin({ inject: [...inject], apply })
    await fiber.await()
    const entry = b.slots.entries(SLOT).find(e => e.component === AutoCollapseRow)
    expect(entry).toBeTruthy()
    expect(entry!.options).toMatchObject({ id: 'auto-collapse-sidebar' })

    await fiber.dispose()
    expect(b.slots.entries(SLOT).some(e => e.component === AutoCollapseRow)).toBe(false)
  })

  it('does not collapse when the feature is disabled or not a real selection', async () => {
    const b = await bench()
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    // Default: not stored → disabled.
    b.sessions.list.setCurrent('s-b')
    expect(b.layout.toggleSidebar).not.toHaveBeenCalled()
  })

  it('collapses once on a real session selection while enabled and expanded', async () => {
    localStorage.setItem(AUTO_COLLAPSE_SIDEBAR_STORE, JSON.stringify({ enabled: true }))
    const b = await bench()
    await b.ctx.plugin({ inject: [...inject], apply }).await()
    // The frame is empty → no `data-sidebar-collapsed` → treated as expanded.
    document.body.innerHTML = '<div id="frame"></div>'

    b.sessions.list.setCurrent('s-b')
    expect(b.layout.toggleSidebar).toHaveBeenCalledTimes(1)

    // A repeat notification for the same pick does not re-flip (the machine's
    // one-turn latch + session-identity guard).
    b.sessions.list.setCurrent('s-b')
    expect(b.layout.toggleSidebar).toHaveBeenCalledTimes(1)
  })
})
