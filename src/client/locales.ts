/** Locale bundles for the auto-collapse-sidebar settings rows and button. */

/** Locale keys the surfaces render. */
export type AutoCollapseSidebarKey =
  | 'title' | 'description'
  | 'fullTitle' | 'fullDescription'
  | 'expandButton'

/** English copy. */
export const en: Record<AutoCollapseSidebarKey, string> = {
  title: 'Auto-collapse sidebar',
  description: 'Collapse the left sidebar after you select a conversation, on screen sizes that fit it.',
  fullTitle: 'Fully collapse',
  fullDescription: 'When the sidebar is collapsed, tuck it fully away and show only one expand button.',
  expandButton: 'Open sidebar',
}

/** Simplified Chinese copy. */
export const zh: Record<AutoCollapseSidebarKey, string> = {
  title: '自动收起侧边栏',
  description: '选中会话后自动收起左侧边栏。',
  fullTitle: '完全缩回',
  fullDescription: '侧边栏收起后完全隐藏，只保留一个展开按钮。',
  expandButton: '打开侧边栏',
}
