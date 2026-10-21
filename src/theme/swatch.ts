import type { StyleValue } from 'vue'

/**
 * A distinct color per item — a household member, a list, a feed source —
 * from the theme's four chart colors, cycling. Bind it as a style and use the
 * `bg-swatch` / `text-swatch-foreground` / `border-swatch` utilities inside
 * (opacity works: `bg-swatch/20`). The foreground always reads on the fill.
 *
 *   <Card :style="swatch(i)"><div class="bg-swatch text-swatch-foreground">…
 *
 * Also recolors anything primary inside, e.g. a progress bar:
 * `:style="swatch(i, { primary: true })"`.
 */
export function swatch(index: number, options: { primary?: boolean } = {}): StyleValue {
  const n = (((index % 4) + 4) % 4) + 1
  const style: Record<string, string> = {
    '--swatch': `var(--chart-${n})`,
    '--swatch-foreground': `var(--chart-${n}-foreground)`,
  }
  if (options.primary) {
    style['--primary'] = `var(--chart-${n})`
    style['--primary-foreground'] = `var(--chart-${n}-foreground)`
  }
  return style
}
