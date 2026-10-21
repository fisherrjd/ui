<script setup lang="ts">
import { TrendingDownIcon, TrendingUpIcon } from '@lucide/vue'
import type { Component } from 'vue'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import Sparkline from './Sparkline.vue'

// one number on a dashboard. A number value counts up; a string ("9/9",
// "19m 47s") shows as is. Give it `to` or `href` and the whole card links to
// the page that number comes from.
const props = withDefaults(
  defineProps<{
    label: string
    value: number | string
    /** turns the (possibly mid-animation, fractional) number into display text */
    format?: (n: number) => string
    /** small line under the value, e.g. "round 2" */
    sub?: string
    /** percent change vs the previous period; sign picks the trend color */
    delta?: number
    /** recent values for the sparkline */
    data?: number[]
    icon?: Component
    /** in-app route the card opens */
    to?: string
    /** outside page the card opens, in a new tab */
    href?: string
  }>(),
  { format: (n: number) => Math.round(n).toLocaleString('en-US') },
)

// count up towards the target so value changes feel alive
const shown = ref(0)
let raf = 0
function animateTo(target: number | string) {
  cancelAnimationFrame(raf)
  if (typeof target !== 'number') return
  const from = shown.value
  const start = performance.now()
  const duration = 600
  const tick = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    shown.value = from + (target - from) * (1 - (1 - t) ** 3)
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}
onMounted(() => animateTo(props.value))
onUnmounted(() => cancelAnimationFrame(raf))
watch(() => props.value, animateTo)

const display = computed(() => (typeof props.value === 'number' ? props.format(shown.value) : props.value))
const deltaText = computed(() =>
  props.delta === undefined ? '' : `${props.delta > 0 ? '+' : ''}${props.delta.toFixed(1)}%`,
)
const root = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'div'))
const linkAttrs = computed(() =>
  props.to ? { to: props.to } : props.href ? { href: props.href, target: '_blank', rel: 'noopener' } : {},
)
</script>

<template>
  <component
    :is="root"
    v-bind="linkAttrs"
    data-slot="card"
    class="flex min-w-0 flex-col rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-[border-color]"
    :class="to || href ? 'outline-none hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring' : ''"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="truncate font-mono text-[11px] tracking-widest text-muted-foreground uppercase">{{ label }}</p>
      <span v-if="icon" class="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary-text">
        <component :is="icon" class="size-4" />
      </span>
    </div>
    <p class="mt-1.5 truncate font-mono text-2xl leading-tight font-medium tracking-tight tabular-nums">{{ display }}</p>
    <p v-if="sub" class="mt-0.5 truncate text-xs text-muted-foreground">{{ sub }}</p>
    <div v-if="delta !== undefined || data" class="mt-3 flex items-end justify-between gap-4">
      <p
        v-if="delta !== undefined"
        class="flex items-center gap-1 text-xs font-medium whitespace-nowrap"
        :class="delta >= 0 ? 'text-success' : 'text-destructive'"
      >
        <TrendingUpIcon v-if="delta >= 0" class="size-3.5" />
        <TrendingDownIcon v-else class="size-3.5" />
        {{ deltaText }}
        <span class="font-normal text-muted-foreground">vs last period</span>
      </p>
      <div v-if="data" class="h-9 w-20 min-w-0 text-primary-text">
        <Sparkline :data="data" />
      </div>
    </div>
  </component>
</template>
