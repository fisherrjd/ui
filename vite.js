// vite plugin for @fisherrjd/ui. vite.config.ts is the one place an app says
// which theme presets it offers and its defaults; this plugin
//   - serves that config to useTheme (virtual:fisherrjd-ui)
//   - injects the pre-paint script into index.html, so the saved theme and
//     mode apply before first paint (no flash)
//   - keeps vite from pre-bundling this package: it ships .vue source
import { existsSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const PKG = '@fisherrjd/ui'
const VIRTUAL = 'virtual:fisherrjd-ui'
const RESOLVED = '\0' + VIRTUAL

// the house default when an app doesn't pick
const DEFAULT_THEME = 'evergreen'

// every preset this package ships = every css file in styles/themes
const PRESETS = readdirSync(new URL('./styles/themes', import.meta.url))
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.slice(0, -'.css'.length))

// what the components import. pre-bundled up front, or the first page load
// discovers them, re-optimizes, and reloads.
const DEPS = [
  '@lucide/vue',
  '@vueuse/core',
  'class-variance-authority',
  'clsx',
  'reka-ui',
  'tailwind-merge',
  'vue-sonner',
]

/** @param {import('./vite').UiOptions} [options] */
export default function ui(options = {}) {
  const themes = options.themes ?? PRESETS
  const config = {
    themes,
    defaultTheme: options.defaultTheme ?? options.themes?.[0] ?? DEFAULT_THEME,
    defaultMode: options.defaultMode ?? 'dark',
    locked: options.lock ?? false,
    keys: { theme: 'app.theme', mode: 'app.mode' },
  }

  const unknown = themes.filter((t) => !PRESETS.includes(t))
  if (unknown.length) {
    throw new Error(`[${PKG}] unknown theme(s) ${unknown.join(', ')} — have: ${PRESETS.join(', ')}`)
  }
  if (!themes.includes(config.defaultTheme)) {
    throw new Error(`[${PKG}] defaultTheme '${config.defaultTheme}' isn't in themes`)
  }

  return {
    name: PKG,
    config(user) {
      // skipped inside this repo (the playground), where the package isn't a dep
      const root = user.root ?? process.cwd()
      if (!existsSync(join(root, 'node_modules', PKG))) return
      return {
        optimizeDeps: {
          exclude: [PKG],
          include: DEPS.map((d) => `${PKG} > ${d}`),
        },
      }
    },
    resolveId(id) {
      if (id === VIRTUAL) return RESOLVED
    },
    load(id) {
      if (id === RESOLVED) return `export default ${JSON.stringify(config)}`
    },
    transformIndexHtml() {
      return [{ tag: 'script', children: prePaint(config), injectTo: 'head' }]
    },
  }
}

// mirrors useTheme's initial state; a saved theme the app no longer offers
// falls back to the default instead of painting unstyled
function prePaint(c) {
  return `
      // ${PKG}: apply the saved theme/mode before first paint
      ;(() => {
        const c = ${JSON.stringify(c)}
        let theme = c.defaultTheme
        let mode = c.defaultMode
        if (!c.locked) {
          const t = localStorage.getItem(c.keys.theme)
          const m = localStorage.getItem(c.keys.mode)
          if (c.themes.includes(t)) theme = t
          if (m === 'light' || m === 'dark') mode = m
        }
        document.documentElement.dataset.theme = theme
        document.documentElement.classList.toggle('dark', mode === 'dark')
      })()
    `
}
