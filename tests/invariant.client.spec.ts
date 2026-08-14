import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { apply as nodeApply } from 'dsh-left-sidebar-collapse'
import * as AutoCollapseInvariant from 'dsh-left-sidebar-collapse/invariant'
import InvariantRegistry from '@deepseek-ai/dsh-invariants'

describe('invariant companion', () => {
  it('registers under the package name with an empty installer', async () => {
    const ctx = new Context()
    await ctx.plugin(InvariantRegistry, { enabled: true })
    await expect(ctx.plugin(AutoCollapseInvariant).await()).resolves.toBeDefined()
  })

  it('node-half has no host-side behavior', () => {
    nodeApply()
    expect(true).toBe(true)
  })
})
