<script setup lang="ts">
import { CheckIcon, Loader2Icon, MinusIcon, XIcon } from '@lucide/vue'
import type { PipelineStatus } from './types'

// where a long process is: one node per phase, joined by a line that fills in
// as phases finish. One row from sm up; a vertical list on a phone.
defineProps<{
  steps: { label: string; status: PipelineStatus; detail?: string }[]
}>()

const NODE: Record<PipelineStatus, string> = {
  done: 'border-primary bg-primary text-primary-foreground',
  running: 'border-highlight text-highlight',
  failed: 'border-destructive bg-destructive text-white',
  todo: 'border-border text-muted-foreground',
  skipped: 'border-dashed border-border text-muted-foreground',
}
</script>

<template>
  <ol class="flex flex-col sm:grid sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]" :style="{ '--n': steps.length }">
    <li
      v-for="(s, i) in steps"
      :key="s.label"
      class="relative flex items-center gap-3 pb-3 last:pb-0 sm:flex-col sm:gap-1.5 sm:px-1 sm:pb-0 sm:text-center"
    >
      <!-- the joining line runs to the next node (down on a phone, across from sm),
           filled once this phase is done -->
      <span
        v-if="i < steps.length - 1"
        class="absolute top-7 bottom-0 left-[calc(0.875rem-1px)] w-0.5 sm:top-3.5 sm:bottom-auto sm:left-[calc(50%+1rem)] sm:h-0.5 sm:w-[calc(100%-2rem)]"
        :class="s.status === 'done' ? 'bg-primary' : 'bg-border'"
        aria-hidden="true"
      />
      <span class="relative grid size-7 shrink-0 place-items-center rounded-full border-2 bg-card" :class="NODE[s.status]">
        <CheckIcon v-if="s.status === 'done'" class="size-3.5" />
        <Loader2Icon v-else-if="s.status === 'running'" class="size-3.5 animate-spin" />
        <XIcon v-else-if="s.status === 'failed'" class="size-3.5" />
        <MinusIcon v-else-if="s.status === 'skipped'" class="size-3.5" />
        <span v-else class="size-1.5 rounded-full bg-current" />
      </span>
      <span class="flex min-w-0 items-baseline gap-2 sm:flex-col sm:items-center sm:gap-0.5">
        <span
          class="truncate font-mono text-[11px] tracking-widest uppercase"
          :class="s.status === 'todo' || s.status === 'skipped' ? 'text-muted-foreground' : 'font-semibold'"
        >
          {{ s.label }}
        </span>
        <span v-if="s.detail" class="truncate text-xs text-muted-foreground">{{ s.detail }}</span>
      </span>
    </li>
  </ol>
</template>
