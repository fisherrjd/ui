/// <reference path="../virtual.d.ts" />
import config from 'virtual:fisherrjd-ui'
import { ref, watchEffect } from 'vue'
import { type Mode, PRESETS, type ThemeId } from './presets'

// the presets this app offers (ui({ themes }) in vite.config.ts) — pickers
// and the styleguide swatches are driven by this
export const THEMES = PRESETS.filter((t) => config.themes.includes(t.id))

// ui({ lock: true }) pins the app to its default theme + mode: the header
// drops its picker and toggle, and nothing is read from or saved to
// localStorage. The styleguide can still preview the others for a visit.
export const LOCKED = config.locked

const DEFAULT_THEME = config.defaultTheme as ThemeId

function initialTheme(): ThemeId {
  if (LOCKED) return DEFAULT_THEME
  const saved = localStorage.getItem(config.keys.theme)
  return THEMES.some((t) => t.id === saved) ? (saved as ThemeId) : DEFAULT_THEME
}

function initialMode(): Mode {
  if (LOCKED) return config.defaultMode
  const saved = localStorage.getItem(config.keys.mode)
  if (saved === 'light' || saved === 'dark') return saved
  return config.defaultMode
}

// module-scope singleton: every component shares the same theme state
const theme = ref<ThemeId>(initialTheme())
const mode = ref<Mode>(initialMode())

// locked, changes (the styleguide's previews) apply but aren't saved
watchEffect(() => {
  document.documentElement.dataset.theme = theme.value
  if (!LOCKED) localStorage.setItem(config.keys.theme, theme.value)
})

watchEffect(() => {
  document.documentElement.classList.toggle('dark', mode.value === 'dark')
  if (!LOCKED) localStorage.setItem(config.keys.mode, mode.value)
})

export function useTheme() {
  const setTheme = (id: ThemeId) => {
    theme.value = id
  }
  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }
  /** locked: back to the pinned theme — the styleguide calls this on its way out */
  const restore = () => {
    if (!LOCKED) return
    theme.value = DEFAULT_THEME
    mode.value = config.defaultMode
  }
  return { theme, mode, setTheme, toggleMode, restore }
}
