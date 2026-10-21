# @fisherrjd/ui

The shared look for every app built from
[app-template](https://github.com/fisherrjd/app-template): theme presets,
tokens, base styles and utilities, shadcn-vue primitives, and the theme
runtime. Apps install it as a git dependency, so a style change here reaches
every app with one command.

## Change a style, ship it to every app

1. `direnv allow`, then `dev`: the styleguide playground on `:3099`.
2. Edit `styles/` or `src/components/ui/` and watch it repaint (HMR).
3. `check`, commit, push to main.
4. In each app: `ui-update` (= `bun update @fisherrjd/ui` + typecheck), look
   at its `/styleguide`, commit `bun.lock`.

Apps only move when they run `ui-update`: their `bun.lock` pins the commit.

Try a change inside an app before pushing: `bun link` here, then
`bun link @fisherrjd/ui` in the app (undo: `bun install --force`).

## What's in it

| path                    | what                                                           | apps import                     |
| ----------------------- | -------------------------------------------------------------- | ------------------------------- |
| `styles/index.css`      | token wiring, base styles, `card-hover`, `md-prose`, `rise-in`, page transitions | `@import "@fisherrjd/ui/styles.css"` |
| `styles/themes/*.css`   | one preset per file: light + `.dark` HSL triplets              | (via styles.css)                |
| `src/components/ui/`    | shadcn-vue primitives                                          | `@fisherrjd/ui/button`, `…/dialog`, … |
| `src/theme/`            | `useTheme`, `THEMES`, `LOCKED`, `ThemePicker`, `ThemeToggle`   | `@fisherrjd/ui/theme`           |
| `src/styleguide/`       | `ColorSwatches`, `TypeScale`, `ComponentGallery` sections      | `@fisherrjd/ui/styleguide`      |
| `src/lib/utils.ts`      | `cn`                                                           | `@fisherrjd/ui/utils`           |
| `vite.js`               | `ui()` vite plugin                                             | `@fisherrjd/ui/vite`            |

It ships source (`.vue`/`.ts`), not a build: the app's vite compiles it, and
`styles/index.css` has an `@source` so tailwind generates the components'
classes even from inside `node_modules`.

## Using it in an app

```css
/* src/assets/index.css */
@import "tailwindcss";
@import "@fisherrjd/ui/styles.css";
/* app-only styles below */
```

```ts
// vite.config.ts
import ui from '@fisherrjd/ui/vite'

plugins: [vue(), tailwindcss(), ui()]
// ui({ themes: ['dusk'] })                        just one preset
// ui({ defaultTheme: 'evergreen', lock: true })   pinned: no picker, nothing saved
```

The plugin serves that config to `useTheme`, injects the pre-paint script into
`index.html` (saved theme/mode applied before first paint), and keeps vite's
dep optimizer off this package's `.vue` source.

## Add a preset

1. Copy `styles/themes/earthy.css` → `styles/themes/<name>.css`; change the
   `[data-theme='<name>']` selectors and the triplets.
2. `@import "./themes/<name>.css";` in `styles/index.css`.
3. `{ id: '<name>', label: '<Name>' }` in `PRESETS` (`src/theme/presets.ts`).

## Add a primitive

```sh
add <component>    # shadcn-vue CLI, then @/ imports rewritten relative
```

Package code imports relatively, never `@/` — every app has its own `@/`.
`check` catches it (`tsconfig.app.json` has no `@/` path). Keep the
`hsl(var(--x))` triplet convention; the CLI generates oklch, so if it touches
`styles/`, revert that part.

## Rules of thumb

- Belongs here: anything that should look the same in every app.
- Stays in the app: pattern components (dashboard, data, forms…), app-only CSS.
  An app that needs one primitive to differ copies it locally rather than
  forking the shared one.
- Breaking a prop or export? Grep the apps first, or update them in the same
  pass.
