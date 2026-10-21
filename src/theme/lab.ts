import { ref } from 'vue'
import { DEFAULTS, fontHref, type Mode, PALETTES, type Theme, themeCss } from './derive'
import { THEME } from './useTheme'

/** fired on window after the theme lab repaints, for readers like ColorSwatches */
export const THEME_CHANGE = 'ui-theme-change'

const clone = (theme: Theme): Theme => JSON.parse(JSON.stringify(theme))

// module scope: the lab's edits stay applied (and in the lab) while you
// visit other pages, until a reload brings back vite.config.ts's theme
export const draft = ref<Theme>(clone(THEME))

export function resetDraft() {
  draft.value = clone(THEME)
}

/** paint a theme on the live page: CSS variables, look, fonts */
export function applyTheme(theme: Theme) {
  let style = document.getElementById('ui-theme')
  if (!style) {
    style = document.createElement('style')
    style.id = 'ui-theme'
    document.head.append(style)
  }
  style.textContent = themeCss(theme)
  document.documentElement.dataset.look = theme.style
  for (const name of new Set(Object.values(theme.fonts))) {
    const href = fontHref(name)
    if (!href || document.querySelector(`link[data-ui-font="${CSS.escape(name)}"]`)) continue
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.dataset.uiFont = name
    document.head.append(link)
  }
  window.dispatchEvent(new Event(THEME_CHANGE))
}

/** the shortest ui({ ... }) call that reproduces a theme */
export function themeSnippet(theme: Theme, mode: Mode): string {
  const lines: string[] = []
  if (theme.palette !== DEFAULTS.palette) lines.push(`palette: '${theme.palette}',`)
  const base = PALETTES[theme.palette]
  const colors = Object.entries(theme.colors).filter(
    ([key, value]) => base[key as keyof typeof base] !== value.toLowerCase(),
  )
  if (colors.length) lines.push(`colors: { ${colors.map(([k, v]) => `${k}: '${v}'`).join(', ')} },`)
  const fonts = Object.entries(theme.fonts).filter(
    ([key, value]) => DEFAULTS.fonts[key as keyof typeof DEFAULTS.fonts] !== value,
  )
  if (fonts.length) lines.push(`fonts: { ${fonts.map(([k, v]) => `${k}: '${v}'`).join(', ')} },`)
  if (theme.style !== DEFAULTS.style) lines.push(`style: '${theme.style}',`)
  if (theme.radius !== DEFAULTS.radius) lines.push(`radius: ${theme.radius},`)
  if (theme.shadow !== DEFAULTS.shadow) lines.push(`shadow: ${theme.shadow},`)
  if (mode !== DEFAULTS.defaultMode) lines.push(`defaultMode: '${mode}',`)
  if (theme.lockMode) lines.push('lockMode: true,')
  return lines.length ? `ui({\n  ${lines.join('\n  ')}\n})` : 'ui()'
}
