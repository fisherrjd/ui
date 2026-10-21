<script setup lang="ts">
import { CheckIcon, CopyIcon, RotateCcwIcon, XIcon } from '@lucide/vue'
import { computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { Button } from '../components/ui/button'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import {
  contrast,
  derive,
  type Fonts,
  FONTS,
  PALETTES,
  type PaletteName,
  type Seeds,
  STYLES,
} from '../theme/derive'
import { applyTheme, draft, resetDraft, themeSnippet } from '../theme/lab'
import { useTheme } from '../theme/useTheme'

const { mode, setMode } = useTheme()

// every edit repaints the whole app, live
watch(draft, (theme) => applyTheme(theme), { deep: true })

const palettes = Object.keys(PALETTES) as PaletteName[]
function pickPalette(name: PaletteName) {
  draft.value.palette = name
  draft.value.colors = { ...PALETTES[name] }
}

const seeds: { key: keyof Seeds; label: string; hint: string }[] = [
  { key: 'primary', label: 'Primary', hint: 'buttons, active states, charts' },
  { key: 'accent', label: 'Accent', hint: 'pending, hovers, second series' },
  { key: 'neutral', label: 'Neutral', hint: 'tints every grey' },
  { key: 'danger', label: 'Danger', hint: 'errors, refunds' },
]

const fontRoles: { key: keyof Fonts; label: string }[] = [
  { key: 'heading', label: 'Headings' },
  { key: 'body', label: 'Body' },
  { key: 'mono', label: 'Numbers & labels' },
]
// headings can be anything (mono headings suit the terminal look); body
// text stays proportional for reading; the mono slot stays mono
const fontsFor = (role: keyof Fonts) => [
  'system',
  ...Object.keys(FONTS).filter((name) =>
    role === 'heading' ? true : role === 'mono' ? FONTS[name]!.kind === 'mono' : FONTS[name]!.kind !== 'mono',
  ),
]

const styleHints = {
  line: 'hairlines, flat',
  block: '2px outlines, hard shadows',
  hud: 'console panels, brackets',
} as const

const snippet = computed(() => themeSnippet(draft.value, mode.value))

const checks = computed(() => {
  const t = derive(draft.value.colors, mode.value)
  const pairs: [string, string, string][] = [
    ['Text', 'foreground', 'background'],
    ['Muted text', 'muted-foreground', 'card'],
    ['Primary button', 'primary-foreground', 'primary'],
    ['Primary as text', 'primary-text', 'background'],
    ['Accent as text', 'highlight', 'card'],
    ['Danger button', 'destructive-foreground', 'destructive'],
  ]
  return pairs.map(([label, fg, bg]) => {
    const ratio = contrast(t[fg]!, t[bg]!)
    return { label, fg: t[fg], bg: t[bg], ratio: ratio.toFixed(1), ok: ratio >= 4.5 }
  })
})

async function copy() {
  try {
    await navigator.clipboard.writeText(snippet.value)
    toast.success('Config copied', { description: 'Paste it into vite.config.ts' })
  } catch {
    // clipboard needs https or localhost — plain http over the tailnet has none
    toast.error('Clipboard unavailable here', { description: 'Select the snippet and copy it by hand.' })
  }
}
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
    <div class="space-y-6">
      <section class="space-y-2">
        <h3 class="text-sm font-semibold">Palette</h3>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="name in palettes"
            :key="name"
            :variant="draft.palette === name ? 'secondary' : 'outline'"
            size="sm"
            :aria-pressed="draft.palette === name"
            @click="pickPalette(name)"
          >
            <span class="size-3 rounded-full" :style="{ background: PALETTES[name].primary }" />
            {{ name }}
          </Button>
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="text-sm font-semibold">Seed colors</h3>
        <div class="grid gap-3 sm:grid-cols-2">
          <label
            v-for="seed in seeds"
            :key="seed.key"
            class="flex cursor-pointer items-center gap-3 rounded-md border p-2"
          >
            <input
              v-model="draft.colors[seed.key]"
              type="color"
              class="size-9 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
            />
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ seed.label }}</span>
              <span class="block text-xs text-muted-foreground">{{ seed.hint }}</span>
            </span>
            <code class="ml-auto font-mono text-xs text-muted-foreground">{{ draft.colors[seed.key] }}</code>
          </label>
        </div>
      </section>

      <section class="space-y-2">
        <h3 class="text-sm font-semibold">Fonts</h3>
        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="role in fontRoles" :key="role.key" class="space-y-1.5">
            <Label :for="`lab-font-${role.key}`">{{ role.label }}</Label>
            <Select v-model="draft.fonts[role.key]">
              <SelectTrigger :id="`lab-font-${role.key}`" class="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="name in fontsFor(role.key)" :key="name" :value="name">
                  {{ name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section class="grid gap-6 sm:grid-cols-2">
        <div class="space-y-2">
          <h3 class="text-sm font-semibold">Style</h3>
          <div class="flex flex-wrap gap-2" role="group" aria-label="Style">
            <Button
              v-for="s in STYLES"
              :key="s"
              :variant="draft.style === s ? 'default' : 'outline'"
              size="sm"
              :aria-pressed="draft.style === s"
              @click="draft.style = s"
            >
              {{ s }}
            </Button>
          </div>
          <p class="text-xs text-muted-foreground">{{ styleHints[draft.style] }}</p>
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-semibold">Mode</h3>
          <div class="flex gap-2" role="group" aria-label="Mode">
            <Button
              v-for="m in (['dark', 'light'] as const)"
              :key="m"
              :variant="mode === m ? 'default' : 'outline'"
              size="sm"
              :aria-pressed="mode === m"
              @click="setMode(m)"
            >
              {{ m }}
            </Button>
          </div>
        </div>
        <div class="space-y-1.5">
          <Label for="lab-radius">Corner radius · {{ draft.radius }}px</Label>
          <input id="lab-radius" v-model.number="draft.radius" type="range" min="0" max="20" class="w-full accent-primary" />
        </div>
        <div class="space-y-1.5">
          <Label for="lab-shadow">Block shadow · {{ draft.shadow }}px</Label>
          <input id="lab-shadow" v-model.number="draft.shadow" type="range" min="0" max="10" class="w-full accent-primary" />
        </div>
      </section>
    </div>

    <aside class="space-y-6">
      <section class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold">This look in vite.config.ts</h3>
          <div class="flex gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Reset to the app's theme" @click="resetDraft">
              <RotateCcwIcon />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Copy config" @click="copy">
              <CopyIcon />
            </Button>
          </div>
        </div>
        <pre class="overflow-x-auto rounded-md border bg-muted/50 p-3 font-mono text-xs leading-relaxed">{{ snippet }}</pre>
        <p class="text-xs text-muted-foreground">
          Edits repaint every page until you reload. Paste this into
          <code class="font-mono">ui(…)</code> to keep them.
        </p>
      </section>

      <section class="space-y-2">
        <h3 class="text-sm font-semibold">Contrast · {{ mode }}</h3>
        <ul class="space-y-1.5">
          <li v-for="c in checks" :key="c.label" class="flex items-center gap-2 text-sm">
            <span
              class="grid h-6 w-9 place-items-center rounded text-xs font-bold"
              :style="{ background: c.bg, color: c.fg }"
            >Aa</span>
            <span class="flex-1">{{ c.label }}</span>
            <span class="font-mono text-xs tabular-nums" :class="c.ok ? 'text-primary-text' : 'text-destructive'">{{ c.ratio }}:1</span>
            <CheckIcon v-if="c.ok" class="size-4 text-primary-text" aria-label="passes" />
            <XIcon v-else class="size-4 text-destructive" aria-label="fails" />
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>
