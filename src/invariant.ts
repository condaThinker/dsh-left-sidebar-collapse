/**
 * Package-owned invariant companion for `dsh-left-sidebar-collapse`.
 * @module dsh-left-sidebar-collapse/invariant
 */

/* jscpd:ignore-start */
import type { Context } from '@deepseek-ai/cordis'
import type { InvariantInstaller } from '@deepseek-ai/dsh-invariants'

const PACKAGE_NAME = 'dsh-left-sidebar-collapse'

/** Cordis companion plugin name. */
export const name = 'dsh-left-sidebar-collapse-invariant'
/** Service required before the companion can reserve package ownership. */
export const inject = ['invariants']

/**
 * No runtime invariant: a browser-side surface plugin whose node half owns no
 * event stream or mutable runtime data; the persisted preference and the
 * collapse gesture are host and layout contracts covered there.
 */
const install: InvariantInstaller = () => {}

/**
 * Register this package's invariant companion.
 * @param ctx - Cordis context carrying the invariant service.
 * @returns the installed registration's disposer after setup succeeds.
 */
export const apply = (ctx: Context): Promise<() => void> =>
  Promise.resolve(ctx.invariants.register(PACKAGE_NAME, install))
/* jscpd:ignore-end */
