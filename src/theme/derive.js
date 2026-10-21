// Jade's theme, as data: 4 seed colors + 3 fonts + a style → every token an
// app uses. Shared by the vite plugin (writes the CSS at build time) and the
// styleguide's theme lab (rewrites it live in the browser), so both always
// agree. Colors are worked in OKLCH so lightness steps look even across hues,
// and every *-foreground is picked for contrast, not hand-tuned.

/** starting colors; any of them can be overridden per app */
export const PALETTES = {
  evergreen: { primary: '#3e986b', accent: '#d9cba8', neutral: '#141b18', danger: '#c4472f' },
  lime: { primary: '#c8f031', accent: '#5ee6ff', neutral: '#0d0f0d', danger: '#ff6b5b' },
  crimson: { primary: '#d93d42', accent: '#4f6fa8', neutral: '#1a1c22', danger: '#e07b2e' },
  ember: { primary: '#ff5c39', accent: '#ffcf33', neutral: '#171615', danger: '#e23b3b' },
  lagoon: { primary: '#14a89a', accent: '#f2b33d', neutral: '#1f2638', danger: '#e5534b' },
  cobalt: { primary: '#3d5afe', accent: '#ff7eb6', neutral: '#18181b', danger: '#e5484d' },
  gold: { primary: '#e0b040', accent: '#c98f52', neutral: '#241c13', danger: '#d0503a' },
  synth: { primary: '#22d3ee', accent: '#f472b6', neutral: '#0f1226', danger: '#fb7185' },
  blueprint: { primary: '#1f5fd1', accent: '#e8833a', neutral: '#12233d', danger: '#d23f3f' },
  dusk: { primary: '#a78bfa', accent: '#f9a8d4', neutral: '#17141f', danger: '#f87171' },
}

/** Google Fonts we know the weights of; any other family name loads at 400 */
export const FONTS = {
  'Inter Tight': { kind: 'sans', axes: 'wght@400;500;600;700' },
  Inter: { kind: 'sans', axes: 'wght@400;500;600;700' },
  'Space Grotesk': { kind: 'sans', axes: 'wght@400;500;700' },
  'IBM Plex Sans': { kind: 'sans', axes: 'wght@400;500;600;700' },
  Geist: { kind: 'sans', axes: 'wght@400;500;600;700' },
  'Plus Jakarta Sans': { kind: 'sans', axes: 'wght@400;500;600;700' },
  Nunito: { kind: 'sans', axes: 'wght@400;600;700' },
  Fredoka: { kind: 'sans', axes: 'wght@400;500;600' },
  Cinzel: { kind: 'serif', axes: 'wght@500;700' },
  Newsreader: { kind: 'serif', axes: 'opsz,wght@6..72,400;6..72,600;6..72,700' },
  'Cascadia Code': { kind: 'mono', axes: 'wght@400;500;600;700' },
  'JetBrains Mono': { kind: 'mono', axes: 'wght@400;500;700' },
  'IBM Plex Mono': { kind: 'mono', axes: 'wght@400;500;700' },
  'Geist Mono': { kind: 'mono', axes: 'wght@400;500;700' },
  'Space Mono': { kind: 'mono', axes: 'wght@400;700' },
}

export const STYLES = ['line', 'block', 'hud']

export const DEFAULTS = {
  palette: 'evergreen',
  fonts: { heading: 'Inter Tight', body: 'Inter Tight', mono: 'JetBrains Mono' },
  style: 'line',
  radius: 6,
  shadow: 4,
  defaultMode: 'dark',
  lockMode: false,
}

const HEX = /^#[0-9a-f]{6}$/i

/** options as written in vite.config.ts → a complete, validated theme */
export function resolveTheme(options = {}) {
  const palette = options.palette ?? DEFAULTS.palette
  if (!PALETTES[palette]) {
    throw new Error(`[@fisherrjd/ui] unknown palette '${palette}' — have: ${Object.keys(PALETTES).join(', ')}`)
  }
  const colors = { ...PALETTES[palette], ...options.colors }
  for (const [key, value] of Object.entries(colors)) {
    if (!HEX.test(value)) throw new Error(`[@fisherrjd/ui] colors.${key} must be #rrggbb, got '${value}'`)
  }
  const style = options.style ?? DEFAULTS.style
  if (!STYLES.includes(style)) {
    throw new Error(`[@fisherrjd/ui] unknown style '${style}' — have: ${STYLES.join(', ')}`)
  }
  return {
    palette,
    colors,
    fonts: { ...DEFAULTS.fonts, ...options.fonts },
    style,
    radius: options.radius ?? DEFAULTS.radius,
    shadow: options.shadow ?? DEFAULTS.shadow,
    defaultMode: options.defaultMode ?? DEFAULTS.defaultMode,
    lockMode: options.lockMode ?? DEFAULTS.lockMode,
    keys: { mode: 'app.mode' },
  }
}

// ————— color math: sRGB hex ⇄ OKLCH —————

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)

function oklch(hex) {
  const [r, g, b] = rgb(hex).map(lin)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { L, C: Math.hypot(A, B), h: Math.atan2(B, A) }
}

function linearRgb(L, C, h) {
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

/** OKLCH → hex, pulling chroma in until the color fits sRGB */
function hex(L, C, h) {
  let c = C
  let v = linearRgb(L, c, h)
  for (let i = 0; i < 60 && v.some((x) => x < -0.0005 || x > 1.0005); i++) {
    c *= 0.92
    v = linearRgb(L, c, h)
  }
  return `#${v
    .map((x) => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, x))))) * 255))
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')}`
}

function luminance(color) {
  const [r, g, b] = rgb(color).map(lin)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG contrast ratio, 1–21 */
export function contrast(a, b) {
  const x = luminance(a)
  const y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

/** hex → the "H S% L%" triplet the tokens use (hsl(var(--x)) in CSS) */
function triplet(color) {
  const [r, g, b] = rgb(color)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  let h = 0
  let s = 0
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1))
    h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
    h = Math.round(h * 60 + 360) % 360
  }
  return `${h} ${Math.round(s * 1000) / 10}% ${Math.round(l * 1000) / 10}%`
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** seeds + mode → every color token, as hex */
export function derive(colors, mode) {
  const P = oklch(colors.primary)
  const A = oklch(colors.accent)
  const N = oklch(colors.neutral)
  const D = oklch(colors.danger)
  // the neutral seed only lends its hue and a hint of chroma to the greys
  const nc = Math.min(N.C, 0.04)
  const n = (L, k = 1) => hex(L, nc * k, N.h)
  const dark = mode === 'dark'
  const ink = n(0.16)
  const on = (bg) => (contrast(bg, '#ffffff') >= contrast(bg, ink) ? '#ffffff' : ink)
  // a fill that carries text: nudge lightness away from its text until 4.5:1
  const fill = (L, C, h, step) => {
    let color = hex(L, C, h)
    for (let i = 0; i < 20 && contrast(color, on(color)) < 4.5; i++) {
      L += step
      color = hex(L, C, h)
    }
    return color
  }

  const t = dark
    ? {
        background: n(0.165),
        foreground: n(0.93, 0.25),
        card: n(0.195),
        popover: n(0.205),
        sidebar: n(0.15),
        secondary: n(0.26),
        muted: n(0.24),
        'muted-foreground': n(0.72, 0.5),
        border: n(0.285),
        input: n(0.305),
        outline: n(0.92, 0.35),
        primary: fill(clamp(P.L, 0.62, 0.9), P.C, P.h, 0.02),
        'primary-text': hex(clamp(P.L, 0.72, 0.92), P.C, P.h),
        accent: hex(0.26, Math.min(A.C, 0.05), A.h),
        'accent-foreground': hex(0.9, Math.min(A.C, 0.08), A.h),
        highlight: hex(clamp(A.L, 0.72, 0.9), A.C, A.h),
        'accent-fill': fill(clamp(A.L, 0.7, 0.88), A.C, A.h, 0.02),
        destructive: fill(clamp(D.L, 0.62, 0.72), D.C, D.h, 0.02),
        'chart-3': hex(0.76, Math.max(P.C, 0.12), P.h + 2.1),
        'chart-4': hex(0.76, Math.max(A.C, 0.12), A.h + 2.1),
      }
    : {
        background: n(0.975, 0.4),
        foreground: n(0.22, 0.6),
        card: n(0.995, 0.2),
        popover: n(0.995, 0.2),
        sidebar: n(0.955, 0.5),
        secondary: n(0.92, 0.6),
        muted: n(0.935, 0.6),
        'muted-foreground': n(0.47, 0.7),
        border: n(0.88, 0.6),
        input: n(0.86, 0.6),
        outline: n(0.2, 0.6),
        primary: fill(clamp(P.L, 0.42, 0.6), P.C, P.h, -0.02),
        'primary-text': hex(clamp(P.L, 0.36, 0.5), P.C, P.h),
        accent: hex(0.93, Math.min(A.C, 0.04), A.h),
        'accent-foreground': hex(0.3, Math.min(A.C, 0.08), A.h),
        highlight: hex(clamp(A.L, 0.4, 0.5), A.C, A.h),
        'accent-fill': fill(clamp(A.L, 0.72, 0.88), A.C, A.h, 0.02),
        destructive: fill(clamp(D.L, 0.45, 0.55), D.C, D.h, -0.02),
        'chart-3': hex(0.82, Math.max(P.C, 0.12), P.h + 2.1),
        'chart-4': hex(0.82, Math.max(A.C, 0.12), A.h + 2.1),
      }

  // status colors keep their meaning (green = good) whatever the palette,
  // at this theme's lightness and readable on its background
  const status = (L, C, h) => {
    let color = hex(L, C, h)
    for (let i = 0; i < 20 && contrast(color, t.background) < 4.5; i++) {
      L += dark ? 0.02 : -0.02
      color = hex(L, C, h)
    }
    return color
  }

  return {
    ...t,
    success: status(dark ? 0.74 : 0.5, 0.15, 2.53),
    warning: status(dark ? 0.8 : 0.55, 0.15, 1.3),
    'card-foreground': t.foreground,
    'popover-foreground': t.foreground,
    'secondary-foreground': t.foreground,
    'primary-foreground': on(t.primary),
    'accent-fill-foreground': on(t['accent-fill']),
    'destructive-foreground': on(t.destructive),
    ring: t['primary-text'],
    'chart-1': t.primary,
    'chart-2': t['accent-fill'],
  }
}

function stack(name, role) {
  if (name === 'system') {
    return role === 'mono'
      ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
      : 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
  }
  const kind = role === 'mono' ? 'mono' : (FONTS[name]?.kind ?? 'sans')
  const fallback =
    kind === 'mono' ? 'ui-monospace, monospace' : kind === 'serif' ? 'Georgia, serif' : 'ui-sans-serif, system-ui, sans-serif'
  return `"${name}", ${fallback}`
}

/** the stylesheet <link> for one font family (null for 'system') */
export function fontHref(name) {
  if (name === 'system') return null
  const family = name.replace(/ /g, '+')
  const axes = FONTS[name]?.axes
  return `https://fonts.googleapis.com/css2?family=${family}${axes ? `:${axes}` : ''}&display=swap`
}

/** a resolved theme → the CSS custom properties that drive everything */
export function themeCss(theme) {
  const block = (tokens) =>
    Object.entries(tokens)
      .map(([name, value]) => `--${name}: ${triplet(value)};`)
      .join(' ')
  const shape = [
    `--radius: ${theme.radius}px;`,
    `--shadow-offset: ${theme.shadow}px;`,
    `--ui-font-heading: ${stack(theme.fonts.heading, 'heading')};`,
    `--ui-font-body: ${stack(theme.fonts.body, 'body')};`,
    `--ui-font-mono: ${stack(theme.fonts.mono, 'mono')};`,
  ].join(' ')
  return [
    `:root { ${shape} ${block(derive(theme.colors, 'light'))} }`,
    `:root.dark { ${block(derive(theme.colors, 'dark'))} }`,
  ].join('\n')
}
