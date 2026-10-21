/// <reference path="../virtual.d.ts" />
import theme from 'virtual:fisherrjd-ui'
import { ref, watchEffect } from 'vue'
import type { Mode } from './derive'

// the app's theme as configured in vite.config.ts (ui({ ... }))
export const THEME = theme

// ui({ lockMode: true }) pins the app to its default mode: the header drops
// its toggle, and nothing is read from or saved to localStorage
export const LOCKED = theme.lockMode

function initialMode(): Mode {
  if (LOCKED) return theme.defaultMode
  const saved = localStorage.getItem(theme.keys.mode)
  return saved === 'light' || saved === 'dark' ? saved : theme.defaultMode
}

// module-scope singleton: every component shares the same mode
const mode = ref<Mode>(initialMode())

watchEffect(() => {
  document.documentElement.classList.toggle('dark', mode.value === 'dark')
  if (!LOCKED) localStorage.setItem(theme.keys.mode, mode.value)
})

export function useTheme() {
  const setMode = (next: Mode) => {
    mode.value = next
  }
  const toggleMode = () => {
    mode.value = mode.value === 'dark' ? 'light' : 'dark'
  }
  return { mode, setMode, toggleMode }
}
