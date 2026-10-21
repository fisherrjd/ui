# @fisherrjd/ui

**Jade's theme**: one look for every app built from
[app-template](https://github.com/fisherrjd/app-template), recolorable and
refontable per app. It holds the theme engine, base styles and utilities,
the shadcn-vue primitives, and the theme runtime. Apps install it as a git
dependency, so a change here reaches every app with one command.

## Theming an app

Everything lives in the app's `vite.config.ts`:

```ts
import ui from '@fisherrjd/ui/vite'

plugins: [
  vue(),
  tailwindcss(),
  ui({
    palette: 'gold',                       // starting colors
    colors: { accent: '#c98f52' },          // override any of the 4 seeds
    fonts: { heading: 'Cinzel', body: 'IBM Plex Sans', mono: 'IBM Plex Mono' },
    style: 'hud',                           // line | block | hud
    radius: 0,                              // px
    defaultMode: 'dark',                    // lockMode: true pins it
  }),
]
```

Every option is optional; `ui()` is evergreen, Inter Tight + JetBrains Mono,
line style, 6px corners, dark.

- **4 seed colors make every color.** `primary` (buttons, active states,
  charts), `accent` (pending, hovers, second series), `neutral` (tints every
  grey: only its hue really counts), `danger`. Backgrounds, borders, muted
  text, hover surfaces, chart colors, and success/warning are derived from
  them for dark and light. Every text color is checked to hit 4.5:1 contrast
  on its background.
- **Palettes** are just named seeds: evergreen, lime, crimson, ember,
  lagoon, cobalt, gold, synth, blueprint, dusk.
- **3 fonts:** headings, body, and mono (numbers, labels, code). Any Google
  Fonts family works. The ones in `FONTS` (`src/theme/derive.js`) load all
  their weights, any other loads at 400. Use `'system'` for no web font.
- **3 styles:**
  - `line`: hairlines and flat panels.
  - `block`: 2px outlines, hard offset shadows (`shadow` px), loud titles.
  - `hud`: console panels with corner brackets, glow and a grid backdrop.

**Finding a look:** open any app's `/styleguide`. Its **theme lab**
repaints the whole app live (palettes, color pickers, fonts, style, radius,
mode) and prints the `ui({ … })` call to paste back into `vite.config.ts`.
It also shows contrast checks.

How it works: the plugin generates the CSS variables (`<style id="ui-theme">`)
and font links into `index.html`, and a pre-paint script sets the saved mode
and `data-look` before first paint. `styles/looks.css` restyles the
primitives per look by their `data-slot`.

## Change the theme itself, ship it to every app

1. `direnv allow`, then `dev`: the styleguide playground on `:3099` (theme
   lab included).
2. Edit `styles/`, `src/components/ui/`, or the color math in
   `src/theme/derive.js`; the playground repaints as you save.
3. `check`, commit, push to main.
4. In each app: `ui-update` (= `bun update @fisherrjd/ui` + typecheck), look
   at its `/styleguide`, commit `bun.lock`.

Apps only move when they run `ui-update`: their `bun.lock` pins the commit.

**Try a change inside a real app before pushing:** run `bun link` here, then
`bun link @fisherrjd/ui` in the app, and restart its `dev`. The plugin
handles the symlink. To undo: `bun install --force`.

## What's in it

| path | what | apps import |
| --- | --- | --- |
| `src/theme/derive.js` | seeds → tokens, palettes, fonts, CSS generation | (via the plugin) |
| `styles/index.css` | token wiring, base styles, `card-hover`, `md-prose`, `rise-in`, page transitions | `@import "@fisherrjd/ui/styles.css"` |
| `styles/looks.css` | the line / block / hud rules | (via styles.css) |
| `src/components/ui/` | shadcn-vue primitives | `@fisherrjd/ui/button`, `…/dialog`, … |
| `src/theme/` | `useTheme` (mode), `THEME`, `LOCKED`, `ThemeToggle` | `@fisherrjd/ui/theme` |
| `src/styleguide/` | `ThemeLab`, `ColorSwatches`, `TypeScale`, `ComponentGallery` | `@fisherrjd/ui/styleguide` |
| `src/lib/utils.ts` | `cn` | `@fisherrjd/ui/utils` |
| `vite.js` | the `ui()` plugin (+ `PALETTES`) | `@fisherrjd/ui/vite` |

It ships source (`.vue`/`.ts`), not a build: the app's vite compiles it, and
`styles/index.css` has an `@source` so tailwind generates the components'
classes even from inside `node_modules`.

Tokens apps can use as tailwind colors: the shadcn set (`background`,
`primary`, `muted-foreground`, …) plus `sidebar`, `outline`, `primary-text`
(primary that's safe as text), `highlight` (accent as text), `accent-fill`,
`success`, `warning`, `chart-1`…`chart-4`, and the fonts `font-heading`,
`font-sans`, `font-mono`.

## Add a palette

Add an entry to `PALETTES` in `src/theme/derive.js` (4 `#rrggbb` seeds) and
its name to `PaletteName` in `derive.d.ts`.

## Add a primitive

```sh
add <component>    # shadcn-vue CLI, then cleaned up
```

The CLI writes `@/` imports and its registry currently emits
`import { cn } from "cn"` along with an unrelated npm `cn` package. `add`
rewrites the imports relative and keeps package.json to genuinely new
deps. Package code must never import `@/`: every app has its own `@/`. `check`
catches it, because `tsconfig.app.json` has no `@/` path. If the CLI touches
`styles/`, revert that part: tokens are generated, not hand-written.

If the new primitive should follow the block/hud looks, add its `data-slot`
to the matching selectors in `styles/looks.css`.

## Rules of thumb

- **Belongs here:** anything that should look the same in every app.
- **Stays in the app:** pattern components (dashboard, data, forms…) and
  app-only CSS. Use theme tokens (`text-success`, `bg-chart-2`, …), not
  Tailwind palette colors, so they follow the app's colors.
- **One app needs a primitive to differ:** copy it locally rather than
  forking the shared one.
- **Breaking a prop or export:** grep the apps first, or update them in the
  same pass.
