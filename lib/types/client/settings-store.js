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
import { createSnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
/** localStorage key owning the persisted flags. */
export const AUTO_COLLAPSE_SIDEBAR_STORE = 'dsh.auto-collapse-sidebar';
const INITIAL = {
    enabled: false,
    fullyCollapse: false,
};
/**
 * Owner of the persisted flags. The store rehydrates from localStorage on
 * construction and persists each write; nothing else is needed, so the rows
 * are interactive from first paint.
 */
export class AutoCollapseSidebarController {
    /** Row snapshot the renderer subscribes to. */
    store = createSnapshotStore(INITIAL, {
        persist: { name: AUTO_COLLAPSE_SIDEBAR_STORE },
    });
    constructor() {
        // Rehydrate may have restored an older `{ enabled }` shape; normalize the
        // default for any field a stored value predates.
        const snap = this.store.getSnapshot();
        if (snap.fullyCollapse === undefined)
            this.store.update(s => { s.fullyCollapse = false; });
        if (snap.enabled === undefined)
            this.store.update(s => { s.enabled = false; });
    }
    /** Exposed for tests/inspection: the current persisted value. */
    get enabled() {
        return this.store.getSnapshot().enabled;
    }
    /** Exposed for tests/inspection: the current persisted value. */
    get fullyCollapse() {
        return this.store.getSnapshot().fullyCollapse;
    }
    /**
     * Set the enabled flag. A nothing-to-do write (same value) is skipped; the
     * store's persist option writes `localStorage` on every change.
     * @param enabled - next master-switch value.
     */
    setEnabled(enabled) {
        if (this.store.getSnapshot().enabled === enabled)
            return;
        this.store.update(s => { s.enabled = enabled; });
    }
    /**
     * Set the fully-collapse flag. A nothing-to-do write (same value) is
     * skipped; the store's persist option writes `localStorage` on every change.
     * @param fullyCollapse - next fully-collapse value.
     */
    setFullyCollapse(fullyCollapse) {
        if (this.store.getSnapshot().fullyCollapse === fullyCollapse)
            return;
        this.store.update(s => { s.fullyCollapse = fullyCollapse; });
    }
}
//# sourceMappingURL=settings-store.js.map