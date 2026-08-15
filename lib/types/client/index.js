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
import { AutoCollapseRow } from "./AutoCollapseRow.js";
import { AutoCollapseMachine, frameReportsSidebarCollapsed } from "./collapse-machine.js";
import { FullCollapseButton } from "./FullCollapseButton.js";
import { en, zh } from "./locales.js";
import { AutoCollapseSidebarController } from "./settings-store.js";
export { AUTO_COLLAPSE_SIDEBAR_STORE } from "./settings-store.js";
export { AutoCollapseMachine, frameReportsSidebarCollapsed, isRealSessionSelection, } from "./collapse-machine.js";
/** Dictionary namespace owned by this plugin. */
const NS = 'settings.autoCollapseSidebar';
/** Required services (cordis fiber inject). */
export const inject = ['slots', 'locale', 'layout', 'sessions'];
/**
 * Browser plugin body: register the settings row and the session listener.
 * @param ctx - Client root context.
 */
export function apply(ctx) {
    const controller = new AutoCollapseSidebarController();
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-auto-collapse-sidebar: settings row dictionaries');
    ctx.slots.inject('settings.general.item', () => ctx.slots.register({
        name: 'settings.general.item',
        id: 'auto-collapse-sidebar',
        // After the theme's Appearance row and before the composer behavior rows.
        order: 12,
        locale: NS,
        inject: () => ({
            hooks: { autoCollapseSidebar: controller.store },
            setEnabled: (enabled) => controller.setEnabled(enabled),
            setFullyCollapse: (fullyCollapse) => controller.setFullyCollapse(fullyCollapse),
        }),
    }, AutoCollapseRow));
    // The floating expand button + rail-hiding style, active only while the
    // fully-collapse preference is on and the sidebar renders collapsed.
    ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'auto-collapse-sidebar-expand',
        order: -100,
        locale: NS,
        inject: () => ({
            hooks: { autoCollapseSidebar: controller.store },
            expand: () => { ctx.layout.toggleSidebar(); },
        }),
    }, FullCollapseButton));
    // The collapse machine: seeded so the first real selection after mount is
    // the only event that collapses — a refresh into an already-current session
    // never does — and each notification is evaluated against the live
    // collapsed state so nothing ever flips a rail open.
    const machine = new AutoCollapseMachine(frameReportsSidebarCollapsed, () => { ctx.layout.toggleSidebar(); });
    let previous = ctx.sessions.list.getSnapshot().current;
    const stop = ctx.sessions.list.subscribe(() => {
        const current = ctx.sessions.list.getSnapshot().current;
        machine.onSessionChange(previous, current, controller.store.getSnapshot().enabled);
        previous = current;
    });
    ctx.effect(() => () => { stop(); }, 'ui-auto-collapse-sidebar: session listener');
}
//# sourceMappingURL=index.js.map