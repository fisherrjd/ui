<script setup lang="ts">
import { Separator } from '../components/ui/separator'
import ColorSwatches from './ColorSwatches.vue'
import ComponentGallery from './ComponentGallery.vue'
import ThemeLab from './ThemeLab.vue'
import TypeScale from './TypeScale.vue'

// the whole /styleguide page every app mounts (dev only — keep its route
// behind import.meta.env.DEV). App-specific sections, like the template's
// pattern demos, go in the default slot and render after the shared ones.
</script>

<template>
  <div class="space-y-10">
    <div class="space-y-1.5">
      <p class="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">jade's theme</p>
      <h1 class="text-3xl font-bold tracking-tight">Styleguide</h1>
      <p class="text-muted-foreground">
        The theme lab repaints the app live — try palettes, fonts and styles, then paste the
        config into <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">vite.config.ts</code>.
      </p>
    </div>

    <section class="space-y-4">
      <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Theme lab
      </h2>
      <ThemeLab />
    </section>

    <Separator />

    <section class="space-y-4">
      <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Colors
      </h2>
      <ColorSwatches />
    </section>

    <Separator />

    <section class="space-y-4">
      <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Typography
      </h2>
      <TypeScale />
    </section>

    <Separator />

    <section class="space-y-4">
      <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Components
      </h2>
      <ComponentGallery />
    </section>

    <slot />
  </div>
</template>
