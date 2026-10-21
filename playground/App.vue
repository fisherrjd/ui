<script setup lang="ts">
import { Toaster } from '../src/components/ui/sonner'
import { StyleguidePage } from '../src/styleguide'
import { ThemeToggle } from '../src/theme'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="flex justify-end px-4 pt-4">
      <ThemeToggle />
    </header>
    <main class="mx-auto w-full max-w-5xl px-4 pb-8">
      <StyleguidePage />
    </main>
    <Toaster position="bottom-right" />
  </div>
</template>
