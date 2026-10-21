import type { Plugin } from 'vite'
import type { ThemeOptions } from './src/theme/derive.js'

export type UiOptions = ThemeOptions
export { PALETTES } from './src/theme/derive.js'

export default function ui(options?: UiOptions): Plugin
