<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  /** small mono line above the title — a date, a scope, a breadcrumb */
  eyebrow?: string
}>()
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="space-y-1.5">
      <p v-if="eyebrow" class="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
        {{ eyebrow }}
      </p>
      <h1 class="text-3xl font-bold tracking-tight">{{ title }}</h1>
      <p v-if="description" class="text-muted-foreground">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
