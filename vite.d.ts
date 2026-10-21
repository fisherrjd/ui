import type { Plugin } from 'vite'
import type { Mode, ThemeId } from './src/theme/presets.ts'

export interface UiOptions {
  /** presets this app offers, in no particular order (default: all) */
  themes?: ThemeId[]
  /** first paint, and the fallback (default: themes[0], else evergreen) */
  defaultTheme?: ThemeId
  /** default: dark */
  defaultMode?: Mode
  /** pin to defaultTheme + defaultMode: no picker/toggle, nothing saved */
  lock?: boolean
}

export default function ui(options?: UiOptions): Plugin
