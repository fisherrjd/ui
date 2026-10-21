<script setup lang="ts">
import { PaletteIcon } from '@lucide/vue'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import type { ThemeId } from './presets'
import { THEMES, useTheme } from './useTheme'

const { theme, setTheme } = useTheme()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="sm" aria-label="Theme">
        <PaletteIcon />
        <span class="max-md:hidden">{{ THEMES.find((t) => t.id === theme)?.label }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuRadioGroup
        :model-value="theme"
        @update:model-value="setTheme($event as ThemeId)"
      >
        <DropdownMenuRadioItem v-for="t in THEMES" :key="t.id" :value="t.id">
          {{ t.label }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
