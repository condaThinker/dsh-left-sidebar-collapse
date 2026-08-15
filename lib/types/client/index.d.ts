/**
 * Auto-collapse sidebar on session select — browser plugin.
 *
 * Two surfaces over one preference:
 *  - a General-settings row that toggles the persisted `enabled` flag, and
 *  - a root listener that, while the flag is on, collapses the left sidebar
 *    whenever the current session moves to a different real session (i.e.
 *    the operator picked a conversation).
 *
 * The collapse goes through `ctx.layout` (the cross-plugin panel-action
 * face) and is decided by the plugin's own state machine
 * ({@link AutoCollapseMachine}). The machine only fires the flip while the
 * AppFrame actually renders the sidebar expanded (`data-sidebar-collapsed` on
 * the frame root — a stable cross-plugin signal, not a hashed class), so
 * enabling the feature never pops a collapsed rail open and a burst of
 * session notifications still collapses at most once. Neither the layout
 * store nor the breakpoint is read here — the plugin needs no framework state.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type AutoCollapseSidebarKey } from './locales.ts';
export type { AutoCollapseRowInjected, AutoCollapseRowProps } from './AutoCollapseRow.tsx';
export type { FullCollapseButtonInjected, FullCollapseButtonProps } from './FullCollapseButton.tsx';
export type { AutoCollapseSidebarKey } from './locales.ts';
export type { AutoCollapseSidebarState } from './settings-store.ts';
export type { CollapseDecision, CollapseSidebar, ReadSidebarCollapsed } from './collapse-machine.ts';
export { AUTO_COLLAPSE_SIDEBAR_STORE } from './settings-store.ts';
export { AutoCollapseMachine, frameReportsSidebarCollapsed, isRealSessionSelection, } from './collapse-machine.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Auto-collapse-sidebar copy. */
        'settings.autoCollapseSidebar': AutoCollapseSidebarKey;
    }
}
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Browser plugin body: register the settings row and the session listener.
 * @param ctx - Client root context.
 */
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=index.d.ts.map