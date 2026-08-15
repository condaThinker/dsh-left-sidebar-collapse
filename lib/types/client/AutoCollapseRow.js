import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { IconCheckOutline16 } from '@deepseek-ai/dsh-client-ui-primitives';
import css from './AutoCollapseRow.module.css';
/** One title/description + switch row. */
function SwitchRow(props) {
    return (_jsxs("div", { className: css.row, children: [_jsxs("div", { className: css.rowText, children: [_jsx("div", { className: css.title, children: props.title }), _jsx("div", { className: css.desc, children: props.description })] }), _jsx("button", { type: "button", role: "switch", "aria-checked": props.checked, "aria-label": props.title, className: css.switch, "data-on": props.checked || undefined, onClick: props.onToggle, children: _jsx("span", { className: css.knob, children: props.checked && _jsx(IconCheckOutline16, { className: css.check }) }) })] }));
}
/**
 * Render the auto-collapse + fully-collapse toggle rows.
 * @param props - composed slot props.
 * @returns the rows.
 */
export function AutoCollapseRow({ useAutoCollapseSidebar, setEnabled, setFullyCollapse, t }) {
    const state = useAutoCollapseSidebar(snapshot => snapshot);
    return (_jsxs(_Fragment, { children: [_jsx(SwitchRow, { title: t('title'), description: t('description'), checked: state.enabled, onToggle: () => { setEnabled(!state.enabled); } }), _jsx(SwitchRow, { title: t('fullTitle'), description: t('fullDescription'), checked: state.fullyCollapse, onToggle: () => { setFullyCollapse(!state.fullyCollapse); } })] }));
}
//# sourceMappingURL=AutoCollapseRow.js.map