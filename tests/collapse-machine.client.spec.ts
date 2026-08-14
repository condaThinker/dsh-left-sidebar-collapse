// @vitest-environment jsdom
/**
 * AutoCollapseMachine unit account: the pure selection predicate and the
 * decision machine — collapse-on-selection that never double-toggles, holds
 * against the layout's feedback notification, and never flips a collapsed
 * rail open.
 */
import { describe, expect, it, vi } from 'vitest'
import { AutoCollapseMachine, frameReportsSidebarCollapsed, isRealSessionSelection } from '../src/client/collapse-machine.ts'

describe('isRealSessionSelection', () => {
  it('recognizes a different real session chosen while enabled', () => {
    expect(isRealSessionSelection(true, 'a', 'b')).toBe(true)
    // disabled → never
    expect(isRealSessionSelection(false, 'a', 'b')).toBe(false)
    // same session (activity echo) → not a selection
    expect(isRealSessionSelection(true, 'a', 'a')).toBe(false)
    // leaving into the no-session/blank view → not a real selection
    expect(isRealSessionSelection(true, 'a', undefined)).toBe(false)
    // first real session after mount (no prior) → never triggers (seeded)
    expect(isRealSessionSelection(true, undefined, 'a')).toBe(false)
  })
})

describe('AutoCollapseMachine', () => {
  it('collapses exactly once when a real session is selected while expanded', () => {
    const collapse = vi.fn()
    const machine = new AutoCollapseMachine(() => false, collapse)
    expect(machine.onSessionChange('a', 'b', true)).toBe('collapsed')
    expect(collapse).toHaveBeenCalledTimes(1)
    expect(machine.lastDecision).toBe('collapsed')
  })

  it('never flips open when the frame already reports collapsed', () => {
    const collapse = vi.fn()
    const machine = new AutoCollapseMachine(() => true, collapse)
    expect(machine.onSessionChange('a', 'b', true)).toBe('already-collapsed')
    expect(collapse).not.toHaveBeenCalled()
  })

  it('holds a second notification that still reads expanded (stale DOM) instead of re-flipping', () => {
    const collapse = vi.fn()
    // The frame never confirms collapsed within this burst (stale DOM read).
    const machine = new AutoCollapseMachine(() => false, collapse)
    expect(machine.onSessionChange('a', 'b', true)).toBe('collapsed')
    // A feedback notification for the same pick reads expanded again — held.
    expect(machine.onSessionChange('a', 'b', true)).toBe('already-collapsed')
    expect(collapse).toHaveBeenCalledTimes(1)
  })

  it('releases the hold once the frame confirms collapsed, so a later new pick can collapse', () => {
    const collapse = vi.fn()
    let collapsed = false
    const machine = new AutoCollapseMachine(() => collapsed, () => { collapse(); collapsed = true })
    expect(machine.onSessionChange('a', 'b', true)).toBe('collapsed')
    // Frame now reports collapsed: a same-pick echo confirms and clears the hold.
    expect(machine.onSessionChange('a', 'b', true)).toBe('already-collapsed')
    // Frame later reports expanded again (user re-opened): a new pick collapses.
    collapsed = false
    expect(machine.onSessionChange('b', 'c', true)).toBe('collapsed')
    expect(collapse).toHaveBeenCalledTimes(2)
  })

  it('lets a genuinely new session selection collapse even while an earlier hold is in flight', () => {
    const collapse = vi.fn()
    // DOM stays expanded throughout (none of the flips "land" in this harness).
    const machine = new AutoCollapseMachine(() => false, collapse)
    expect(machine.onSessionChange('a', 'b', true)).toBe('collapsed')
    // A different session pick releases the prior hold and collapses for it.
    expect(machine.onSessionChange('b', 'c', true)).toBe('collapsed')
    expect(collapse).toHaveBeenCalledTimes(2)
  })

  it('ignores when disabled or not a real selection', () => {
    const collapse = vi.fn()
    const machine = new AutoCollapseMachine(() => false, collapse)
    expect(machine.onSessionChange('a', 'b', false)).toBe('ignored')
    expect(machine.onSessionChange('a', 'a', true)).toBe('ignored')
    expect(collapse).not.toHaveBeenCalled()
  })
})

describe('frameReportsSidebarCollapsed', () => {
  it('reflects the presence of the stable frame attribute', () => {
    document.body.innerHTML = '<div data-sidebar-collapsed></div>'
    expect(frameReportsSidebarCollapsed()).toBe(true)
    document.body.innerHTML = '<div></div>'
    expect(frameReportsSidebarCollapsed()).toBe(false)
  })
})
