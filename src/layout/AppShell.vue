<script setup lang="ts">
import { MenuIcon, XIcon } from '@lucide/vue'
import { type Component, computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { Button } from '../components/ui/button'
import { Toaster } from '../components/ui/sonner'
import ThemeToggle from '../theme/ThemeToggle.vue'
import { LOCKED, THEME, useTheme } from '../theme/useTheme'
import type { NavLink, NavSection } from './types'

// Jade's theme app frame: sidebar nav (a drawer on phones), a top bar with
// a breadcrumb and the mode toggle, and the page column. Apps pass their
// nav and render <RouterView> in the default slot.
const props = withDefaults(
  defineProps<{
    brand: string
    /** the square mark next to the brand */
    icon?: Component
    nav: NavSection[]
    /** how wide the page column gets */
    width?: 'narrow' | 'default' | 'wide'
  }>(),
  { width: 'default' },
)

const { mode } = useTheme()
const route = useRoute()

// manual active check: `/` must not light up for every route
function isActive(link: NavLink) {
  return link.to === '/'
    ? route.path === '/'
    : route.path === link.to || route.path.startsWith(`${link.to}/`)
}
const current = computed(
  () => props.nav.flatMap((section) => section.links).find(isActive)?.label ?? '',
)

// phones: the sidebar is a drawer, closed again on every navigation
const navOpen = ref(false)
watch(() => route.path, () => (navOpen.value = false))

const WIDTH = { narrow: 'max-w-3xl', default: 'max-w-6xl', wide: 'max-w-screen-2xl' }
</script>

<template>
  <div class="flex min-h-screen bg-background text-foreground">
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r bg-sidebar transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0"
      :class="navOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex h-14 shrink-0 items-center gap-2.5 px-4">
        <RouterLink to="/" class="flex min-w-0 items-center gap-2.5 font-heading text-lg font-bold tracking-tight">
          <span v-if="icon" class="grid size-6 shrink-0 place-items-center rounded-sm bg-primary text-primary-foreground">
            <component :is="icon" class="size-3.5" />
          </span>
          <span class="truncate">{{ brand }}</span>
        </RouterLink>
        <Button variant="ghost" size="icon-sm" class="ml-auto md:hidden" aria-label="Close navigation" @click="navOpen = false">
          <XIcon />
        </Button>
      </div>

      <nav aria-label="Main" class="flex-1 space-y-5 overflow-y-auto px-2 py-3 font-mono text-[13px]">
        <div v-for="section in nav" :key="section.label" class="space-y-0.5">
          <p class="px-2 pb-2 text-[11px] tracking-widest text-muted-foreground uppercase">{{ section.label }}</p>
          <RouterLink
            v-for="link in section.links"
            :key="link.to"
            :to="link.to"
            :title="link.title"
            class="flex items-center gap-2.5 rounded-md px-2 py-1.5 lowercase transition-colors"
            :class="isActive(link) ? 'bg-muted font-medium text-primary-text' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
            :aria-current="isActive(link) ? 'page' : undefined"
          >
            <component :is="link.icon" v-if="link.icon" class="size-4 shrink-0" />
            <span class="truncate">{{ link.label }}</span>
            <span v-if="link.badge" class="ml-auto text-[11px] text-primary-text tabular-nums">{{ link.badge }}</span>
          </RouterLink>
        </div>
      </nav>

      <div class="space-y-1 border-t px-4 py-3 font-mono text-[11px] text-muted-foreground">
        <slot name="sidebar-footer">
          <p class="flex items-center gap-2">
            <span class="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {{ THEME.palette }} · {{ THEME.style }} · {{ mode }}
          </p>
        </slot>
      </div>
    </aside>

    <!-- phones: dim the page behind the open drawer; tap to close -->
    <div
      v-if="navOpen"
      class="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm md:hidden"
      aria-hidden="true"
      @click="navOpen = false"
    />

    <div class="flex min-w-0 flex-1 flex-col">
      <header class="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-6">
        <Button variant="ghost" size="icon" class="md:hidden" aria-label="Open navigation" @click="navOpen = true">
          <MenuIcon />
        </Button>
        <p class="truncate font-mono text-xs text-muted-foreground">
          {{ brand }} / <span class="lowercase text-foreground">{{ current }}</span>
        </p>
        <div class="ml-auto flex items-center gap-1">
          <slot name="actions" />
          <!-- a locked mode (ui({ lockMode: true }) in vite.config.ts) leaves nothing to toggle -->
          <ThemeToggle v-if="!LOCKED" />
        </div>
      </header>

      <main class="mx-auto w-full flex-1 px-4 py-8 md:px-6" :class="WIDTH[width]">
        <slot />
      </main>
    </div>

    <Toaster position="bottom-right" />
  </div>
</template>
