/**
 * Auto-collapse-sidebar preference controller.
 *
 * Two boolean flags, persisted in `localStorage` via the snapshot store's
 * persist option (process-local browser preference): `enabled` (auto-collapse
 * the sidebar when a conversation is selected) and `fullyCollapse` (when the
 * sidebar is collapsed, fully tuck it away — hide the 56px rail — and show
 * only a single expand button). Persisting locally keeps the row
 * unconditionally writable in any browser: it never depends on a Host
 * settings namespace being registered or on the settings transport being
 * writable, so the toggle can never land in a disabled/unavailable state.
 * The values survive reloads in this browser and converge across tabs
 * sharing the same origin.
 */
import { type SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
/** localStorage key owning the persisted flags. */
export declare const AUTO_COLLAPSE_SIDEBAR_STORE = "dsh.auto-collapse-sidebar";
/** Row snapshot the renderer subscribes to. */
export interface AutoCollapseSidebarState {
    /** Whether the auto-collapse feature is on. */
    enabled: boolean;
    /** Whether the collapsed rail is fully tucked away (only an expand button). */
    fullyCollapse: boolean;
}
/**
 * Owner of the persisted flags. The store rehydrates from localStorage on
 * construction and persists each write; nothing else is needed, so the rows
 * are interactive from first paint.
 */
export declare class AutoCollapseSidebarController {
    /** Row snapshot the renderer subscribes to. */
    readonly store: SnapshotStore<AutoCollapseSidebarState>;
    constructor();
    /** Exposed for tests/inspection: the current persisted value. */
    get enabled(): boolean;
    /** Exposed for tests/inspection: the current persisted value. */
    get fullyCollapse(): boolean;
    /**
     * Set the enabled flag. A nothing-to-do write (same value) is skipped; the
     * store's persist option writes `localStorage` on every change.
     * @param enabled - next master-switch value.
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set the fully-collapse flag. A nothing-to-do write (same value) is
     * skipped; the store's persist option writes `localStorage` on every change.
     * @param fullyCollapse - next fully-collapse value.
     */
    setFullyCollapse(fullyCollapse: boolean): void;
}
//# sourceMappingURL=settings-store.d.ts.map