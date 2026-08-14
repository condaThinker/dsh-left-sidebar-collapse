// @vitest-environment jsdom
/**
 * Auto-collapse-sidebar controller unit account: the localStorage-backed
 * `enabled` + `fullyCollapse` flags — initial values, set/skip, and
 * persistence across a new controller instance. The collapse decision itself
 * lives in the collapse-machine spec.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { AUTO_COLLAPSE_SIDEBAR_STORE, AutoCollapseSidebarController } from '../src/client/settings-store.ts'

describe('AutoCollapseSidebarController', () => {
  beforeEach(() => { localStorage.clear() })
  afterEach(() => { localStorage.clear() })

  it('starts disabled and persists an enabled flag to localStorage', () => {
    const ctrl = new AutoCollapseSidebarController()
    expect(ctrl.store.getSnapshot()).toEqual({ enabled: false, fullyCollapse: false })

    ctrl.setEnabled(true)
    expect(ctrl.store.getSnapshot().enabled).toBe(true)
    // Persist writes synchronously via the snapshot store option.
    expect(JSON.parse(localStorage.getItem(AUTO_COLLAPSE_SIDEBAR_STORE) ?? '{}')).toEqual({ enabled: true, fullyCollapse: false })
  })

  it('persists the fully-collapse flag and skips redundant writes', () => {
    const ctrl = new AutoCollapseSidebarController()
    ctrl.setFullyCollapse(true)
    expect(ctrl.store.getSnapshot().fullyCollapse).toBe(true)
    expect(ctrl.fullyCollapse).toBe(true)
    ctrl.setFullyCollapse(true) // no-op
    ctrl.setEnabled(false) // already false, no-op
    expect(ctrl.store.getSnapshot()).toEqual({ enabled: false, fullyCollapse: true })
  })

  it('rehydrates persisted values on a new controller instance', () => {
    localStorage.setItem(AUTO_COLLAPSE_SIDEBAR_STORE, JSON.stringify({ enabled: true, fullyCollapse: true }))
    const ctrl = new AutoCollapseSidebarController()
    expect(ctrl.store.getSnapshot()).toEqual({ enabled: true, fullyCollapse: true })
  })

  it('normalizes an older enabled-only persisted shape', () => {
    localStorage.setItem(AUTO_COLLAPSE_SIDEBAR_STORE, JSON.stringify({ enabled: true }))
    const ctrl = new AutoCollapseSidebarController()
    expect(ctrl.store.getSnapshot()).toEqual({ enabled: true, fullyCollapse: false })
  })

  it('skips redundant writes leaving localStorage untouched', () => {
    const ctrl = new AutoCollapseSidebarController()
    ctrl.setEnabled(false)
    ctrl.setFullyCollapse(false)
    expect(localStorage.getItem(AUTO_COLLAPSE_SIDEBAR_STORE)).toBeNull()
  })
})
