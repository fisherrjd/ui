<script setup lang="ts">
import { Separator } from '../src/components/ui/separator'
import { Toaster } from '../src/components/ui/sonner'
import { ColorSwatches, ComponentGallery, TypeScale } from '../src/styleguide'
import { ThemePicker, ThemeToggle } from '../src/theme'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <main class="mx-auto w-full max-w-5xl space-y-10 px-4 py-8">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="space-y-1">
          <h1
            class="bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent"
          >
            @fisherrjd/ui
          </h1>
          <p class="text-muted-foreground">
            The shared layer every app imports. Edit
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">styles/</code> or
            <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">src/components/ui/</code>
            and watch this page repaint.
          </p>
        </div>
        <div class="flex items-center gap-1">
          <ThemePicker />
          <ThemeToggle />
        </div>
      </div>

      <section class="space-y-4">
        <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Colors</h2>
        <ColorSwatches />
      </section>

      <Separator />

      <section class="space-y-4">
        <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Typography</h2>
        <TypeScale />
      </section>

      <Separator />

      <section class="space-y-4">
        <h2 class="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <span class="size-2 rounded-sm bg-primary" aria-hidden="true" />Components</h2>
        <ComponentGallery />
      </section>
    </main>
    <Toaster position="bottom-right" />
  </div>
</template>
