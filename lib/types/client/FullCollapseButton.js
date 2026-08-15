import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
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
import { useEffect, useMemo, useState } from 'react';
import { IconPanelLeftOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './FullCollapseButton.module.css';
/**
 * Live observation of the frame's collapsed signal. Returns true while the
 * sidebar renders collapsed (`data-sidebar-collapsed` on the frame root).
 */
function useSidebarCollapsed() {
    const [collapsed, setCollapsed] = useState(() => document.querySelector('[data-sidebar-collapsed]') !== null);
    useEffect(() => {
        const read = () => {
            setCollapsed(document.querySelector('[data-sidebar-collapsed]') !== null);
        };
        read();
        const observer = new MutationObserver(read);
        observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-sidebar-collapsed'] });
        return () => observer.disconnect();
    }, []);
    return collapsed;
}
/**
 * Render the floating expand button (and the rail-hiding style) when the
 * sidebar is collapsed and fully-collapse is on.
 * @param props - composed slot props.
 * @returns the overlay entry, or null when inactive.
 */
export function FullCollapseButton({ useAutoCollapseSidebar, expand, t }) {
    const flags = useAutoCollapseSidebar(snapshot => snapshot);
    const collapsed = useSidebarCollapsed();
    const active = flags.fullyCollapse && collapsed;
    // Fully reclaim the collapsed rail: collapse the sidebar grid track to 0 so
    // the center column spans the whole frame. Overriding the inline
    // `grid-template-columns` is the only way a surface plugin can move the
    // track (the layout store is not on the cross-plugin contract); `!important`
    // beats the inline style. Selector pins to the stable frame-root attribute,
    // never to a hashed module class. The other two tracks stay put: 0px for the
    // sidebar, `minmax(0,1fr)` center, and the details track untouched.
    const styleText = useMemo(() => active
        ? `[data-sidebar-collapsed] { grid-template-columns: 0 minmax(0, 1fr) 0 !important; }`
            + `[data-sidebar-collapsed] [data-slot="conversation.session.header"] > header { padding-left: 48px !important; }`
        : ``, [active]);
    if (!active)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("style", { children: styleText }), _jsx("button", { type: "button", className: css.expand, "aria-label": t('expandButton'), onClick: expand, children: _jsx(IconPanelLeftOutline16, { size: 18 }) })] }));
}
//# sourceMappingURL=FullCollapseButton.js.map