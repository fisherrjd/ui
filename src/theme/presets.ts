// every preset this package ships, in picker order. adding one = a css file
// in styles/themes/ + its @import in styles/index.css + an entry here.
// apps choose which of these they offer via ui({ themes }) in vite.config.ts.
export const PRESETS = [
  { id: 'evergreen', label: 'Evergreen' },
  { id: 'dusk', label: 'Dusk' },
  { id: 'earthy', label: 'Earthy' },
  { id: 'grapebox', label: 'Grapebox' },
] as const

export type ThemeId = (typeof PRESETS)[number]['id']
export type Mode = 'light' | 'dark'

// every token a preset must define, in display order
export const THEME_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
] as const
