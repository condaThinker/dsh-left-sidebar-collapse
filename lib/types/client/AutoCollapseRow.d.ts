/**
 * Auto-collapse-sidebar preference rows in General settings: two toggles —
 * auto-collapse the sidebar when a conversation is selected, and fully tuck
 * away the collapsed rail (leaving one expand button). The preferences are
 * persisted in localStorage by the controller; the rows read the snapshot and
 * route every toggle through the injected setters. Always interactive — they
 * never depend on a Host settings transport being writable.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AutoCollapseSidebarKey } from './locales.ts';
import type { AutoCollapseSidebarState } from './settings-store.ts';
/** Registration-side preference face. */
export interface AutoCollapseRowInjected {
    hooks: {
        /** Persisted preferences bound as useAutoCollapseSidebar. */
        autoCollapseSidebar: SnapshotStore<AutoCollapseSidebarState>;
    };
    /** Change the persisted enabled flag. */
    setEnabled: (enabled: boolean) => void;
    /** Change the persisted fully-collapse flag. */
    setFullyCollapse: (fullyCollapse: boolean) => void;
}
/** Full Settings-row props. */
export type AutoCollapseRowProps = PropsRuntime<'settings.general.item'> & PropsLocale<'settings.autoCollapseSidebar'> & InjectFace<AutoCollapseRowInjected>;
/**
 * Render the auto-collapse + fully-collapse toggle rows.
 * @param props - composed slot props.
 * @returns the rows.
 */
export declare function AutoCollapseRow({ useAutoCollapseSidebar, setEnabled, setFullyCollapse, t }: AutoCollapseRowProps): import("react").JSX.Element;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Auto-collapse-sidebar row copy. */
        'settings.autoCollapseSidebar': AutoCollapseSidebarKey;
    }
}
//# sourceMappingURL=AutoCollapseRow.d.ts.map