<script setup lang="ts">
import type { Component } from 'vue'

// a timeline of what happened, newest first. Titles wrap (they often carry
// URLs or log lines); `dense` drops the icon bubbles for long feeds.
defineProps<{
  items: {
    id: string | number
    title: string
    description?: string
    time: string
    icon?: Component
  }[]
  dense?: boolean
}>()
</script>

<template>
  <ol v-if="dense" class="ml-1 border-l-2">
    <li v-for="item in items" :key="item.id" class="flex flex-col gap-0.5 pb-3 pl-3.5 last:pb-0">
      <span class="font-mono text-[11px] text-muted-foreground">
        {{ item.time }}<template v-if="item.description"> · {{ item.description }}</template>
      </span>
      <span class="text-sm break-words">{{ item.title }}</span>
    </li>
  </ol>
  <ol v-else>
    <li
      v-for="(item, i) in items"
      :key="item.id"
      class="relative flex gap-3 pb-5 last:pb-0"
    >
      <span
        v-if="i < items.length - 1"
        class="absolute top-8 left-4 h-[calc(100%-2rem)] w-px bg-border"
        aria-hidden="true"
      />
      <span
        class="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
      >
        <component :is="item.icon" v-if="item.icon" class="size-4" />
        <span v-else class="size-2 rounded-full bg-primary" />
      </span>
      <div class="min-w-0 flex-1 pt-1">
        <div class="flex items-baseline justify-between gap-2">
          <p class="text-sm font-medium break-words">{{ item.title }}</p>
          <p class="shrink-0 text-xs text-muted-foreground">{{ item.time }}</p>
        </div>
        <p v-if="item.description" class="mt-0.5 text-xs text-muted-foreground">
          {{ item.description }}
        </p>
      </div>
    </li>
  </ol>
</template>
