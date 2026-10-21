<script setup lang="ts">
import { ArrowUpRightIcon, ChevronRightIcon } from '@lucide/vue'
import type { Component } from 'vue'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { LinkTileStatus } from './types'

// a door to another dashboard or tool: a PR, a preview, a deploy, another page
// in the app. Without `to` or `href` it shows as not there yet.
const props = defineProps<{
  /** small mono kind line, e.g. "code pr" */
  label: string
  /** what it opens, e.g. "news #5" */
  title: string
  /** state of the thing behind it, e.g. "merged", "deployed" */
  sub?: string
  /** colors the dot next to `sub` */
  status?: LinkTileStatus
  icon?: Component
  /** in-app route */
  to?: string
  /** outside page, opens in a new tab */
  href?: string
}>()

const root = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'div'))
const linkAttrs = computed(() =>
  props.to ? { to: props.to } : props.href ? { href: props.href, target: '_blank', rel: 'noopener' } : {},
)
const DOT: Record<LinkTileStatus, string> = {
  ok: 'bg-success',
  live: 'bg-primary animate-pulse',
  warn: 'bg-warning',
  fail: 'bg-destructive',
  off: 'bg-muted-foreground/40',
}
</script>

<template>
  <component
    :is="root"
    v-bind="linkAttrs"
    data-slot="card"
    class="group flex min-w-0 items-start gap-3 rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm transition-[border-color]"
    :class="to || href ? 'outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring' : 'opacity-60'"
  >
    <span v-if="icon" class="hidden size-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-text sm:grid">
      <component :is="icon" class="size-4" />
    </span>
    <span class="flex min-w-0 flex-1 flex-col">
      <span class="truncate font-mono text-[11px] tracking-widest text-muted-foreground uppercase">{{ label }}</span>
      <span class="truncate text-sm font-medium">{{ title }}</span>
      <span v-if="sub" class="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span v-if="status" class="size-1.5 shrink-0 rounded-full" :class="DOT[status]" aria-hidden="true" />
        <span class="truncate">{{ sub }}</span>
      </span>
      <slot />
    </span>
    <ArrowUpRightIcon
      v-if="href"
      class="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
    />
    <ChevronRightIcon
      v-else-if="to"
      class="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
    />
  </component>
</template>
