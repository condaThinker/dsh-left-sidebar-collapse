/**
 * Auto-collapse-sidebar preference rows in General settings: two toggles —
 * auto-collapse the sidebar when a conversation is selected, and fully tuck
 * away the collapsed rail (leaving one expand button). The preferences are
 * persisted in localStorage by the controller; the rows read the snapshot and
 * route every toggle through the injected setters. Always interactive — they
 * never depend on a Host settings transport being writable.
 */

import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AutoCollapseSidebarKey } from './locales.ts'
import type { AutoCollapseSidebarState } from './settings-store.ts'
import css from './AutoCollapseRow.module.css'

/** Registration-side preference face. */
export interface AutoCollapseRowInjected {
  hooks: {
    /** Persisted preferences bound as useAutoCollapseSidebar. */
    autoCollapseSidebar: SnapshotStore<AutoCollapseSidebarState>
  }
  /** Change the persisted enabled flag. */
  setEnabled: (enabled: boolean) => void
  /** Change the persisted fully-collapse flag. */
  setFullyCollapse: (fullyCollapse: boolean) => void
}

/** Full Settings-row props. */
export type AutoCollapseRowProps =
  PropsRuntime<'settings.general.item'>
  & PropsLocale<'settings.autoCollapseSidebar'>
  & InjectFace<AutoCollapseRowInjected>

/** One title/description + switch row. */
function SwitchRow(props: {
  title: string
  description: string
  checked: boolean
  onToggle: () => void
}) {
  return (
    <div className={css.row}>
      <div className={css.rowText}>
        <div className={css.title}>{props.title}</div>
        <div className={css.desc}>{props.description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        aria-label={props.title}
        className={css.switch}
        data-on={props.checked || undefined}
        onClick={props.onToggle}
      >
        <span className={css.knob}>
          {props.checked && <IconCheckOutline16 className={css.check} />}
        </span>
      </button>
    </div>
  )
}

/**
 * Render the auto-collapse + fully-collapse toggle rows.
 * @param props - composed slot props.
 * @returns the rows.
 */
export function AutoCollapseRow({ useAutoCollapseSidebar, setEnabled, setFullyCollapse, t }: AutoCollapseRowProps) {
  const state = useAutoCollapseSidebar(snapshot => snapshot)
  return (
    <>
      <SwitchRow
        title={t('title')}
        description={t('description')}
        checked={state.enabled}
        onToggle={() => { setEnabled(!state.enabled) }}
      />
      <SwitchRow
        title={t('fullTitle')}
        description={t('fullDescription')}
        checked={state.fullyCollapse}
        onToggle={() => { setFullyCollapse(!state.fullyCollapse) }}
      />
    </>
  )
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Auto-collapse-sidebar row copy. */
    'settings.autoCollapseSidebar': AutoCollapseSidebarKey
  }
}
