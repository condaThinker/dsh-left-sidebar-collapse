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
/** Read, live every call: is the frame currently rendering the sidebar collapsed? */
export function frameReportsSidebarCollapsed() {
    return document.querySelector('[data-sidebar-collapsed]') !== null;
}
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
export function isRealSessionSelection(enabled, previousSession, nextSession) {
    return enabled && previousSession !== undefined && previousSession !== nextSession && nextSession !== undefined;
}
/**
 * The collapse state machine.
 */
export class AutoCollapseMachine {
    isCollapsed;
    collapse;
    /** The most recent decision, exposed for tests and inspection. */
    lastDecision = 'ignored';
    /**
     * True after this machine collapsed, until the frame confirms the sidebar is
     * collapsed. While set, the machine holds all further collapses so the flip
     * can never fire twice for one selection (feedback re-toggle / stale read).
     */
    #suppress = false;
    /** The session whose selection set the hold, to release it on a new pick. */
    #suppressFor = undefined;
    /**
     * @param isCollapsed - reads the live collapsed ground truth.
     * @param collapse - performs the sidebar collapse (a flip via ctx.layout).
     */
    constructor(isCollapsed = frameReportsSidebarCollapsed, collapse = () => { }) {
        this.isCollapsed = isCollapsed;
        this.collapse = collapse;
    }
    /**
     * Evaluate one session-change notification.
     * @param previousSession - the previously current session id.
     * @param nextSession - the newly current session id.
     * @param enabled - whether the persisted flag is on.
     * @returns what this machine decided to do.
     */
    onSessionChange(previousSession, nextSession, enabled) {
        if (!isRealSessionSelection(enabled, previousSession, nextSession)) {
            this.reconcileSuppression();
            this.lastDecision = 'ignored';
            return 'ignored';
        }
        // A genuinely new pick for a different session starts a clean decision
        // even if the previous collapse's confirmation is still in flight.
        if (this.#suppress && this.#suppressFor !== nextSession) {
            this.#suppress = false;
            this.#suppressFor = undefined;
        }
        // Holding a collapse we already produced for this selection until the
        // frame confirms it, so the layout's own feedback cannot flip us back.
        if (this.#suppress) {
            // Once the frame reports collapsed, the collapse is confirmed: clear the
            // hold so a genuinely new selection can collapse again later.
            if (this.isCollapsed())
                this.#suppress = false;
            this.lastDecision = 'already-collapsed';
            return 'already-collapsed';
        }
        // Already collapsed (or the click itself left it collapsed): leave it.
        if (this.isCollapsed()) {
            this.lastDecision = 'already-collapsed';
            return 'already-collapsed';
        }
        // Expanded: collapse exactly once and hold until the frame confirms it.
        this.collapse();
        this.#suppress = true;
        this.#suppressFor = nextSession;
        this.lastDecision = 'collapsed';
        return 'collapsed';
    }
    /** Drop the hold the moment the frame reports collapsed, from any entry. */
    reconcileSuppression() {
        if (this.#suppress && this.isCollapsed()) {
            this.#suppress = false;
            this.#suppressFor = undefined;
        }
    }
}
//# sourceMappingURL=collapse-machine.js.map