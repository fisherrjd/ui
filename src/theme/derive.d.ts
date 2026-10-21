export type Mode = 'light' | 'dark'
export type Style = 'line' | 'block' | 'hud'
export type PaletteName =
  | 'evergreen'
  | 'lime'
  | 'crimson'
  | 'ember'
  | 'lagoon'
  | 'cobalt'
  | 'gold'
  | 'synth'
  | 'blueprint'
  | 'dusk'

/** #rrggbb */
export interface Seeds {
  /** brand color: buttons, active states, charts */
  primary: string
  /** second highlight: pending states, hovers, secondary charts */
  accent: string
  /** tints every grey (backgrounds, borders, text) — only its hue really counts */
  neutral: string
  danger: string
}

export interface Fonts {
  /** headings and card titles */
  heading: string
  /** everything else */
  body: string
  /** numbers, labels, code */
  mono: string
}

/** what an app writes in vite.config.ts: ui({ ... }) */
export interface ThemeOptions {
  /** starting colors (default: evergreen) */
  palette?: PaletteName
  /** override any seed of the palette */
  colors?: Partial<Seeds>
  /** Google Fonts family names, or 'system' */
  fonts?: Partial<Fonts>
  /** line: hairlines, flat · block: 2px outlines + hard shadows · hud: console panels + corner brackets */
  style?: Style
  /** corner radius in px (default 6) */
  radius?: number
  /** block style's hard-shadow offset in px (default 4) */
  shadow?: number
  /** default: dark */
  defaultMode?: Mode
  /** pin defaultMode: no toggle, nothing saved */
  lockMode?: boolean
}

export interface Theme {
  palette: PaletteName
  colors: Seeds
  fonts: Fonts
  style: Style
  radius: number
  shadow: number
  defaultMode: Mode
  lockMode: boolean
  keys: { mode: string }
}

export const PALETTES: Record<PaletteName, Seeds>
export const FONTS: Record<string, { kind: 'sans' | 'serif' | 'mono'; axes: string }>
export const STYLES: Style[]
export const DEFAULTS: Omit<Theme, 'colors' | 'keys'>
export function resolveTheme(options?: ThemeOptions): Theme
export function derive(colors: Seeds, mode: Mode): Record<string, string>
export function contrast(a: string, b: string): number
export function fontHref(name: string): string | null
export function themeCss(theme: Theme): string
