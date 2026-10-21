<script setup lang="ts">
// a titled dashboard section. Give it a height (class="lg:h-96") and a long
// body scrolls inside it, so panels side by side stay the same size instead
// of one column running far past the other.
defineProps<{
  title: string
  /** right side of the header: a count, a timestamp */
  meta?: string
}>()
</script>

<template>
  <section
    data-slot="card"
    class="flex min-h-0 min-w-0 flex-col rounded-xl border bg-card text-card-foreground shadow-sm"
  >
    <header class="flex shrink-0 items-baseline justify-between gap-3 px-5 pt-4 pb-3">
      <h2 class="font-heading text-sm font-semibold">{{ title }}</h2>
      <slot name="meta">
        <span v-if="meta" class="truncate font-mono text-xs text-muted-foreground">{{ meta }}</span>
      </slot>
    </header>
    <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="shrink-0 border-t px-5 py-3">
      <slot name="footer" />
    </footer>
  </section>
</template>
