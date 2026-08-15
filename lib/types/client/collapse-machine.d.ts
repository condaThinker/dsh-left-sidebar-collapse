/**
 * Plugin-internal collapse decision machine.
 *
 * A surface plugin may only act on the sidebar through `ctx.layout`'s
 * panel-action face, whose only sidebar control is `toggleSidebar()` — a flip.
 * To collapse the sidebar on session select without ever flipping a collapsed
 * rail open — and to survive the burst of notifications one selection produces
 * (including a feedback notification from the layout's own reflow) — this
 * machine only flips while it can confirm the sidebar is expanded, and then
 * **suppresses further flips until the frame confirms the collapse landed**.
 *
 * This removes the two failure modes live use exposes:
 *  - **Stale-read race** — reading `data-sidebar-collapsed` mid-reflow can say
 *    "expanded" right after we collapsed; the suppression gate holds instead
 *    of re-flipping.
 *  - **Feedback re-toggle** — a notification emitted by the collapse itself
 *    (layout reflow / focus change) is held by the same gate until the frame
 *    reports collapsed, so it can never flip the sidebar back open.
 */
/** A stable, injectable ground-truth of the sidebar's collapsed state. */
export type ReadSidebarCollapsed = () => boolean;
/** Collapse the sidebar (the only flip the machine may act on). */
export type CollapseSidebar = () => void;
/** One decision from handling a session change. */
export type CollapseDecision = 'ignored' | 'collapsed' | 'already-collapsed';
/** Read, live every call: is the frame currently rendering the sidebar collapsed? */
export declare function frameReportsSidebarCollapsed(): boolean;
/**
 * The pure selection predicate: is this a different real session chosen while
 * the feature is armed? Distinguishing a real pick from activity echoes (an
 * unchanged or cleared selection) is the machine's session-identity guard and
 * is kept out of the live-DOM/machine path for unit testability.
 * @param enabled - whether the persisted flag is on.
 * @param previousSession - the previously current session (undefined before any).
 * @param nextSession - the newly current session (undefined when none/blank).
 * @returns whether this is a selection the machine should evaluate.
 */
export declare function isRealSessionSelection(enabled: boolean, previousSession: string | undefined, nextSession: string | undefined): boolean;
/**
 * The collapse state machine.
 */
export declare class AutoCollapseMachine {
    #private;
    private readonly isCollapsed;
    private readonly collapse;
    /** The most recent decision, exposed for tests and inspection. */
    lastDecision: CollapseDecision;
    /**
     * @param isCollapsed - reads the live collapsed ground truth.
     * @param collapse - performs the sidebar collapse (a flip via ctx.layout).
     */
    constructor(isCollapsed?: ReadSidebarCollapsed, collapse?: CollapseSidebar);
    /**
     * Evaluate one session-change notification.
     * @param previousSession - the previously current session id.
     * @param nextSession - the newly current session id.
     * @param enabled - whether the persisted flag is on.
     * @returns what this machine decided to do.
     */
    onSessionChange(previousSession: string | undefined, nextSession: string | undefined, enabled: boolean): CollapseDecision;
    /** Drop the hold the moment the frame reports collapsed, from any entry. */
    private reconcileSuppression;
}
//# sourceMappingURL=collapse-machine.d.ts.map