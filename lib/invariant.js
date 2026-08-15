//#region lib/types/invariant.js
/**
* Package-owned invariant companion for `dsh-left-sidebar-collapse`.
* @module dsh-left-sidebar-collapse/invariant
*/
const PACKAGE_NAME = "dsh-left-sidebar-collapse";
/** Cordis companion plugin name. */
const name = "client-ui-auto-collapse-sidebar-invariant";
/** Service required before the companion can reserve package ownership. */
const inject = ["invariants"];
/**
* No runtime invariant: a browser-side surface plugin whose node half owns no
* event stream or mutable runtime data; the persisted preference and the
* collapse gesture are host and layout contracts covered there.
*/
const install = () => {};
/**
* Register this package's invariant companion.
* @param ctx - Cordis context carrying the invariant service.
* @returns the installed registration's disposer after setup succeeds.
*/
const apply = (ctx) => Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install));
//#endregion
export { apply, inject, name };
