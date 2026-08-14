// @vitest-environment jsdom
/**
 * FullCollapseButton: renders the floating expand button and the rail-hiding
 * style only while the fully-collapse flag is on AND the frame reports the
 * sidebar collapsed; clicking expands.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import { FullCollapseButton } from '../src/client/FullCollapseButton.tsx'
import type { AutoCollapseSidebarState } from '../src/client/settings-store.ts'

type T = (key: string) => string

function mount(state: AutoCollapseSidebarState, expand = vi.fn()) {
  const store = createSnapshotStore<AutoCollapseSidebarState>(state)
  const utils = render(
    <FullCollapseButton
      useAutoCollapseSidebar={(sel) => sel(store.getSnapshot()) as never}
      useSessions={(() => undefined) as never}
      useWorkspaces={(() => undefined) as never}
      expand={expand}
      t={((k: string) => k) as T}
    />,
  )
  return { expand, store, utils }
}

beforeEach(() => { document.body.innerHTML = '' })
afterEach(() => { cleanup(); document.body.innerHTML = '' })

describe('FullCollapseButton', () => {
  it('renders nothing when fully-collapse is off even if the sidebar is collapsed', () => {
    document.body.innerHTML = '<div id="frame" data-sidebar-collapsed></div>'
    const { utils } = mount({ enabled: true, fullyCollapse: false })
    expect(utils.container.querySelector('[aria-label]')).toBeNull()
  })

  it('renders the expand button + center-reclaim style when fully-collapse and collapsed', () => {
    document.body.innerHTML = '<div id="frame" data-sidebar-collapsed></div>'
    const { utils } = mount({ enabled: true, fullyCollapse: true })
    const btn = utils.container.querySelector('[aria-label]')
    expect(btn).toBeTruthy()
    const style = utils.container.querySelector('style')
    expect(style?.textContent).toContain('data-sidebar-collapsed')
    expect(style?.textContent).toContain('grid-template-columns')
    expect(style?.textContent).toContain('padding-left: 48px')
  })

  it('does not render when the sidebar is expanded', () => {
    document.body.innerHTML = '<div id="frame"></div>'
    const { utils } = mount({ enabled: true, fullyCollapse: true })
    expect(utils.container.querySelector('[aria-label]')).toBeNull()
  })

  it('calls expand on click', () => {
    document.body.innerHTML = '<div id="frame" data-sidebar-collapsed></div>'
    const expand = vi.fn()
    const { utils } = mount({ enabled: true, fullyCollapse: true }, expand)
    const btn = utils.container.querySelector('[aria-label]') as HTMLElement
    act(() => { btn.click() })
    expect(expand).toHaveBeenCalledTimes(1)
  })
})
