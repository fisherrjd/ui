// vite plugin for @fisherrjd/ui. vite.config.ts is the one place an app
// says how Jade's theme looks for it — palette/colors, fonts, style, radius —
// and this plugin
//   - writes the theme's CSS variables and font links into index.html
//   - injects the pre-paint script: saved mode + data-look before first paint
//   - serves the resolved theme to useTheme and the theme lab
//     (virtual:fisherrjd-ui)
//   - keeps vite from pre-bundling this package: it ships .vue source
//   - supports `bun link @fisherrjd/ui` for editing styles live inside an app
import { existsSync, realpathSync } from 'node:fs'
import { join, sep } from 'node:path'
import { searchForWorkspaceRoot } from 'vite'
import { fontHref, resolveTheme, themeCss } from './src/theme/derive.js'

export { PALETTES } from './src/theme/derive.js'

const PKG = '@fisherrjd/ui'
const VIRTUAL = 'virtual:fisherrjd-ui'
const RESOLVED = '\0' + VIRTUAL

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
  const theme = resolveTheme(options)

  return {
    name: PKG,
    config(user) {
      // skipped inside this repo (the playground), where the package isn't a dep
      const root = user.root ?? process.cwd()
      const installed = join(root, 'node_modules', PKG)
      if (!existsSync(installed)) return

      // linked: node_modules/@fisherrjd/ui is a symlink to the ui checkout,
      // so vite sees it as source outside the root. allow serving it, and
      // resolve vue & co from the app — the checkout has its own copies, and
      // two vues break reactivity.
      const real = realpathSync(installed)
      if (!real.includes(`${sep}node_modules${sep}`)) {
        return {
          server: { fs: { allow: [searchForWorkspaceRoot(root), real] } },
          resolve: { dedupe: ['vue', ...DEPS] },
          optimizeDeps: { exclude: [PKG], include: DEPS },
        }
      }

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
      if (id === RESOLVED) return `export default ${JSON.stringify(theme)}`
    },
    transformIndexHtml() {
      const families = [...new Set(Object.values(theme.fonts))]
      const fonts = families
        .map((name) => [name, fontHref(name)])
        .filter(([, href]) => href)
        .map(([name, href]) => ({
          tag: 'link',
          attrs: { rel: 'stylesheet', href, 'data-ui-font': name },
          injectTo: 'head',
        }))
      return [
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, injectTo: 'head' },
        ...fonts,
        // the theme lab rewrites this tag live, by id
        { tag: 'style', attrs: { id: 'ui-theme' }, children: themeCss(theme), injectTo: 'head' },
        { tag: 'script', children: prePaint(theme), injectTo: 'head' },
      ]
    },
  }
}

// mirrors useTheme's initial state
function prePaint(theme) {
  const c = { look: theme.style, mode: theme.defaultMode, locked: theme.lockMode, key: theme.keys.mode }
  return `
      // ${PKG}: apply the look and the saved mode before first paint
      ;(() => {
        const c = ${JSON.stringify(c)}
        let mode = c.mode
        if (!c.locked) {
          const saved = localStorage.getItem(c.key)
          if (saved === 'light' || saved === 'dark') mode = saved
        }
        document.documentElement.dataset.look = c.look
        document.documentElement.classList.toggle('dark', mode === 'dark')
      })()
    `
}
