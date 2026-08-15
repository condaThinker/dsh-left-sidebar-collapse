window.__ModuleLoader__.load({
	id: "dsh-left-sidebar-collapse",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region \0dsh-css:/deepseekHarness/deepseek-harness/packages/client/ui-auto-collapse-sidebar/src/client/AutoCollapseRow.module.css.mjs
		const css$1 = "._0IRVBa_row{border-bottom:1px solid var(--dsw-alias-border-l2);align-items:center;gap:8px;padding:16px 0;display:flex}._0IRVBa_rowText{flex-direction:column;flex:1;gap:4px;min-width:0;padding-right:48px;display:flex}._0IRVBa_title{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:400;line-height:22px}._0IRVBa_desc{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:18px}._0IRVBa_switch{background:var(--dsw-alias-bg-module-platform);cursor:pointer;border:none;border-radius:12px;flex:none;justify-content:flex-start;align-items:center;width:40px;height:24px;padding:2px;transition:background-color .12s;display:inline-flex;position:relative}._0IRVBa_switch[data-on]{background:var(--dsw-alias-brand-primary)}._0IRVBa_switch:disabled{cursor:default;opacity:.5}._0IRVBa_knob{background:var(--dsw-alias-bg-base);border-radius:10px;justify-content:center;align-items:center;width:20px;height:20px;transition:transform .12s;display:inline-flex;box-shadow:0 1px 2px #0000003d}._0IRVBa_switch[data-on] ._0IRVBa_knob{transform:translate(16px)}._0IRVBa_check{color:var(--dsw-alias-brand-primary)}";
		const tagId$1 = "dsh-left-sidebar-collapse/AutoCollapseRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-left-sidebar-collapse";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var AutoCollapseRow_module_css_default = {
			"knob": "_0IRVBa_knob",
			"check": "_0IRVBa_check",
			"desc": "_0IRVBa_desc",
			"switch": "_0IRVBa_switch",
			"row": "_0IRVBa_row",
			"rowText": "_0IRVBa_rowText",
			"title": "_0IRVBa_title"
		};
		//#endregion
		//#region src/client/AutoCollapseRow.tsx
		/** One title/description + switch row. */
		function SwitchRow(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: AutoCollapseRow_module_css_default.row,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: AutoCollapseRow_module_css_default.rowText,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AutoCollapseRow_module_css_default.title,
						children: props.title
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: AutoCollapseRow_module_css_default.desc,
						children: props.description
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "switch",
					"aria-checked": props.checked,
					"aria-label": props.title,
					className: AutoCollapseRow_module_css_default.switch,
					"data-on": props.checked || void 0,
					onClick: props.onToggle,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: AutoCollapseRow_module_css_default.knob,
						children: props.checked && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline16, { className: AutoCollapseRow_module_css_default.check })
					})
				})]
			});
		}
		/**
		* Render the auto-collapse + fully-collapse toggle rows.
		* @param props - composed slot props.
		* @returns the rows.
		*/
		function AutoCollapseRow({ useAutoCollapseSidebar, setEnabled, setFullyCollapse, t }) {
			const state = useAutoCollapseSidebar((snapshot) => snapshot);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SwitchRow, {
				title: t("title"),
				description: t("description"),
				checked: state.enabled,
				onToggle: () => {
					setEnabled(!state.enabled);
				}
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SwitchRow, {
				title: t("fullTitle"),
				description: t("fullDescription"),
				checked: state.fullyCollapse,
				onToggle: () => {
					setFullyCollapse(!state.fullyCollapse);
				}
			})] });
		}
		//#endregion
		//#region src/client/collapse-machine.ts
		/** Read, live every call: is the frame currently rendering the sidebar collapsed? */
		function frameReportsSidebarCollapsed() {
			return document.querySelector("[data-sidebar-collapsed]") !== null;
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
		function isRealSessionSelection(enabled, previousSession, nextSession) {
			return enabled && previousSession !== void 0 && previousSession !== nextSession && nextSession !== void 0;
		}
		/**
		* The collapse state machine.
		*/
		var AutoCollapseMachine = class {
			isCollapsed;
			collapse;
			/** The most recent decision, exposed for tests and inspection. */
			lastDecision = "ignored";
			/**
			* True after this machine collapsed, until the frame confirms the sidebar is
			* collapsed. While set, the machine holds all further collapses so the flip
			* can never fire twice for one selection (feedback re-toggle / stale read).
			*/
			#suppress = false;
			/** The session whose selection set the hold, to release it on a new pick. */
			#suppressFor = void 0;
			/**
			* @param isCollapsed - reads the live collapsed ground truth.
			* @param collapse - performs the sidebar collapse (a flip via ctx.layout).
			*/
			constructor(isCollapsed = frameReportsSidebarCollapsed, collapse = () => {}) {
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
					this.lastDecision = "ignored";
					return "ignored";
				}
				if (this.#suppress && this.#suppressFor !== nextSession) {
					this.#suppress = false;
					this.#suppressFor = void 0;
				}
				if (this.#suppress) {
					if (this.isCollapsed()) this.#suppress = false;
					this.lastDecision = "already-collapsed";
					return "already-collapsed";
				}
				if (this.isCollapsed()) {
					this.lastDecision = "already-collapsed";
					return "already-collapsed";
				}
				this.collapse();
				this.#suppress = true;
				this.#suppressFor = nextSession;
				this.lastDecision = "collapsed";
				return "collapsed";
			}
			/** Drop the hold the moment the frame reports collapsed, from any entry. */
			reconcileSuppression() {
				if (this.#suppress && this.isCollapsed()) {
					this.#suppress = false;
					this.#suppressFor = void 0;
				}
			}
		};
		//#endregion
		//#region \0dsh-css:/deepseekHarness/deepseek-harness/packages/client/ui-auto-collapse-sidebar/src/client/FullCollapseButton.module.css.mjs
		const css = "._8X5XmW_expand{z-index:1000;background:var(--dsw-alias-bg-module-platform);width:36px;height:36px;color:var(--dsw-alias-label-primary);cursor:pointer;border:none;border-radius:8px;justify-content:center;align-items:center;display:inline-flex;position:fixed;top:10px;left:10px}._8X5XmW_expand:hover{background:var(--dsw-alias-interactive-bg-hover)}";
		const tagId = "dsh-left-sidebar-collapse/FullCollapseButton.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-left-sidebar-collapse";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var FullCollapseButton_module_css_default = { "expand": "_8X5XmW_expand" };
		//#endregion
		//#region src/client/FullCollapseButton.tsx
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
		/**
		* Live observation of the frame's collapsed signal. Returns true while the
		* sidebar renders collapsed (`data-sidebar-collapsed` on the frame root).
		*/
		function useSidebarCollapsed() {
			const [collapsed, setCollapsed] = (0, react.useState)(() => document.querySelector("[data-sidebar-collapsed]") !== null);
			(0, react.useEffect)(() => {
				const read = () => {
					setCollapsed(document.querySelector("[data-sidebar-collapsed]") !== null);
				};
				read();
				const observer = new MutationObserver(read);
				observer.observe(document.documentElement, {
					attributes: true,
					subtree: true,
					attributeFilter: ["data-sidebar-collapsed"]
				});
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
		function FullCollapseButton({ useAutoCollapseSidebar, expand, t }) {
			const flags = useAutoCollapseSidebar((snapshot) => snapshot);
			const collapsed = useSidebarCollapsed();
			const active = flags.fullyCollapse && collapsed;
			const styleText = (0, react.useMemo)(() => active ? "[data-sidebar-collapsed] { grid-template-columns: 0 minmax(0, 1fr) 0 !important; }[data-sidebar-collapsed] [data-slot=\"conversation.session.header\"] > header { padding-left: 48px !important; }" : ``, [active]);
			if (!active) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("style", { children: styleText }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				className: FullCollapseButton_module_css_default.expand,
				"aria-label": t("expandButton"),
				onClick: expand,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPanelLeftOutline16, { size: 18 })
			})] });
		}
		//#endregion
		//#region src/client/locales.ts
		/** English copy. */
		const en = {
			title: "Auto-collapse sidebar",
			description: "Collapse the left sidebar after you select a conversation, on screen sizes that fit it.",
			fullTitle: "Fully collapse",
			fullDescription: "When the sidebar is collapsed, tuck it fully away and show only one expand button.",
			expandButton: "Open sidebar"
		};
		/** Simplified Chinese copy. */
		const zh = {
			title: "自动收起侧边栏",
			description: "选中会话后自动收起左侧边栏。",
			fullTitle: "完全缩回",
			fullDescription: "侧边栏收起后完全隐藏，只保留一个展开按钮。",
			expandButton: "打开侧边栏"
		};
		//#endregion
		//#region src/client/settings-store.ts
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
		/** localStorage key owning the persisted flags. */
		const AUTO_COLLAPSE_SIDEBAR_STORE = "dsh.auto-collapse-sidebar";
		const INITIAL = {
			enabled: false,
			fullyCollapse: false
		};
		/**
		* Owner of the persisted flags. The store rehydrates from localStorage on
		* construction and persists each write; nothing else is needed, so the rows
		* are interactive from first paint.
		*/
		var AutoCollapseSidebarController = class {
			/** Row snapshot the renderer subscribes to. */
			store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(INITIAL, { persist: { name: AUTO_COLLAPSE_SIDEBAR_STORE } });
			constructor() {
				const snap = this.store.getSnapshot();
				if (snap.fullyCollapse === void 0) this.store.update((s) => {
					s.fullyCollapse = false;
				});
				if (snap.enabled === void 0) this.store.update((s) => {
					s.enabled = false;
				});
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
				if (this.store.getSnapshot().enabled === enabled) return;
				this.store.update((s) => {
					s.enabled = enabled;
				});
			}
			/**
			* Set the fully-collapse flag. A nothing-to-do write (same value) is
			* skipped; the store's persist option writes `localStorage` on every change.
			* @param fullyCollapse - next fully-collapse value.
			*/
			setFullyCollapse(fullyCollapse) {
				if (this.store.getSnapshot().fullyCollapse === fullyCollapse) return;
				this.store.update((s) => {
					s.fullyCollapse = fullyCollapse;
				});
			}
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "settings.autoCollapseSidebar";
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"layout",
			"sessions"
		];
		/**
		* Browser plugin body: register the settings row and the session listener.
		* @param ctx - Client root context.
		*/
		function apply(ctx) {
			const controller = new AutoCollapseSidebarController();
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-auto-collapse-sidebar: settings row dictionaries");
			ctx.slots.inject("settings.general.item", () => ctx.slots.register({
				name: "settings.general.item",
				id: "auto-collapse-sidebar",
				order: 12,
				locale: NS,
				inject: () => ({
					hooks: { autoCollapseSidebar: controller.store },
					setEnabled: (enabled) => controller.setEnabled(enabled),
					setFullyCollapse: (fullyCollapse) => controller.setFullyCollapse(fullyCollapse)
				})
			}, AutoCollapseRow));
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "auto-collapse-sidebar-expand",
				order: -100,
				locale: NS,
				inject: () => ({
					hooks: { autoCollapseSidebar: controller.store },
					expand: () => {
						ctx.layout.toggleSidebar();
					}
				})
			}, FullCollapseButton));
			const machine = new AutoCollapseMachine(frameReportsSidebarCollapsed, () => {
				ctx.layout.toggleSidebar();
			});
			let previous = ctx.sessions.list.getSnapshot().current;
			const stop = ctx.sessions.list.subscribe(() => {
				const current = ctx.sessions.list.getSnapshot().current;
				machine.onSessionChange(previous, current, controller.store.getSnapshot().enabled);
				previous = current;
			});
			ctx.effect(() => () => {
				stop();
			}, "ui-auto-collapse-sidebar: session listener");
		}
		//#endregion
		exports.AUTO_COLLAPSE_SIDEBAR_STORE = AUTO_COLLAPSE_SIDEBAR_STORE;
		exports.AutoCollapseMachine = AutoCollapseMachine;
		exports.apply = apply;
		exports.frameReportsSidebarCollapsed = frameReportsSidebarCollapsed;
		exports.inject = inject;
		exports.isRealSessionSelection = isRealSessionSelection;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map