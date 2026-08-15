/**
 * Floating "expand sidebar" button that appears when the sidebar is collapsed
 * AND the "fully collapse" preference is on. While active it also hides the
 * DSH 56px rail (the collapsed grid column) so the center reclaims the space,
 * leaving exactly one expand affordance in the top-left corner.
 *
 * Visibility is reactive to the stable `data-sidebar-collapsed` frame signal
 * (a MutationObserver, not a hashed class) and to the persisted flag. Clicking
 * expands the sidebar through the layout face.
 */
import type { SnapshotStore } from '@deepseek-ai/dsh-client-runtime/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AutoCollapseSidebarKey } from './locales.ts';
import type { AutoCollapseSidebarState } from './settings-store.ts';
/** Registration-side face. */
export interface FullCollapseButtonInjected {
    hooks: {
        /** Persisted flags bound as useAutoCollapseSidebar. */
        autoCollapseSidebar: SnapshotStore<AutoCollapseSidebarState>;
    };
    /** Expand the sidebar (the flip via ctx.layout). */
    expand: () => void;
}
/** Full component props. */
export type FullCollapseButtonProps = PropsRuntime<'shell.overlay'> & PropsLocale<'settings.autoCollapseSidebar'> & InjectFace<FullCollapseButtonInjected>;
/**
 * Render the floating expand button (and the rail-hiding style) when the
 * sidebar is collapsed and fully-collapse is on.
 * @param props - composed slot props.
 * @returns the overlay entry, or null when inactive.
 */
export declare function FullCollapseButton({ useAutoCollapseSidebar, expand, t }: FullCollapseButtonProps): import("react").JSX.Element | null;
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Auto-collapse-sidebar copy. */
        'settings.autoCollapseSidebar': AutoCollapseSidebarKey;
    }
}
//# sourceMappingURL=FullCollapseButton.d.ts.map